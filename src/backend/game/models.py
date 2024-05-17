from django.db import models

class MatchRemote(models.Model):
     id = models.AutoField(primary_key=True)
     def __str__(self) -> str:
           return f"{self.id}"