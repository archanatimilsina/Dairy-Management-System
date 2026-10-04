from django.db import connection
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    """Unauthenticated liveness probe that also reports database reachability.

    A bare `GET /health/` that never touches the database proves gunicorn and
    Django are up; the `database` block tells you whether the Postgres
    connection string in DATABASE_URL actually works.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        payload = {"status": "ok", "database": {}}
        status_code = 200

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            payload["database"] = {
                "ok": True,
                "alias": connection.settings_dict.get("NAME"),
                "engine": connection.settings_dict.get("ENGINE"),
            }
        except Exception as exc:  # noqa: BLE001 - we want the reason, not a crash
            payload["status"] = "degraded"
            payload["database"] = {
                "ok": False,
                "error": f"{type(exc).__name__}: {exc}".strip(),
            }
            status_code = 503

        return Response(payload, status=status_code)