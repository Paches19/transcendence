from django.http import HttpResponse

from django.shortcuts import render, redirect, get_object_or_404
from .forms import PlayerForm
from .models import Player
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.


def hello(req):
    return HttpResponse("<h1>Hello, World!</h1>")


def about(req):
    return HttpResponse("<h1>About</h1>")

#########################  jutrera- ######################################


def home(request):
    players = Player.objects.all()
    return render(request, 'pong/home.html', {'players': players})


def add_player(request):
    if request.method == 'POST':
        form = PlayerForm(request.POST)
        if form.is_valid():
            form.save()
            # Redirige a la página de inicio u otra página
            return redirect('home')
    else:
        form = PlayerForm()
    return render(request, 'pong/addPlayer.html', {'form': form})


def delete_player(request, player_id):
    if request.method == 'POST':
        try:
            player = get_object_or_404(Player, id=player_id)
            player.delete()
            # Redirige a la página de inicio después de eliminar el jugador
            return redirect('home')
        except ObjectDoesNotExist:
            # El jugador no existe, maneja el error o muestra un mensaje al usuario
            return redirect('home')  # Redirige a la página de inicio
    else:
        # Si la solicitud no es POST, redirige a la página de inicio o maneja la solicitud de otra manera
        return redirect('home')


def player_selection(request):
    if request.method == 'POST':
        selected_player1_id = request.POST.get('selected_player1')
        selected_player2_id = request.POST.get('selected_player2')
        if selected_player1_id and selected_player2_id and selected_player1_id != selected_player2_id:
            player1 = Player.objects.get(pk=selected_player1_id)
            player2 = Player.objects.get(pk=selected_player2_id)
            return render(request, 'pong/game.html', {'opponent1': player1.name, 'opponent2': player2.name})
        else:
            players = Player.objects.all()
            return render(request, 'pong/home.html', {'players': players})
    # Handle GET request or invalid POST data
    else:
        players = Player.objects.all()
    return render(request, 'pong/home.html', {'players': players})
