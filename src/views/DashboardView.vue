<template>
  <div class="dashboard-layout">
    <!-- Barra Lateral (Sidebar) -->
    <!-- Barra Lateral (Sidebar) -->
    <aside class="sidebar" :class="{ 'sidebar-abierta': menuAbierto }">
      <div class="sidebar-header">
        <span class="logo"><img src="../assets/unpaz.png" alt="Logo Universidad" /></span>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li v-if="rolUsuario === 'Administrador'" :class="{ active: vistaActual === 'usuarios' }" @click="vistaActual = 'usuarios'">Gestión de Usuarios</li>
          <li :class="{ active: vistaActual === 'inicio' }" @click="vistaActual = 'inicio'">Inicio</li>
          <li :class="{ active: vistaActual === 'horarios' }" @click="vistaActual = 'horarios'">Horarios</li>
          <li :class="{ active: vistaActual === 'materias' }" @click="vistaActual = 'materias'">Materias</li>
          <li :class="{ active: vistaActual === 'aulas' }" @click="vistaActual = 'aulas'">Aulas</li>
          <li :class="{ active: vistaActual === 'ver-avisos' }" @click="vistaActual = 'ver-avisos'">Ver Avisos</li>
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
        
        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <!-- Selector de Vista (Solo visible si su rol real en el token es Administrador) -->
          <div v-if="rolRealUsuario === 'Administrador'" style="display: flex; align-items: center; gap: 0.5rem; background: #f0f2f5; padding: 0.5rem 1rem; border-radius: 8px;">
            <label for="simulador-rol" style="font-size: 0.85rem; color: #666; font-weight: bold; margin: 0;">Ver como:</label>
            <select id="simulador-rol" v-model="rolUsuario" style="border: none; background: transparent; font-weight: bold; color: #00A8E8; outline: none; cursor: pointer;">
              <option value="Administrador">Administrador</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
          
          <div class="user-info">admin@universidad.edu.ar</div>
        </div>
      </header>
      
      <div class="content-body">
        
        <!-- PANEL DE INICIO (Estadísticas) -->
        <div v-if="vistaActual === 'inicio'" class="card-placeholder fade-in">
          <h3>Resumen del Sistema</h3>
          <p>Métricas principales de la plataforma.</p>
          
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-title">Avisos Activos: </span>
              <span class="stat-value">{{ totalAvisos }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="vistaActual === 'horarios'" class="card-placeholder fade-in">
          <h3>Gestión de Horarios</h3>
          <p>Módulo para asignar materias a las aulas.</p>
        </div>

        <!-- Modulo de materias -->
        <div v-else-if="vistaActual === 'materias'" class="card-placeholder fade-in">
          <h3>Gestión de Materias</h3>
          <p>Carga de materias, horarios y aulas que se verán en la pantalla del Totem.</p>
          
          <!-- Formulario de Carga -->
          <form @submit.prevent="crearMateria" class="form-crear" style="margin-bottom: 2rem;">
            
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="input-group">
                <label>Nombre de la Materia</label>
                <input type="text" v-model="formularioMateria.nombre" placeholder="Ej: Lab. de Software" required>
              </div>
              <div class="input-group">
                <label>Comisión</label>
                <input type="text" v-model="formularioMateria.comision" placeholder="Ej: C1" required>
              </div>
              <div class="input-group">
                <label>Día</label>
                <select v-model="formularioMateria.dia" required class="dark-select" style="background-color: white; color: black;">
                  <option value="">-- Día --</option>
                  <option>Lunes</option><option>Martes</option><option>Miercoles</option>
                  <option>Jueves</option><option>Viernes</option><option>Sabado</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="input-group">
                <label>Hora Inicio</label>
                <input type="time" v-model="formularioMateria.hora_inicio" required>
              </div>
              <div class="input-group">
                <label>Hora Fin</label>
                <input type="time" v-model="formularioMateria.hora_fin" required>
              </div>
              <div class="input-group">
                <label>Edificio</label>
                <input type="text" v-model="formularioMateria.edificio" placeholder="Ej: Sede Central">
              </div>
              <div class="input-group">
                <label>Aula</label>
                <input type="text" v-model="formularioMateria.aula" placeholder="Ej: Aula 102">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="input-group">
                <label>Modalidad</label>
                <select v-model="formularioMateria.modalidad" required class="dark-select" style="background-color: white; color: black;">
                  <option value="">-- Seleccione --</option>
                  <option>Presencial</option>
                  <option>A distancia - Presencial</option>
                  <option>Virtual</option>
                </select>
              </div>
              <div class="input-group">
                <label>Detalle Modalidad</label>
                <input type="text" v-model="formularioMateria.modalidad_combo" placeholder="Ej: 100% Presencial">
              </div>
              <div class="input-group">
                <label>Periodicidad</label>
                <select v-model="formularioMateria.periodicidad" required class="dark-select" style="background-color: white; color: black;">
                  <option value="">-- Seleccione --</option>
                  <option>Semanal</option>
                  <option>Quincenal</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary">Guardar Materia</button>
          </form>

          <hr style="border: 1px solid #eee; margin: 2rem 0;">

          <!-- Tabla de Materias Existentes -->
          <h4>Materias Cargadas ({{ listaMaterias.length }})</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Día</th>
                <th>Horario</th>
                <th>Materia</th>
                <th>Com.</th>
                <th>Modalidad</th>
                <th>Aula</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materia in listaMaterias" :key="materia.id_materia">
                <td>{{ materia.dia }}</td>
                <td>{{ materia.hora_inicio ? materia.hora_inicio.slice(0,5) : '' }} a {{ materia.hora_fin ? materia.hora_fin.slice(0,5) : '' }}</td>
                <td><strong>{{ materia.nombre }}</strong></td>
                <td>{{ materia.comision }}</td>
                <td>{{ materia.modalidad }}</td>
                <td><span class="badge active">{{ materia.aula || 'S/A' }}</span></td>
                <td>
                  <button class="btn-sm delete" @click="eliminarMateria(materia.id_materia)">Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="vistaActual === 'aulas'" class="card-placeholder fade-in">
          <h3>Gestión de Aulas</h3>
          <p>Módulo para administrar las aulas por piso.</p>
        </div>

        <!-- MOCKUP: VER AVISOS -->
        <div v-else-if="vistaActual === 'ver-avisos'" class="card-placeholder fade-in">
          
          <!-- Encabezado con título a la izquierda y botón a la DERECHA -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
              <h3 style="margin: 0;">Lista de avisos</h3>
              <p style="margin: 0; color: #666;">Avisos que se están mostrando actualmente</p>
            </div>
            <!-- Botón Crear Aviso (Bloqueado para Supervisor) -->
            <button  class="btn-primary" @click="mostrarModalCrearAviso = true" style="margin: 0;">+ Crear Aviso</button>
          </div>

          <!-- TABLA DE AVISOS CON MATRIZ DE PERMISOS -->
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th @click="ordenFecha = ordenFecha === 'desc' ? 'asc' : 'desc'" style="cursor: pointer; user-select: none; color: #00A8E8;">
                  Fecha <span v-if="ordenFecha === 'desc'">▼</span><span v-else>▲</span>
                </th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aviso in avisosOrdenados" :key="aviso.id_aviso">
                <td>{{ aviso.id_aviso }}</td>
                <td>{{ aviso.titulo }}</td>
                <td>{{ new Date(aviso.fecha_publicacion).toLocaleDateString('es-AR') }}</td>
                
                <!-- COLUMNA ESTADO -->
                <td>
                  <span :class="calcularEstadoClase(aviso)">
                    {{ calcularEstadoTexto(aviso) }}
                  </span>
                </td>
                
                <!-- COLUMNA ACCIONES CON PERMISOS -->
                <td>
                  <div class="table-actions">
                    <!-- EDITAR: Solo Admin y Editor -->
                    <button class="btn-sm edit" @click="iniciarEdicion(aviso)">Editar</button>
                    
                    <!-- BORRAR: Solo Admin y Supervisor -->
                    <button v-if="rolUsuario === 'Administrador' || rolUsuario === 'Supervisor'" class="btn-sm delete" @click="eliminarAviso(aviso.id_aviso)">Borrar</button>
                    
                    <!-- APROBAR / RECHAZAR: Solo Admin y Supervisor -->
                    <button v-if="(rolUsuario === 'Administrador' || rolUsuario === 'Supervisor') && aviso.estado_aprobacion === 'En revision'" class="btn-sm" style="background-color: #10b981; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer;" @click="cambiarEstadoAviso(aviso.id_aviso, 'Aprobado')">Aprobar</button>
                    
                    <button v-if="(rolUsuario === 'Administrador' || rolUsuario === 'Supervisor') && aviso.estado_aprobacion === 'En revision'" class="btn-sm" style="background-color: #f59e0b; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer;" @click="cambiarEstadoAviso(aviso.id_aviso, 'Rechazado')">Rechazar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- PANEL DE EDICIÓN DE AVISOS -->
          <div v-if="avisoEditandoId !== null" class="edit-panel" style="margin-top: 2rem;">
            <h4>Editar aviso</h4>
            <form @submit.prevent="guardarEdicionAviso" class="form-crear">
              <div class="input-group">
                <label for="titulo-editar">Título del Aviso</label>
                <input id="titulo-editar" v-model="formularioEdicion.titulo" type="text" required>
              </div>

              <div class="input-group">
                <label for="contenido-editar">Contenido / Detalles</label>
                <textarea id="contenido-editar" v-model="formularioEdicion.contenido" rows="4" required></textarea>
              </div>

              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <div class="input-group" style="flex: 1;">
                  <label for="edit_fecha_desde">Mostrar desde:</label>
                  <input type="datetime-local" id="edit_fecha_desde" v-model="formularioEdicion.fechaDesde" required>
                </div>
                <div class="input-group" style="flex: 1;">
                  <label for="edit_fecha_hasta">Ocultar el:</label>
                  <input type="datetime-local" id="edit_fecha_hasta" v-model="formularioEdicion.fechaHasta" required>
                </div>
              </div>

              <div class="form-actions" style="margin-top: 1rem;">
                <button type="submit" class="btn-primary">Guardar cambios</button>
                <button type="button" class="btn-secondary" @click="cancelarEdicion">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <!-- POPUP MODAL: CREAR AVISO -->
        <div v-if="mostrarModalCrearAviso" class="modal-overlay" @click.self="mostrarModalCrearAviso = false">
          <div class="modal-content fade-in" style="max-width: 950px;"> 
            <button class="close-modal" @click="mostrarModalCrearAviso = false">✖</button>
            
            <h3>Crear Nuevo Mensaje</h3>
            
            <form @submit.prevent="crearAviso" class="form-crear">
              <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                
                <div style="flex: 1; min-width: 300px;">
                  <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <div class="input-group" style="flex: 1;">
                      <label for="fecha_desde">Mostrar desde:</label>
                      <input type="datetime-local" id="fecha_desde" v-model="formularioAviso.fechaDesde" required>
                    </div>
                    <div class="input-group" style="flex: 1;">
                      <label for="fecha_hasta">Ocultar el:</label>
                      <input type="datetime-local" id="fecha_hasta" v-model="formularioAviso.fechaHasta" required>
                    </div>
                  </div>

                  <div class="input-group" style="margin-bottom: 1rem;">
                    <label for="titulo">Título del Aviso</label>
                    <input type="text" id="titulo" v-model="formularioAviso.titulo" placeholder="Ej: Cambio de aula..." required>
                  </div>

                  <div style="display: flex; gap: 1rem; align-items: flex-end;">
                    <div class="input-group" style="flex: 1;">
                      <label for="edificio">Edificio</label>
                      <select id="edificio" v-model="formularioAviso.id_edificio" class="dark-select">
                        <option value="">-- Todos --</option>
                        <option :value="1">Sede Alem (Central)</option>
                        <option :value="2">Sede Pueyrredón (CEM)</option>
                        <option :value="3">Sede Arregui (Medicina)</option>
                      </select>
                    </div>
                    <div class="input-group" style="flex: 1;">
                      <button type="button" class="btn-secondary" style="padding: 0.8rem; width: 100%; height: 100%;">Seleccionar Deptos.</button>
                    </div>
                  </div>
                </div>

                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
                  <div class="input-group" style="flex-grow: 1; display: flex; flex-direction: column;">
                    <label for="contenido">Contenido / Detalles</label>
                    <textarea id="contenido" v-model="formularioAviso.contenido" placeholder="Cuerpo del mensaje..." maxlength="100" required style="flex-grow: 1; resize: none; padding: 1rem;"></textarea>
                    <small style="text-align: right; color: #666; font-weight: bold; margin-top: 0.3rem;">
                      {{ formularioAviso.contenido.length }} / 100
                    </small>
                  </div>
                  
                  <button type="submit" class="btn-primary" style="width: 100%; margin-top: 0.5rem; padding: 1rem;">Publicar Mensaje</button>
                </div>
              </div>
            </form>

            <div class="preview-container" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px dashed #ccc;">
              <h4 style="margin-top: 0;">Vista Previa en Pantalla</h4>
              <div class="totem-mockup-header" style="margin-top: 0.5rem;">
                <div class="totem-mockup-logo">
                  <img src="../assets/unpaz.png" alt="Logo Universidad" />
                </div>
                <div class="ticker-wrapper">
                  <div class="ticker-track">
                    <span class="ticker-item">
                      <span class="ticker-title">{{ formularioAviso.titulo || 'Título' }}</span>: {{ formularioAviso.contenido || 'El texto de tu anuncio aparecerá aquí...' }}
                      <span class="ticker-separator">|</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api, { clearAuthSession } from '../services/app.js'

const router = useRouter()
const totalAvisos = ref(0)
const vistaActual = ref('ver-avisos')
const listaAvisos = ref([])
const formularioAviso = ref({ titulo: '', contenido: '', id_edificio: '', fechaDesde: '', fechaHasta: '' })
const avisoEditandoId = ref(null)
const isLoading = ref(false)
const mostrarModalCrearAviso = ref(false)

const normalizarRol = (rol) => {
  const clave = String(rol || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  const roles = {
    admin: 'Administrador',
    administrador: 'Administrador',
    editor: 'Editor',
    supervisor: 'Supervisor'
  }

  return roles[clave] || ''
}

const obtenerRolReal = () => {
  try {
    const token = localStorage.getItem('token')
    const payload = token?.split('.')[1]

    if (payload) {
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      const datosToken = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
      const rolToken = normalizarRol(datosToken.rol)
      if (rolToken) return rolToken
    }
  } catch (error) {
    console.warn('No se pudo leer el rol desde el token:', error)
  }

  return normalizarRol(localStorage.getItem('rol'))
}

// El rol real se obtiene del token y se usa como respaldo el valor guardado.
const rolRealUsuario = obtenerRolReal()

// El rol reactivo que controla qué botones y pestañas se muestran en la pantalla
const rolUsuario = ref(rolRealUsuario);
// Función para que Admin/Supervisor aprueben o rechacen


// Función para que Admin y Supervisor aprueben o rechacen un aviso
const cambiarEstadoAviso = async (id, nuevoEstado) => {
  try {
    // Enviamos el estado exacto tal como lo definimos en el ENUM de la base de datos ('Aprobado' o 'Rechazado')
    await api.patch(`/avisos/${id}/estado`, { 
      estado_aprobacion: nuevoEstado 
    });
    
    // Refrescamos inmediatamente la lista de avisos para reflejar el cambio de color y estado
    await obtenerAvisos();
  } catch (error) {
    console.error('Error al cambiar el estado del aviso:', error);
    const mensaje = error.response?.data?.mensaje
      || error.response?.data?.message
      || (error.response
        ? 'El servidor rechazó el cambio de estado.'
        : 'No se pudo conectar con el backend. Verificá CORS y la conexión.');
    alert(mensaje);
  }
};


// ORDENAMIENTO
const ordenFecha = ref('desc')


// FORMULARIO EDICION ÚNICO
const formularioEdicion = ref({ titulo: '', contenido: '', fechaDesde: '', fechaHasta: '' })

const obtenerAvisos = async () => {
  isLoading.value = true
  try {
    const { data } = await api.get('/avisos')
    const avisos = Array.isArray(data) ? data : []
    listaAvisos.value = avisos
    totalAvisos.value = avisos.length
  } catch (error) {
    console.error('Error al cargar avisos:', error)
  } finally {
    isLoading.value = false
  }
}

const crearAviso = async () => {
  if (!formularioAviso.value.titulo.trim() || !formularioAviso.value.contenido.trim()) return

  try {
    const fechaPub = formularioAviso.value.fechaDesde.replace('T', ' ') + ':00';
    const fechaVenc = formularioAviso.value.fechaHasta.replace('T', ' ') + ':00';

    const arregloEdificios = formularioAviso.value.id_edificio ? [Number(formularioAviso.value.id_edificio)] : [];

    const nuevoAviso = {
      titulo: formularioAviso.value.titulo.trim(),
      descripcion: formularioAviso.value.contenido.trim(),
      fecha_publicacion: fechaPub,
      fecha_vencimiento: fechaVenc,
      id_categoria: 1,
      edificios: arregloEdificios,
      carreras: []
    }
    
    await api.post('/avisos', nuevoAviso)

    formularioAviso.value = { titulo: '', contenido: '', id_edificio: '', fechaDesde: '', fechaHasta: '' }
    await obtenerAvisos()
    
    // Cerramos el popup al terminar
    mostrarModalCrearAviso.value = false
  } catch (error) {
    console.error('No se pudo publicar el aviso:', error)
  }
}

const iniciarEdicion = (aviso) => {
  avisoEditandoId.value = aviso.id_aviso
  
  const formatToInput = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.slice(0, 16).replace(' ', 'T');
  };

  formularioEdicion.value = {
    titulo: aviso.titulo || '',
    contenido: aviso.descripcion || aviso.contenido || '',
    fechaDesde: formatToInput(aviso.fecha_publicacion),
    fechaHasta: formatToInput(aviso.fecha_vencimiento)
  }
}

const cancelarEdicion = () => {
  avisoEditandoId.value = null
  formularioEdicion.value = { titulo: '', contenido: '', fechaDesde: '', fechaHasta: '' }
}

const guardarEdicionAviso = async () => {
  if (!avisoEditandoId.value) return
  if (!formularioEdicion.value.titulo.trim() || !formularioEdicion.value.contenido.trim()) return

  try {
    const fechaPub = formularioEdicion.value.fechaDesde.replace('T', ' ') + ':00';
    const fechaVenc = formularioEdicion.value.fechaHasta.replace('T', ' ') + ':00';

    const avisoActualizado = {
      titulo: formularioEdicion.value.titulo.trim(),
      descripcion: formularioEdicion.value.contenido.trim(),
      fecha_publicacion: fechaPub,
      fecha_vencimiento: fechaVenc,
      id_categoria: 1,
      edificios: [],
      carreras: []
    }

    await api.put(`/avisos/${avisoEditandoId.value}`, avisoActualizado)

    cancelarEdicion()
    await obtenerAvisos()
  } catch (error) {
    console.error('No se pudo editar el aviso:', error)
  }
}

const eliminarAviso = async (id) => {
  try {
    await api.delete(`/avisos/${id}`)
    await obtenerAvisos()
  } catch (error) {
    console.error('Error al intentar eliminar el aviso:', error)
  }
}

// --- MATERIAS Y CURSADAS ---
const formularioCursada = ref({
  dia: '', hora_inicio: '', hora_fin: '', nombre: '', 
  comision: '', modalidad: '', modalidad_combo: '', periodicidad: '', aula: ''
})

const crearCursada = async () => {
  if (!formularioCursada.value.nombre.trim() || !formularioCursada.value.dia) return;

  try {
    await api.post('/cursadas', formularioCursada.value);
    formularioCursada.value = { 
      dia: '', hora_inicio: '', hora_fin: '', nombre: '', 
      comision: '', modalidad: '', modalidad_combo: '', periodicidad: '', aula: '' 
    };
  } catch (error) {
    console.error('Error al guardar cursada:', error);
  }
}

const listaMaterias = ref([]);
const formularioMateria = ref({
  nombre: '', comision: '', dia: '', hora_inicio: '', hora_fin: '', 
  modalidad: '', modalidad_combo: '', periodicidad: '', edificio: '', aula: ''
});

const obtenerMaterias = async () => {
  try {
    const { data } = await api.get('/materias'); 
    listaMaterias.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al cargar materias:', error);
  }
};

const fechaLocalPrecisa = (fechaString) => {
  if (!fechaString) return 0;
  const partes = String(fechaString).match(/\d+/g);
  if (!partes || partes.length < 5) return 0;
  return new Date(partes[0], partes[1] - 1, partes[2], partes[3], partes[4], partes[5] || 0).getTime();
};

const calcularEstadoTexto = (aviso) => {
  if (aviso.estado_aprobacion === 'En revision') return 'En Revisión';
  if (aviso.estado_aprobacion === 'Rechazado') return 'Rechazado';

  // Si está aprobado, calculamos por fecha
  const ahora = new Date().getTime();
  const pub = fechaLocalPrecisa(aviso.fecha_publicacion);
  const venc = fechaLocalPrecisa(aviso.fecha_vencimiento);

  if (ahora < pub) return 'Programado';
  if (ahora >= pub && ahora <= venc) return 'Activo';
  return 'Vencido';
};

const calcularEstadoClase = (aviso) => {
  const estado = calcularEstadoTexto(aviso);
  if (estado === 'En Revisión') return 'badge BORRADOR';
  if (estado === 'Rechazado') return 'badge inactive';
  if (estado === 'Activo') return 'badge active';
  if (estado === 'Vencido') return 'badge inactive';
  return 'badge BORRADOR'; // Para Programado
};

const avisosOrdenados = computed(() => {
  return [...listaAvisos.value].sort((a, b) => {
    const fechaA = fechaLocalPrecisa(a.fecha_publicacion);
    const fechaB = fechaLocalPrecisa(b.fecha_publicacion);
    return ordenFecha.value === 'desc' ? fechaB - fechaA : fechaA - fechaB;
  });
});

const logout = () => {
  clearAuthSession()
  router.push('/login')
}

onMounted(() => {
  obtenerAvisos()
  obtenerMaterias(); 
})
</script>


<style scoped>
/* Estructura gral */
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

/* TABLAS */
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

.table-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}
.badge.active {
  background-color: #d4edda;
  color: #155724;
}

.badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}
.badge.BORRADOR {
  background-color: #e2e3e5;
  color: #383d41;
}

.btn-sm.edit {
  background-color: #2563eb;
  color: white;
  border: 1px solid #2563eb;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm.edit:hover {
  background-color: #1d4ed8;
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

/* Simulador del Header del Totem */
.totem-mockup-header {
  background-color: #0A192F;
  color: #FFFFFF;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  border-bottom: 5px solid #FFD700;
  overflow: hidden;
  margin-top: 1rem;
}

.totem-mockup-logo {
  flex-shrink: 0;
  margin-right: 1.5rem;
  display: flex;
  justify-content: center;
}

.totem-mockup-logo img {
  width: 100%;
  max-width: 140px; 
  height: auto;
  object-fit: contain;
}

/* Cinta animada */
.ticker-wrapper {
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
}

.ticker-track {
  display: inline-block;
  padding-left: 100%;
  /* Animación más rápida en la vista previa para no hacerte esperar */
  animation: marquee 12s linear infinite; 
}

.ticker-item {
  font-size: 1.3rem; 
}

.ticker-title {
  font-weight: bold;
  color: #FFD700;
}

.ticker-separator {
  margin: 0 1.5rem;
  color: #00A8E8;
}

@keyframes marquee {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}


.edit-panel {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.edit-panel h4 {
  margin: 0 0 1rem;
  color: #0f172a;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-secondary {
  border: 1px solid #cbd5e1;
  background: white;
  color: #0f172a;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f8fafc;
}

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
/* --- POPUP / MODAL CREAR AVISO --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(10, 25, 47, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.close-modal {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.2s;
}

.close-modal:hover {
  color: #e53e3e;
}

</style>
