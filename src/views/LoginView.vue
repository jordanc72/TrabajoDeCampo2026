<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <span class="logo"><img src="../assets/unpaz.png" alt="Logo Universidad" /></span>
        <h2>Login</h2>
      </div>
      
        <form @submit.prevent="login" class="login-form">
          <div class="input-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" placeholder="admin@universidad.edu.ar" required>
          </div>
          
          <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" placeholder="••••••••" required>
          </div>
          
          <button type="submit" class="btn-login" :disabled="isLoading">
            {{ isLoading ? 'Ingresando...' : 'Ingresar al Sistema' }}
          </button>
        </form>
        <div class="extra-links">
          <router-link to="/registrar">¿No tienes cuenta? Regístrese acá</router-link>
        </div>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api, { setAuthSession } from '../services/app.js'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
  if (!email.value || !password.value) {
    alert('Completá correo y contraseña antes de continuar.')
    return
  }

  isLoading.value = true

  try {
    const { data } = await api.post('/login', {
      usuario: email.value,
      password: password.value
    })

    if (!data?.token) {
      throw new Error('No se recibió un token válido del servidor.')
    }

    setAuthSession({
      token: data.token,
      rol: data.rol
    })

    router.push('/dashboard')
  } catch (error) {
    const mensaje = error.response?.data?.message || error.response?.data?.mensaje || error.message || 'Error al intentar loguear. Por favor, inténtelo de nuevo.'
    alert(mensaje)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0A192F; /* Fondo azul profundo institucional */
  font-family: 'Segoe UI', sans-serif;
}

.login-card {
  background-color: #FFFFFF;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
  border-top: 5px solid #FFD700;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #0A192F;
}

.logo {
  display: flex;
  justify-content: center; /* Centra la imagen horizontalmente */
  margin-bottom: 1rem;
}

.logo img {
  width: 100%;       /* Ocupa el ancho máximo permitido por su contenedor*/
  max-width: 250px;  /* nunca pasará de los 250px para no quedar gigante */
  height: auto;      /* Mantiene la proporción original sin deformarse */
  object-fit: contain; /* Asegura que la imagen encaje perfectamente */
}

.login-header h2 {
  margin-top: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #333;
}

.input-group input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
}

.input-group input:focus {
  border-color: #00A8E8;
  box-shadow: 0 0 5px rgba(0, 168, 232, 0.3);
}

.btn-login {
  background-color: #00A8E8;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-login:hover {
  background-color: #008fca;
}

.extra-links {
  margin-top: 1.5rem;
  text-align: center;
}

.extra-links a {
  color: #1b365d;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.extra-links a:hover {
  text-decoration: underline;
}
</style>