from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import IntegrityError
from datetime import datetime

from .models import Appointment
from .serializers import (
    AppointmentCreateSerializer,
    AppointmentDetailSerializer,
    AppointmentAdminSerializer,
)
from doctors.views import IsAdminUser




class AppointmentCreateView(generics.CreateAPIView):

    serializer_class = AppointmentCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            self.perform_create(serializer)
            appointment = serializer.instance   
            detail_serializer = AppointmentDetailSerializer(appointment)

            return Response(
                {
                    "message": "Appointment booked successfully",
                    "appointment": detail_serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        except IntegrityError:
            return Response(
                {
                    "error": "This time slot is already booked. Please choose another time."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )




class MyAppointmentsView(generics.ListAPIView):

    serializer_class = AppointmentDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        contact = self.request.query_params.get('contact', '').strip()
        
        if not contact:
            return Appointment.objects.none()
        
        cleaned_contact = contact.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        queryset = Appointment.objects.select_related('doctor').filter(
            patient_contact__icontains=cleaned_contact
        ).order_by('-appointment_date', '-appointment_time')
        
        return queryset



class AvailableTimeSlotsView(APIView):
    
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        doctor_id = request.query_params.get("doctor_id")
        date_str = request.query_params.get("date")

        if not doctor_id or not date_str:
            return Response(
                {"error": "doctor_id and date are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            appointment_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        all_slots = []
        for hour in range(9, 17):
            all_slots.append(f"{hour:02d}:00")
            all_slots.append(f"{hour:02d}:30")

        booked_appointments = Appointment.objects.filter(
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            status__in=["pending", "confirmed"],
        ).values_list("appointment_time", flat=True)

        booked_slots = [t.strftime("%H:%M") for t in booked_appointments]

        available_slots = [
            slot for slot in all_slots if slot not in booked_slots
        ]

        return Response(
            {
                "date": date_str,
                "available_slots": available_slots,
            }
        )



class AdminAppointmentListView(generics.ListAPIView):
   
    serializer_class = AppointmentAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Appointment.objects.select_related("doctor").order_by("-created_at")
        
        doctor_id = self.request.query_params.get('doctor')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                appointment_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                queryset = queryset.filter(appointment_date=appointment_date)
            except ValueError:
                pass  
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset



class AdminAppointmentDetailView(generics.RetrieveUpdateAPIView):

    serializer_class = AppointmentAdminSerializer
    permission_classes = [IsAdminUser]
    queryset = Appointment.objects.select_related("doctor").all()
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        if 'status' in request.data and len(request.data) == 1:
            new_status = request.data['status']
            
            if instance.status == 'cancelled' and new_status != 'cancelled':
                return Response(
                    {"error": "Cannot change status of a cancelled appointment"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)



class AdminAppointmentStatsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.utils import timezone

        today = timezone.now().date()

        return Response(
            {
                "total_appointments": Appointment.objects.count(),
                "pending": Appointment.objects.filter(status="pending").count(),
                "confirmed": Appointment.objects.filter(status="confirmed").count(),
                "cancelled": Appointment.objects.filter(status="cancelled").count(),
                "today_appointments": Appointment.objects.filter(
                    appointment_date=today
                ).count(),
                "upcoming_appointments": Appointment.objects.filter(
                    appointment_date__gte=today,
                    status__in=["pending", "confirmed"],
                ).count(),
            }
        )