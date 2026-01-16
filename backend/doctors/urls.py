from django.urls import path
from .views import (
    DoctorListView,
    DoctorDetailView,
    SpecializationListView,
    AdminDoctorListCreateView,
    AdminDoctorDetailView
)

urlpatterns = [
    path('', DoctorListView.as_view(), name='doctor-list'),
    path('<uuid:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('specializations/', SpecializationListView.as_view(), name='specializations'),

    path('admin/', AdminDoctorListCreateView.as_view(), name='admin-doctor-list'),
    path('admin/<uuid:pk>/', AdminDoctorDetailView.as_view(), name='admin-doctor-detail'),
]
