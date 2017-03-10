from django.db import models

class Board(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	title = models.CharField(max_length=100)
	owner = models.ForeignKey('auth.user', related_name='boards',
							  on_delete=models.CASCADE)

	class Meta:
		ordering = ('created',)