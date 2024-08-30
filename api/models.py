from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

from backend import settings

class UserManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, role='candidate', password=None):
        if not email:
            raise ValueError("The Email field must be set")
        if role not in ['candidate', 'recruiter', 'admin']:
            raise ValueError("Invalid role")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, first_name, last_name, password=None):
        user = self.create_user(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            role='admin',
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=[('candidate', 'Candidate'), ('recruiter', 'Recruiter'), ('admin', 'Admin')], default='candidate')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.email

class Candidate(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    resume = models.FileField()
    cover_letter = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.username


class ResumeAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resume_file = models.FileField(upload_to='resumes/')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    resume_score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    no_of_pages = models.IntegerField()
    reco_field = models.CharField(max_length=50)
    cand_level = models.CharField(max_length=30)
    skills = models.TextField()
    recommended_skills = models.TextField()
    courses = models.TextField()

    def __str__(self):
        return self.name