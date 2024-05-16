from django.shortcuts import render, redirect
from django.contrib import messages
from game.models import *

def home(request):
	if request.method == "GET":
		return render(request, "index.html")
	elif request.method == 'POST':
		matchId = request.POST.get("match-id", None)
		userName = request.POST.get("user-name", None)
		if not userName:
			userName = "Unknown"
		if(matchId):
			try:
				match = Match.objects.get(id=matchId)
				return redirect(f"/game/{match.id}/{userName}/")
			except Match.DoesNotExist:
				messages.error(request, "Match does not exist.")
				return redirect("/")
		else:
			match = Match.objects.create()
			return redirect(f"/game/{match.id}/{userName}/")

def game(request, id=None, name=None):
	try:
		match = Match.objects.get(id=id)
		return render(request, "pong.html", {"match": match, "name": name})
	except Match.DoesNotExist:
		messages.error(request, "Match does not exist.")
		return redirect("/")