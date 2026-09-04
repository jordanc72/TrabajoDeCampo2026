<template>
  <div class="dashboard-layout">
    <!-- Barra Lateral (Sidebar) -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo"><img src="../assets/unpaz.png" alt="Logo Universidad" /></span>
        
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: vistaActual === 'inicio' }" @click="vistaActual = 'inicio'">Inicio</li>
          <li :class="{ active: vistaActual === 'horarios' }" @click="vistaActual = 'horarios'">Horarios</li>
          <li :class="{ active: vistaActual === 'materias' }" @click="vistaActual = 'materias'">Materias</li>
          <li :class="{ active: vistaActual === 'aulas' }" @click="vistaActual = 'aulas'">Aulas</li>
          <li :class="{ active: vistaActual === 'ver-avisos' }" @click="vistaActual = 'ver-avisos'">Ver Avisos</li>
          <li :class="{ active: vistaActual === 'crear-aviso' }" @click="vistaActual = 'crear-aviso'">Crear Aviso</li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <main class="dashboard-content">
      <header class="content-header">
        <h1>Gestión de avisos</h1>
        <div class="user-info">admin@universidad.edu.ar</div>
      </header>
      
      <div class="content-body">
        
        <!-- PANTALLAS EN CONSTRUCCIÓN (Placeholders) -->
        <!-- PANEL DE INICIO (Estadísticas) -->
        <div v-if="vistaActual === 'inicio'" class="card-placeholder fade-in">
          <h3>Resumen del Sistema</h3>
          <p>Métricas principales de la plataforma.</p>
          
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-title">Avisos Activos</span>
              <span class="stat-value">{{ totalAvisos }}</span>
            </div>
            <!-- Podés agregar más tarjetas acá en el futuro para aulas, materias, etc. -->
          </div>
        </div>


        <div v-else-if="vistaActual === 'horarios'" class="card-placeholder fade-in">
          <h3>Gestión de Horarios</h3>
          <p>Módulo para asignar materias a las aulas.</p>
        </div>

        <div v-else-if="vistaActual === 'materias'" class="card-placeholder fade-in">
          <h3>Gestión de Materias</h3>
          <p>Módulo para materias y carreras.</p>
        </div>

        <div v-else-if="vistaActual === 'aulas'" class="card-placeholder fade-in">
          <h3>Gestión de Aulas</h3>
          <p>Módulo para administrar las aulas por piso.</p>
        </div>

        <!-- MOCKUP: VER AVISOS -->
        <div v-else-if="vistaActual === 'ver-avisos'" class="card-placeholder fade-in">
          <h3>Lista de Mensajes</h3>
          <p>Avisos que se están mostrando actualmente </p>
          
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Fecha de inscripción </td>
                <td>21/08/2026</td>
                <td><span class="badge active">Activo</span></td>
                <td><button class="btn-sm delete">Borrar</button></td>
              </tr>
              <tr>
                <td>2</td>
                <td>Paro no docente</td>
                <td>20/08/2026</td>
                <td><span class="badge inactive">Inactivo</span></td>
                <td><button class="btn-sm delete">Borrar</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOCKUP: CREAR AVISO -->
        <div v-else-if="vistaActual === 'crear-aviso'" class="card-placeholder fade-in">
          <h3>Crear Nuevo Mensaje</h3>
          <p>Escriba un nuevo aviso para publicarlo en las pantallas de la uni</p>
          
          <form @submit.prevent="simularCreacion" class="form-crear">
                        
            <div class="input-group">
              <label for="titulo">Título del Aviso</label>
              <input type="text" id="titulo" v-model="formularioAviso.titulo" placeholder="Ej: Cambio de aula para ...." required>
            </div>

            <div class="input-group">
              <label for="contenido">Contenido / Detalles</label>
              <textarea id="contenido" rows="4" v-model="formularioAviso.contenido" placeholder="Cuerpo del mensaje..." required></textarea>
            </div>
            
            <button type="submit" class="btn-primary">Publicar Mensaje</button>
          </form>
          <div class="preview-container">

          <h4>Vista Previa del aviso</h4>
          <div class="totem-mockup">
            <!-- Si el input está vacío se muestra esto por defecto -->
            <h2>{{ formularioAviso.titulo || 'noticia 1' }}</h2>
            <p>{{ formularioAviso.contenido || 'Sin contenido' }}</p>
          </div>
        </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const totalAvisos = ref(0)

// Para q arranque por defecto en la pestaña 'ver-avisos'
const vistaActual = ref('ver-avisos') 

const simularCreacion = () => {
  alert('El mensaje fue "creado" correctamente.')
  vistaActual.value = 'ver-avisos' 
}

const formularioAviso = ref({ titulo: '', contenido: '' })


const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
/* --- ESTRUCTURA PRINCIPAL --- */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
}

.sidebar {
  width: 260px;
  background-color: #0A192F;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header h2 { margin: 0; }
.logo { font-size: 1.8rem; }

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #ccc;
  font-weight: 500;
}

.sidebar-nav li:hover {
  background-color: rgba(255,255,255,0.05);
  color: white;
}

/* Estilo para la opción seleccionada */
.sidebar-nav li.active {
  background-color: #00A8E8;
  color: white;
  border-left: 4px solid #FFD700;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-logout {
  width: 100%;
  background: none;
  border: 1px solid #ccc;
  color: white;
  padding: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

/* Contenido Principal */
.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  background-color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.content-header h1 {
  margin: 0;
  color: #0A192F;
  font-size: 1.4rem;
}

.user-info {
  color: #666;
  font-weight: 500;
}

.content-body {
  padding: 2rem;
}

.card-placeholder {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border-top: 4px solid #00A8E8;
}

/* --- TABLAS (VER MSJ) --- */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.data-table th, .data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f9f9f9;
  color: #0A192F;
  font-weight: bold;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.btn-sm.delete {
  background-color: transparent;
  color: #d93025;
  border: 1px solid #d93025;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm.delete:hover {
  background-color: #d93025;
  color: white;
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

.preview-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #ccc;
}
.totem-mockup {
  background-color: #00A8E8;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}


/* --- FORMULARIO (CREAR MSJ) --- */
/*.form-crear {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 600px;
}
*/
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: bold;
  color: #0A192F;
}

.input-group input, .input-group textarea {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  font-family: inherit;
}

.input-group input:focus, .input-group textarea:focus {
  border-color: #00A8E8;
  box-shadow: 0 0 5px rgba(0, 168, 232, 0.3);
}

.btn-primary {
  background-color: #00A8E8;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  align-self: flex-start;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #008fca;
}

</style>
