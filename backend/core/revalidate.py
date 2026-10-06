"""Tell the Next.js frontend to drop cached catalogue/settings data.

Tags are queued only after the database transaction commits, then sent in a
single debounced background POST so an admin save with many inline rows
produces one request. Failures are logged and never block the admin; the
frontend also revalidates on a timer as a safety net.
"""

import json
import logging
import threading
import urllib.request

from django.conf import settings
from django.db import transaction

logger = logging.getLogger("catalog")

DEBOUNCE_SECONDS = 1.0

_lock = threading.Lock()
_queued_tags = set()
_timer = None


def _post(tags):
    url = settings.FRONTEND_REVALIDATE_URL
    secret = settings.REVALIDATE_SECRET
    request = urllib.request.Request(
        url,
        data=json.dumps({"tags": sorted(tags)}).encode(),
        headers={"Content-Type": "application/json", "X-Revalidate-Secret": secret},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=5) as response:  # noqa: S310 — configured URL
            response.read()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Frontend revalidation failed for %s: %s", sorted(tags), exc)


def _flush():
    global _timer
    with _lock:
        tags = set(_queued_tags)
        _queued_tags.clear()
        _timer = None
    if tags:
        _post(tags)


def _enqueue(tags):
    global _timer
    with _lock:
        _queued_tags.update(tags)
        if _timer is None:
            _timer = threading.Timer(DEBOUNCE_SECONDS, _flush)
            _timer.daemon = True
            _timer.start()


def request_revalidation(*tags):
    if not settings.FRONTEND_REVALIDATE_URL or not settings.REVALIDATE_SECRET:
        return
    transaction.on_commit(lambda: _enqueue(tags))
