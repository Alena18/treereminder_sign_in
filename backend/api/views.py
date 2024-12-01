from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializers import UserSerializer, NoteSerializer
from .models import Reminder


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Reminder.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Reminder.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# New View to Clear All Reminders for the Authenticated User
class ClearReminders(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def delete(self, request, *args, **kwargs):
        user = request.user  # Get the logged-in user
        # Delete all reminders for this user
        Reminder.objects.filter(author=user).delete()
        return Response({"message": "All reminders cleared!"}, status=status.HTTP_200_OK)
