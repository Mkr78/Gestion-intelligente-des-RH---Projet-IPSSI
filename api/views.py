from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User, Candidate
from .serializers import UserSerializer, UserCreateSerializer, CandidateSerializer
from .permissions import IsRecruiter

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsRecruiter]
