from rest_framework import serializers
from .models import Doctor



class DoctorListSerializer(serializers.ModelSerializer):
    consultation_modes = serializers.ListField(
        source='_consultation_modes',
        read_only=True
    )
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id',
            'name',
            'specialization',
            'years_of_experience',
            'consultation_modes',
            'is_available',
        ]

    def get_is_available(self, obj):
        return obj.is_active



class DoctorDetailSerializer(serializers.ModelSerializer):
    consultation_modes = serializers.ListField(
        source='_consultation_modes',
        read_only=True
    )
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id',
            'name',
            'specialization',
            'bio',
            'years_of_experience',
            'consultation_modes',
            'is_available',
        ]

    def get_is_available(self, obj):
        return obj.is_active


class DoctorAdminSerializer(serializers.ModelSerializer):
    consultation_modes = serializers.ListField(
        source='_consultation_modes'
    )

    class Meta:
        model = Doctor
        fields = [
            'id',
            'name',
            'specialization',
            'bio',
            'years_of_experience',
            'consultation_modes',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_consultation_modes(self, value):
        if not value:
            raise serializers.ValidationError(
                "At least one consultation mode is required."
            )
        valid_modes = ['online', 'in-person']
        for mode in value:
            if mode not in valid_modes:
                raise serializers.ValidationError(
                    f"Invalid consultation mode: {mode}"
                )
        return value

    def update(self, instance, validated_data):
        if 'bio' in validated_data and validated_data['bio'] == '':
            validated_data.pop('bio')
        return super().update(instance, validated_data)




class SpecializationSerializer(serializers.Serializer):
    specialization = serializers.CharField(max_length=100)
