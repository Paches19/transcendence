from django.urls import path
from . import views

urlpatterns = [
    # path("", views.hello),
    path('about/', views.about),

    path('', views.home, name='home'),  # Página de inicio
    path('player_selection/', views.player_selection, name='player_selection'),
    path('add_player/', views.add_player, name='add_player'),
    path('delete_player/<int:player_id>/',
         views.delete_player, name='delete_player'),
]