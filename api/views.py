from django.contrib.auth.models import User
from django.http import HttpRequest, Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from toDoList.models import Task
from .serializers import TaskSerializer

def get_task(id, user):
        try:
            task = Task.objects.get(pk=id)

            if task.owner != user:
                raise Http404
        
            return task
        except Task.DoesNotExist:
            raise Http404

class TasksView(APIView):
    def get(self, request):
        tasks = Task.objects.filter(owner=request.user)
        serializer = TaskSerializer(tasks, many=True, read_only=True)

        return Response({"tasks": serializer.data})
    
    def post(self, request):
        task = request.data.get('task')
        task["owner"] = request.user.id

        serializer = TaskSerializer(data=task)
        if serializer.is_valid(raise_exception=True):
            task_saved = serializer.save()
        return Response({"success": f"Task '{task_saved.title}' created successfully"})

class TaskView(APIView):
    def get(self, request: HttpRequest, id):
        task = get_task(id, request.user)

        serializer = TaskSerializer(task)
        return Response({"task": serializer.data})

    def delete(self, request: HttpRequest, id):
        task = get_task(id, request.user)
        task.delete()
        return Response({"success": f"Task '{task.title}' deleted!"})

class TaskMove(APIView):
    def post(self, request: HttpRequest, id):
        task = get_task(id, request.user)
        task.done = not task.done
        task.save()

        return Response({"success": f"Task '{task.title}' moved from {not task.done} to {task.done}!"})
