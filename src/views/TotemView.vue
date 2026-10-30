<template>
  <div class="totem-container">
    <!-- Encabezado con Carrusel Lateral Integrado -->
    <header class="header">
      <div class="logo">
        <img src="../assets/unpaz.png" alt="Logo Universidad" />
      </div>
      
      <!-- Cinta de noticias (Marquee) -->
      <div v-if="noticias.length > 0" class="ticker-wrapper">
        <div class="ticker-track">
          <span v-for="(noticia, index) in noticias" :key="index" class="ticker-item">
            <span class="ticker-title">{{ noticia.titulo }}</span>: {{ noticia.descripcion }}
            <span class="ticker-separator"> | </span>
          </span>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      <!-- Título de Cursadas -->
      <h2 style="color: #0A192F; border-bottom: 3px solid #FFD700; padding-bottom: 0.5rem; margin-top: 0;">
        Cronograma de Cursadas
      </h2>

      <!-- Grilla de Horarios Animada -->
      <section class="schedule-board">
        <!-- Cabecera fija -->
        <div class="schedule-header">
          <div class="col">Día</div>
          <div class="col">Horario</div>
          <div class="col">Materia</div>
          <div class="col">Com.</div>
          <div class="col">Modalidad</div>
          <div class="col">Frecuencia</div>
          <div class="col">Aula</div>
        </div>
        
        <!-- Movimiento de materias -->
        <transition-group name="scroll" tag="div" class="schedule-body">
          <div v-for="materia in horariosVisibles" :key="materia.uniqueId" class="schedule-row">
            <div class="col font-bold">{{ materia.dia }}</div>
            <div class="col text-center">
              {{ materia.hora_inicio ? materia.hora_inicio.slice(0,5) : '' }} - 
              {{ materia.hora_fin ? materia.hora_fin.slice(0,5) : '' }}
            </div>
            <div class="col font-bold materia-texto">{{ materia.nombre }}</div>
            <div class="col text-center">{{ materia.comision }}</div>
            <div class="col text-center">
              <span class="modalidad-principal">{{ materia.modalidad }}</span><br>
              <span class="modalidad-combo">{{ materia.modalidad_combo }}</span>
            </div>
            <div class="col text-center badge-frecuencia">{{ materia.periodicidad }}</div>
            <div class="col text-center badge-aula">{{ materia.aula || 'A designar' }}</div>
          </div>
        </transition-group>
      </section>
    </main>

    <!-- Ventana y Botón del Chatbot -->
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
    <div v-show="!isChatOpen" class="chatbot-fab" @click="toggleChat">
      Consultas
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../services/app.js'

// --- 1. AVISOS ---
const noticias = ref([])

const cargarNoticias = async () => {
  try {
    // El '?t=' obliga al navegador a no usar caché y buscar la verdad en la base de datos
    const { data } = await api.get('/avisos?t=' + new Date().getTime());
    if (!Array.isArray(data)) return;

    const ahoraMs = new Date().getTime(); 
    
    // Función blindada: Extrae solo los números e ignora los formatos con "Z" o "T"
    const fechaLocalPrecisa = (fechaString) => {
      if (!fechaString) return 0;
      const partes = String(fechaString).match(/\d+/g); 
      if (!partes || partes.length < 5) return 0;
      // Arma la fecha forzando la zona horaria del sistema en el que estás
      return new Date(partes[0], partes[1] - 1, partes[2], partes[3], partes[4], partes[5] || 0).getTime();
    };

    const avisosActivos = data.filter(aviso => {
      const pubMs = fechaLocalPrecisa(aviso.fecha_publicacion);
      const vencMs = fechaLocalPrecisa(aviso.fecha_vencimiento);
      return ahoraMs >= pubMs && ahoraMs <= vencMs;
    });
    
    noticias.value = avisosActivos;
  } catch (error) {
    console.error('Error al cargar noticias en el totem:', error);
    noticias.value = [];
  }
}

// --- 2. MATERIAS (HORARIOS) ---
const MAX_FILAS_VISIBLES = 8;
let horariosBase = [];
let indiceMateria = MAX_FILAS_VISIBLES;
let intervaloHorarios;
const horariosVisibles = ref([]);

const cargarHorarios = async () => {
  try {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const diaHoy = diasSemana[new Date().getDay()]; 
    
    const { data } = await api.get('/materias/' + diaHoy);
    horariosBase = Array.isArray(data) ? data : [];
    
    if (horariosBase.length > 0) {
      horariosVisibles.value = horariosBase
        .slice(0, MAX_FILAS_VISIBLES)
        .map((h, i) => ({ ...h, uniqueId: Date.now() + i }));
      indiceMateria = MAX_FILAS_VISIBLES;
    } else {
      horariosVisibles.value = [];
    }
  } catch (error) {
    console.error(`Error al cargar materias de hoy:`, error);
    horariosVisibles.value = [];
  }
}

// --- 3. CHATBOT ---
const isChatOpen = ref(false)
const toggleChat = () => { isChatOpen.value = !isChatOpen.value }

// --- 4. MOTORES E INICIALIZACIÓN ---
onMounted(async () => {
  await Promise.all([cargarNoticias(), cargarHorarios()]);

  // Motor del Cronograma (Asciende y desvanece)
  intervaloHorarios = setInterval(() => {
    if (horariosBase.length > 0) {
      horariosVisibles.value.shift();
      const nextItem = horariosBase[indiceMateria % horariosBase.length];
      horariosVisibles.value.push({ ...nextItem, uniqueId: Date.now() });
      indiceMateria++;
    }
  }, 3500);

  // Auto-recarga silenciosa cada 15 segundos
  setInterval(async () => {
    await cargarNoticias();
    try {
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const diaHoy = diasSemana[new Date().getDay()];
      const { data } = await api.get('/materias/' + diaHoy);
      if (Array.isArray(data) && data.length > 0) {
        horariosBase = data;
      }
    } catch (e) {}
  }, 15000);
})

onUnmounted(() => {
  clearInterval(intervaloHorarios)
})
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

/* --- HEADER Y CINTA DE NOTICIAS --- */
.header {
  background-color: #0A192F;
  color: #FFFFFF;
  padding: 1.2rem 2rem; 
  margin: 2rem 2rem 0 2rem; 
  border-radius: 8px; 
  display: flex;
  align-items: center;
  border-bottom: 5px solid #FFD700;
  overflow: hidden; 
}

.logo {
  flex-shrink: 0;
  margin-right: 2rem;
  display: flex;
  justify-content: center;
}

.logo img {
  width: 100%;
  /* Agrandamos el límite del logo (antes 150px) */
  max-width: 180px; 
  height: auto;
  object-fit: contain;
}

.ticker-wrapper {
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
}

.ticker-track {
  display: inline-block;
  padding-left: 100%; /* Arranca empujado fuera de la pantalla a la derecha */
  animation: marquee 25s linear infinite; /* Tiempo de la animación */
}

.ticker-item {
  /* Agrandamos la letra significativamente (antes 1.2rem) */
  font-size: 1.8rem;
}

.ticker-title {
  font-weight: bold;
  color: #FFD700;
}

.ticker-separator {
  margin: 0 2.5rem;
  color: #00A8E8;
}

@keyframes marquee {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}

/* --- CONTENIDO PRINCIPAL --- */
.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
}

.schedule-board {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow: hidden;
}

.schedule-header {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 2.5fr 0.6fr 1.8fr 1fr 1fr;
  background-color: #00A8E8;
  color: #FFFFFF;
  padding: 1.2rem 0.5rem;
  font-size: 1.05rem;
  font-weight: bold;
  text-align: center;
}

.schedule-row {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 2.5fr 0.6fr 1.8fr 1fr 1fr;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #eee;
  background-color: white;
  align-items: center;
  font-size: 0.95rem;
}

.schedule-row:nth-child(even) { background-color: #f8fbff; }
.font-bold { font-weight: 600; color: #0A192F; }
.text-center { text-align: center; }

.materia-texto {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
}

.modalidad-principal {
  font-weight: bold;
  color: #0A192F;
}
.modalidad-combo {
  font-size: 0.8rem;
  color: #666;
}

.badge-frecuencia {
  background-color: #f1f5f9;
  color: #475569;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  border: 1px solid #cbd5e1;
}

.badge-aula {
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
}

/* --- CLASES DE TRANSICIÓN VUE --- */
.scroll-move,
.scroll-enter-active,
.scroll-leave-active {
  transition: all 1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.scroll-enter-from { opacity: 0; transform: translateY(30px); }
.scroll-leave-to { opacity: 0; transform: translateY(-30px); }
.scroll-leave-active { position: absolute; width: 100%; }

/* --- BOTÓN FLOTANTE Y CHATBOT --- */
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
.close-btn { background: none; border: none; color: #FFFFFF; font-size: 1.2rem; cursor: pointer; }
.chat-body { flex: 1; padding: 1rem; background-color: #f9f9f9; overflow-y: auto; }
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
.chat-input { flex: 1; padding: 0.8rem; border: 1px solid #ccc; border-radius: 20px; outline: none; }
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