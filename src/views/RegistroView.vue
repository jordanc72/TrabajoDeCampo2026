<template>
  <div class="register-container">
    <div class="register-card">
      <div class="logo-container">
        <!-- IMPORTANTE: Si la imagen no está en src/assets/ con este nombre exacto, la pantalla quedará en blanco -->
         <img src="../assets/unpaz.png" alt="UNPAZ Logo" class="unpaz-logo" />
      </div>
      <h2>Registro al Sistema</h2>
      <form @submit.prevent="registrarUsuario">
        <div class="input-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="form.nombre" placeholder="Ingrese su nombre" required />
        </div>

        <div class="input-group">
          <label for="apellido">Apellido</label>
          <input type="text" id="apellido" v-model="form.apellido" placeholder="Ingrese su apellido" required />
        </div>

        <div class="input-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="form.email" placeholder="ejemplo@unpaz.edu.ar" required />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="form.password" placeholder="••••••••" required />
        </div>

        <div class="input-group">
          <label for="id_rol">Rol</label>
          <select id="id_rol" v-model="form.id_rol" required>
            <option disabled value="">Seleccione su rol</option>
            <option value="1">Administrador</option>
            <option value="2">Usuario / Estudiante</option>
          </select>
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          {{ isLoading ? 'Registrando...' : 'Registrarse' }}
        </button>
        
        <p v-if="mensaje" :class="['mensaje', esError ? 'error' : 'exito']">{{ mensaje }}</p>
      </form>

      <div class="extra-links">
        <router-link to="/login">¿Ya tienes una cuenta? Iniciar Sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/app.js'

const router = useRouter()

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  id_rol: ''
})

const mensaje = ref('')
const esError = ref(false)
const isLoading = ref(false)

const registrarUsuario = async () => {
  mensaje.value = ''
  isLoading.value = true

  try {
    const formulario = {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email,
      password: form.value.password,
      id_rol: Number(form.value.id_rol)
    }

    const { data } = await api.post('/registrar', formulario)

    mensaje.value = data.message || data.mensaje || '¡Registro exitoso!'
    esError.value = false

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.mensaje || error.message || 'Error en el servidor al registrar'
    mensaje.value = errorMessage
    esError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f8;
  padding: 1rem;
}

.register-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.logo-container {
  text-align: center;
  margin-bottom: 1.5rem;
}

.unpaz-logo {
  max-width: 250px; /* Ajustado para que se vea bien como en el login */
  height: auto;
}

h2 {
  text-align: center;
  color: #1b365d; /* Azul institucional */
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box; /* Asegura que el padding no rompa el ancho */
  transition: border-color 0.2s;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #1b365d;
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  background-color: #1b365d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-submit:hover {
  background-color: #12243f;
}

.mensaje {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
}

.mensaje.error {
  color: #d9534f;
}

.mensaje.exito {
  color: #5cb85c;
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