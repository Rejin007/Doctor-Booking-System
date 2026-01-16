from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, time
from .models import Appointment
from doctors.serializers import DoctorListSerializer

class AppointmentCreateSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = Appointment
        fields = [
            'doctor',
            'patient_name',
            'patient_contact',
            'consultation_type',
            'appointment_date',
            'appointment_time'
        ]
    
    def validate_appointment_date(self, value):
        
        if value < timezone.now().date():
            raise serializers.ValidationError("Cannot book appointments in the past")
        return value
    
    def validate_appointment_time(self, value):
        
        if value < time(9, 0) or value >= time(17, 0):
            raise serializers.ValidationError("Appointments available between 9 AM and 5 PM only")
        
        if value.minute not in [0, 30]:
            raise serializers.ValidationError("Appointments must be on 30-minute intervals (e.g., 9:00, 9:30)")
        
        return value
    
    def validate_patient_contact(self, value):
       
        cleaned = value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        if len(cleaned) < 10:
            raise serializers.ValidationError("Please provide a valid contact number")
        
        return value
    
    def validate(self, data):
       
        doctor = data.get('doctor')
        consultation_type = data.get('consultation_type')
        
        if consultation_type not in doctor.consultation_modes:
            raise serializers.ValidationError({
                'consultation_type': f"Dr. {doctor.name} does not offer {consultation_type} consultations"
            })
        
        if not doctor.is_active:
            raise serializers.ValidationError({
                'doctor': "This doctor is currently not available for appointments"
            })
        
        return data

class AppointmentDetailSerializer(serializers.ModelSerializer):
    
    
    doctor = DoctorListSerializer(read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id',
            'doctor',
            'patient_name',
            'patient_contact',
            'consultation_type',
            'appointment_date',
            'appointment_time',
            'status',
            'created_at'
        ]

from rest_framework import serializers
from .models import Appointment

class AppointmentAdminSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)
    doctor_specialization = serializers.CharField(
        source="doctor.specialization", read_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient_name",
            "patient_contact",
            "consultation_type",
            "appointment_date",
            "appointment_time",
            "status",
            "doctor_name",
            "doctor_specialization",
            "created_at",
        ]
