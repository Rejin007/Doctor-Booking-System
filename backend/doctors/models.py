import uuid
import json
from django.db import models

class Doctor(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    specialization = models.CharField(max_length=100, db_index=True)
    bio = models.TextField()
    years_of_experience = models.IntegerField()
    
    _consultation_modes = models.JSONField(default=list)
    
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'doctors_doctor'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['specialization', 'is_active']),
        ]
    
    def __str__(self):
        return f"Dr. {self.name} - {self.specialization}"
    
    @property
    def consultation_modes(self):
        """Get consultation modes"""
        return self._consultation_modes
    
    @consultation_modes.setter
    def consultation_modes(self, value):
        """Set consultation modes"""
        self._consultation_modes = value
    
    @property
    def is_available(self):
        """
        Check if doctor is available for new appointments.
        Currently based on is_active status.
        Can be extended to check time-based availability.
        """
        return self.is_active