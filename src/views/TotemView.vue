<template>
  <div class="totem-container">
    <!-- Encabezado -->
    <header class="header">
      <div class="logo"><img src="../assets/unpaz.png" alt="Logo Universidad" /></div>
      <!-- <h1>Información cursadas</h1> -->
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      

        <section class="carrusel-section">
          <transition name="fade" mode="out-in">
            <div :key="indiceActual" class="slide-noticia">
              <h2>{{ noticias[indiceActual].titulo }}</h2>
            </div>
          </transition>
        </section>
     <!-- Sección de Filtros Avanzados -->
      <section class="filtros-container">
        <div class="filtros-header">
          <span>Filtro</span>
          <span class="icon-up">▲</span>
        </div>
        
        <div class="filtros-body">

          <div class="form-row">
            <label>Carrera</label>
            <select v-model="filtros.propuesta" class="dark-select">
              <option value="">-- Seleccione --</option>
              <option value="LGTI">LGTI</option>
              <option value="Enfermeria">Enfermería</option>
            </select>
          </div>
          <div class="form-row-grid">
            <div class="grid-col">
              <label>Sede</label>
              <select v-model="filtros.ubicacion" class="dark-select">
                <option value="">-- Todas --</option>
                <option value="sede-central">Alem</option>
              </select>
            </div>
            
            <div class="grid-col">
              <label>Día de la semana</label>
              <select v-model="filtros.dia" class="dark-select">
                <option value="">-- Seleccione --</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
              </select>
            </div>
            
            <div class="grid-col">
              <label>Turno</label>
              <select v-model="filtros.turno" class="dark-select">
                <option value="">-- Seleccione --</option>
                <option value="manana">Mañana</option>
                <option value="manana">tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Grilla de Horarios -->
      <section class="schedule-board">
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Horario</th>
              <th>Materia</th>
              <th>Aula</th>
              <th>Profesor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>08:00 - 10:00</td>
              <td>POO</td>
              <td>Aula 104 (Piso 1)</td>
              <td>Molina, J.</td>
            </tr>
            <tr>
              <td>10:00 - 12:00</td>
              <td>Bases de Datos I</td>
              <td>Aula 201 (Piso 2)</td>
              <td>Funes, J.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- Ventana Desplegable del Chatbot -->
    <div v-show="isChatOpen" class="chatbot-window">
      <div class="chat-header">
        <h3>Asistente Institucional</h3>
        <button @click="toggleChat" class="close-btn">✖</button>
      </div>
      
      <div class="chat-body">
        <div class="message bot">
          ¡Hola! Soy el asistente virtual de la universidad. ¿En qué te puedo ayudar hoy?
        </div>
      </div>
      
      <div class="chat-footer">
        <input type="text" placeholder="Escribí tu consulta..." class="chat-input" />
        <button class="send-btn">➤</button>
      </div>
    </div>

    <!-- Botón Flotante del Chatbot -->
    <div v-show="!isChatOpen" class="chatbot-fab" @click="toggleChat">
      Consultas
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const noticias = ref([
  { id: 1, titulo: 'noticia 1' },
  { id: 2, titulo: 'noticia 2' },
  { id: 3, titulo: 'noticia 3' }
])

const indiceActual = ref(0)
let intervaloCarrusel

onMounted(() => {
  intervaloCarrusel = setInterval(() => {
    // Incrementa el índice y vuelve a 0 cuando llega al final del arreglo
    indiceActual.value = (indiceActual.value + 1) % noticias.value.length
  }, 5000)
})

onUnmounted(() => {
  clearInterval(intervaloCarrusel)
})

const filtros = ref({
  responsable: '',
  propuesta: '',
  periodo: '',
  actividad: '',
  ubicacion: '',
  dia: '',
  turno: ''
})

// Mantiene el estado de la ventana del chat para q no se vea
const isChatOpen = ref(false)

// Invierte el estado de la ventana
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}
</script>

<style scoped>
/* --- ESTILOS GENERALES Y GRILLA --- */
.totem-container {
  min-height: 100vh;
  background-color: #FFFFFF;
  color: #0A192F;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  justify-content: center; /* Centra la imagen horizontalmente */
  margin-bottom: 1rem;
}

.logo img {
  width: 100%;       /* Ocupa el ancho máximo permitido por su contenedor*/
  max-width: 250px;  /* no pasará de los 250px para no quedar gigante */
  height: auto;      /* Mantiene la proporción original sin deformarse */
  object-fit: contain; /* Asegura que la imagen encaje perfectamente */
  right: 1rem; /* Espacio a la derecha para separar del título */
}

.header {
  background-color: #0A192F;
  color: #FFFFFF;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 5px solid #FFD700;
}

.header h1 { margin: 0; font-size: 2rem; }
.logo-placeholder { font-size: 2.5rem; }

.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.filters {
  display: flex;
  gap: 2rem;
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 5px solid #00A8E8;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.filter-group label {
  font-weight: bold;
  color: #0A192F;
}

.select-input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
}

.select-input:focus {
  border-color: #00A8E8;
  box-shadow: 0 0 5px rgba(0, 168, 232, 0.3);
}

.schedule-board { overflow-x: auto; }
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.schedule-table th {
  background-color: #00A8E8;
  color: #FFFFFF;
  padding: 1rem;
  font-size: 1.1rem;
}

.schedule-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.schedule-table tbody tr:hover { background-color: #f9f9f9; }

/*FILTROS*/

.filtros-container {
  background-color: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #000000;
  margin-bottom: 2rem;
}

.filtros-header {
  background-color: #007bb5; /* Azul institucional */
  color: white;
  padding: 0.8rem 1rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-up {
  font-size: 0.8rem;
  cursor: pointer;
}

.filtros-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-row label {
  font-size: 0.9rem;
}

.form-row-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.grid-col {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.dark-select, .dark-input {
  background-color: #007bb5;
  border: 1px solid #060606;
  color: #fff;
  padding: 0.6rem;
  border-radius: 4px;
  width: 100%;
  outline: none;
}

.dark-select:focus, .dark-input:focus {
  border-color: #007bb5;
}

/* Input con botón de limpiar */
.input-with-clear {
  display: flex;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  overflow: hidden;
}

.input-with-clear .dark-input {
  border: none;
  flex: 1;
}

.btn-clear {
  background: none;
  border: none;
  color: #fff;
  padding: 0 1rem;
  cursor: pointer;
  background-color: #333;
}

.btn-clear:hover {
  background-color: #000000;
}

/* --- BOTÓN FLOTANTE (FAB) --- */
.chatbot-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #FFD700;
  color: #0A192F;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

.chatbot-fab:hover { transform: scale(1.05); }

/* --- VENTANA DEL CHATBOT --- */
.chatbot-window {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 350px;
  height: 450px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(10, 25, 47, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  z-index: 1000;
}

.chat-header {
  background-color: #0A192F;
  color: #FFFFFF;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #00A8E8;
}

.chat-header h3 { margin: 0; font-size: 1.1rem; }

.close-btn {
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 1.2rem;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 1rem;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.message.bot {
  background-color: #e0f2fe;
  color: #0A192F;
  padding: 0.8rem;
  border-radius: 8px 8px 8px 0;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.4;
}

.chat-footer {
  padding: 1rem;
  background-color: #FFFFFF;
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid #e0e0e0;
}

.chat-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
}

.chat-input:focus { border-color: #00A8E8; }

.send-btn {
  background-color: #FFD700;
  color: #0A192F;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.send-btn:hover { background-color: #e6c200; }

.carrusel-section {
  background-color: #00A8E8;
  color: white;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.slide-noticia h2 {
  font-size: 2.5rem;
  margin: 0;
}

/* Clases de transición de Vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



</style>