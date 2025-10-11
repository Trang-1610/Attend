from django.urls import path
from .views import (
    csrf_cookie, send_otp, verify_otp, 
    update_avatar, LoginView, ResetPasswordView, 
    lock_account, bulk_create_students, bulk_create_lecturers, 
    ResetPasswordLecturerView, unlock_account, LogoutView, 
    RefreshTokenView, MeView, get_csrf, GetAllAccountsView, 
    RequestOTPChangePasswordView, VerifyOTPChangePasswordView, RequestEmailChangePasswordView,
    VerifyOtpResetPasswordView, ResendOtpView, ResetPasswordForChangePasswordView,
    AdminUpdateAccountView, AccountCreateView, ForceLogoutUserView
)

urlpatterns = [
    path('send_otp/', send_otp),
    path('verify_otp/', verify_otp),
    path('csrf/cookie/', csrf_cookie),  
    path('<int:account_id>/update_avatar/', update_avatar, name='update_avatar'),
    path('login/', LoginView.as_view(), name='login'),
    path('reset-password/<str:email>/', ResetPasswordView.as_view(), name='admin-reset-password'),
    path('lock/<str:email>/', lock_account, name='lock-account'),
    path('unlock/<str:email>/', unlock_account, name='unlock-account'),
    path('bulk-create-students/', bulk_create_students, name='bulk-create-students'),
    path('bulk-create-lecturers/', bulk_create_lecturers, name='bulk-create-lecturers'),
    path('lecturer/reset-password/<str:email>/', ResetPasswordLecturerView.as_view(), name='reset-password-lecturer'),

    # Change password
    path("auth/request-otp-change-password/", RequestOTPChangePasswordView.as_view(), name="request-otp-change-password"),
    path("auth/verify-otp-change-password/", VerifyOTPChangePasswordView.as_view(), name="verify-otp-change-password"),

    # Send email to change password
    path("auth/forgot-password/", RequestEmailChangePasswordView.as_view(), name="forgot-password"),

    # Verify OTP to reset password
    path("auth/verify-otp-reset-password/", VerifyOtpResetPasswordView.as_view(), name="verify-otp-reset-password"),

    # Resend OTP
    path("auth/resend-otp/", ResendOtpView.as_view(), name="resend-otp"),

    # Reset password for change password
    path("auth/reset-password-for-change-password/", ResetPasswordForChangePasswordView.as_view(), name="reset-password-for-change-password"),

    # Authentication and Token Management
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
    path('me/', MeView.as_view(), name='me'),
    path('get-csrf-token/', get_csrf, name='get-csrf-token'),

    # Admin
    path('get-all-accounts/', GetAllAccountsView.as_view(), name='get-all-accounts'),

    # Admin update account
    path('admin/update-account/<int:account_id>/', AdminUpdateAccountView.as_view(), name='admin-update-account'),

    # Admin create account
    path('admin/create-account/', AccountCreateView.as_view(), name='admin-create-account'),

    # Force logout user
    path('admin/force-logout-user/<int:account_id>/', ForceLogoutUserView.as_view(), name='force-logout-user'),
]