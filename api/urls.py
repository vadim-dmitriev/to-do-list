from django.urls import path
from . import views


app_name = "api"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('tasks/', views.TasksView.as_view()),
    path('tasks/<int:id>/', views.TaskView.as_view()),
]