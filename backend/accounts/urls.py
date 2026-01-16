from django.urls import path
from .views import AdminLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]