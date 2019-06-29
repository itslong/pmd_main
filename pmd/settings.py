"""
Django settings for pmd project.

Generated by 'django-admin startproject' using Django 2.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import sys
import dj_database_url
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
try:
  from pmd import local_settings as init_settings
  KEY_VALUE = init_settings.SECRET_KEY
except ImportError:
  # in prod: use elasticbeanstalk's environement vars
  KEY_VALUE = os.getenv('DJANGO_SECRET_KEY')

SECRET_KEY = KEY_VALUE

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', 'pmd-dev.herokuapp.com']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'knox',
    'corsheaders',
    'webpack_loader',
    'inventory',
    'web',
    'pmd_auth',
    'pdf_tasks',
    'django_filters',
    'localflavor',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pmd.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
          os.path.join(BASE_DIR, 'templates'),
          os.path.join(BASE_DIR, 'pmd', 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pmd.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases
USE_HEROKU_CONFIG = os.getenv('USE_HEROKU_CONFIG') == 'TRUE'
if USE_HEROKU_CONFIG:
  DATABASES = {
    'default': dj_database_url.config(conn_max_age=600)
  }
else:
  DATABASES = {
    'default': {
      'ENGINE': init_settings.LOCAL_DB['ENGINE'],
      'NAME': init_settings.LOCAL_DB['NAME'],
      'USER': init_settings.LOCAL_DB['USER'],
      'PASSWORD': init_settings.LOCAL_DB['PASSWORD'],
      'HOST': init_settings.LOCAL_DB['HOST'],
      'PORT': init_settings.LOCAL_DB['PORT'],
    }
  }


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Los_Angeles'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

if USE_HEROKU_CONFIG:
  STATIC_URL = '/static/'
  STATIC_ROOT = os.path.join(BASE_DIR, 'static')
  STATICFILES_DIRS = [
    os.path.join(BASE_DIR + '/web/bundles'),
  ]
  STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
  # STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
else:
  STATIC_URL = '/static/'
  STATIC_ROOT = os.path.join(BASE_DIR, 'static')
  STATICFILES_DIRS = (os.path.join(BASE_DIR, 'web/bundles'), )

# webpack loader config
USE_WEBPACK_PROD = os.getenv('USE_WEBPACK_PROD') == 'TRUE'

if USE_WEBPACK_PROD:
  WEBPACK_LOADER = {
    'DEFAULT': {
      'BUNDLE_DIR_NAME': 'dist/',
      'STATS_FILE': os.path.join(BASE_DIR + '/web/', 'webpack-stats.prod.json'),
    }
  }
else:
  # toggle this in local_settings
  WEBPACK_PROD_TEST = init_settings.WEBPACK_PROD_TEST == 'TRUE'
  # build-prod then test this path
  if WEBPACK_PROD_TEST:
    WEBPACK_LOADER = {
      'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR + '/web/', 'webpack-stats.prod.json'),
        'POLL_INTERVAL': 0.1,
        'TIMEOUT': None,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
      }
    }
  else:
    WEBPACK_LOADER = {
      'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'dev/bundles/',
        'STATS_FILE': os.path.join(BASE_DIR + '/web/', 'webpack-stats.dev.json'),
        'POLL_INTERVAL': 0.1,
        'TIMEOUT': None,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
      }
    }


# rest_framework configs
REST_FRAMEWORK = {
  'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication', ),
}

CORS_ORIGIN_WHITELIST = [
  'http://localhost:8000',
  'https://pmd-dev.herokuapp.com'
]

