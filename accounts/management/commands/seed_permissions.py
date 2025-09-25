from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission
from accounts.models import PermissionMeta

class Command(BaseCommand):
    help = "Seed PermissionMeta for all existing permissions"

    def handle(self, *args, **options):
        count_created = 0
        count_existing = 0

        for perm in Permission.objects.all():
            obj, created = PermissionMeta.objects.get_or_create(
                permission=perm,
                defaults={"description": f"Auto-generated meta for {perm.codename}"}
            )
            if created:
                count_created += 1
                self.stdout.write(self.style.SUCCESS(f"Created PermissionMeta for {perm.codename}"))
            else:
                count_existing += 1
                self.stdout.write(f"PermissionMeta already exists for {perm.codename}")

        self.stdout.write(self.style.SUCCESS(
            f"Done! Created: {count_created}, Skipped existing: {count_existing}"
        ))