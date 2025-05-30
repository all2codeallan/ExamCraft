# server/ai_generator/models.py
from django.db import models
from django.conf import settings
from api.models import Course, Question # Assuming your models are in 'api.models'

class PaperDraft(models.Model):
    STATUS_CHOICES = [
        ('drafting', 'Drafting'),
        ('review', 'Under Review'), # Optional: if AI makes a full draft then faculty reviews
        ('finalized', 'Finalized'), # When faculty confirms
        ('archived', 'Archived'),
    ]

    faculty = models.ForeignKey(
        settings.AUTH_USER_MODEL, # Or 'api.Faculty' if you link directly to Faculty model
        on_delete=models.CASCADE,
        related_name='ai_paper_drafts'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='ai_paper_drafts'
    )
    # Store parameters given by faculty via chat
    constraints = models.JSONField(default=dict, blank=True, help_text="Stores extracted constraints like marks, CO/BT focus, units.")
    
    # Store lists of Question primary keys (q_id from api.models.Question)
    part_a_question_ids = models.JSONField(default=list, blank=True)
    part_b_question_ids = models.JSONField(default=list, blank=True)
    
    # Stores the actual conversation
    conversation_history = models.JSONField(default=list, blank=True, help_text="List of {'role': 'user/assistant', 'content': '...'}")
    
    # Stores structured data extracted or generated by AI, useful for RAG and state
    # e.g., candidate questions, coverage analysis, suggestions
    ai_meta_data = models.JSONField(default=dict, blank=True, help_text="Structured data from AI, e.g., suggestions, coverage.")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='drafting')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Draft for {self.course.course_name} by {self.faculty.username} ({self.status})"

    class Meta:
        ordering = ['-updated_at']