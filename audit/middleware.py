import threading

_thread_local = threading.local()

def set_current_request(request):
    _thread_local.request = request

def get_current_request():
    return getattr(_thread_local, "request", None)

def clear_current_request():
    if hasattr(_thread_local, "request"):
        del _thread_local.request

class AuditLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        set_current_request(request)
        response = self.get_response(request)
        clear_current_request()
        return response