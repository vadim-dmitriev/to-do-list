from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from django.contrib.auth.models import User
from .models import Task

@login_required
def home(request: HttpRequest):
    u: User = User.objects.get_by_natural_key(request.user)
    
    tasks: Task = Task.objects.filter(owner=u.id)

    return render(request, 'home.html', {'tasks': tasks})

@login_required
def new_task(request: HttpRequest):
    u: User = User.objects.get_by_natural_key(request.user)

    new_task: Task = Task()
    new_task.title = request.POST.get("Title")
    new_task.description = request.POST.get("Description")
    new_task.owner = User.objects.get_by_natural_key(request.user)

    new_task.save()

    return redirect('/')

@login_required
def delete_task(request: HttpRequest):
    task: Task = Task.objects.get(id=request.POST.get("taskID"))

    task.delete()

    return HttpResponseRedirect('/', content_type='text/html')
