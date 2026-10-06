"""End-to-end checks against locally running servers (Django on :8000 with
the file-based email backend, Next.js on :3000). Uses synthetic data and
local mail capture only — never run this against production.

    cd backend && .venv/Scripts/python -I ../scripts/e2e_check.py
"""

import io
import json
import os
import sys
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402

django.setup()

from django.conf import settings  # noqa: E402
from django.core.files.uploadedfile import SimpleUploadedFile  # noqa: E402
from PIL import Image  # noqa: E402

from catalog.models import Product, ProductImage  # noqa: E402
from enquiries.models import Enquiry  # noqa: E402

SITE = "http://localhost:3000"
assert "localhost" in SITE


def post_json(url, payload):
    request = urllib.request.Request(
        url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status, json.loads(response.read())
    except urllib.error.HTTPError as error:
        return error.code, json.loads(error.read() or b"{}")


def get(url):
    with urllib.request.urlopen(url, timeout=30) as response:
        return response.status, response.headers, response.read()


failures = []


def check(condition, message):
    print(("ok   " if condition else "FAIL ") + message)
    if not condition:
        failures.append(message)


# 1. Multi-item quotation through the public Next.js endpoint.
eps = Product.objects.get(slug="eps-boxes")
fish = eps.variants.get(label="Fish box")
key = uuid.uuid4().hex
mail_dir = Path(settings.EMAIL_FILE_PATH)
before_mail = set(mail_dir.glob("*.log")) if mail_dir.exists() else set()
payload = {
    "kind": "quote", "name": "E2E Test Buyer", "email": "e2e-buyer@example.com",
    "company": "", "phone": "", "delivery_location": "Nakuru", "project_notes": "Synthetic local test",
    "idempotency_key": key,
    "items": [
        {"product_slug": "eps-boxes", "variant_id": fish.id, "quantity": "150", "unit": "boxes", "notes": ""},
        {"product_slug": "ceramic-fibre-blanket", "quantity": "3", "unit": "rolls", "notes": "25 mm"},
    ],
}
status, body = post_json(f"{SITE}/api/enquiry", payload)
check(status == 201, f"quote submit via Next returns 201 (got {status})")
reference = body.get("reference_number", "")
enquiry = Enquiry.objects.filter(reference_number=reference).first()
check(enquiry is not None and enquiry.items.count() == 2, "enquiry and 2 line items persisted")
check(enquiry and enquiry.items.first().variant_label_snapshot == "Fish box", "variant snapshot stored")
check(enquiry and enquiry.notification_sent, "notification recorded as sent (local file backend)")

status2, body2 = post_json(f"{SITE}/api/enquiry", payload)
check(status2 == 200 and body2.get("reference_number") == reference, "duplicate submit returns original reference")
check(Enquiry.objects.filter(idempotency_key=key).count() == 1, "no duplicate enquiry row")

new_mail = set(mail_dir.glob("*.log")) - before_mail if mail_dir.exists() else set()
mail_text = "".join(p.read_text(encoding="utf-8", errors="replace") for p in new_mail).replace("\n ", " ")
check(len(new_mail) == 1, f"exactly one notification captured locally ({len(new_mail)})")
check("Reply-To: e2e-buyer@example.com" in mail_text, "visitor email used as Reply-To")
check("To: info@karivexsolutionsltd.com" in mail_text, "notification addressed to verified company email")
check("From: KariVex Industrial Materials <no-reply@" in mail_text, "sender is the configured site address")

status3, body3 = post_json(f"{SITE}/api/enquiry", {**payload, "idempotency_key": "", "items": [{"product_slug": "max-50"}]})
check(status3 == 400, "draft product rejected through public endpoint")

# 2. Admin-style edit refreshes the public page (signal -> /api/revalidate).
product = Product.objects.get(slug="perlite")
marker = f"Updated summary {uuid.uuid4().hex[:8]}"
original_summary = product.short_summary
_, _, html_before = get(f"{SITE}/products/perlite")
product.short_summary = marker
product.save()
time.sleep(2.5)  # debounce + request
_, _, html_after = get(f"{SITE}/products/perlite")
check(marker.encode() in html_after, "admin edit visible on public product page after save")
product.short_summary = original_summary
product.save()

# 3. Image upload/replacement served through Next image optimiser.
buffer = io.BytesIO()
Image.new("RGB", (1200, 900), (180, 160, 120)).save(buffer, format="JPEG")
image = ProductImage.objects.create(
    product=product, alt_text="E2E test image of perlite", is_primary=True,
    image=SimpleUploadedFile("e2e-perlite.jpg", buffer.getvalue(), content_type="image/jpeg"),
)
time.sleep(2.5)
_, _, html_img = get(f"{SITE}/products/perlite")
check(b"E2E test image of perlite" in html_img, "uploaded image alt text rendered")
media_url = image.image.url
status_m, headers_m, _ = get(f"{SITE}/_next/image?url={urllib.request.quote(media_url, safe='')}&w=640&q=75")
check(status_m == 200 and headers_m.get("Content-Type", "").startswith("image/"), "optimised media image served")
old_path = Path(image.image.path)
buffer2 = io.BytesIO()
Image.new("RGB", (800, 600), (20, 40, 60)).save(buffer2, format="PNG")
image.image = SimpleUploadedFile("e2e-replacement.png", buffer2.getvalue(), content_type="image/png")
image.save()
check(not old_path.exists(), "replaced image file removed from storage")
image.delete()

if failures:
    print(f"\n{len(failures)} failure(s)")
    sys.exit(1)
print("\nall end-to-end checks passed")
