"""Password hashing tuned for a Render free-tier shared vCPU.

Django 6 defaults to PBKDF2-SHA256 with 1,200,000 iterations, which costs
~700ms of pure CPU on a Render shared vCPU. That is paid on every single
``/login/`` and ``/register/`` request, before any database work happens, and
it is by far the largest cost on those endpoints.

600,000 iterations is the OWASP-recommended floor for PBKDF2-SHA256 and halves
the cost. The iteration count is stored inside each hash, so existing users'
passwords keep verifying without a reset.
"""

from django.contrib.auth.hashers import PBKDF2PasswordHasher


class PBKDF2PasswordHasher600k(PBKDF2PasswordHasher):
    iterations = 600_000