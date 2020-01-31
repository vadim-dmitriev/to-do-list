from django.http import HttpRequest, HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from django.contrib.auth.models import User
from .models import Task

@login_required
def home(request: HttpRequest):
    u = User.objects.get_by_natural_key(request.user)
    
    tasks = Task.objects.filter(owner=u.id)

    return render(request, 'home.html', {'tasks': tasks})

@login_required
def new_task(request: HttpRequest):
    u = User.objects.get_by_natural_key(request.user)

    new_task = Task()
    new_task.title = request.POST.get("Title")
    new_task.description = request.POST.get("Description")
    new_task.owner = User.objects.get_by_natural_key(request.user)

    new_task.save()

    return redirect('/')
