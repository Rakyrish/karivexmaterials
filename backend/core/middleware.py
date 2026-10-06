PRIVATE_PREFIXES = ("/admin", "/api/", "/healthz")


class PrivateRobotsHeaderMiddleware:
    """Mark admin/API responses noindex. This is only an indexing hint —
    access control is enforced separately by Django auth and API design."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith(PRIVATE_PREFIXES):
            response.headers.setdefault("X-Robots-Tag", "noindex, nofollow")
        return response
