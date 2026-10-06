"""Create web derivatives of the supplied KariVex logo.

Source: assets/logo-source/logo-original.png (identical copy of ./logo.png
supplied in the project root). The artwork is only cropped, scaled and
placed on padding — lettering, colours, proportions and tagline are never
altered.

Usage (from the repo root):
    backend/.venv/Scripts/python -I scripts/make_brand_assets.py   # Windows
    backend/.venv/bin/python -I scripts/make_brand_assets.py       # Linux/macOS
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "logo-source" / "logo-original.png"
PUBLIC = ROOT / "frontend" / "public" / "brand"
APP = ROOT / "frontend" / "src" / "app"

NAVY = (2, 21, 51)
WHITE = (254, 254, 254)


def content_bbox(img, threshold=235, top=0, bottom=None):
    rgb = img.convert("RGB")
    w, h = rgb.size
    bottom = h if bottom is None else bottom
    px = rgb.load()
    xs, ys = [], []
    for y in range(top, bottom):
        for x in range(w):
            if min(px[x, y]) < threshold:
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def pad_square(img, pad_ratio, background=WHITE):
    w, h = img.size
    side = int(max(w, h) * (1 + 2 * pad_ratio))
    canvas = Image.new("RGB", (side, side), background)
    canvas.paste(img, ((side - w) // 2, (side - h) // 2))
    return canvas


def save_png_webp(img, stem, width):
    out = img.copy()
    out.thumbnail((width, width * 4), Image.Resampling.LANCZOS)
    out.save(PUBLIC / f"{stem}.png", optimize=True)
    out.save(PUBLIC / f"{stem}.webp", quality=90, method=6)
    return out.size


def main():
    PUBLIC.mkdir(parents=True, exist_ok=True)
    original = Image.open(SOURCE).convert("RGB")

    # Full logo (mark + wordmark + tagline), tightly cropped with a small margin.
    x0, y0, x1, y1 = content_bbox(original)
    margin = 12
    full = original.crop((x0 - margin, y0 - margin, x1 + margin, y1 + margin))
    sizes = {"karivex-logo": save_png_webp(full, "karivex-logo", 640)}

    # Hexagon "KV" mark only: the artwork above the first horizontal gap
    # (measured at y≈979 in the 1600px source).
    mx0, my0, mx1, my1 = content_bbox(original, bottom=979)
    # Crop exactly (the gap below the mark is only ~3px) and pad with white.
    mark = ImageOps.expand(original.crop((mx0, my0, mx1, my1)), border=margin, fill=WHITE)
    sizes["karivex-mark"] = save_png_webp(mark, "karivex-mark", 256)

    # Favicons / app icons from the mark on white.
    icon = pad_square(mark, 0.06)
    icon.resize((512, 512), Image.Resampling.LANCZOS).save(APP / "icon.png", optimize=True)
    icon.resize((180, 180), Image.Resampling.LANCZOS).save(APP / "apple-icon.png", optimize=True)
    # ICO entries must be RGBA for some decoders (e.g. Next.js/Turbopack).
    icon.convert("RGBA").save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    # Social preview 1200x630: the full logo on white with a navy band naming
    # the division in plain text (the logo itself is unchanged).
    og = Image.new("RGB", (1200, 630), WHITE)
    logo = full.copy()
    logo.thumbnail((470, 470), Image.Resampling.LANCZOS)
    og.paste(logo, ((1200 - logo.width) // 2, 40))
    band_top = 40 + logo.height + 30
    draw = ImageDraw.Draw(og)
    draw.rectangle((0, band_top, 1200, 630), fill=NAVY)
    try:
        font = ImageFont.truetype("arialbd.ttf", 40)
    except OSError:
        try:
            font = ImageFont.truetype("DejaVuSans-Bold.ttf", 40)
        except OSError:
            font = ImageFont.load_default()
    text = "Industrial Materials Division"
    tw = draw.textlength(text, font=font)
    draw.text(((1200 - tw) / 2, band_top + (630 - band_top - 40) / 2 - 4), text, fill=WHITE, font=font)
    og.save(PUBLIC / "og-default.png", optimize=True)

    for name, size in sizes.items():
        print(f"{name}: {size[0]}x{size[1]}")
    print("Wrote favicon.ico, icon.png, apple-icon.png, og-default.png")


if __name__ == "__main__":
    main()
