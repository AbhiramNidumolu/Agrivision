from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CropImage(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="uploads/")
    description = models.TextField(blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
