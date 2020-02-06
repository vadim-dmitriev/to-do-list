from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView

from toDoList.models import Task
from .serializers import TaskSerializer

class TaskView(APIView):
    def get(self, request):
        tasks = Task.objects.filter(owner=request.user.id)
        serializer = TaskSerializer(tasks, many=True, read_only=True)

        return Response({"tasks": serializer.data})
    
    def post(self, request):
        task = request.data.get('task')
        task["owner"] = request.user.id

        serializer = TaskSerializer(data=task)
        if serializer.is_valid(raise_exception=True):
            task_saved = serializer.save()
        return Response({"success": f"Task '{task_saved.title}' created successfully"})
