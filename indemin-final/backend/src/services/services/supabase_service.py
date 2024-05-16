import requests
import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

supabase_url = 'https://lcserliwuqwzfjtrdcib.supabase.co/rest/v1/'
supabaseheads = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ'

@app.route('/usuario', methods=['GET'])
def get_user_by_email_and_password():
    email = request.args.get('email')
    password = request.args.get('password')
    headers = {'apikey': supabaseheads}
    url = f'{supabase_url}/usuario'
    params = {
        'select': '*',  # Obtener todos los campos
        'email': f'eq.{email}',
        'password': f'eq.{password}'
    }
    
    response = requests.get(supabase_url, headers=headers, params=params)
    return response.json()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)