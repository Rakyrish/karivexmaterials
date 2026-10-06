from django.conf import settings


def client_ip(request):
    """Client IP used for enquiry rate limiting.

    X-Forwarded-For is only honoured when TRUST_X_FORWARDED_FOR is enabled,
    i.e. when the deployment guarantees the reverse proxy overwrites the header
    (see deploy/Caddyfile.materials). Otherwise the socket address is used.
    """
    if settings.TRUST_X_FORWARDED_FOR:
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
        first = forwarded.split(",")[0].strip()
        if first:
            return first
    return request.META.get("REMOTE_ADDR", "")
