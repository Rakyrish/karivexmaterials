from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SiteSettings
from .serializers import SiteSettingsSerializer


class SiteSettingsView(APIView):
    def get(self, request):
        settings_obj = SiteSettings.load()
        return Response(SiteSettingsSerializer(settings_obj).data)
