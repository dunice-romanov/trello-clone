from django.db import models

class Text(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	title = models.TextField()

	class Meta:
		ordering = ('created',)