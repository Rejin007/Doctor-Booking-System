from django.contrib import admin
from .models import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "specialization",
        "years_of_experience",
        "is_active",
        "created_at",
    )

    list_filter = (
        "specialization",
        "is_active",
    )

    search_fields = (
        "name",
        "specialization",
    )

    ordering = ("name",)

    readonly_fields = ("id", "created_at", "updated_at")

    fieldsets = (
        ("Basic Information", {
            "fields": (
                "id",
                "name",
                "specialization",
                "years_of_experience",
                "bio",
                "is_active",
            )
        }),
        ("Consultation Settings", {
            "fields": (
                "consultation_modes",
            )
        }),
        ("Metadata", {
            "fields": ("created_at", "updated_at"),
        }),
    )

    list_per_page = 25