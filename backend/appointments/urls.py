from django.urls import path
from .views import (
    AppointmentCreateView,
    AvailableTimeSlotsView,
    MyAppointmentsView,
    AdminAppointmentListView,
    AdminAppointmentDetailView,
    AdminAppointmentStatsView,
)

urlpatterns = [
    path("", AppointmentCreateView.as_view(), name="appointment-create"),
    path("available-slots/", AvailableTimeSlotsView.as_view(), name="available-slots"),
    path("my-appointments/", MyAppointmentsView.as_view(), name="my-appointments"),

    path("admin/appointments/", AdminAppointmentListView.as_view(), name="admin-appointment-list"),
    path("admin/appointments/<uuid:pk>/", AdminAppointmentDetailView.as_view(), name="admin-appointment-detail"),
    path("admin/stats/", AdminAppointmentStatsView.as_view(), name="admin-stats"),
]