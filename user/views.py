from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate



from .serializers import UserRegistrationSerializer,UserLoginSerializer
from .models import User






def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
class UserRegistrationView(APIView):

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 200,
                'message': 'Registration successfully  check your email',
                'data': serializer.data
            })
        return Response({
            'status': 400,
            'message': 'Something went wrong',
            'data': serializer.errors
        })
    

class UserLoginView(APIView):

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        print(user)
        person = User.objects.get(email=email)
        print("***************",person.is_active)    
       
        if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token': token, 'msg': 'Login Success',
                                'user': {'id': user.id, 'email': user.email, 'username': user.username,'firstname':user.firstname,'lastname':user.lastname, 'is_admin': user.is_admin}},
                                status=status.HTTP_200_OK)
        else:
            return Response({'errors': {'non_field_errors': ['Email or Password is not valid']}},
                            status=status.HTTP_400_BAD_REQUEST)
        


