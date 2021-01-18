from django.contrib.auth.models import User
from django.db import models

STATUS_BACKLOG = ('b', 'backlog')
STATUS_IN_PROGRESS = ('p', 'in progress')
STATUS_DONE = ('d', 'done')

STATUS_CHOICES = [
    STATUS_BACKLOG,
    STATUS_IN_PROGRESS,
    STATUS_DONE
]

class Task(models.Model):
    title = models.CharField(max_length=500)
    description = models.CharField(max_length=1600)
    status = models.CharField(max_length=1, default='b', choices=STATUS_CHOICES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
