
from django.db import models
from django.contrib.auth.models import User

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    due_date = models.DateTimeField()  # Make sure the due date is a DateTimeField
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when created

    def __str__(self):
        return f"Reminder for {self.user.username} - {self.text}"
