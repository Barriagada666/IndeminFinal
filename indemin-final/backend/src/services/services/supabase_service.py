import requests
import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

supabase_url = 'https://lcserliwuqwzfjtrdcib.supabase.co/rest/v1/'
supabaseheads = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2VybGl3dXF3emZqdHJkY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MjU3MjYsImV4cCI6MjAzMTIwMTcyNn0.h81cjxbMg7kWQ2Wv-YP3augY5_071Bpjfl57_jCXThQ'

@app.route('/usuario', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    headers = {'apikey': supabaseheads}
    response = requests.get(supabase_url + 'usuario?email=eq.' + email + '&password=eq.' + password, headers=headers)
    if response.status_code == 200:
        user_data = response.json()
        if len(user_data) == 1:
            return jsonify({'message': 'Usuario logueado correctamente', 'user': user_data[0]}), 200
        else:
            return jsonify({'message': 'Credenciales invalidas'}), 401
    else:    
        return jsonify({'message': 'Error en el servidor'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)