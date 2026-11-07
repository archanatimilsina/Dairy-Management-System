from django.db import connection
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    """Unauthenticated liveness probe that also reports database reachability.

    A bare `GET /health/` that never touches the database proves gunicorn and
    Django are up; the `database` block tells you whether the Postgres
    connection string in DATABASE_URL actually works. The truncated error
    string is what lets you tell "migrations missing" apart from "host
    unreachable" without Render log access (psycopg2 errors never contain
    the password, only the host/reason).
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
            }
        except Exception as e:  # noqa: BLE001 - we want the reason, not a crash
            import logging
            logging.getLogger('django.request').exception('health: database unreachable')
            payload["status"] = "degraded"
            payload["database"] = {
                "ok": False,
                "error": str(e)[:300],
            }
            status_code = 503

        return Response(payload, status=status_code)