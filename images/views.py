from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from PIL import Image
from .serializers import CropImageSerializer
from .permissions import IsStaffOrAdmin
from django.http import JsonResponse
from .models import  CropImage
from django.views import View


class ImageListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        images = CropImage.objects.filter(is_approved=True).order_by("-created_at")
        serializer = CropImageSerializer(images, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("image")
        name = request.data.get("name")

        if not file or not name:
            return Response({"error": "Name and image are required."}, status=status.HTTP_400_BAD_REQUEST)

        from PIL import Image
        try:
            img = Image.open(file)
            width, height = img.size
        except:
            return Response({"error": "Invalid image file."}, status=status.HTTP_400_BAD_REQUEST)

        if width < 400 or height < 400:
            return Response({"error": f"Image too small ({width}x{height}). Minimum is 400x400."},
                            status=status.HTTP_400_BAD_REQUEST)

        CropImage.objects.create(
            name=name,
            image=file,
            uploaded_by=request.user,
            is_approved=True  
        )

        return Response({"message": "Upload successful!"}, status=status.HTTP_201_CREATED)
class CropImagesByName(APIView):
    permission_classes = [AllowAny]

    def get(self, request, name):
        images = CropImage.objects.filter(name__iexact=name, is_approved=True)
        serializer = CropImageSerializer(images, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
class StatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        total_images = CropImage.objects.filter(is_approved=True).count()
        total_crops = CropImage.objects.filter(is_approved=True).values('name').distinct().count()
        data = {
            "images": total_images,
            "crops": total_crops
        }
        return Response(data, status=status.HTTP_200_OK)

class CropDeleteView(APIView):
    # You can require authentication or leave as AllowAny for local development
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        try:
            crop = CropImage.objects.get(pk=pk)
            crop.delete()
            return Response({"message": "Crop deleted"}, status=status.HTTP_204_NO_CONTENT)
        except CropImage.DoesNotExist:
            return Response({"error": "Crop not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    