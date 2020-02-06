from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=10)
    description = models.CharField(max_length=100)
    done = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
