from django.urls import path
from .views import (
    ImageListView,
    ImageUploadView,
    CropImagesByName, 
    StatsView,
    CropDeleteView,   
)

urlpatterns = [
    path("", ImageListView.as_view(), name="image-list"),
    path("upload/", ImageUploadView.as_view(), name="image-upload"),
    path("crop/<str:name>/", CropImagesByName.as_view(), name="crop-images-by-name"),
    path("stats/", StatsView.as_view(), name="stats"),
    path('crops/<int:pk>/delete/', CropDeleteView.as_view(), name='crop-delete')
]
