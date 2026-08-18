<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <span class="logo"><img src="../assets/unpaz.png" alt="Logo Universidad" /></span>
        <h2>Login</h2>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="admin@universidad.edu.ar" required>
        </div>
        
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" placeholder="••••••••" required>
        </div>
        
        <button type="submit" class="btn-login">Ingresar al Sistema</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  // Acá en el futuro irá la llamada a tu API Node.js para validar credenciales.
  // Por ahora, simulamos que el login es exitoso y enviamos al usuario al Dashboard:
  console.log('Intentando loguear con:', email.value)
  router.push('/dashboard') 
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
  width: 100%;       /* Ocupará el ancho máximo permitido por su contenedor... */
  max-width: 250px;  /* ...pero nunca pasará de los 250px para no quedar gigante */
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
</style>