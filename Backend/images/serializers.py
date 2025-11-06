from rest_framework import serializers
from .models import CropImage

class CropImageSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CropImage
        fields = ['id', 'name', 'image_url', 'uploaded_by', 'is_approved', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url)
        return None
