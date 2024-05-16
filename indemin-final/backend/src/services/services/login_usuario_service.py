from supabase_service import SupabaseService
from models import UserLogin

# Crear una instancia de SupabaseService
supabase_service = SupabaseService()

def authenticate_user(user_login: UserLogin):
    email = user_login.email
    password = user_login.password
    
    response_data, status_code = supabase_service.get_login_user(email, password)
    
    if status_code == 200:
        if response_data:
            return {"message": "Usuario autenticado exitosamente"}, 200
        else:
            return {"error": "Credenciales incorrectas"}, 401
    else:
        return {"error": "Error al conectar con la base de datos"}, status_code
