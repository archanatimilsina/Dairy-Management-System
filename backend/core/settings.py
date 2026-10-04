
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
    raise ImproperlyConfigured(
        'DATABASE_URL is not set. The app cannot serve a single DB-backed '
        'endpoint without it (every request would return HTTP 500). '
        'Set it in your host\'s environment, e.g. Render -> Environment.'
    )

if 'postgres' not in DATABASE_URL and 'sqlite' not in DATABASE_URL:
    raise ImproperlyConfigured(
        f'DATABASE_URL does not point at a Postgres database: {DATABASE_URL!r}'
    )

DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True
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
AWS_S3_ENDPOINT_URL = f"{os.environ.get('SUPABASE_URL')}/storage/v1/s3"
AWS_S3_REGION_NAME = "ap-southeast-1"  
AWS_DEFAULT_ACL = 'public-read'
AWS_QUERYSTRING_AUTH = False           

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')  


MEDIA_URL = '/media/'
MEDIA_ROOT =os.path.join(BASE_DIR, 'media')


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-(!ch1zz7wnz89wq-gvm-d$37g=(e@+@5eu(k2%rnc3r@08bs@t'
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', '0') == '1'

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get(
        'ALLOWED_HOSTS',
        'localhost,127.0.0.1,dairy-management-system-te10.onrender.com'
    ).split(',')
    if h.strip()
]


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
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'https://dairy-management-system-git-main-archanatimilsinas-projects.vercel.app',
    'https://dairy-management-system-ej2jdvxiy-archanatimilsinas-projects.vercel.app',
    'https://dairy-management-system-rho.vercel.app'
]

CORS_ALLOW_CREDENTIALS = True

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL') or os.getenv('EMAIL_HOST_USER')