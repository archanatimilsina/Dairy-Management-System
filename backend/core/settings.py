
from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()
from django.core.exceptions import ImproperlyConfigured
import dj_database_url
BASE_DIR = Path(__file__).resolve().parent.parent

DATABASE_URL = os.environ.get('DATABASE_URL')

if not DATABASE_URL:
    # Never crash at import: Render runs collectstatic during build, often
    # without runtime env. Fall back to local sqlite so the build succeeds;
    # /health/ will report database: unavailable until a real URL is set.
    import warnings
    warnings.warn('DATABASE_URL is not set; using local sqlite fallback.')
    DATABASE_URL = 'sqlite:///' + str(BASE_DIR / 'db.sqlite3')

if 'postgres' not in DATABASE_URL and 'sqlite' not in DATABASE_URL:
    raise ImproperlyConfigured('DATABASE_URL must be a Postgres or sqlite URL.')

# Supabase pooler (6543 / pgbouncer transaction mode) cannot hold server-side
# connections: conn_max_age must be 0 or you get hangs + prepared-statement
# errors. Direct Postgres (5432) can reuse connections.
_is_pooler = 'pooler' in DATABASE_URL or ':6543' in DATABASE_URL
# Managed hosts (Supabase / Render / Neon) require SSL; local PG usually not.
_is_managed = any(h in DATABASE_URL for h in ('supabase', 'render.com', 'neon.tech'))
DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=0 if _is_pooler else 600,
        conn_health_checks=not _is_pooler,
        ssl_require=_is_managed,
    )
}

# psycopg2 will happily sit on a dead/unroutable host for the OS default
# (minutes). Every auth request then hangs instead of failing, which is what
# made /login/ and /register/ look "stuck" when the database was unreachable.
if 'sqlite' not in DATABASES['default'].get('ENGINE', ''):
    DATABASES['default'].setdefault('OPTIONS', {})
    DATABASES['default']['OPTIONS'].setdefault('connect_timeout', 5)

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

AWS_ACCESS_KEY_ID = os.environ.get('SUPABASE_S3_ACCESS_KEY')
AWS_SECRET_ACCESS_KEY = os.environ.get('SUPABASE_S3_SECRET_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('SUPABASE_BUCKET_NAME')  
_supa = os.environ.get('SUPABASE_URL')
AWS_S3_ENDPOINT_URL = f"{_supa}/storage/v1/s3" if _supa else None
AWS_S3_REGION_NAME = "ap-southeast-1"  
AWS_DEFAULT_ACL = 'public-read'
AWS_QUERYSTRING_AUTH = False           

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')  


MEDIA_URL = '/media/'
MEDIA_ROOT =os.path.join(BASE_DIR, 'media')


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY:
    if os.environ.get('DEBUG', '0') == '1':
        SECRET_KEY = 'django-insecure-(!ch1zz7wnz89wq-gvm-d$37g=(e@+@5eu(k2%rnc3r@08bs@t'
    else:
        raise ImproperlyConfigured('SECRET_KEY is not set. Set it in the environment.')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', '0') == '1'

_hosts = [h.strip() for h in os.environ.get('ALLOWED_HOSTS', '').split(',') if h.strip()]
if not _hosts:
    _hosts = ['localhost', '127.0.0.1', '.onrender.com']
_render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if _render_host and _render_host not in _hosts:
    _hosts.append(_render_host)
ALLOWED_HOSTS = _hosts


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

EXTERNAL_APPS =[
'account',
'product',
'Feedbacks',
'contact',
'order',
'rest_framework',
'rest_framework_simplejwt.token_blacklist',
'corsheaders',
]

INSTALLED_APPS +=EXTERNAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

# Django 6 defaults to PBKDF2-SHA256 with 1,200,000 iterations, which burns
# ~700ms of CPU per login/register on a Render shared vCPU. 600,000 is still the
# OWASP floor for PBKDF2-SHA256 and halves it. Password hashing is the single
# biggest cost on the auth endpoints -- nothing else there is worth more than a
# few ms.
PASSWORD_HASHERS = [
    'core.hashers.PBKDF2PasswordHasher600k',
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

CORS_ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get(
        'CORS_ALLOWED_ORIGINS',
        'http://127.0.0.1:5173,http://localhost:5173,https://dairy-management-system-rho.vercel.app',
    ).split(',') if o.strip()
]
# Any Vercel preview of this project (branch deploys) without listing each URL.
CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https://dairy-management-system-.*\.vercel\.app$',
]
_csrf = [o.strip() for o in os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',') if o.strip()]
if not _csrf:
    _csrf = ['https://dairy-management-system-rho.vercel.app', 'https://*.onrender.com']
if _render_host and f'https://{_render_host}' not in _csrf:
    _csrf.append(f'https://{_render_host}')
CSRF_TRUSTED_ORIGINS = _csrf

CORS_ALLOW_CREDENTIALS = False

# Production hardening (active when DEBUG=0).
if os.environ.get('DEBUG', '0') != '1':
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'same-origin'
    X_FRAME_OPTIONS = 'DENY'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
EMAIL_TIMEOUT = int(os.environ.get('EMAIL_TIMEOUT', '15'))
PASSWORD_RESET_TIMEOUT = 86400

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL') or os.getenv('EMAIL_HOST_USER')