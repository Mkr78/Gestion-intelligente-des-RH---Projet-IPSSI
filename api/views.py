from django.http import BadHeaderError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate 
from rest_framework.permissions import IsAdminUser
from django.core.mail import send_mail

from backend import settings

from .serializers import (
    AdminUserCreationSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    CandidateSerializer
)
from .models import User, Candidate
from .permissions import IsRecruiter



def send_welcome_email(email, password):
    subject = 'Welcome to Our Platform'
    message = f'Your account has been created. Your password is: {password}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    try:
        send_mail(subject, message, from_email, recipient_list)
    except BadHeaderError:
        # Handle the error (e.g., log it or notify someone)
        print("Invalid header found.")
    except Exception as e:
        # Handle other potential exceptions
        print(f"An error occurred while sending email: {e}")


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

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action == 'add_user':
            return AdminUserCreationSerializer
        elif self.action in ['get_profile', 'edit_profile']:
            return UserProfileSerializer
        return UserLoginSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[])
    def add_user(self, request):
        """
        Custom action for admin to add normal users with an automatically generated password.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_welcome_email(user.email, user.generated_password)

            return Response({
                'status': 201,
                'message': 'User created successfully',
                'data': {
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role':user.role,
                    'generated_password': user.generated_password  # Include the generated password in response
                }
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 400,
            'message': 'User creation failed',
            'data': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

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

        user = authenticate(email=email, password=password)
        
        if user is not None:
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

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated,IsRecruiter])
    def get_profile(self, request):
        """
        Custom action to get the profile of the authenticated user or any user by admin.
        """
        user = request.user
        user_id = self.kwargs.get('pk')

        print(request.user)  # Debugging output
        if not request.user.is_authenticated:
            print("User is not authenticated")

        # If an admin is making the request, they can get any user's profile
        if user.is_superuser:
            try:
                profile_user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # If not an admin, only their own profile can be accessed
            if user_id and user_id != user.id:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            profile_user = user

        serializer = UserProfileSerializer(profile_user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated,IsRecruiter])
    def edit_profile(self, request):
        """
        Custom action to edit the profile of the authenticated user or any user by admin.
        """
        user = request.user
        user_id = self.kwargs.get('pk')

        # If an admin is making the request, they can edit any user's profile
        if user.is_superuser:
            try:
                profile_user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # If not an admin, only their own profile can be edited
            if user_id and user_id != user.id:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            profile_user = user

        serializer = UserProfileSerializer(profile_user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], permission_classes=[])
    def delete_profile(self, request, pk=None):
        """
        Custom action to delete a user profile. Only accessible by admin.
        """
        user = request.user

        if not user.is_superuser:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        try:
            user_to_delete = User.objects.get(pk=pk)
            user_to_delete.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



class CandidateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing candidates.
    """
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

    def list(self, request):
        """
        List all candidates.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a specific candidate.
        """
        candidate = self.get_object()
        serializer = self.get_serializer(candidate)
        return Response(serializer.data)

    def create(self, request):
        """
        Create a new candidate.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        candidate = serializer.save()  # Removed recruiter=request.user
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        """
        Update a candidate.
        """
        candidate = self.get_object()
        serializer = self.get_serializer(candidate, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        """
        Delete a candidate.
        """
        candidate = self.get_object()
        candidate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
