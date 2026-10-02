<template>
  <div class="totem-container">
    <!-- Encabezado -->
    <header class="header">
      <div class="logo"><img src="../assets/unpaz.png" alt="Logo Universidad" /></div>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
      
      <!-- Carrusel de Noticias -->
      <section class="carrusel-section">
        <transition name="fade" mode="out-in">
          <div v-if="noticias.length > 0" :key="indiceActual" class="slide-noticia">
            <h2>{{ noticias[indiceActual].titulo }}</h2>
            <p>{{ noticias[indiceActual].descripcion }}</p>
          </div>
        </transition>
      </section>

      <!-- Título de Cursadas -->
      <h2 style="color: #0A192F; border-bottom: 3px solid #FFD700; padding-bottom: 0.5rem; margin-top: 1rem;">
        Cronograma de Cursadas
      </h2>

      <!-- Grilla de Horarios Animada -->
      <section class="schedule-board">
        <!-- Cabecera fija -->
        <div class="schedule-header">
          <div class="col">Día</div>
          <div class="col">Horario</div>
          <div class="col">Materia</div>
          <div class="col">Comisión</div>
          <div class="col">Aula</div>
        </div>
        
        <!-- Cuerpo animado (Ascienden y se desvanecen) -->
        <transition-group name="scroll" tag="div" class="schedule-body">
          <div v-for="materia in horariosVisibles" :key="materia.uniqueId" class="schedule-row">
            <div class="col font-bold">{{ materia.Dia }}</div>
            <div class="col">{{ materia['Hora Inicio'].slice(0,5) }} - {{ materia['Hora Fin'].slice(0,5) }}</div>
            <div class="col">{{ materia['Nombre de la Materia'] }}</div>
            <div class="col text-center">{{ materia['Nombre de la Comision'] }}</div>
            <div class="col text-center badge-aula">{{ materia.Aula || 'A designar' }}</div>
          </div>
        </transition-group>
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
import api from '../services/app.js'

// ==========================================
// 1. LÓGICA DE NOTICIAS (AVISOS)
// ==========================================
const noticias = ref([])
const indiceActual = ref(0)
let intervaloCarrusel

const cargarNoticias = async () => {
  try {
    const { data } = await api.get('/avisos')
    const ahoraMs = new Date().getTime() 
       
    const avisosActivos = data.filter(aviso => {
      const fechaPubString = aviso.fecha_publicacion.replace('T', ' ').slice(0, 19).replace(/-/g, '/')
      const fechaVencString = aviso.fecha_vencimiento.replace('T', ' ').slice(0, 19).replace(/-/g, '/')
      
      const pubMs = new Date(fechaPubString).getTime()
      const vencMs = new Date(fechaVencString).getTime()
      
      return aviso.estado === 'ACTIVO' && ahoraMs >= pubMs && ahoraMs <= vencMs
    })
    
    noticias.value = avisosActivos.length > 0 
      ? avisosActivos 
      : [{ id_aviso: 0, titulo: 'No hay avisos recientes', descripcion: 'Consultá más tarde para novedades.' }]
      
  } catch (error) {
    console.error('Error al cargar noticias en el totem:', error)
    noticias.value = [{ id_aviso: 0, titulo: 'Error al conectar con el servidor', descripcion: '' }]
  }
}

// ==========================================
// 2. LÓGICA DE HORARIOS (EXCEL ANIMADO)
// ==========================================
// Datos extraídos directamente de tu archivo Trabajo_de_campo.xlsx
const horariosBase = [
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Laboratorio de Software", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "13:00:00", "Hora Fin": "17:00:00", "Nombre de la Materia": "Ingeniería de Software I", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Viernes", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Algoritmos y Programación", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Base de Datos II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Sistemas Operativos II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Sabado", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Gestión de Proyectos", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Inglés II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Análisis Matemático II", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Viernes", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Álgebra y Geometría Analítica", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Base de Datos I", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "13:00:00", "Hora Fin": "17:00:00", "Nombre de la Materia": "Base de Datos I", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Estructuras Discretas", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Arquitectura de Computadoras II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Álgebra y Geometría Analítica", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Dirección Estratégica", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Viernes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Contabilidad I", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Viernes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Comunicaciones y Redes", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Administración II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Ingeniería de Software II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Análisis Matemático II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Optativa II", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Sabado", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Administración II", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Análisis Matemático I", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Inteligencia de los Negocios", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Ciencia, Tecnología y Sociedad", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Arquitectura de Computadoras I", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Administración de Recursos Humanos", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Trabajo Final de Grado", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Álgebra y Geometría Analítica", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Arquitectura de Computadoras II", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Programación Orientada a Objetos", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Contabilidad Avanzada", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Arquitectura de Computadoras II", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Viernes", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Ciencia, Tecnología y Sociedad", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Análisis Matemático I", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Administración I", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Arquitectura Web", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Estructuras Discretas", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Sabado", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Probabilidad y Estadísticas", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Viernes", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Ciencia, Tecnología y Sociedad", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Seguridad Informática", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Administración II", "Nombre de la Comision": "C2", "Aula": ""},
  {"Dia": "Sabado", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Algoritmos y Programación", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Algoritmos y Programación", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Trabajo de Campo", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Miercoles", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Introducción a la Programación", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Análisis Matemático II", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Investigación Operativa", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Introducción a la Programación", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Martes", "Hora Inicio": "18:00:00", "Hora Fin": "22:00:00", "Nombre de la Materia": "Laboratorio de Programación y Lenguajes", "Nombre de la Comision": "C1", "Aula": ""},
  {"Dia": "Lunes", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Arquitectura de Computadoras I", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Inglés I", "Nombre de la Comision": "A1", "Aula": ""},
  {"Dia": "Viernes", "Hora Inicio": "14:00:00", "Hora Fin": "18:00:00", "Nombre de la Materia": "Inglés I", "Nombre de la Comision": "B1", "Aula": ""},
  {"Dia": "Jueves", "Hora Inicio": "08:00:00", "Hora Fin": "12:00:00", "Nombre de la Materia": "Introducción a la Programación", "Nombre de la Comision": "A1", "Aula": ""}
];

// Cantidad de filas a mostrar a la vez (ideal para un Totem sin que se rompa la pantalla)
const MAX_FILAS_VISIBLES = 6;
let indiceMateria = MAX_FILAS_VISIBLES;
let intervaloHorarios;

// Inicializamos la lista con las primeras 6 materias y les ponemos un ID único
const horariosVisibles = ref(
  horariosBase.slice(0, MAX_FILAS_VISIBLES).map((h, i) => ({ ...h, uniqueId: Date.now() + i }))
);

// ==========================================
// 3. CHATBOT Y CICLOS DE VIDA
// ==========================================
const isChatOpen = ref(false)
const toggleChat = () => { isChatOpen.value = !isChatOpen.value }

onMounted(async () => {
  await cargarNoticias()

  // Carrusel de los Avisos
  if (noticias.value.length > 1) {
    intervaloCarrusel = setInterval(() => {
      indiceActual.value = (indiceActual.value + 1) % noticias.value.length
    }, 5000)
  }

  // Animación del Cronograma: Cada 3 segundos asciende y se desvanece
  intervaloHorarios = setInterval(() => {
    // Saca el primer elemento (dispara animación Leave hacia arriba)
    horariosVisibles.value.shift();
    
    // Calcula la próxima materia del Excel
    const nextItem = horariosBase[indiceMateria % horariosBase.length];
    
    // Mete el nuevo elemento al final (dispara animación Enter desde abajo)
    // El "uniqueId" es clave matemática para que Vue entienda qué fila es nueva
    horariosVisibles.value.push({ ...nextItem, uniqueId: Date.now() });
    
    indiceMateria++;
  }, 3500);
})

onUnmounted(() => {
  if (intervaloCarrusel) clearInterval(intervaloCarrusel)
  if (intervaloHorarios) clearInterval(intervaloHorarios)
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

.logo {
  display: flex;
  justify-content: center; 
  margin-bottom: 1rem;
}

.logo img {
  width: 100%;       
  max-width: 250px;  
  height: auto;      
  object-fit: contain; 
  right: 1rem; 
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

.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
}


/* --- GRILLA DE HORARIOS ANIMADA (CSS GRID) --- */
.schedule-board {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow: hidden;
}

.schedule-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 3fr 1fr 1fr;
  background-color: #00A8E8;
  color: #FFFFFF;
  padding: 1.2rem 1rem;
  font-size: 1.1rem;
  font-weight: bold;
}

/* El cuerpo es relativo para que el 'absolute' de las filas que salen funcione */
.schedule-body {
  position: relative;
  display: flex;
  flex-direction: column;
}

.schedule-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 3fr 1fr 1fr;
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #eee;
  background-color: white;
  align-items: center;
  font-size: 1.05rem;
}

.schedule-row:nth-child(even) { background-color: #f8fbff; }

.font-bold { font-weight: 600; }
.text-center { text-align: center; }
.badge-aula {
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
}

/* --- CLASES MAGICAS DE TRANSICIÓN VUE --- */
.scroll-move,
.scroll-enter-active,
.scroll-leave-active {
  /* La curva 'cubic-bezier' le da ese efecto moderno de deslizamiento */
  transition: all 1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.scroll-enter-from {
  opacity: 0;
  transform: translateY(30px); /* Entra desde abajo */
}

.scroll-leave-to {
  opacity: 0;
  transform: translateY(-30px); /* Se desvanece hacia arriba */
}

/* Fundamental: Saca del flujo al elemento que se va para que los de abajo suban de golpe */
.scroll-leave-active {
  position: absolute;
  width: 100%;
}


/* --- CARRUSEL AVISOS --- */
.carrusel-section {
  background-color: #00A8E8;
  color: white;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.slide-noticia { text-align: center; }
.slide-noticia h2 { font-size: 2.5rem; margin: 0 0 0.5rem 0; }
.slide-noticia p { font-size: 1.2rem; margin: 0; }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

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