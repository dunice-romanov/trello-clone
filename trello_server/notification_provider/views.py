from django.shortcuts import render

from channels import Group

# Create your views here.
def index(request):
    username = 'ethan'
    result = {}
    result['text'] = 'Check notifications, ' + username 
    Group(username).send(result)

    return render(request, 'index.html')