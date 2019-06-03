from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):

  def handle(self, *args, **options):
    if not User.objects.filter(username="pmadmin").exists():
      User.objects.create_superuser(username="pmdadmin", email="pmdadmin@adminenv.com", password="pleasechangeme")
