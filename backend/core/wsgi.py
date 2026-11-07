"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import logging
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()


def _run_startup_migrations():
    """Apply pending migrations once, before gunicorn starts serving.

    Render's free tier does NOT support a pre-deploy command, and this service
    is configured from the dashboard (render.yaml is ignored), so nothing has
    ever run `migrate` in production. That left tables such as
    ``token_blacklist_outstandingtoken`` missing, which made every /register/
    and /login/ fail (surfaced as a misleading "database temporarily
    unavailable" 503).

    Safe defaults:
      * Gunicorn runs with --preload, so this executes once in the master
        process, not once per worker.
      * `migrate` is idempotent: with no pending migrations it is a single
        cheap read of django_migrations.
      * DEBUG=1 (local `runserver`) skips it unless AUTO_MIGRATE=1 is set
        explicitly, so the dev autoreloader does not migrate on every save.
      * A failure is logged and swallowed: a database outage at boot should
        not put the service into a crash loop. /health/ reports the problem.
    """
    from django.conf import settings

    flag = os.environ.get('AUTO_MIGRATE')
    if flag is None:
        enabled = not settings.DEBUG
    else:
        enabled = flag.strip().lower() in ('1', 'true', 'yes', 'on')
    if not enabled:
        return

    from django.core.management import call_command

    try:
        call_command('migrate', interactive=False, verbosity=1)
        logging.getLogger('django.request').info('startup migrations: up to date')
    except Exception:  # noqa: BLE001 - never block startup on a DB outage
        logging.getLogger('django.request').exception(
            'startup migrations failed; serving anyway (/health/ will report it)'
        )


_run_startup_migrations()
