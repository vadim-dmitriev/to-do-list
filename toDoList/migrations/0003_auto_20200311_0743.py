# Generated by Django 3.0.2 on 2020-03-11 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('toDoList', '0002_task_done'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='description',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='task',
            name='title',
            field=models.CharField(max_length=70),
        ),
    ]
