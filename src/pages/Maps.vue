<template>
  <div :class="['map-container', { 'fullscreen-map': isFullscreen }]">
    <MglMap
  class="main-map"
  :accessToken="accessToken"
  :mapStyle="mapStyle"
  :center="center"
  :zoom="zoom"
  :style="{ height: isFullscreen ? '100vh' : '1100px', width: isFullscreen ? '100vw' : 'auto' }"
  @load="onMapLoaded"
>
      />
      <button v-if="showFullscreenButton" class="fullscreen-toggle" @click="toggleFullscreen">
  {{ isFullscreen ? 'Salir Pantalla Completa' : 'Pantalla Completa' }}
</button>
      <div id="planning-controls" class="planning-controls"> 
  <button class="planning-toggle" @click="togglePlanning">
    {{ isPlanningOpen ? '▲ Cerrar Opciones' : '▼ Abrir Opciones' }}
  </button>
  <div :style="{ display: isPlanningOpen ? 'block' : 'none' }">
    <div class="row" style="margin-top:20px;">
      <div class="col-md-4 pr-md-1">
        <base-input label="Fecha Inicio" type="date" format="yyyy-MM-dd" placeholder="Fecha Inicio"
          v-model="fecha_inicio_simulacion" :disabled="isDateInputDisabled">
        </base-input>
      </div>
      <div class="col-md-4 pr-md-1">
        <label class="custom-label">¿Quisieras separar los paquetes?</label>
        <div>
          <input type="radio" id="separarPaquetesSi" value="true" v-model="separarPaquetes"
            :disabled="isButtonDisabledSeparar">
          <label for="separarPaquetesSi">Sí</label>
          <input type="radio" id="separarPaquetesNo" value="false" v-model="separarPaquetes" 
            :disabled="isButtonDisabledSeparar">
          <label for="separarPaquetesNo">No</label>
        </div>
      </div>
      <div class="col-md-4 pr-md-1" v-if="separarPaquetes === 'true'">
        <base-input label="Tamaño del Grupo" type="number" placeholder="Tamaño del Grupo" v-model="tamanoGrupo"
          :disabled="isButtonDisabledSeparar">
        </base-input>
      </div>
    </div>
    <div class="row">

  <!-- Modal Cancelar -->
  <div v-if="showCancelarModal" class="modal-overlay" @click="closeCancelarModal">
    <div class="modal-content" @click.stop>
      <h2>Cancelar Simulación</h2>
      <p>¿Deseas cancelar la simulación?</p>
      <button class="modal-button" @click="cancelarSimulacion">Cancelar</button>
      <button class="modal-button" @click="closeCancelarModal">Cerrar</button>
    </div>
  </div>

  <!-- Modal Detener -->
  <div v-if="showDetenerModal" class="modal-overlay" @click="closeDetenerModal">
    <div class="modal-content" @click.stop>
      <h2>Detener Simulación</h2>
      <p>¿Deseas detener la simulacion?</p>
      <button class="modal-button" @click="detenerSimulacion">Detener</button>
      <button class="modal-button" @click="closeDetenerModal">Cerrar</button>
    </div>
  </div>

  <!-- Modal Reanudar -->
  <div v-if="showReanudarModal" class="modal-overlay" @click="closeReanudarModal">
    <div class="modal-content" @click.stop>
      <h2>Reanudar Simulación</h2>
      <p>¿Deseas reanudar la simulación?</p>
      <button class="modal-button" @click="reanudarSimulacion">Reanudar</button>
      <button class="modal-button" @click="closeReanudarModal">Cerrar</button>
    </div>
  </div>
      <div class="col-md-3" style="margin-top:20px;"
        v-if="!toggleIniciarDetener && validarFechaIniciarPlanificacion">
        <b-button @click="validarFechaIniciarPlanificacion" :class="{ 'button-disabled': isButtonDisabled }"
          :disabled="isButtonDisabled" type="primary" fill>
          {{ planificacionBotonTexto }}
        </b-button>
       
      </div>
      <div class="row justify-content-between align-items-center" style="margin-top:20px;">
  <div class="col-md-auto">
    <button v-if="planificacionEnEsperaCancelar" class="btn-simulation-left font-weight-bold" @click="openCancelarModal">Cancelar Simulación</button>
  </div>
  <div class="col-md-auto ml-auto btn-container">
    <button v-if="planificacionEnEsperaDetener" class="btn-simulation-right font-weight-bold" @click="openDetenerModal">Detener Simulación</button>
    <button v-if="planificacionEnEsperaRenaudar" class="btn-simulation-right-Rea font-weight-bold" @click="openReanudarModal">Reanudar Simulación</button>
  </div>
</div>
 
     <!-- Modal Fecha Invalida -->
  <div v-if="showFechaInvalidaModal" class="modal-overlay" @click="closeFechaInvalidaModal">
    <div class="modal-content" @click.stop>
      <h2>Error</h2>
      <p>La fecha de inicio de simulación no puede estar vacía.</p>
      <button class="modal-button" @click="closeFechaInvalidaModal">Cerrar</button>
    </div>
  </div>

  <!-- Modal Confirmar Fecha -->
  <div v-if="showConfirmarFechaModal" class="modal-overlay" @click="closeConfirmarFechaModal">
    <div class="modal-content" @click.stop>
      <h2>Confirmar</h2>
      <p>¿Deseas iniciar la planificación en esta fecha: {{ fecha_inicio_simulacion }}?</p>
      <button class="modal-button" @click="confirmarPlanificacion">Confirmar</button>
      <button class="modal-button" @click="closeConfirmarFechaModal">Cancelar</button>
    </div>
  </div>
    </div>
  </div>
</div> 

      <div class="datetime-display">
        {{ currentDateTime }}
      </div>
      <div class="vuelos-carga-info">
      <button class="info-toggle" @click="toggleInfo">
        {{ isInfoOpen ? '▲ Cerrar Información General' : '▼ Abrir Información General' }}
      </button>
      <div :style="{ display: isInfoOpen ? 'block' : 'none' }">
        <div class="vuelos-movimiento">
          Cantidad de vuelos en movimiento: {{ cantidadVuelosMovimiento }}
        </div>
        <div class="capacidad-carga">
          <div class="carga-bar">
            <div class="carga-bar-inner" :style="{ width: (capacidadCargaUsadoTotal / capacidadCargaMaximaTotal * 100) + '%' }"></div>
          </div>
          Capacidad usada de vuelos: {{ ((capacidadCargaUsadoTotal / capacidadCargaMaximaTotal) * 100).toFixed(2) }}%
        </div>
        <div class="capacidad-carga">
          <div class="carga-bar">
            <div class="carga-bar-inner" :style="{ width: (capacidadAeropuertosUsadaTotal / capacidadAeropuertosMaximaTotal * 100) + '%' }"></div>
          </div>
          Capacidad usada de aeropuertos: {{ ((capacidadAeropuertosUsadaTotal / capacidadAeropuertosMaximaTotal) * 100).toFixed(2) }}%
        </div>
      </div>
    </div>
      <MglGeojsonLayer :sourceId="'aeropuertos'" :layerId="'aeropuertosLayer'" :type="'symbol'"
        :source="geojsonAeropuertos" :layout="{
          'icon-image': ['get', 'icon-image'],
          'icon-size': 1.0,
          'icon-allow-overlap': true
        }" @click="onAirportClick" />

<div id="airport-popup" class="airport-popup" v-if="showPopup" :style="{ top: popupPosition.top, left: popupPosition.left }">
  {{ currentAirportCode }}
</div> 

      <MglGeojsonLayer v-for="(vuelo, index) in filteredVuelos" :key="`vuelo-layer-${index}`"
        :sourceId="`vuelo-${index}`" :layerId="`avion-${index}`" :type="'symbol'"
        :source="createGeojsonSourceForVuelo(vuelo)" :layout="{
          'icon-image': ['get', 'icon-image'],
          'icon-size': 0.3,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'icon-rotate'] // Use icon-rotate property
        }" @click="onFlightClick" />

      <div id="legend" class="map-legend">
        <button class="legend-toggle" @click="toggleLegend">
          {{ isLegendOpen ? '▲ Cerrar Leyenda' : '▼ Abrir Leyenda' }}
        </button>
        <ul :style="{ display: isLegendOpen ? 'block' : 'none' }" class="legend-content">
          <li><span class="dot greater-80"></span>Menor a 50%</li>
          <li><span class="dot between-50-80"></span>Entre 50% y 80%</li>
          <li><span class="dot less-50"></span>Mayor a 80%</li>
          <li><span class="icon airplane-icon"></span>Vuelo</li>
          <li><span class="icon airport-icon"></span>Aeropuerto</li>
        </ul>
      </div>
      <div class="map-search-container">


<input class="search-input" type="text" v-model="busquedaEnvio" @input="buscarEnvio" :disabled="!searchEnabled"
  placeholder="Buscar envío">
<div v-if="resultadosBusquedaEnvio.length" class="search-results">
  <div v-for="envio in resultadosBusquedaEnvio" :key="envio.id" class="search-result-card"
    @click="abrirEnvioModal(envio)">
    <p><strong>{{ envio.idEnvio }}</strong></p>
    <p>Ciudad Actual: {{ envio.ciudadActual }}</p>
    <p>Cantidad Paquetes: {{ envio.cantidadPaquetes }}</p>
    <p>Estado: {{ envio.estadoEnvio }}</p>
  </div>
</div>

<input class="search-input" type="text" v-model="busquedaAeropuerto" @input="buscarAeropuerto"
  :disabled="!searchEnabled" placeholder="Buscar aeropuerto">
<div v-if="resultadosBusqueda.length" class="search-results">
  <div v-for="aeropuerto in resultadosBusqueda" :key="aeropuerto.id" class="search-result-card"
    @click="abrirModal(aeropuerto)">
    <p><strong>{{ aeropuerto.nombreCiudad }}, {{ aeropuerto.pais }}</strong></p>
    <p>Capacidad: {{ aeropuerto.capacidadAlmacenamientoMaximo }}</p>
  </div>
</div>

<input class="search-input" type="text" v-model="busquedaVuelo" @input="buscarVuelo" :disabled="!searchEnabled"
  placeholder="Buscar vuelo">
<div v-if="resultadosBusquedaVuelo.length" class="search-results">
  <div v-for="vuelo in resultadosBusquedaVuelo" :key="vuelo.id" class="search-result-card"
    @click="abrirVueloModal(vuelo)">
    <p><strong>Id Vuelo:</strong> {{ vuelo.id }}</p>
    <p><strong>Capacidad Máxima:</strong> {{ vuelo.capacidadCargaMaxima }}</p>
    <p><strong>Capacidad Usada:</strong> {{ vuelo.capacidadCargaUsado }}</p>
  </div>
</div>

</div>





    </MglMap>


<div v-if="showFinalizationModal" class="modal-overlay" @click="closeFinalizationModal">
  <div class="modal-content-reporte" @click.stop>
    <img src="/img/Redex.png" alt="Simulación Exitosa" class="modal-image">
    <img src="/img/caption.png" alt="Simulación Exitosa 2" class="modal-image2">
    <h3>Simulación Finalizada</h3>
 
    <div class="modal-details">
 
    <p><strong>Total de Envíos:</strong> <span>{{ totalEnvios }} envíos</span></p>

    <p><strong>Total de Paquetes:</strong> <span>{{ totalPaquetes }} paquetes</span></p>

    <p><strong>Fecha y Hora de Inicio:</strong> <span class="datetime">{{ formatDateTime(fechaHoraInicio) }} UTC</span></p>

    <p><strong>Fecha y Hora Fin:</strong> <span class="datetime">{{ formatDateTimeGMT0(currentDateTime) }}</span></p>

    <p><strong>Cantidad de vuelos:</strong> <span>{{ totalVuelos }} vuelos</span></p>

 
</div>
<button class="modal-button-reporte" @click="downloadWord">Descargar Reporte</button>
    <button class="modal-button-reporte" @click="reloadPage">Cerrar</button>
  </div>
</div>
    <div v-for="modal in openFlightModals" :key="modal.id" class="modal-overlay-flight"
      @click="closeFlightModal(modal.id)">
      <div class="modal-content-flight" @click.stop>
        <h2>Información del Vuelo</h2>
        <p><strong>Id:</strong> {{ modal.data.id }}</p>
        <p><strong>Aeropuerto de Salida:</strong> {{ modal.data.ciudadOrigen }}</p>
        <p><strong>Aeropuerto de Llegada:</strong> {{ modal.data.ciudadDestino }}</p>
        <p><strong>Capacidad de Carga Máxima:</strong> {{ modal.data.capacidadCargaMaxima }}</p>
        <p><strong>Capacidad de Carga Usado:</strong> {{ modal.data.capacidadCargaUsado }}</p>
        <p><strong>Fecha y Hora de Salida:</strong> {{ formatDateTime(modal.data.fechaHoraSalidaGMT0) }}</p>
        <p><strong>Fecha y Hora de Llegada:</strong> {{ formatDateTime(modal.data.fechaHoraLlegadaGMT0) }}</p>
        <p><strong>Tiempo Estimado de Vuelo:</strong> {{ formatDuration(modal.data.tiempoEstimadoVuelo) }}</p>
        <button class="modal-button-flight" @click="closeFlightModal(modal.id)">Cerrar</button>
      </div>
    </div>


    <div v-for="modal in openModals" :key="modal.id" class="modal-overlay-airport" @click="closeAirportModal(modal.id)">
      <div class="modal-content-airport" @click.stop>
        <h2>Información del Aeropuerto</h2>
        <p><strong>Ciudad:</strong> {{ modal.data.nombreCiudad }}</p>
        <p><strong>País:</strong> {{ modal.data.pais }}</p>
        <p><strong>Capacidad de Almacenamiento Máximo:</strong> {{ modal.data.capacidadAlmacenamientoMaximo }}</p>
        <p><strong>Capacidad de Almacenamiento Usado:</strong> {{ modal.data.capacidadDeAlmacenamientoUsado }}</p>
        <p><strong>Coordenadas:</strong> {{ modal.data.coordinates.join(', ') }}</p>
        <button class="modal-button-airport" @click="closeAirportModal(modal.id)">Cerrar</button>
      </div>
    </div>
    <!-- <div id="map" style="height:750px!important;"></div> -->

    <div v-for="modal in openEnvioModals" :key="modal.id" class="modal-overlay-envio"
      @click="closeEnvioModal(modal.id)">
      <div class="modal-content-envio" @click.stop>
        <h2>Plan de Vuelo del Envío {{ modal.data.idEnvio }}</h2>
        <div v-for="(vuelo, index) in modal.data.ruta.vuelos" :key="vuelo.id">
          <hr>
          <h3>Vuelo #{{ index + 1 }}</h3>
          <p><strong>Aeropuerto de Salida:</strong> {{ vuelo.ciudadOrigen }}</p>
          <p><strong>Aeropuerto de Llegada:</strong> {{ vuelo.ciudadDestino }}</p>
          <p><strong>Fecha y Hora de Salida:</strong> {{ formatDateTime(vuelo.fechaHoraSalidaGMT0) }}</p>
          <p><strong>Fecha y Hora de Llegada:</strong> {{ formatDateTime(vuelo.fechaHoraLlegadaGMT0) }}</p>

        </div>
        <button class="modal-button-envio" @click="closeEnvioModal(modal.id)">Cerrar</button>
      </div>
    </div>







    <div v-if="isVisibleResumen">
      <button class="modal-button" @click="showModal">Mostrar resumen de colapso</button>

    </div>
    <div v-if="isVisible" class="modal-overlay" @click="closeCollapseModal">
      <div class="modal-content" @click.stop>
        <div class="collapse-icon"></div> <!-- Icono de colapso -->
        <h2>COLAPSO LOGÍSTICO</h2>
        <p>El sistema ha colapsado debido a un <strong>{{ collapseReason }}</strong>.</p>
        <p><strong>Detalles del Colapso:</strong></p>
        <ul>
          <li><strong>Motivo:</strong> EXCESO DE PAQUETES EN AEROPUERTOS</li>
          <li><strong>Lugar:</strong> Lima, Perú - SMTP</li>
          <li><strong>Fecha:</strong> {{ currentDateTime }}</li>
          <li><strong>Almacenes o Vuelos afectados:</strong> Brasil, Brasilia; New York, USA; Cali, Colombia</li>
        </ul>
        <button class="modal-button" @click="closeCollapseModal">Intentar de nuevo</button>
      </div>
    </div>


  </div>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl, MglGeojsonLayer } from "vue-mapbox";
import Mapa from '@/store/map.json';
import Mapa2 from '@/store/map2.json';
import axios from 'axios';
import Authentication from '@/store/authentication.js';
import Simulation from '@/store/simulation.js';
import config from "../config";

const
  aeropuertos = [];


const calendarioVuelos = {};


const envios = [];

let urlBase = config.urlBase;// aquí guardamos la base de la URL

let urlListarEnvios = '/api/paquete/';

let saltoTemporalAux = config.saltoTemporalSimulacion;

let delayAux = config.delaySimulacion;

export default {
  props: ['title', 'content', 'isVisible', 'isVisibleResumen'],
  components: {
    MglMap,
    MglNavigationControl,
    MglGeojsonLayer
  },
  data() {
    return {
      capacidadAeropuertosUsadaTotal: 0,
      capacidadAeropuertosMaximaTotal: 1,
      isInfoOpen: false,
      cantidadVuelosMovimiento: 0,
    capacidadCargaUsadoTotal: 0,
    capacidadCargaMaximaTotal: 1,
      showFinalizationModal: false,
      totalEnvios: 0,
      totalPaquetes: 0,
      totalVuelos: 0,
      fechaHoraInicio: "",
      showPopup: false,
      currentAirportCode: '',
      popupPosition: { top: '0px', left: '0px' },
      showFechaInvalidaModal: false,
      showConfirmarFechaModal: false,
      showCancelarModal: false,
      showDetenerModal: false,
      showReanudarModal: false,
      planificacionEnEsperaCancelar: false,
      planificacionEnEsperaRenaudar: false,
      planificacionEnEsperaDetener:false,
      showFullscreenButton: false,
      isFullscreen: false,
      isPlanningOpen: false,
      simulationStarted: false,
      filteredVuelos: [],
      allVuelos: [],
      vuelosOrdenadoGMT0: [],
      progresoPlanificacion: 0, // Añade esto al estado
      isButtonDisabledSeparar: false,
      separarPaquetes: 'false',
      tamanoGrupo: 0,
      searchEnabled: false,
      busquedaVuelo: '',
      resultadosBusquedaVuelo: [],
      busquedaEnvio: '',
      resultadosBusquedaEnvio: [],
      openEnvioModals: [],
      busquedaAeropuerto: '',
      resultadosBusqueda: [],
      openModals: [],
      planificacionBotonTexto: 'Iniciar Planificacion',
      planificacionEnEspera: false,
      toggleIniciarDetener: false,
      isButtonDisabled: false,
      isDateInputDisabled: false,
      simulationDateTime: null,
      simulationInterval: null,
      realTimePerSimulatedSecond: 1000 / (60 * 6), // 1 second real time = 6 minutes simulated time
      openModals: [],
      openFlightModals: [],
      isModalVisible: false,
      isVisibleResumen: false,
      isVisible: false,
      collapseReason: "",
      isLegendOpen: false,
      isAnimating: false,
      envios: envios,
      calendarioVuelos: {},
      movingFlights: [],
      currentDateTime: new Date().toLocaleString('es-ES', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }),
      //  toggleIniciarDetener: true,
      toggleReanudar: false,
      accessToken: this.$store.state.map.token, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      center: [5, 15],
      zoom: 2,


      myInterval: null,
      myIntervalReplan: null,

      fecha_inicio_simulacion: '',
      fecha_fin_simulacion: null,

      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      },

      geojsonAeropuertos: {
        type: 'FeatureCollection',
        features: aeropuertos.map(a => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: a.coordinates
          },
          properties: {
            ...a,
            'icon-image': this.calculateIcon(a.capacidadDeAlmacenamientoUsado / a.capacidadAlmacenamientoMaximo)
          }
        }))
      },



      createGeojsonSourceForEnvio(envio) {
        return {
          type: 'FeatureCollection',
          features: envio.ruta.vuelos.map(vuelo => ({
            type: 'Feature',
            properties: {
              id: vuelo.id,
              'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima)
            },
            geometry: {
              type: 'Point',
              coordinates: vuelo.origen
            }
          }))
        };
      },
      createGeojsonSourceForVuelo(vuelo) {
        const bearing = this.calculateBearing(vuelo.origen, vuelo.destino, vuelo.id);
        return {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {
              id: vuelo.id,
              'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
              'icon-rotate': bearing
            },
            geometry: {
              type: 'Point',
              coordinates: vuelo.origen
            }
          }]
        };
      },
      // Otras funciones...


      envios: [],
      currentFlightIndex: 0,
      isSimulating: false,



    }
  },
  mounted() {
    console.log("Aeropuertos disponibles:", aeropuertos);

    this.fetchAeropuertos();
    let vue = this;
    // this.updateTime();
    this.map.on('load', () => {
      this.loadImages(() => {
        this.setupAirportLayer();

        setInterval(() => {
          this.updateAirportCapacities();
          this.updateFlightCapacities();
          this.checkForCollapse();
        }, 1000);  // Actualiza cada segundo
      });
    });
  },
  destroyed() {
   // clearInterval(this.setInterval);
  },
  
  methods: {
    toggleInfo() {
      this.isInfoOpen = !this.isInfoOpen;
    },
    openCancelarModal() {
      this.showCancelarModal = true;
    },
    openDetenerModal() {
      this.showDetenerModal = true;
    },
    openReanudarModal() {
      this.showReanudarModal = true;
    },
    closeFechaInvalidaModal() {
      this.showFechaInvalidaModal = false;
    },
    closeConfirmarFechaModal() {
      this.showConfirmarFechaModal = false;
    },
    closeCancelarModal() {
      this.showCancelarModal = false;
    },
    closeDetenerModal() {
      this.showDetenerModal = false;
    },
    closeReanudarModal() {
      this.showReanudarModal = false;
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;

      if (this.isFullscreen) {
        this.$nextTick(() => {
          this.map.resize();
        });
      } else {
        this.$nextTick(() => {
          this.map.resize();
        });
    }
  },
    togglePlanning() {
      this.isPlanningOpen = !this.isPlanningOpen;
    },
    fetchAeropuertos() {
      console.log(urlBase+'/api/aeropuertos' );
      axios.get(urlBase + '/api/aeropuertos')
        .then(response => {
          this.aeropuertos = response.data;
          this.geojsonAeropuertos.features = this.aeropuertos.map(a => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: a.coordinates
            },
            properties: {
              ...a,
              'icon-image': this.calculateIcon(a.capacidadDeAlmacenamientoUsado / a.capacidadAlmacenamientoMaximo)
            }
          }));
          if (this.map && this.map.getSource('aeropuertos')) {
            this.map.getSource('aeropuertos').setData(this.geojsonAeropuertos);
          }
        })
        .catch(error => {
          console.error("Error fetching aeropuertos:", error);
        });
    },



    updateAirportData() {
      const fecha = this.simulationDateTime.toISOString().split('T')[0];
      const hora = this.simulationDateTime.toTimeString().split(' ')[0].substring(0, 5);

      axios.get(urlBase +`/api/simulacion/semanal/aeropuertos?fecha=${fecha}&hora=${hora}`)
        .then(response => {
          this.aeropuertos = response.data;
          this.geojsonAeropuertos.features = this.aeropuertos.map(a => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: a.coordinates
            },
            properties: {
              ...a,
              'icon-image': this.calculateIcon(a.capacidadDeAlmacenamientoUsado / a.capacidadAlmacenamientoMaximo)
            }
          }));
          this.capacidadAeropuertosUsadaTotal = this.aeropuertos.reduce((sum, a) => sum + a.capacidadDeAlmacenamientoUsado, 0);
          this.capacidadAeropuertosMaximaTotal = this.aeropuertos.reduce((sum, a) => sum + a.capacidadAlmacenamientoMaximo, 0);
          if (this.map && this.map.getSource('aeropuertos')) {
            this.map.getSource('aeropuertos').setData(this.geojsonAeropuertos);
          }
        })
        .catch(error => {
          console.error("Error fetching aeropuertos:", error);
        });
    },

    toggleLegend() {
      this.isLegendOpen = !this.isLegendOpen;
    },


    calculateIcon(capacityRatio) {
      if (capacityRatio < 0.50) return 'airport-green';
      else if (capacityRatio < 0.80) return 'airport-orange';
      return 'airport-red';
    },



    calculateFlightIcon(capacidadCargaUsado, capacidadCargaMaxima) {
      const ratio = capacidadCargaUsado / capacidadCargaMaxima;
      if (ratio < 0.50) return 'flight-green';  // Ensure these icons exist in your Mapbox style
      else if (ratio < 0.80) return 'flight-orange';
      else return 'flight-red';
    },



    updateAirportCapacities() {
      this.geojsonAeropuertos.features = this.aeropuertos.map(a => {
        let usageRatio = a.capacidadDeAlmacenamientoUsado / a.capacidadAlmacenamientoMaximo;
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: a.coordinates
          },
          properties: {
            ...a,
            'icon-image': this.calculateIcon(usageRatio) // Asegúrate de que la propiedad se llama 'icon-image'
          }
        };
      });
      if (this.map && this.map.getSource('aeropuertos')) {
        this.map.getSource('aeropuertos').setData(this.geojsonAeropuertos);
      }
    },




    updateFlightCapacities() {
      this.envios.forEach(envio => {
        envio.ruta.vuelos.forEach(vuelo => {
          // Aquí podrías actualizar la capacidad usada basado en alguna lógica o simulación
          vuelo.capacidadCargaUsado = Math.max(0, Math.min(vuelo.capacidadCargaMaxima, vuelo.capacidadCargaUsado + (Math.random() * 20 - 10)));
          this.updateFlightOnMap(vuelo, envio.id);
        });
      });
    },



    updateFlightOnMap(vuelo, envioId) {
      if (vuelo.capacidadCargaUsado > vuelo.capacidadCargaMaxima) {
        console.log("Collapse detected!");
        this.showModal();
      }
      const sourceId = `envio-${envioId}`;
      if (this.map.getSource(sourceId)) {
        this.map.getSource(sourceId).setData({
          type: 'Feature',
          properties: {
            id: vuelo.id,
            'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima)
          },
          geometry: {
            type: 'Point',
            coordinates: vuelo.origen
          }
        });
      } else {
        console.error(`Source ${sourceId} not found!`);
      }


    },




    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async updateSimulationHourly() {
      // Esta función se ejecuta cada hora en tiempo simulado
      this.currentDateTimeAux.setUTCHours(this.currentDateTimeAux.getUTCHours() + 1);
      this.currentDate = this.currentDateTimeAux.toISOString().split('T')[0];
      this.currentHour = this.currentDateTimeAux.toISOString().split('T')[1].substring(0, 5);

      console.log("Fecha current Simular ", this.currentDate);
      console.log("Hora current Simular ", this.currentHour);

      await this.continuarSimulacion(this.currentDate, this.currentHour);
      // Añadir un retraso antes de obtener los resultados de la simulación
     // await this.delay(5000); // 500ms de retraso, ajusta según sea necesario
  
      

    },


    // Add a method to animate only visible flights
    animateVisibleFlights() {
      const bounds = this.map.getBounds();
      const visibleFlights = this.filteredVuelos.filter(vuelo => {
        const [lng, lat] = vuelo.origen;
        return bounds.contains([lng, lat]);
      });

      visibleFlights.forEach(vuelo => this.animateFlight(vuelo));
    },

    // Modify checkAndAnimateFlights to use animateVisibleFlights
    checkAndAnimateFlights() {
      this.actualizarContadoresVuelos();
      const currentTime = this.simulationDateTime.getTime();
      console.log(`Tiempo de simulación actual: ${new Date(currentTime).toISOString()}`);
      this.pendingFlights.forEach(vuelo => {
    const vueloStartTime = new Date(vuelo.fechaHoraSalidaGMT0).getTime();
    console.log(`Tiempo de simulación actual Check VUELO: ${new Date(vueloStartTime).toISOString()}`, currentTime ,'-', vueloStartTime );
    if (currentTime >= vueloStartTime && !vuelo.animated) {
      vuelo.animated = true; // Marcar el vuelo como animado
      console.log(`Animando vuelo con ID ${vuelo.id} a las ${new Date(vueloStartTime).toISOString()}`);
      vuelo.isActive = false;

      this.animateFlight(vuelo);
    }
  });
      this.pendingFlights = this.pendingFlights.filter(vuelo => !vuelo.animated); // Remover los vuelos animados

      // Call animateVisibleFlights periodically

      this.animateVisibleFlights();

    },
    updateCurrentDateTimeDisplay() {
      this.currentDateTime = this.simulationDateTime.toLocaleString('es-ES', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    },

    loadImages(callback) {
      let imagesToLoad = ['airport-green', 'airport-orange', 'airport-red', 'flight-green', 'flight-orange', 'flight-red'];
      let loadedImages = 0;
      const totalImages = imagesToLoad.length;
      const imageLoaded = () => {
        loadedImages++;
        if (loadedImages === imagesToLoad.length) {
          callback();
        }
      };
      imagesToLoad.forEach(icon => {
        this.map.loadImage(`/img/${icon}.png`, (error, image) => {
          if (error) {
            console.error(`Error loading image: /img/${icon}.png`, error);
            return;
          }
          this.map.addImage(icon, image);
          loadedImages++;
          imageLoaded();
        });
      });
    },
    onAirportMouseEnter(event) {
    const feature = event.features[0];
    const aeropuerto = this.aeropuertos.find(a => a.codigoOACI === feature.properties.codigoOACI);
    if (aeropuerto) {
      this.currentAirportCode = aeropuerto.codigoOACI;
      this.showPopup = true;
      const coordinates = feature.geometry.coordinates.slice();
      const popupCoordinates = this.map.project([coordinates[0], coordinates[1]]);
      this.popupPosition = { top: `${popupCoordinates.y}px`, left: `${popupCoordinates.x}px` }; // Ajuste la posición del popup
    }
  },
  onAirportMouseLeave() {
    this.showPopup = false;
  },


    onMapLoaded(event) {
      // Establecer referencia al mapa en componente y store global si es necesario
      this.map = event.map;
      this.$store.map = event.map;
 this.$nextTick(() => {
        this.map.resize();
      });
      // Cargar todas las imágenes necesarias antes de configurar las capas
      this.loadImages(() => {
        // Una vez que las imágenes estén cargadas, configurar las capas
        this.setupAirportLayer(); // Configurar la capa de aeropuertos primero
        // this.setupFlightLayers(); // Configurar las capas de vuelos después
        this.map.on('click', 'aeropuertosLayer', this.onAirportClick);
        this.map.on('mouseenter', 'aeropuertosLayer', this.onAirportMouseEnter);
        this.map.on('mouseleave', 'aeropuertosLayer', this.onAirportMouseLeave);

      });
      this.map.on('mouseenter', 'aeropuertosLayer', () => {
    this.map.getCanvas().style.cursor = 'pointer';
  });

  this.map.on('mouseleave', 'aeropuertosLayer', () => {
    this.map.getCanvas().style.cursor = '';
  });
    },


    setupAirportLayer() {
      if (!this.map.getSource('aeropuertos')) {
        this.map.addSource('aeropuertos', {
          type: 'geojson',
          data: this.geojsonAeropuertos
        });
      }

      if (!this.map.getLayer('aeropuertosLayer')) {
        this.map.addLayer({
          id: 'aeropuertosLayer',
          type: 'symbol',
          source: 'aeropuertos',
          layout: {
            'icon-image': ['get', 'icon-image'],
            'icon-size': 1.0,
            'icon-allow-overlap': true
          }
        });
      }
    },


    iniciarSimulacion() {
      let vue = this;
    },

    confirmarPlanificacion() {
    this.showConfirmarFechaModal = false;
    this.iniciarPlanificacion();
  },
  actualizarContadoresVuelos() {

    const now = this.simulationDateTime.getTime();
  //  console.log(`Tiempo de simulación actual actualizar vuelos: ${new Date(now).toISOString()}`);

    this.pendingFlights.forEach(vuelo => {
      const vueloStartTime = new Date(vuelo.fechaHoraSalidaGMT0).getTime();
      const vueloEndTime = new Date(vuelo.fechaHoraLlegadaGMT0).getTime();
      const cincoHorasEnMilisegundos = 5 * 60 * 60 * 1000; // 5 horas convertidas a milisegundos
      const nuevoVueloStartTimeSalida = new Date(vueloStartTime - cincoHorasEnMilisegundos);
      const nuevoVueloStartTimeLlegada = new Date(vueloEndTime - cincoHorasEnMilisegundos);
   //   console.log(`Tiempo de simulación actual actualizar vuelos SALIDA: ${new Date(nuevoVueloStartTimeSalida).toISOString()}`);
  //    console.log(`Tiempo de simulación actual actualizar vuelos LLEGADA: ${new Date(nuevoVueloStartTimeLlegada).toISOString()}`);
      if (now >= nuevoVueloStartTimeSalida && now <= nuevoVueloStartTimeLlegada) {
        
        if (vuelo.fechaSalida.length === 10) { // Inicialización
          vuelo.fechaSalida = "LISTO";
          this.cantidadVuelosMovimiento++;
          this.capacidadCargaUsadoTotal += vuelo.capacidadCargaUsado;
          this.capacidadCargaMaximaTotal += vuelo.capacidadCargaMaxima;
       
      }
      
    }
    else if (now > nuevoVueloStartTimeLlegada){
   //   console.log(`ENTRO CONDICIONAL ${new Date(nuevoVueloStartTimeLlegada).toISOString()}`);
      if (vuelo.fechaSalida.length === 5) { // Si está en movimiento
     //           console.log(`ENTRO MOVIMIENTO NEGATIVO ${new Date(now).toISOString()}`);
                vuelo.fechaSalida = "LISTOLISTO";
            this.cantidadVuelosMovimiento--;
            this.capacidadCargaUsadoTotal -= vuelo.capacidadCargaUsado;
            this.capacidadCargaMaximaTotal -= vuelo.capacidadCargaMaxima;
      }
      }

    });

  },
    async iniciarPlanificacion() {

      this.isDateInputDisabled = true;
      this.isButtonDisabled = true;
      this.isButtonDisabledSeparar = true;
      this.showFullscreenButton = true;

      

      try {
        let cont = 0;

        this.planificacionBotonTexto = `Esperando ... ${(this.progresoPlanificacion * 100).toFixed(2)}%`;
        this.planificacionEnEspera = true;

        const fechaInicio = this.fecha_inicio_simulacion;
        const fechaInicioHora = "00:00"; // Ensure it is always "00:00"
        const separarPaquetesCont = this.separarPaquetes === 'true';
        const tamanoGrupoCont = separarPaquetesCont ? this.tamanoGrupo : 0;
        cont = 1;
        const response = await axios.get(urlBase +'/api/simulacion/semanal/iniciarST', {
          params: {
            fecha: fechaInicio,
            hora: fechaInicioHora,
            separarPaquetes: separarPaquetesCont,
            tamanoGrupo: tamanoGrupoCont,
            saltoTemporal: saltoTemporalAux
          }
        });

   //     await this.delay(delayAux); 


        console.log("Simulación iniciada:", response.data);
     //   await this.checkSimulationStatus();
        this.currentDateTimeAux = new Date(`${fechaInicio}T${fechaInicioHora}:00Z`);
        this.currentDate = fechaInicio;
        this.currentHour = fechaInicioHora;

        if (!this.fecha_inicio_simulacion) {
          console.error("Fecha de inicio de simulación no está definida");
          return;
        }

        this.simulationDateTime = new Date(`${fechaInicio}T${fechaInicioHora}:00Z`);


let progressInterval = setInterval(async () => {
  const statusResponse = await axios.get(urlBase+'/api/simulacion/semanal/estado');
  console.log("Estado de la simulación:", statusResponse.data);
  this.progresoPlanificacion = statusResponse.data.progreso;
  this.planificacionBotonTexto = `Esperando ... ${(this.progresoPlanificacion * 100).toFixed(2)}%`;

  if (statusResponse.data.progreso === 1.0 || statusResponse.data.estado.includes("Terminado")) {
    clearInterval(progressInterval); // Detener el reloj de progreso una vez que la planificación esté completa
    this.startSimulationLoop(fechaInicio, fechaInicioHora); // Iniciar el loop de simulación
  }
}, 1000); // Actualizar cada segundo

      } catch (error) {
        console.error("Error iniciando simulación:", error);
        this.planificacionBotonTexto = 'Iniciar Planificación';
        this.planificacionEnEspera = false;
        this.isButtonDisabled = false;  // Habilitar el botón si ocurre un error
      }
    },


    startSimulationLoop(fechaInicio, fechaInicioHora) {


      this.updateCurrentDateTimeDisplay();
      if (this.simulationInterval) {
       // clearInterval(this.simulationInterval);
      }
      let initialExecution = true; // Variable de control
      this.simulationInterval = setInterval(async () => {


          //clearInterval(this.simulationInterval);
          this.planificacionBotonTexto = 'Iniciar Planificación';
          this.planificacionEnEspera = false;
          this.planificacionEnEsperaCancelar = true; // Mostrar el botón "Cancelar"
          this.planificacionEnEsperaDetener = true;
          this.toggleIniciarDetener = true; // Mostrar el botón de "Iniciar Simulación"
          this.validarFechaIniciarPlanificacion = false;
          this.isButtonDisabled = false;
          this.showFullscreenButton = true;

          // AQUI COMIENZA LA SIMULACION
          let vue = this;
          //vue.toggleIniciarDetener = false;
          this.validarFechaIniciarPlanificacion = false;
          vue.toggleReanudar = false;
          this.isAnimating = true;
          this.searchEnabled = true;
          if (!this.isSimulating) {
            await this.fetchSimulationResults(fechaInicio, fechaInicioHora);
            this.isSimulating = true;


           // this.simulationDateTime = new Date(this.simulationDateTime.getTime() + 360000); // Avanzar 1 hora en tiempo simulado
            this.updateCurrentDateTimeDisplay();

            this.updateAirportData();

         //   this.checkAndAnimateFlights();
   

          } else {
     
            if (initialExecution) {
      this.currentDateTimeAux.setUTCHours(this.currentDateTimeAux.getUTCHours() + 1);
      this.currentDate = this.currentDateTimeAux.toISOString().split('T')[0];
      this.currentHour = this.currentDateTimeAux.toISOString().split('T')[1].substring(0, 5);
      await this.continuarSimulacion(this.currentDate, this.currentHour);
      initialExecution = false; // Asegura que solo se ejecute una vez
    }
            
            this.simulationDateTime = new Date(this.simulationDateTime.getTime() + 360000); // Avanzar 1 hora en tiempo simulado
            this.updateCurrentDateTimeDisplay(); 

            this.updateAirportData();
            this.actualizarContadoresVuelos();
            const endDate = new Date(this.fecha_inicio_simulacion);
            endDate.setDate(endDate.getDate() + 7);
            const endDateAux = new Date(this.fecha_inicio_simulacion);
            endDateAux.setDate(endDateAux.getDate() + 9);
            if (this.simulationDateTime < endDate) {
              if (this.simulationDateTime.getMinutes() % 60 === 0) {
                await this.fetchSimulationResultsContinuar(this.currentDate, this.currentHour);

                await this.updateSimulationHourly();

              }
              this.checkAndAnimateFlightsContinuar();
            }
            
            else if (this.simulationDateTime >= endDateAux) {
              clearInterval(this.simulationInterval);
            }
            else if(this.simulationDateTime>= endDate){
              await this.finalizarSimulacion();
              await this.cancelarSimulacion();
            }
            
          }

      }, 1000); // Ejecutar cada segundo en tiempo real
    },



    async continuarSimulacion(fecha, hora) {

      const separarPaquetesCont = this.separarPaquetes === 'true';
      const tamanoGrupoCont = separarPaquetesCont ? this.tamanoGrupo : 0;

      try {
        const response = await axios.get(urlBase + '/api/simulacion/semanal/continuarST', {
          params: {
            fecha: fecha,
            hora: hora,
            separarPaquetes: separarPaquetesCont,
            tamanoGrupo: tamanoGrupoCont,
            saltoTemporal: saltoTemporalAux
          }
        });
        console.log(`Simulación continuada para ${fecha} ${hora}:`, response.data);

      } catch (error) {
        console.error(`Error continuando simulación para ${fecha} ${hora}:`, error);
      }



    },




    async finalizarSimulacion() {
  try {
    const response = await axios.get(urlBase + '/api/simulacion/semanal/finalizarST');
    console.log("Simulación finalizada:", response.data);
    
    this.totalEnvios = response.data.totalEnvios;
    this.totalPaquetes = response.data.totalPaquetes;
    this.fechaHoraInicio = response.data.fechaHoraInicio;
    this.totalVuelos = response.data.totalVuelos
    
    this.showFinalizationModal = true; // Mostrar la ventana emergente
  } catch (error) {
    console.error("Error finalizando la simulación:", error);
  }
}, 
closeFinalizationModal() {
      this.showFinalizationModal = false;
    },

    reloadPage() {
      window.location.reload();
    },
    async checkSimulationStatus() {
      try {
        const response = await axios.get(urlBase + '/api/simulacion/semanal/estado');
        console.log("Estado de la simulación:", response.data);
        // Manejar la respuesta de estado si es necesario
      } catch (error) {
        console.error("Error verificando estado de simulación:", error);
      }
    },

    async fetchSimulationResults(fecha, hora) {
      try {
        const response = await axios.get(urlBase + '/api/simulacion/semanal/resultados');
        console.log("Resultados de la simulación:", response.data);
        const fetchedVuelos = response.data.vuelosOrdenadoGMT0;

        console.log("Vuelos disponibles SACADOS:", fetchedVuelos);
        let filteredVuelos = [];
        this.pendingFlights = [];
        this.allVuelos = [];
        let count = 0;

        // Procesar los vuelos en vuelosOrdenadoGMT0
        fetchedVuelos.forEach(vuelo => {
          vuelo.animated = false; // Agregar propiedad animated
          vuelo.movimiento = false;
          filteredVuelos.push(vuelo);
          
          this.pendingFlights.push(vuelo);
          this.allVuelos.push(vuelo); // Acumular vuelos
          
          count++;
        });

        // Ordenar los vuelos por fecha y hora de salida
        filteredVuelos.sort((a, b) => new Date(a.fechaHoraSalidaGMT0) - new Date(b.fechaHoraSalidaGMT0));

        console.log("CUENTA ACTUALIZADOS:" + count);
        this.vuelosOrdenadoGMT0 = filteredVuelos;
        // this.filteredVuelos = filteredVuelos; // Actualizar el estado de filteredVuelos aquí
        this.$set(this, 'filteredVuelos', filteredVuelos);
        console.log("Vuelos disponibles ACTUALIZADOS:", filteredVuelos);
       
        console.log("Contenido de allVuelos después de fetchSimulationResults:", this.allVuelos);
      } catch (error) {
        console.error("Error obteniendo resultados de la simulación:", error);
      }
    },



    async fetchSimulationResultsContinuar(fecha, hora) {
      try {
        const response = await axios.get(urlBase + '/api/simulacion/semanal/resultados');
        console.log("Resultados de la simulación:", response.data);
        const fetchedVuelos = response.data.vuelosOrdenadoGMT0;

        console.log("Vuelos disponibles SACADOS:", fetchedVuelos);
        //  let filteredVuelos = [];
        //   this.pendingFlights = [];
        let count = 0;
        this.allVuelos = fetchedVuelos;
        // Procesar los vuelos en vuelosOrdenadoGMT0
        fetchedVuelos.forEach(vuelo => {
          vuelo.animated = false; // Agregar propiedad animated
          vuelo.movimiento = false;
          //  filteredVuelos.push(vuelo);
          this.pendingFlights.push(vuelo);
        //  this.allVuelos.push(vuelo); // Acumular vuelos
        
          count++;
        });

        // Ordenar los vuelos por fecha y hora de salida
        this.vuelosOrdenadoGMT0.sort((a, b) => new Date(a.fechaHoraSalidaGMT0) - new Date(b.fechaHoraSalidaGMT0));

        console.log("CUENTA ACTUALIZADOS:" + count);
        console.log("Contenido de allVuelos después de fetchSimulationResultsContinuar:", this.allVuelos);
        console.log("Contenido de pendingFlights después de fetchSimulationResultsContinuar:", this.pendingFlights);
      } catch (error) {
        console.error("Error obteniendo resultados de la simulación:", error);
      }
    },



    checkAndAnimateFlightsContinuar() {

      
      const currentTime = this.simulationDateTime.getTime();
      console.log(`Tiempo de simulación actual: ${new Date(currentTime).toISOString()}`);

      this.allVuelos.forEach(vuelo => {
        const vueloStartTime = new Date(vuelo.fechaHoraSalidaGMT0).getTime();

        const cincoHorasEnMilisegundos = 5 * 60 * 60 * 1000; // 5 horas convertidas a milisegundos
        const nuevoVueloStartTime = new Date(vueloStartTime - cincoHorasEnMilisegundos);
        if (currentTime >= nuevoVueloStartTime && !vuelo.animated) {
          vuelo.animated = true; // Marcar el vuelo como animado
          console.log(`Animando vuelo con ID ${vuelo.id} a las ${new Date(vueloStartTime).toISOString()}`);
          vuelo.isActive = false;
          this.animateFlight(vuelo);
        }
      });
      this.allVuelos = this.allVuelos.filter(vuelo => !vuelo.animated); // Remover los vuelos animados

      // Call animateVisibleFlights periodically

      this.animateVisibleFlights();

    },




    calculateBearing(begin, end) {
  const lat = Math.abs(begin[1] - end[1]);
  const lng = Math.abs(begin[0] - end[0]);

  if (begin[1] < end[1] && begin[0] < end[0]) {
    return (Math.atan(lng / lat) * 180) / Math.PI;
  } else if (begin[1] >= end[1] && begin[0] < end[0]) {
    return ((90 - (Math.atan(lng / lat) * 180) / Math.PI) + 90);
  } else if (begin[1] >= end[1] && begin[0] >= end[0]) {
    return ((Math.atan(lng / lat) * 180) / Math.PI + 180);
  } else if (begin[1] < end[1] && begin[0] >= end[0]) {
    return ((90 - (Math.atan(lng / lat) * 180) / Math.PI) + 270);
  }
  return -1;
},
    animateFlight(vuelo) {
      if (vuelo.capacidadCargaUsado > vuelo.capacidadCargaMaxima) {

        this.collapseReason = 'EXCESO DE PAQUETES EN VUELOS';
        console.log("Collapse detected!");
        //this.showCollapseAlert("collapseReason", "llapseDetails");
        this.handleCollapse();
        return; //AVISO CON ESTO SE PODRIA PARAR EL MOVIMIENTO
      }
      // console.log(`Updating capacities for ${vuelo.ciudadDestino} with ${cantidadPaquetes} packages`);

      //this.updateAirportCapacitiesColapse(vuelo.ciudadDestino, vuelo.cantidadPaquetes);

      const sourceId = `vuelo-${vuelo.id}`;
      const bearing = this.calculateBearing(vuelo.origen, vuelo.destino, vuelo.id);
      if (!this.map.getSource(sourceId)) {
      //  console.log(`Updating source ${sourceId}`);
        this.map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {
              id: vuelo.id,
              'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
              'icon-rotate': bearing // Calculate bearing and set icon rotation

            },
            geometry: {
              type: 'Point',
              coordinates: vuelo.origen
            }
          }
        });
        this.map.addLayer({
          id: `avion-${vuelo.id}`,
          type: 'symbol',
          source: sourceId,
          layout: {
            'icon-image': ['get', 'icon-image'],
            'icon-size': 0.3,
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'icon-rotate'] // Use icon-rotate property
          }
        });

        this.map.on('click', `avion-${vuelo.id}`, this.onFlightClick);
      }


      const flightDurationMinutes = this.parseDurationToMinutes(vuelo.tiempoEstimadoVuelo);
      const flightDurationSimulationSeconds = flightDurationMinutes * 60;
      const realTimeSeconds = flightDurationSimulationSeconds / 360;  // Convert to real time seconds based on 2160 simulated seconds = 1 real second


     // console.log(flightDurationMinutes)
      const steps = 50; // MEJORA VISULAZCION PERO SE DESFASA ALGO EL TIEMPO PERO SE VE MAS RAPIDO
      const interval = (realTimeSeconds * 1000) / steps;
      //console.log(steps)
      // let steps =336;
      let currentStep = vuelo.pausedAtStep || 0; // Usa pausedAtStep si existe
      let currentPos = vuelo.pausedAtPos || [...vuelo.origen];
      const incrementLat = (vuelo.destino[1] - vuelo.origen[1]) / steps;
      const incrementLng = (vuelo.destino[0] - vuelo.origen[0]) / steps;

      const move = () => {
        if (!this.isAnimating) {
          vuelo.pausedAtStep = currentStep; // Guarda el paso actual
          vuelo.pausedAtPos = currentPos; // Guarda la posición actual
          vuelo.paused = true;
          return; // Sal de la animación si está en pausa
        }
        vuelo.paused = false;
        vuelo.currentStep = currentStep;
        vuelo.currentPos = currentPos;
        if (currentStep <= steps) {
          currentPos[0] += incrementLng;
          currentPos[1] += incrementLat;
          if (this.map.getSource(sourceId)) {
            this.map.getSource(sourceId).setData({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: currentPos
              },
              properties: {
                id: vuelo.id,
                'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
                'icon-rotate': bearing // Update rotation dynamically
              }
            });
          }
          currentStep++;
          //  requestAnimationFrame(move);
          setTimeout(move, interval);
        } else {
          // Ensure the final position is the exact destination
          if (this.map.getSource(sourceId)) {
            this.map.getSource(sourceId).setData({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: vuelo.destino
              },
              properties: {
                id: vuelo.id,
                'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
                'icon-rotate': bearing
              }
            });
          }
          setTimeout(() => {
            if (this.map.getLayer(`avion-${vuelo.id}`)) {
              this.map.removeLayer(`avion-${vuelo.id}`);
            }
            if (this.map.getSource(sourceId)) {
              this.map.removeSource(sourceId);
            }
          }, 1000); // Add a delay to ensure the final position is updated before removing REMUEVE EL AVION 1 SEGUNDO DESPUES
        }



      };
      move();
    },

    updateAirportCapacitiesColapse(codigoOACI, paquetes) {
      this.collapseReason = 'EXCESO DE PAQUETES EN AEROPUERTOS';
      const aeropuerto = aeropuertos.find(a => a.codigoOACI === codigoOACI);
      if (aeropuerto) {
        aeropuerto.capacidadDeAlmacenamientoUsado += paquetes;
      //  console.log(`New storage used: ${aeropuerto.capacidadDeAlmacenamientoUsado}/${aeropuerto.capacidadAlmacenamientoMaximo}`);
        if (aeropuerto.capacidadDeAlmacenamientoUsado > aeropuerto.capacidadAlmacenamientoMaximo) {
        //  console.log("Airport collapse detected!");
          const collapseReason = 'Exceso de paquetes';
          const collapseDetails = {
            location: 'Lima, Perú - SMTP',
            packagesInvolved: '956'
          };
          this.showModal();
        }
      }
    },

    checkForCollapse() {
      console.log("Checking for collapse...");
      if (aeropuertos.some(aero => aero.capacidadDeAlmacenamientoUsado > aero.capacidadAlmacenamientoMaximo) ||
        envios.some(envio => envio.ruta.vuelos.some(vuelo => vuelo.capacidadCargaUsado > vuelo.capacidadCargaMaxima))) {
        console.log("Collapse detected!");
        this.showModal();
      }
    },



    parseDurationToMinutes(duration) {
      const regex = /PT(\d+H)?(\d+M)?/;
      const matches = duration.match(regex);
      const hours = parseInt(matches[1] || 0, 10);
      const minutes = parseInt(matches[2] || 0, 10);
      return (hours * 60) + minutes;
    },




    validarFechaIniciarPlanificacion() {
    if (!this.fecha_inicio_simulacion) {
      this.showFechaInvalidaModal = true;
    } else {
      this.showConfirmarFechaModal = true;
    }
  },
    closeFechaInvalidaModal() {
      this.showFechaInvalidaModal = false;
      this.isButtonDisabled = false;
      //  this.isDateInputDisabled = true;
    },




    showModal() {
      this.isModalVisible = true;
      this.isVisible = true;
      this.isVisibleResumen = true;
    },

    handleCollapse() {
      console.log("Collapse detected!");
      this.isSimulating = false; // Detener la simulación
      this.showModal();

    },
    closeCollapseModal() {
      this.isVisible = false;
    },

    detenerSimulacion() {
      this.showDetenerModal = false;
      let vue = this;
      clearInterval(this.simulationInterval);
      this.planificacionEnEsperaDetener = false;
      this.planificacionEnEsperaRenaudar = true;
      this.simulationInterval = null;
      vue.toggleIniciarDetener = false;
      vue.toggleReanudar = true;
      this.isAnimating = false;
      this.searchEnabled = true;
      this.pendingFlights.forEach(vuelo => {
        if (vuelo.animated && !vuelo.paused) {
          vuelo.paused = true;
          vuelo.pausedAtStep = vuelo.currentStep;
          vuelo.pausedAtPos = vuelo.currentPos;
          this.movingFlights.push(vuelo); // Agregar vuelo en movimiento a la estructura
        }
      });




    },
    reanudarSimulacion() {
      const fechaInicio = this.fecha_inicio_simulacion;
        const fechaInicioHora = "00:00"; // Ensure it is always "00:00"
      this.showReanudarModal = false;
      this.planificacionEnEsperaDetener = true;
      this.planificacionEnEsperaRenaudar = false;
      let vue = this;
      vue.toggleIniciarDetener = false;
      vue.toggleReanudar = true;
      this.isAnimating = true;
      if (!this.simulationInterval && this.simulationDateTime) {
        this.startSimulationLoop(fechaInicio,fechaInicioHora); // Reanudar la simulación desde el punto donde se detuvo
        this.movingFlights.forEach(vuelo => {
          vuelo.paused = false;
          this.animateFlight(vuelo);
        });

        this.movingFlights = [];

      }

    },

    downloadWord() {
    const content = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>Simulación Reporte</title></head><body>
      <h1>Simulación Finalizada</h1>
      <p><strong>Total de Envíos:</strong> ${this.totalEnvios} envíos</p>
      <p><strong>Total de Paquetes:</strong> ${this.totalPaquetes} paquetes</p>
      <p><strong>Fecha y Hora de Inicio:</strong> ${this.formatDateTime(this.fechaHoraInicio)} UTC</p>
      <p><strong>Fecha y Hora Fin:</strong> ${this.formatDateTimeGMT0(this.currentDateTime)}</p>
      <p><strong>Cantidad de vuelos:</strong> ${this.totalVuelos} vuelos</p>
      </body></html>`;
    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'simulacion_reporte.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
    formatDateTimeGMT0(dateTime) {

    
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return dateTime.toLocaleString('es-ES', options).replace(',', ' -');
    },

    async cancelarSimulacion() {
      this.showCancelarModal = false;
      this.planificacionEnEsperaCancelar = false;
      this.planificacionEnEsperaRenaudar = false;
      this.planificacionEnEsperaDetener = false;
      this.showFullscreenButton = false;
      let vue = this;
      // vue.toggleIniciarDetener = true;
      console.log("SE DETIENE LA SIMULACION");
      await this.finalizarSimulacion();
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      this.isSimulating = false;
      Simulation.stopSimulation();
      console.log(vue.fecha_fin_simulacion);
      this.validarFechaIniciarPlanificacion = true;
      this.isDateInputDisabled = false;

      this.filteredVuelos.forEach(vuelo => {
        const sourceId = `vuelo-${vuelo.id}`;
        if (this.map.getLayer(`avion-${vuelo.id}`)) {
          this.map.removeLayer(`avion-${vuelo.id}`);
        }
        if (this.map.getSource(sourceId)) {
          this.map.removeSource(sourceId);
        }
      });
      this.fetchAeropuertos();
      this.isButtonDisabled = false;  // Habilitar el botón de planificación
      this.simulationDateTime = null;
      this.envios = [];
      this.calendarioVuelos = {};
      this.pendingFlights = [];
        // Mostrar la ventana emergente con los datos de finalización
  this.showFinalizationModal = true;

    
    },

    onAirportClick(event) {
      const feature = event.features[0];

      const aeropuerto = this.aeropuertos.find(a => a.codigoOACI === feature.properties.codigoOACI);

      if (aeropuerto) {
        this.openModals.push({
          id: aeropuerto.id,
          data: aeropuerto
        });
      }
    },
    closeAirportModal(id) {
      this.openModals = this.openModals.filter(modal => modal.id !== id);
    },

    onFlightClick(event, vuelo) {

      const vueloId = event.features[0].properties.id;
      console.log(event.features[0].properties.id)
  // Combina both pendingFlights and filteredVuelos into one array
  const allFlights = [...this.pendingFlights, ...this.filteredVuelos];
  
  // Busca el vuelo en el array combinado
  const clickedVuelo = allFlights.find(v => v.id === vueloId);
    if (clickedVuelo) {
      this.openFlightModals.push({
        id: `${vueloId}-${new Date().getTime()}`,
        data: clickedVuelo
      });
    } else {
      console.error("No se encontró el vuelo clicado en filteredVuelos");
    }
    },
    closeFlightModal(id) {
      this.openFlightModals = this.openFlightModals.filter(modal => modal.id !== id);
    },

    formatDuration(duration) {
      const regex = /PT(\d+H)?(\d+M)?/;
      const matches = duration.match(regex);
      const hours = parseInt(matches[1] || 0, 10);
      const minutes = parseInt(matches[2] || 0, 10);
      return `${hours} horas y ${minutes} minutos`;
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleString('es-ES', options).replace(',', ' -');
    },


 
    async buscarAeropuerto() {
    if (this.busquedaAeropuerto.trim() !== '') {
      const cadena = this.busquedaAeropuerto;
      const fechaHora = new Date(this.currentDateTime);
      console.log(`FECHA BUSQUEDA AEROPUERTO ${new Date(fechaHora).toISOString()}`);
      const fecha = fechaHora.toISOString().split('T')[0];
      const hora = fechaHora.toTimeString().split(' ')[0].substring(0, 5);
      try {
        const response = await axios.get(urlBase + `/api/simulacion/semanal/aeropuerto?cadena=${cadena}&fecha=${fecha}&hora=${hora}`);
        this.resultadosBusqueda = response.data;
        
      } catch (error) {
        console.error("Error fetching aeropuertos:", error);
      }
    } else {
      this.resultadosBusqueda = [];
    }
  },

  async buscarEnvio() {
    if (this.busquedaEnvio.trim() !== '') {
      const cadena = this.busquedaEnvio;
      const fechaHora = new Date(this.currentDateTime);
      console.log(`FECHA BUSQUEDA ENVIO ${new Date(fechaHora).toISOString()}`);
      const fecha = fechaHora.toISOString().split('T')[0];
      const hora = fechaHora.toTimeString().split(' ')[0].substring(0, 5);
      try {
        const response = await axios.get(urlBase + `/api/simulacion/semanal/paquete?fecha=${fecha}&hora=${hora}&cadena=${cadena}`);
        this.resultadosBusquedaEnvio = response.data;
      } catch (error) {
        console.error("Error fetching envios:", error);
      }
    } else {
      this.resultadosBusquedaEnvio = [];
    }
  },

  async buscarVuelo() {
    if (this.busquedaVuelo.trim() !== '') {
      const cadena = this.busquedaVuelo;
      try {
        const response = await axios.get(urlBase + `/api/simulacion/semanal/vuelo`, {
          params: { cadena: cadena }
        });
        this.resultadosBusquedaVuelo = response.data ? [response.data] : [];
      } catch (error) {
        console.error("Error fetching vuelos:", error);
      }
    } else {
      this.resultadosBusquedaVuelo = [];
    }
  },
  abrirModal(aeropuerto) {
      this.openModals.push({
        id: aeropuerto.id,
        data: aeropuerto
      });
    },
    abrirEnvioModal(envio) {
      this.openEnvioModals.push({
        id: envio.id,
        data: envio
      });
    },
    abrirVueloModal(vuelo) {
      this.openFlightModals.push({
        id: vuelo.id,
        data: vuelo
      });
    },
    closeEnvioModal(id) {
      this.openEnvioModals = this.openEnvioModals.filter(modal => modal.id !== id);
    }


  },
  computed: {

    filteredVuelos() {
      const filtered = [];

      Object.keys(this.calendarioVuelos).forEach(fecha => {
        const vuelosDelDia = this.calendarioVuelos[fecha];
        vuelosDelDia.forEach(vuelo => {
          filtered.push(vuelo);
        });
      });

      return filtered;
    }
  }

}
</script>
<style scoped>
.datetime-display {
  position: absolute;
  top: 10px;
  right: 10px;

  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1001;
  /* Asegúrate de que esté visible sobre el mapa */
  font-size: 1.5em;
  /* Increase font size */
  font-weight: bold;
  /* Make the text bold */
}

.map-container {
  position: relative;
  height: calc(100vh - 100px);
  /* Ajusta esta altura según tus necesidades */
  width: 100%;

}

.map-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  color: #fff;
  text-align: center;
}

.map-title {
  font-size: 1.5em;
}

.map-tagline {
  font-size: 1em;
}



.search-input {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

.main-map {
  width: 100% !important;
  height: 100% !important;
}

.map-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  height: 100%;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
}


.brand-title {
  font-size: 1em;
  /* Ajusta el tamaño como desees */
  color: #fff;
  /* Color para 'Redex' */
  font-weight: bold;
}

.brand-title-point {
  font-size: 1em;
  /* Asegúrate de que sea del mismo tamaño que .brand-title para alineación adecuada */
  color: #00B074;
  /* Color para el punto */
  font-weight: bold;
}

.brand-tagline {
  font-size: 1em;
  /* Ajusta el tamaño del tagline */
  color: #B9BBBD;
  /* Color para 'Always on Time' */
  font-weight: bold;
  margin-bottom: 199px;
  display: flex;
  align-items: baseline;
  /* Alinea correctamente el texto y el punto */
  gap: 0.2em;
  /* Ajusta el espacio entre 'Redex' y el punto */
}

/* Si deseas que 'Redex.' esté en una sola línea, puedes usar display: flex en el contenedor */
.brand {
  display: flex;
  align-items: baseline;
  /* Alinea correctamente el texto y el punto */
  gap: 0.2em;
  /* Ajusta el espacio entre 'Redex' y el punto */

  margin-bottom: -5px;
  /* Ajusta esto para aumentar el espacio entre el título y el subtítulo */

}





.map-legend {
  color: black;
  /* Cambia el color de texto a negro */
  position: absolute;
  bottom: 120px;
  right: 20px;
  z-index: 1000;
  background: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.legend-toggle {
  background: #333;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
}

.legend-content {
  color: black;
  list-style: none;
  padding: 0;
  margin: 0;
  /* Remove margin-top when visible */
  display: none;
  /* Hidden by default */
}

.legend-content li {
  color: black;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.dot {

  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}

.less-50 {
  background: red;
}

.between-50-80 {
  background: orange;
}

.greater-80 {
  background: green;
}

.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 10px;
}

.modal-content {
  background: white;
  /* Fondo blanco para alto contraste */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
  /* Color de texto general a negro */
  width: auto;
  max-width: 500px;
  /* Ajusta el ancho máximo según necesites */
  text-align: left;
  /* Asegura que el texto esté alineado a la izquierda */
}

.modal-content h2 {
  color: red;
  /* Color rojo para el título del colapso */
  font-weight: bold;
  margin: 0 auto;
  /* Centra la imagen */
}

.modal-content strong {
  color: red;
  /* Color rojo para las palabras clave */
  font-weight: bold;
}

.modal-content p,
.modal-content ul {
  color: black;
  /* Resto del texto en negro */
}

.modal-button {
  background-color: red;
  /* Fondo rojo para el botón */
  color: white;
  /* Texto blanco para el botón */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  /* Espaciado superior para separarlo del contenido */
  font-weight: bold;
}

.modal-button:hover {
  background-color: darkred;
  /* Un rojo más oscuro al pasar el mouse */
}

.modal-content li strong {
  color: black;
  /* Cambia el color de los términos clave a negro */
  font-weight: normal;
  /* Si deseas que no sean bold */
}

.modal-content li {
  color: black;
  /* Todos los textos de los items en negro */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  /* Alto z-index para asegurar que está sobre otros elementos */
}

.collapse-icon {
  background-image: url('/img/carita.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 50px;
  /* Ajusta el tamaño según tus necesidades */
  height: 50px;
  /* Ajusta el tamaño según tus necesidades */
  display: block;
  margin: 0 auto;
  /* Centra la imagen */
}





.modal-content-airport {
  background: white;
  /* Fondo blanco para alto contraste */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
  /* Color de texto general a negro */
  width: auto;
  max-width: 500px;
  /* Ajusta el ancho máximo según necesites */
  text-align: left;
  /* Asegura que el texto esté alineado a la izquierda */
  display: flex;
  flex-direction: column;
  /* Alinea el contenido verticalmente */
  align-items: left;
  /* Centra horizontalmente el contenido */
}

.modal-content-airport h2 {
  color: #00B074;
  /* Color verde para el título del colapso */
  font-weight: bold;
  margin: 0 auto;
  /* Centra la imagen */
}

.modal-content-airport strong {
  color: #00B074;
  /* Color verde para las palabras clave */
  font-weight: bold;
}

.modal-content-airport p,
.modal-content-airport ul {
  color: black;
  /* Resto del texto en negro */
}

.modal-button-airport {
  background-color: #00B074;
  /* Fondo verde para el botón */
  color: white;
  /* Texto blanco para el botón */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  /* Espaciado superior para separarlo del contenido */
  font-weight: bold;
  align-self: center;
  /* Centra el botón horizontalmente */
}

.modal-button-airport:hover {
  background-color: darkgreen;
  /* Un verde más oscuro al pasar el mouse */
}

.modal-content-airport li strong {
  color: black;
  /* Cambia el color de los términos clave a negro */
  font-weight: normal;
  /* Si deseas que no sean bold */
}

.modal-content-airport li {
  color: black;
  /* Todos los textos de los items en negro */
}

.modal-overlay-airport {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  /* Alto z-index para asegurar que está sobre otros elementos */
}



.modal-content-flight {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
  width: auto;
  max-width: 500px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: left;
}

.modal-content-flight h2 {
  color: #00B074;
  font-weight: bold;
  margin: 0 auto;
}

.modal-content-flight strong {
  color: #00B074;
  font-weight: bold;
}

.modal-content-flight p,
.modal-content-flight ul {
  color: black;
}

.modal-button-flight {
  background-color: #00B074;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  align-self: center;
}

.modal-button-flight:hover {
  background-color: darkgreen;
}

.modal-overlay-flight {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}



.button-disabled {
  background-color: #cccccc;
  /* Color de fondo para el botón deshabilitado */
  color: #000000 !important;
  /* Color del texto para el botón deshabilitado */
  cursor: not-allowed;
  /* Cambiar el cursor para el botón deshabilitado */
  opacity: 0.6;
  /* Reducir la opacidad para el botón deshabilitado */
}

/* Asegurarse de que el texto del botón deshabilitado tenga alta visibilidad */
button[disabled] {
  color: #ffffff !important;
  /* Color del texto cuando el botón está deshabilitado */
}


.map-search-container {
  position: absolute;
  top: 60px;
  left: 10px;
  z-index: 1000;
  /* Ajusta según necesidad  width: calc(100% - 2000px); */
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
  box-sizing: border-box;
  /* Añadido para asegurar que padding se considere en el ancho total */
}

.search-input {
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background-color: white;
  color: black;
  box-sizing: border-box;
  /* Añadido para asegurar que padding se considere en el ancho total */
}

.search-results {
  width: 100%;
  /* Coincidir con el ancho del campo de búsqueda */
  max-height: 200px;
  overflow-y: auto;
  background-color: white !important;
  /* Fondo rojo para la lista */
  border: 1px solid #ccc;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 15px;
  font-weight: bold !important;
  /* Letra en negrita */
  color: black !important;
  /* Cambia el color de la letra a negro */
}

.search-result-card {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
  color: black !important;
  /* Cambia el color de la letra a negro */
  background-color: rgb(155, 152, 152) !important;
  /* Fondo rojo para el card */
  font-weight: bold !important;
  /* Letra en negrita */
}


.search-result-card:hover {
  background-color: #757373 !important;
}


.modal-content-envio {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
  width: auto;
  max-width: 500px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: left;
}

.modal-content-envio h2 {
  color: #00B074;
  font-weight: bold;
  margin: 0 auto;
}

.modal-content-envio h3 {
  color: #00B074;
  font-weight: bold;
  margin: 0 auto;
}

.modal-content-envio strong {
  color: #00B074;
  font-weight: bold;
}

.modal-content-envio p,
.modal-content-envio ul {
  color: black;
}


.modal-button-envio {
  background-color: #00B074;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  align-self: center;
}



.modal-button-envio:hover {
  background-color: darkgreen;
}

.modal-overlay-envio {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}




.modal-content-envio hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 20px 0;
}

.modal-content-envio p {
  margin: 5px 0;
}





@media (max-width: 1200px) {
  .map-search-container {
    width: calc(100% - 2000px);
    /* Ajusta el ancho para pantallas medianas */
    left: 10px;
    right: 10px;
  }

  .search-input {
    width: calc(100% - 2000px);
    /* Ajusta el ancho para pantallas medianas */
    margin-bottom: 10px;
  }
}

@media (max-width: 768px) {
  .map-search-container {
    width: calc(100% - 2000px);
    /* Ajusta el ancho para pantallas pequeñas */
    left: 10px;
    right: 10px;
  }

  .search-input {
    width: calc(100% - 2000px);
    /* Ajusta el ancho para pantallas pequeñas */
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .map-search-container {
    width: calc(100% - 2000px);
    /* Ocupa casi todo el ancho en pantallas muy pequeñas */
    left: 10px;
    right: 10px;
  }

  .search-input {
    width: calc(100% - 2000px);
    /* Ajusta el ancho para pantallas muy pequeñas */
    margin-bottom: 10px;
  }
}

.planning-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
 
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;

  color: black;
  z-index: 1000;
  overflow: hidden;
  transition: height 0.3s ease;
}

.planning-toggle {
  background: #333;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  font-weight: bold;
}

.planning-content {
  display: none;
  margin-top: 10px;
  color: black;
  list-style: none;
  padding: 0;
  margin: 0;

}


.planning-controls .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.planning-controls label.custom-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: black;
}

.planning-controls input[type="radio"] {
  margin-right: 5px;
}

.base-input input[type="date"],
.base-input input[type="number"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-weight: bold;
  color: black;
  background-color: #f0f0f0; /* Cambia el color de fondo */
}

.base-input label {
  font-weight: bold; /* Texto en negrita */
  color: black; /* Color del texto */
}

.planning-controls input[type="number"] {
  color: black; /* Cambia el color del texto */
  background-color: #f0f0f0; /* Cambia el color de fondo */
  font-weight: bold; /* Texto en negrita */
}
.b-button {
  width: 100%;
}


.fullscreen-map {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 10000 !important;
}


.row.justify-content-between.align-items-center {
  display: flex;
  justify-content: space-between;
  align-items: center;

}


.btn-simulation-left {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 30px
}

.btn-simulation-right {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 320px; /* Added margin to separate buttons */
  
}


.btn-simulation-right-Rea {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 320px; /* Added margin to separate buttons */
}
.airport-popup {
  position: absolute;
  background: white;
  border: 1px solid black;
  padding: 5px;
  border-radius: 5px;
  z-index: 1000;
  pointer-events: none; /* Para que el popup no interfiera con otros eventos del mouse */
  transform: translate(-50%, 10px); /* Centramos el popup horizontalmente y lo colocamos debajo del icono */
}

.mapboxgl-canvas {
  cursor: pointer; /* Cambia el cursor a puntero cuando está sobre el mapa */
}
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.fullscreen-toggle {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}
.fullscreen-toggle:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.modal-content-reporte {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: black;
  width: auto;
  max-width: 600px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
}
.modal-image {

  margin-bottom: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  width: 100px;
  /* Ajusta el tamaño según tus necesidades */
  height: 25px;
  /* Ajusta el tamaño según tus necesidades */
  display: block;
  margin: 0 auto;
}

.modal-image2 {

margin-bottom: 30px;
background-size: contain;
background-repeat: no-repeat;
width: 100px;
/* Ajusta el tamaño según tus necesidades */
height: 15px;
/* Ajusta el tamaño según tus necesidades */
display: block;
margin: 0 auto;
}


.modal-content-reporte h2 {
  color: #00B074;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
}

.modal-content-reporte h3 {
  color: #00B074;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.modal-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 16px;
  border-left: 3px solid #00B074;
  border-right: 3px solid #00B074;
  border-bottom: 3px solid #00B074;
  border-top: 3px solid #00B074;
  padding-left: 10px;
}



.modal-details p {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #00B074;
  padding: 10px 20px;
}

.modal-details hr {
  width: 100%;
  border: 0;
  height: 2px;
  background: #00B074;
  margin: 10px 0;
}

.modal-details strong {
  font-weight: bold;
}

.modal-details span {
  margin-left: auto;
  margin: 0px 10px;
}

.datetime {
  margin-left: 100px;
  /* Adjust this value as needed */
}

.modal-button-reporte {
  background-color: #00B074;
  color: white;
  padding: 10px 50px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 68%;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.modal-button-reporte:hover {
  background-color: #008f63;
}
.vuelos-carga-info {
  position: absolute;
  top: 70px; /* Ajusta este valor para moverlo más abajo */
  right: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 1001;
  font-size: 1em; /* Ajuste de tamaño */
  font-weight: bold;
}

.info-toggle {
  background: #333;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.vuelos-movimiento {
  margin-bottom: 20px;
  font-size: 1.2em; 
}

.capacidad-carga {
  margin-bottom: 20px;
}



.carga-bar {
  width: 100%;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.carga-bar-inner {
  height: 15px; /* Ajuste de tamaño */
  background-color: #4caf50;
  width: 0;
}

.airplane-icon {
  background-image: url('/img/avion.png');
}

.airport-icon {
  background-image: url('/img/ubi.png');
}

.airport-green {
  background-image: url('/img/airport-green.png');
}

.airport-orange {
  background-image: url('/img/airport-orange.png');
}

.airport-red {
  background-image: url('/img/airport-red.png');
}

.flight-green {
  background-image: url('/img/flight-green.png');
}

.flight-orange {
  background-image: url('/img/flight-orange.png');
}

.flight-red {
  background-image: url('/img/flight-red.png');
}
</style>