from django.db import models
from django.conf import settings 

class Candidate(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL,null=True,blank=True,on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name