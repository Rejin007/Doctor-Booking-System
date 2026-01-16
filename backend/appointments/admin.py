from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "patient_name",
        "doctor",
        "appointment_date",
        "appointment_time",
        "consultation_type",
        "status",
        "created_at",
    )
    
    list_filter = (
        "status",
        "consultation_type",
        "appointment_date",
    )
    
    search_fields = (
        "patient_name",
        "patient_contact",
        "doctor__name",
    )
    
    readonly_fields = ("id", "created_at")
    
    ordering = ("-appointment_date", "-appointment_time")
    
    list_per_page = 25