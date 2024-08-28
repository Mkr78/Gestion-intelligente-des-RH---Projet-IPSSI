from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    
    def create_user(self, email, username, firstname, lastname, role='candidat', password=None):
        """
        Crée un utilisateur normal avec l'email et le mot de passe donnés.
        """
        if not email:
            raise ValueError('L\'utilisateur doit avoir une adresse email')

        if role not in ['candidat', 'recruteur', 'admin']:
            raise ValueError('Rôle invalide')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            firstname=firstname,
            lastname=lastname,
            role=role
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, firstname, lastname, password=None):
        """
        Crée un superutilisateur avec l'email et le mot de passe donnés.
        """
        user = self.create_user(
            email,
            password=password,
            username=username,
            firstname=firstname,
            lastname=lastname,
            role='admin'
        )
        user.is_admin = True
        user.is_active = True  # Généralement, les superutilisateurs sont actifs par défaut
        user.save(using=self._db)
        return user

#  Custom User Model
class User(AbstractBaseUser):
    ROLE_CHOICES = (
        ('candidat', 'Candidat'),
        ('recruteur', 'Recruteur'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(verbose_name='Email', max_length=255, unique=True)
    username = models.CharField(max_length=200, unique=True)
    firstname = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)
    role = models.CharField(max_length=200, choices=ROLE_CHOICES, default='candidat')

    code = models.CharField(max_length=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'firstname', 'lastname']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """
        L'utilisateur a-t-il une permission spécifique ?
        """
        return self.is_admin

    def has_module_perms(self, app_label):
        """
        L'utilisateur a-t-il des permissions pour voir l'app `app_label` ?
        """
        return True

    @property
    def is_staff(self):
        """
        L'utilisateur est-il membre du personnel ?
        """
        return self.is_admin

    @property
    def is_superuser(self):
        """
        L'utilisateur est-il un superutilisateur ?
        """
        return self.is_admin
