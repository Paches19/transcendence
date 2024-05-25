from django.shortcuts import render, redirect
from django.contrib import messages
from game.models import *
import subprocess

def remote(request, id=None, name=None):
	try:
		match = MatchRemote.objects.get(id=id)
		result = subprocess.run(['python', './pong.py', match.mode, id, name], stdout=subprocess.PIPE)
	except MatchRemote.DoesNotExist:
		messages.error(request, "Match does not exist.")
		return redirect("/")
	
def local(request, name=None):
	result = subprocess.run(['python', './pong.py', name], stdout=subprocess.PIPE)
	
def game(request):
	result = subprocess.run(['python', './pong.py'], stdout=subprocess.PIPE)

def home(request):
	return redirect("http://localhost:8080")