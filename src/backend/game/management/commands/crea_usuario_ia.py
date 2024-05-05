# crea_usuario_ia.py
from django.core.management.base import BaseCommand
from pong.models import Player

class Command(BaseCommand):
	help = 'Crea el usuario IA'

	def handle(self, *args, **kwargs):
		Player.objects.create(name='AI')
		self.stdout.write(self.style.SUCCESS('Usuario IA creado correctamente'))
