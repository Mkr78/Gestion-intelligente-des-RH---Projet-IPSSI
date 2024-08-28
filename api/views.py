from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate 

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    CandidateSerializer
)
from .models import User, Candidate
from .permissions import IsRecruiter


def get_tokens_for_user(user):
    """
    Generate JWT tokens for a given user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users, including registration and login.
    """
    queryset = User.objects.all()
    serializer_class = UserLoginSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserLoginSerializer

    @action(detail=False, methods=['post'], permission_classes=[])
    def register(self, request):
        """
        Custom action to handle user registration.
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 200,
                'message': 'Registration successful, check your email',
                'data': serializer.data
            })
        return Response({
            'status': 400,
            'message': 'Something went wrong',
            'data': serializer.errors
        })

    @action(detail=False, methods=['post'], permission_classes=[])
    def login(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        
        # Debug: print email and password
        print(f"Attempting to authenticate with email: {email}")

        user = authenticate(email=email, password=password)
        
        if user is not None:
            # Debug: print user and its properties
            print(f"Authenticated user: {user}")
            print(f"User is active: {user.is_active}")

            if not user.is_active:
                return Response(
                    {'errors': {'non_field_errors': ['Oops! Your account is not verified!']}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = get_tokens_for_user(user)
            return Response(
                {
                    'token': token,
                    'msg': 'Login Success',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                        'firstname': user.first_name,
                        'lastname': user.last_name,
                        'role': user.role,
                        'is_admin': user.is_superuser
                    }
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'errors': {'non_field_errors': ['Email or Password is not valid']}},
                status=status.HTTP_400_BAD_REQUEST
            )


class CandidateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing candidates.
    """
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsRecruiter]
