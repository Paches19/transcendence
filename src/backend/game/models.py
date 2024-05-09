from django.db import models

# Create your models here.

class Match(models.Model):
     id = models.AutoField(primary_key=True)
     def __str__(self) -> str:
           return f"{self.id}"
