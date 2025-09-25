from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from helper.generate_random_code import generate_random_code

# =======================
# Account Manager
# =======================
class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # hash password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


# =======================
# Account
# =======================
class Account(AbstractBaseUser, PermissionsMixin):
    class UserType(models.TextChoices):
        STUDENT = "student", "Student"
        TEACHER = "teacher", "Teacher"
        ADMIN = "admin", "Admin"
        STAFF = "staff", "Staff"

    account_id = models.BigAutoField(primary_key=True)
    account_code = models.UUIDField(default=generate_random_code, unique=True)  # Changed: use uuid.uuid4 directly

    # Removed custom Role FK, replaced with built-in Group/Permission
    # role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="accounts")

    email = models.EmailField(unique=True, max_length=200)
    phone_number = models.CharField(max_length=15, unique=True)

    is_active = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    is_verified_email = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    user_type = models.CharField(max_length=20, choices=UserType.choices)

    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(auto_now=True)  # auto update when login
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = AccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone_number"]

    class Meta:
        db_table = "accounts"
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["phone_number"]),
        ]
        verbose_name = "Account"
        verbose_name_plural = "Accounts"

    def __str__(self):
        return self.email

    # Example helper method to check permissions
    def has_role(self, role_name: str) -> bool:
        return self.groups.filter(name=role_name).exists()

    def has_permission(self, codename: str) -> bool:
        return self.user_permissions.filter(codename=codename).exists() or \
               self.groups.filter(permissions__codename=codename).exists()

# =======================
# Extend Group (Role) with metadata
# =======================
class Role(Group):  # Changed: inherit from Group instead of custom model
    role_code = models.UUIDField(default=generate_random_code, unique=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "roles"
        verbose_name = "Role"
        verbose_name_plural = "Roles"


# =======================
# Extend Permission via OneToOne
# =======================
class PermissionMeta(models.Model):
    permission = models.OneToOneField(
        Permission,
        on_delete=models.CASCADE,
        related_name="meta"
    )
    description = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "permission_meta"
        verbose_name = "Permission Metadata"
        verbose_name_plural = "Permissions Metadata"

    def __str__(self):
        return f"{self.permission.codename} - {self.description or 'No description'}"