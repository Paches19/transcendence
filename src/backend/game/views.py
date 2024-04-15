from django.http import HttpResponse

# Create your views here.


def hello(req):
    return HttpResponse("<h1>Hello, World!</h1>")


def about(req):
    return HttpResponse("<h1>About</h1>")
