from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Doctor
from .serializers import (
    DoctorListSerializer,
    DoctorDetailSerializer,
    DoctorAdminSerializer
)

class IsAdminUser(permissions.BasePermission):
  
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

class DoctorListView(generics.ListAPIView):

    serializer_class = DoctorListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Doctor.objects.filter(is_active=True)
        
        specialization = self.request.query_params.get('specialization', None)
        if specialization:
            queryset = queryset.filter(
                specialization__icontains=specialization
            )
        
        return queryset

class DoctorDetailView(generics.RetrieveAPIView):

    serializer_class = DoctorDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Doctor.objects.filter(is_active=True)

class SpecializationListView(generics.GenericAPIView):

    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        specializations = Doctor.objects.filter(
            is_active=True
        ).values_list('specialization', flat=True).distinct().order_by('specialization')
        
        return Response(list(specializations))


class AdminDoctorListCreateView(generics.ListCreateAPIView):
    
    serializer_class = DoctorAdminSerializer
    permission_classes = [IsAdminUser]
    queryset = Doctor.objects.all()
    
    def get_queryset(self):
        queryset = Doctor.objects.all()
        
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(specialization__icontains=search)
            )
        
        return queryset

class AdminDoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
   
    serializer_class = DoctorAdminSerializer
    permission_classes = [IsAdminUser]
    queryset = Doctor.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(
            {'message': 'Doctor deactivated successfully'},
            status=status.HTTP_200_OK
        )