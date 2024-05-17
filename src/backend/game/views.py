from django.shortcuts import render, redirect
from django.contrib import messages
from game.models import *

def game(request, id=None, name=None):
	try:
		match = MatchRemote.objects.get(id=id)
		return render(request, "pong.html", {"match": match, "name": name})
	except MatchRemote.DoesNotExist:
		messages.error(request, "Match does not exist.")
		return redirect("/")
	
def home(request):
	return redirect("http://localhost:8080")