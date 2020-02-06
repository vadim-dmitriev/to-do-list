from django.urls import path
from . import views


app_name = "api"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('tasks/', views.TaskView.as_view()),
]