from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.contrib import messages
from game.models import *

# Create your views here.


def hello(req):
    return HttpResponse("<h1>Hello, World!</h1>")


def about(req):
    return HttpResponse("<h1>About</h1>")

#########################  jutrera- ######################################

def index(request):
	if request.method == "GET":
		return render(request, "index.html")
	elif request.method == 'POST':
		matchId = request.POST.get("match-id", None)

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
		#return render(request, "tictactoe.html", {"match": match, "name": name})
	except Match.DoesNotExist:
		messages.error(request, "Match does not exist.")
		return redirect("/")
