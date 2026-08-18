<template>
  <div class="totem-container">
    <!-- Encabezado -->
    <header class="header">
      <div class="logo-placeholder">🎓</div>
      <h1>Información Académica</h1>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      
      <!-- Sección de Filtros -->
      <section class="filters">
        <div class="filter-group">
          <label for="carrera">Seleccionar Carrera:</label>
          <select id="carrera" class="select-input">
            <option value="">Todas las carreras...</option>
            <option value="sistemas">Ingeniería en Sistemas</option>
            <option value="administracion">Administración de Empresas</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="piso">Piso:</label>
          <select id="piso" class="select-input">
            <option value="">Todos los pisos...</option>
            <option value="1">Piso 1</option>
            <option value="2">Piso 2</option>
          </select>
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
              <td>Algoritmos y Estructuras de Datos</td>
              <td>Aula 104 (Piso 1)</td>
              <td>Pérez, J.</td>
            </tr>
            <tr>
              <td>10:00 - 12:00</td>
              <td>Bases de Datos I</td>
              <td>Aula 201 (Piso 2)</td>
              <td>Gómez, M.</td>
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
      💬 Consultas
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Estado reactivo: arranca en 'false' para que la ventana esté oculta al principio
const isChatOpen = ref(false)

// Función que invierte el estado de la ventana al hacer clic
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
</style>