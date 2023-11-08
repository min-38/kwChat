from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

# Create your views here.

def get_auth_for_user(user):
    tokens = RefreshToken.for_user(user)
    return {
        'user': UserSerializer(user).data,
        'tokens': {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }
    }

class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        userId = request.data.get('userId')
        password = request.data.get('password')
        if not userId or not password:
            return Response(status=400)
        
        user = authenticate(userId=userId, password=password)
        if not user:
            return Response(status=401)
        
        user_data = get_auth_for_user(user)

        return Response(user_data)