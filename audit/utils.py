import threading
import json
from decimal import Decimal
from django.db.models import FileField
from user_agents import parse as parse_ua
import ipinfo
import requests
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
import pytz

_local = threading.local()

# ==================================================
# Set current request
# ==================================================
def set_current_request(request):
    _local.request = request
# ==================================================
# Get current request
# ==================================================
def get_current_request():
    return getattr(_local, "request", None)

# def get_current_user():
#     request = get_current_request()
#     if request and hasattr(request, "user") and request.user.is_authenticated:
#         return request.user
#     return None
# ==================================================
# Get current user
# ==================================================
def get_current_user():
    request = get_current_request()
    if not request:
        return None
    user = getattr(request, "user", None)
    if user and getattr(user, "is_authenticated", False):
        return user
    return None
# ==================================================
# Clear current request
# ==================================================
def clear_current_request():
    if hasattr(_local, "request"):
        del _local.request
# ==================================================
# Convert model to dict
# ==================================================
def safe_model_to_dict(instance):
    """Convert model to dict with JSON-safe values."""
    from django.forms.models import model_to_dict

    data = model_to_dict(instance)

    for field in instance._meta.fields:
        field_name = field.name
        value = getattr(instance, field_name, None)

        if isinstance(field, FileField):
            data[field_name] = value.url if value else None
        elif hasattr(value, "isoformat"):
            data[field_name] = value.isoformat() if value else None
        elif isinstance(value, Decimal):
            data[field_name] = str(value)
        else:
            try:
                json.dumps(value)
                data[field_name] = value
            except (TypeError, ValueError):
                data[field_name] = str(value)

    return data
from user_agents import parse as parse_ua
# ==================================================
# Get device info
# ==================================================
def get_device_info(request):
    user_agent_str = request.META.get("HTTP_USER_AGENT", "")
    ua = parse_ua(user_agent_str)
    return {
        "browser": ua.browser.family,  # Chrome, Safari, Firefox
        "browser_version": ua.browser.version_string,
        "os": ua.os.family,           # Windows, iOS, Android
        "os_version": ua.os.version_string,
        "device": ua.device.family,   # iPhone, Samsung, etc.
        "is_mobile": ua.is_mobile,
        "is_tablet": ua.is_tablet,
        "is_pc": ua.is_pc,
    }
# ==================================================
# Get location
# ==================================================
def get_location(ip):
    try:
        access_token = "d065275d7a2b3f"
        handler = ipinfo.getHandler(access_token)
        details = handler.getDetails(ip)
        return {
            "city": details.city,
            "region": details.region,
            "country": details.country_name,
            "loc": details.loc,  # lat,long
        }
    except Exception:
        return None
import requests
# ==================================================
# Get device and location
# ==================================================
def get_device_and_location(request):
    user_agent = request.META.get("HTTP_USER_AGENT", "")
    ip_address = request.META.get("REMOTE_ADDR") or request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0]

    device_type = "Unknown"
    if "Windows" in user_agent:
        device_type = "Windows PC"
    elif "Mac" in user_agent:
        device_type = "Mac"
    elif "Android" in user_agent:
        device_type = "Android"
    elif "iPhone" in user_agent:
        device_type = "iPhone"
    elif "iPad" in user_agent:
        device_type = "iPad"

    location = None
    try:
        res = requests.get(f"https://ipinfo.io/{ip_address}?token=d065275d7a2b3f", timeout=3)
        if res.status_code == 200:
            data = res.json()
            location = f"{data.get('city', '')}, {data.get('region', '')}, {data.get('country', '')}"
    except Exception:
        pass

    return {
        "ip": ip_address,
        "user_agent": user_agent,
        "device_type": device_type,
        "location": location,
    }
# ==================================================
# Send email to inform user about logining activity
# ==================================================
def send_login_email(account, ip_address, device_info, location=None):
    """Send email to inform user about logining activity"""
    if not account or not getattr(account, "email", None):
        return

    vn_tz = pytz.timezone("Asia/Ho_Chi_Minh")
    now_vn = timezone.now().astimezone(vn_tz)

    # Render HTML template context
    context = {
        "user_email": account.email,
        "ip_address": ip_address or "Không xác định",
        "device_info": device_info.get("device", "Không rõ") if isinstance(device_info, dict) else str(device_info),
        "location": location or "Không xác định",
        "datelogin": now_vn.strftime("%H:%M:%S %d/%m/%Y"),
    }

    # Render HTML template
    subject = "Thông báo đăng nhập - ATTEND 3D"
    html_content = render_to_string("account/login_email.html", context)
    text_content = (
        f"Bạn đã đăng nhập vào ATTEND 3D lúc {context['datelogin']} từ IP {context['ip_address']} ({context['location']})."
    )

    # Send email
    msg = EmailMultiAlternatives(subject, text_content, None, [account.email])
    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=True)