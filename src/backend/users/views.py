from django.shortcuts import render

# Create your views here.

def avatar(request):
	return render(request, "index.html", {})