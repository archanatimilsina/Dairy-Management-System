from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


def _pending_migrations():
    """Return "app.name" for every migration not applied to this database."""
    executor = MigrationExecutor(connection)
    targets = executor.loader.graph.leaf_nodes()
    return [f"{migration.app_label}.{migration.name}"
            for migration, _backwards in executor.migration_plan(targets)]


class HealthView(APIView):
    """Unauthenticated liveness/readiness probe.

    It checks two things, because they fail independently:
      1. Can we open a connection and run SELECT 1? (host reachable, creds OK)
      2. Are all migrations applied? (schema usable)

    The second check matters: the database can be perfectly reachable while a
    missing table makes every write endpoint fail. That is exactly how
    ``token_blacklist_outstandingtoken`` stayed missing in production while a
    bare SELECT 1 health check kept reporting green.

    A truncated error string is returned so you can tell "host unreachable"
    apart from "schema out of date" without Render log access (psycopg2
    errors never contain the password, only the host/reason).
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        payload = {
            "status": "ok",
            "database": {"ok": True, "migrations_ok": True, "pending_migrations": []},
        }

        # 1. Connectivity.
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
        except Exception as e:  # noqa: BLE001 - we want the reason, not a crash
            import logging
            logging.getLogger('django.request').exception('health: database unreachable')
            payload["status"] = "degraded"
            payload["database"] = {
                "ok": False,
                "migrations_ok": False,
                "error": str(e)[:300],
            }
            return Response(payload, status=503)

        # 2. Schema state.
        try:
            pending = _pending_migrations()
        except Exception as e:  # noqa: BLE001
            import logging
            logging.getLogger('django.request').exception('health: migration check failed')
            payload["status"] = "degraded"
            payload["database"]["migrations_ok"] = False
            payload["database"]["error"] = str(e)[:300]
            return Response(payload, status=503)

        if pending:
            payload["status"] = "degraded"
            payload["database"]["migrations_ok"] = False
            payload["database"]["pending_count"] = len(pending)
            payload["database"]["pending_migrations"] = pending[:20]
            return Response(payload, status=503)

        return Response(payload, status=200)
