import uuid
from django.db import models
from django.core.exceptions import ValidationError
from doctors.models import Doctor

class Appointment(models.Model):
    
    CONSULTATION_TYPES = [
        ('online', 'Online'),
        ('in-person', 'In-Person'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    
    patient_name = models.CharField(max_length=255)
    patient_contact = models.CharField(max_length=20)
    
    consultation_type = models.CharField(
        max_length=20,
        choices=CONSULTATION_TYPES
    )
    appointment_date = models.DateField(db_index=True)
    appointment_time = models.TimeField()
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'appointments_appointment'
        ordering = ['-appointment_date', '-appointment_time']
        
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'appointment_date', 'appointment_time'],
                name='unique_doctor_appointment_slot'
            )
        ]
        
        indexes = [
            models.Index(fields=['doctor', 'appointment_date']),
            models.Index(fields=['appointment_date', 'status']),
        ]
    
    def __str__(self):
        return f"{self.patient_name} - Dr. {self.doctor.name} on {self.appointment_date} at {self.appointment_time}"
    

    def clean(self):
        modes = self.doctor.consultation_modes or []

        if self.consultation_type not in modes:
            raise ValidationError(
                f"Doctor does not support {self.consultation_type} consultations"
            )

        if not self.doctor.is_active:
            raise ValidationError("Doctor is not active")
