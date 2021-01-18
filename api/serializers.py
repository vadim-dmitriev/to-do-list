from django.contrib.auth.models import User

from rest_framework import serializers
from toDoList.models import Task


class TaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField()
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(),
                                               write_only=True)

    def create(self, validated_data):
        return Task.objects.create(**validated_data)
