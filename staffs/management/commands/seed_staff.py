from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import Account
from staffs.models import Staff
from datetime import date

class Command(BaseCommand):
    help = "Seed 2 default admin staffs into the database"

    def handle(self, *args, **options):
        admin_data = [
            {
                "email": "zephyrnguyen.vn@gmail.com",
                "fullname": "Admin System 1",
                "gender": "M",
                "dob": date(2003, 5, 5),
            },
            {
                "email": "huyentrangqb2003@gmail.com",
                "fullname": "Admin System 2",
                "gender": "F",
                "dob": date(2003, 4, 20),
            },
        ]

        created_count = 0
        skipped_count = 0

        for admin in admin_data:
            try:
                # Find account by email
                account = Account.objects.filter(email=admin["email"]).first()
                if not account:
                    self.stdout.write(
                        self.style.WARNING(f"Account with email {admin['email']} not found, skipping.")
                    )
                    continue

                # Check if staff already exists for this account
                if Staff.objects.filter(account=account).exists():
                    skipped_count += 1
                    self.stdout.write(
                        self.style.WARNING(f"Staff for {admin['email']} already exists, skipped.")
                    )
                    continue

                # Create staff
                Staff.objects.create(
                    fullname=admin["fullname"],
                    account=account,
                    gender=admin["gender"],
                    dob=admin["dob"],
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created staff for {admin['email']}")
                )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Failed to create staff for {admin['email']}: {e}")
                )

        self.stdout.write(
            self.style.SUCCESS(f"\nDone. Created: {created_count}, Skipped: {skipped_count}")
        )