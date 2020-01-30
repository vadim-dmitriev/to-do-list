from django.http import HttpRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render
from django.db.models.manager import BaseManager

from django.contrib.auth.models import User

from .models import Task

@login_required
def home(request: HttpRequest):
    u = User.objects.get_by_natural_key(request.user)
    
    tasks = Task.objects.filter(owner=u.id)
    return render(request, 'home.html', {'tasks': tasks})
