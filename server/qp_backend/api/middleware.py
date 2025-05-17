from functools import wraps
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser

def role_required(allowed_roles=[]):
    def decorator(view_func_or_method):
        @wraps(view_func_or_method)
        def _wrapped_view_or_method(*args, **kwargs):
            request_obj = None
            # args[0] is 'self' for a method, or 'request' for a function view
            # args[1] is 'request' for a method
            if args:
                if len(args) >= 2 and hasattr(args[1], 'user'): # Likely 'self', 'request', ...
                    request_obj = args[1]
                elif hasattr(args[0], 'user'): # Likely 'request', ...
                    request_obj = args[0]
            
            if not request_obj:
                print("DEBUG Middleware: Role check error: Could not identify request object.")
                return JsonResponse({'error': 'Server configuration error (decorator).'}, status=500)

            # Initial check for authentication and basic user structure
            if not hasattr(request_obj, 'user') or not request_obj.user or not request_obj.user.is_authenticated:
                print(f"DEBUG Middleware: Role check DENIED (Unauthenticated): User is Anonymous. Path: {request_obj.path}")
                return JsonResponse(
                    {'error': 'Authentication credentials were not provided or are invalid.'}, 
                    status=401
                )

            if not hasattr(request_obj.user, 'role'):
                print(f"DEBUG Middleware: Role check DENIED (No Role Attribute): User {request_obj.user.username}. Path: {request_obj.path}")
                return JsonResponse(
                    {'error': 'User profile is incomplete or misconfigured.'}, 
                    status=403
                )
            
            user_role = request_obj.user.role
            current_username = request_obj.user.username
            roles_to_check = allowed_roles if isinstance(allowed_roles, (list, tuple)) else [allowed_roles]
            
            if user_role not in roles_to_check:
                # Log detailed info only on denial
                print(f"DEBUG Middleware: Role check DENIED: User '{current_username}', Role '{user_role}', Allowed: {roles_to_check}. Path: {request_obj.path}")
                return JsonResponse(
                    {'error': f'Access denied. Required roles: {", ".join(roles_to_check)}'}, 
                    status=403
                )
            
            # For successful access, no logging to reduce noise
            # print(f"DEBUG Middleware: Role check GRANTED: User '{current_username}', Role '{user_role}'. Path: {request_obj.path}")
            return view_func_or_method(*args, **kwargs)
        return _wrapped_view_or_method
    return decorator

def class_role_required(allowed_roles=[]):
    def decorator(cls_method): # This decorator wraps a method of a class
        @wraps(cls_method)
        def _wrapped_method(self_obj, request, *args, **kwargs): # 'self_obj' is the class instance (e.g., the view instance)
            if not hasattr(request, 'user') or not request.user or not request.user.is_authenticated:
                print(f"DEBUG Middleware: Role check DENIED in 'class_role_required': User is Anonymous. Path: {request.path}")
                return JsonResponse(
                    {'error': 'Authentication credentials were not provided or are invalid.'},
                    status=401
                )
            if not hasattr(request.user, 'role'):
                print(f"DEBUG Middleware: Role check DENIED in 'class_role_required': User {request.user.username} lacks 'role' attribute. Path: {request.path}")
                return JsonResponse(
                    {'error': 'User profile is incomplete or misconfigured.'},
                    status=403
                )
            
            user_role = request.user.role
            current_username = request.user.username
            roles_to_check = allowed_roles if isinstance(allowed_roles, (list, tuple)) else [allowed_roles]

            if user_role not in roles_to_check:
                print(f"DEBUG Middleware: Role check DENIED in 'class_role_required': User '{current_username}', Role '{user_role}', Allowed: {roles_to_check}. Path: {request.path}")
                return JsonResponse(
                    {'error': f'Access denied. Required roles: {", ".join(roles_to_check)}'},
                    status=403
                )
            
            # For successful access, no logging to reduce noise
            # print(f"DEBUG Middleware: Role check GRANTED in 'class_role_required': User '{current_username}', Role '{user_role}'. Path: {request.path}")
            return cls_method(self_obj, request, *args, **kwargs)
        return _wrapped_method
    return decorator
