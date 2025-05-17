# server/ai_generator/urls.py
from django.urls import path
from . import views

app_name = 'ai_generator'

urlpatterns = [
    path('chat/', views.AIChatView.as_view(), name='ai_chat'),
    path('drafts/', views.ListFacultyPaperDraftsView.as_view(), name='list_faculty_paper_drafts'),
    path('save-draft/', views.SavePaperDraftView.as_view(), name='save_paper_draft'),
    path('download-paper/', views.DownloadGeneratedPaperView.as_view(), name='download_paper'),
]