import random
import string
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Candidate
from django.contrib.auth import authenticate 

User = get_user_model()



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name','role')



class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    role = serializers.CharField(required=False)  # Utiliser ChoiceField pour valider les rôles

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password2', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        # Validation des mots de passe
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError({
                'password': "Les mots de passe ne correspondent pas."
            })

        return attrs

    def create(self, validated_data):
        # Retirer `password2` car il n'est pas nécessaire pour la création
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        role = validated_data.get('role', 'admin')  # Assurez-vous que `role` a une valeur valide
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=role,
            password=password
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'No user with this email address'})
        
        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError({'non_field_errors': 'Email or Password is not valid'})

        return data




class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'name', 'resume', 'cover_letter')

class AdminUserCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id','email', 'username', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'role': {'read_only': True}  # Role should be read-only
        }

    def create(self, validated_data):
        # Generate a random password
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        
        # Set the default role to 'recruiter'
        role = 'recruiter'

        # Create user with generated password
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=role,
            password=password
        )

        # Attach the generated password to the user instance
        user.generated_password = password
        return user
    

class AdminCandidateCreationSerializer(serializers.ModelSerializer):
    generated_password = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 'generated_password']
        extra_kwargs = {
            'role': {'read_only': True}  # Role should be read-only
        }

    def create(self, validated_data):
        # Generate a random password
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        
        # Set the default role to 'candidate'
        role = 'candidate'

        # Create user with generated password
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=role,
            password=password
        )

        return user

    def get_generated_password(self, obj):
        # This method is used to include the generated password in the response
        # Ensure to set this value only if needed, or use it for admin purposes
        # For security reasons, you might want to exclude this from the response
        return getattr(obj, 'generated_password', None)
    