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
      <button  class="fullscreen-toggle" @click="toggleFullscreen">
  {{ isFullscreen ? 'Salir Pantalla Completa' : 'Pantalla Completa' }}
</button>
  

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
          'icon-size': 0.5,
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
    <li><strong>Información de Aeropuertos</strong></li>
    <li><span class="icon airport-green"></span>Menor a 10%</li>
    <li><span class="icon airport-orange"></span>Entre 10% y 25%</li>
    <li><span class="icon airport-red"></span>Mayor a 25%</li>
    <li><span class="icon airport-selected-icon"></span>Aeropuerto seleccionado</li>
    <li><strong>Información de Vuelos</strong></li>
    <li><span class="icon flight-green"></span>Menor a 10%</li>
    <li><span class="icon flight-orange"></span>Entre 10% y 30%</li>
    <li><span class="icon flight-red"></span>Mayor a 30%</li>
    <li><span class="icon flight-selected-icon"></span>Vuelo seleccionado</li>
  </ul>
</div>


<div class="map-search-container">
        
        <!-- Buscadores existentes -->
        <div>
            
            <label>
              <span class="checkbox-title">Búsqueda de Paquetes</span>
            </label>
          </div>
          <div>
            
            <label>
              <span class="checkbox-title">por su código de envío</span>
            </label>
          </div>
        <input class="search-input" type="text" v-model="busquedaEnvio" @input="buscarEnvio" placeholder="Buscar paquete">
        <div v-if="resultadosBusquedaEnvio.length>0" class="search-results">
          <div v-for="envio in resultadosBusquedaEnvio" :key="envio.id" class="search-result-card" @click="mostrarEnvio(envio)">
            <p><strong>{{ envio.idEnvio }}</strong></p>
            <p>Ciudad Actual: {{ getCiudadYPais(envio.ciudadActual) }}</p>
            <p>Cantidad Paquetes: {{ envio.cantidadPaquetes }}</p>
            <p>Estado: {{ envio.estadoEnvio }}</p>
            <p>Fecha de Envío: {{ formatDateTime(envio.fechaHoraEncioGMT0) }}</p>
          </div>
        </div>
        <div>
            
            <label>
              <span class="checkbox-title">Búsqueda de Aeropuerto</span>
            </label>
          </div>
        <input class="search-input" type="text" v-model="busquedaAeropuerto" @input="buscarAeropuerto" placeholder="Buscar aeropuerto">
        <div v-if="resultadosBusqueda.length>0" class="search-results">
          <div v-for="aeropuerto in resultadosBusqueda" :key="aeropuerto.id" class="search-result-card" @click="mostrarAeropuerto(aeropuerto)">
            <p><strong>{{ aeropuerto.nombreCiudad }}, {{ aeropuerto.pais }}</strong></p>
            <p>Capacidad Máxima: {{ aeropuerto.capacidadAlmacenamientoMaximo }}</p>
            <p>Capacidad Usada: {{ aeropuerto.capacidadDeAlmacenamientoUsado }}</p>
          </div>
        </div>
        
        <div class="checkbox-group">
          <div>
            
            <label>
              <span class="checkbox-title">Tipos de Búsqueda de Vuelo</span>
            </label>
          </div>
          <div>
            
            <label>
              <input type="checkbox" v-model="buscarPorId" @change="toggleCheckbox('id')"> <span class="checkbox-label">Por Id</span>
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" v-model="buscarPorCiudadOrigen" @change="toggleCheckbox('origen')"> <span class="checkbox-label">Por el aeropuerto que salen</span>
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" v-model="buscarPorCiudadDestino" @change="toggleCheckbox('destino')"> <span class="checkbox-label">Por el aeropuerto que llegan</span>
            </label>
          </div>
        </div>
        <input class="search-input" type="text" v-model="busquedaVuelo" @input="buscarVuelo" placeholder="Buscar vuelo">
        <div v-if="resultadosBusquedaVuelo.length > 0" class="search-results">
          <div v-for="vuelo in resultadosBusquedaVuelo" :key="vuelo.id" class="search-result-card" @click="mostrarVuelo(vuelo)">
            <p><strong>Id Vuelo:</strong> {{ vuelo.id }}</p>
            <p><strong>Capacidad Máxima:</strong> {{ vuelo.capacidadCargaMaxima }}</p>
            <p><strong>Capacidad Usada:</strong> {{ vuelo.capacidadCargaUsado }}</p>
          </div>
        </div>
        <div  v-if="detalle">
        <div v-if="detalle.tipo === 'vuelo'" class="detail-container">
          <div class="modal-content-flight">
          <h2>Información del Vuelo</h2>
          <p><strong>Id:</strong> {{ detalle.datos.id }}</p>
         
          <p><strong>Aeropuerto de Salida:</strong> {{ getCiudadYPais(detalle.datos.ciudadOrigen) }}</p>
          <p><strong>Aeropuerto de Llegada:</strong> {{ getCiudadYPais(detalle.datos.ciudadDestino) }}</p>
          <p><strong>Fecha y Hora de Salida:</strong> {{ formatDateTime(detalle.datos.fechaHoraSalidaGMT0) }}</p>
          <p><strong>Fecha y Hora de Llegada:</strong> {{ formatDateTime(detalle.datos.fechaHoraLlegadaGMT0) }}</p>
          <p><strong>Tiempo Estimado de Vuelo:</strong> {{ formatDuration(detalle.datos.tiempoEstimadoVuelo) }}</p>
      <!--    <div v-if="!detalle.datos.paquetesAlmacenados || detalle.datos.paquetesAlmacenados.length === 0">
            <h3 class="paquetes-title">Paquetes:</h3>
            <p>No hay paquetes</p>
          </div>
          <div v-else>
            <h3 class="paquetes-title">Paquetes Almacenados:</h3>
            <div class="paquetes-list">
              <div v-for="paquete in detalle.datos.paquetesAlmacenados" :key="paquete.id" class="paquete-item">
                <p><strong>ID del Paquete:</strong> {{ paquete.id }}</p>
                <p><strong>ID del Envío:</strong> {{ paquete.idEnvio }}</p>
                <p><strong>Cantidad de Paquetes:</strong> {{ paquete.cantidadPaquetes }}</p>
              </div>
            </div>
          </div>-->
          <button class="modal-button-flight" @click="downloadDetails('vuelo')">Descargar</button>
          <button class="modal-button-flight" @click="detalle = null">Cerrar</button>
          
        </div>
      </div>
        <div v-if="detalle.tipo === 'aeropuerto'" class="detail-container">
          <div class="modal-content-airport">
          <h2>Información del Aeropuerto</h2>
          <p><strong>Ciudad y País</strong> {{ detalle.datos.nombreCiudad }}, {{detalle.datos.pais }}</p>
          <p><strong>Coordenadas:</strong> {{ formatCoordinates(detalle.datos.coordinates) }}</p>
      <!--    <p v-if="!detalle.datos.paquetes || detalle.datos.paquetes.length === 0"><strong>Paquetes almacenados:</strong> No hay paquetes</p>
          <div v-else>
            <h3 class="paquetes-title">Paquetes almacenados:</h3>
            <div class="paquetes-list">
              <div v-for="paquete in detalle.datos.paquetes" :key="paquete.id" class="paquete-item">
                <p><strong>ID del Paquete:</strong> {{ paquete.id }}</p>
                <p><strong>ID del Envío:</strong> {{ paquete.idEnvio }}</p>
                <p><strong>Cantidad de Paquetes:</strong> {{ paquete.cantidadPaquetes }}</p>
              </div>
            </div>
          </div>-->
          <button class="modal-button-airport" @click="downloadDetails('aeropuerto')">Descargar</button>
          <button class="modal-button-airport" @click="detalle = null">Cerrar</button>
        </div>
      </div>
      
      
        
        <div v-else-if="detalle.tipo === 'envio'" class="detail-container">
          <div class="modal-content-envio">
          <h2>Plan de Vuelo del Envío {{ detalle.datos.idEnvio }}</h2>
          <div v-if="detalle.datos.ruta && detalle.datos.ruta.vuelos && detalle.datos.ruta.vuelos.length > 0">
      
             
              <div class="paquetes-list">
                <div v-for="(vuelo, index) in detalle.datos.ruta.vuelos" :key="vuelo.id">
                  <hr>
                  <p><strong>Vuelo #</strong>{{ index + 1 }}</p>
                  <p><strong>id del vuelo</strong> {{ vuelo.id }}</p>
                <p><strong>Aeropuerto de Salida:</strong> {{ getCiudadYPais(vuelo.ciudadOrigen) }}</p>
              <p><strong>Aeropuerto de Llegada:</strong> {{ getCiudadYPais(vuelo.ciudadDestino) }}</p>
              <p><strong>Fecha y Hora de Salida:</strong> {{ formatDateTime(vuelo.fechaHoraSalidaGMT0) }}</p>
              <p><strong>Fecha y Hora de Llegada:</strong> {{ formatDateTime(vuelo.fechaHoraLlegadaGMT0) }}</p>
            </div>
          </div>
          </div>
          <div v-else>
            <p>No tiene plan de vuelo</p>
          </div>
          <button class="modal-button-envio" @click="downloadDetails('envio')">Descargar</button>
          <button class="modal-button-envio" @click="detalle = null">Cerrar</button>
        </div>
      </div>
      </div>
      
      
      </div>
      

    </MglMap>



    <div v-for="modal in openFlightModals" :key="modal.id" class="modal-overlay-flight" @click="closeFlightModal(modal.id)">
  <div class="modal-content-flight" @click.stop>
    <h2>Información del Vuelo</h2>
    <p><strong>Id:</strong> {{ modal.data.id }}</p>
    <p><strong>Aeropuerto de Salida:</strong> {{ getCiudadYPais(modal.data.ciudadOrigen) }}</p>
    <p><strong>Aeropuerto de Llegada:</strong> {{ getCiudadYPais(modal.data.ciudadDestino) }}</p>
    <p><strong>Capacidad de Carga Máxima:</strong> {{ modal.data.capacidadCargaMaxima }}</p>
    <p><strong>Capacidad de Carga Usado:</strong> {{ modal.data.capacidadCargaUsado }}</p>
    <p><strong>Fecha y Hora de Salida:</strong> {{ formatDateTime(modal.data.fechaHoraSalidaGMT0) }}</p>
    <p><strong>Fecha y Hora de Llegada:</strong> {{ formatDateTime(modal.data.fechaHoraLlegadaGMT0) }}</p>
    <p><strong>Tiempo Estimado de Vuelo:</strong> {{ formatDuration(modal.data.tiempoEstimadoVuelo) }}</p>
   <!--   <div v-if="!modal.data.paquetesAlmacenados || modal.data.paquetesAlmacenados.length === 0">
      <h3 class="paquetes-title">Paquetes:</h3>
      <p>No hay paquetes</p>
    </div>
    <div v-else>
      <h3 class="paquetes-title">Paquetes Almacenados:</h3>
      <div class="paquetes-list">
        <div v-for="paquete in modal.data.paquetesAlmacenados" :key="paquete.id" class="paquete-item">
          <p><strong>ID del Paquete:</strong> {{ paquete.id }}</p>
          <p><strong>ID del Envío:</strong> {{ paquete.idEnvio }}</p>
          <p><strong>Cantidad de Paquetes:</strong> {{ paquete.cantidadPaquetes }}</p>
        </div>
      </div>
    </div>-->
    <button class="modal-button-flight" @click="downloadDetailsModal('vuelo', modal.data)">Descargar</button>
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
    <p><strong>Coordenadas:</strong> {{ formatCoordinates(modal.data.coordinates) }}</p>
  <!--   <p v-if="!modal.data.paquetes || modal.data.paquetes.length === 0"><strong>Paquetes almacenados:</strong> No hay paquetes</p>
    <div v-else>
      <h3 class="paquetes-title">Paquetes almacenados:</h3>
      <div class="paquetes-list">
        <div v-for="paquete in modal.data.paquetes" :key="paquete.id" class="paquete-item">
          <p><strong>ID del Paquete:</strong> {{ paquete.id }}</p>
          <p><strong>ID del Envío:</strong> {{ paquete.idEnvio }}</p>
          <p><strong>Cantidad de Paquetes:</strong> {{ paquete.cantidadPaquetes }}</p>
        </div>
      </div>
    </div>-->
    <button class="modal-button-airport" 
        @click="downloadDetailsModal('aeropuerto', modal.data)" 
       >
  Descargar
</button>
    <button class="modal-button-airport" @click="closeAirportModal(modal.id)">Cerrar</button>
  </div>
</div>
    <!-- <div id="map" style="height:750px!important;"></div> -->

<div v-for="modal in openEnvioModals" :key="modal.id" class="modal-overlay-envio" @click="closeEnvioModal(modal.id)">
  <div class="modal-content-envio" @click.stop>
    <h2>Plan de Vuelo del Envío {{ modal.data.idEnvio }}</h2>
    <div v-if="modal.data.ruta && modal.data.ruta.vuelos && modal.data.ruta.vuelos.length > 0">
      <div v-for="(vuelo, index) in modal.data.ruta.vuelos" :key="vuelo.id">
        <hr>
        <h3>Vuelo #{{ index + 1 }}</h3>
        <p><strong>id del vuelo</strong> {{ vuelo.id }}</p>
        <p><strong>Aeropuerto de Salida:</strong> {{ getCiudadYPais(vuelo.ciudadOrigen) }}</p>
        <p><strong>Aeropuerto de Llegada:</strong> {{ getCiudadYPais(vuelo.ciudadDestino) }}</p>
        <p><strong>Fecha y Hora de Salida:</strong> {{ formatDateTime(vuelo.fechaHoraSalidaGMT0) }}</p>
        <p><strong>Fecha y Hora de Llegada:</strong> {{ formatDateTime(vuelo.fechaHoraLlegadaGMT0) }}</p>
      </div>
    </div>
    <div v-else>
      <p>No tiene plan de vuelo</p>
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
      isDownloadVisible: false, 
      busquedasHabilitadas: false, // Variable para controlar el estado de habilitación
      buscarPorId: false,
    buscarPorCiudadOrigen: false,
    buscarPorCiudadDestino: false,
      detalle: null,
      capacidadAeropuertosUsadaTotal: 0,
      capacidadAeropuertosMaximaTotal: 1,
      isInfoOpen: true,
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
      primerosVuelos: [],
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
      isLegendOpen: true,
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
      zoom: 2.5,


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
    // Inicializar currentDateTime al cargar el mapa
    this.updateCurrentDateTimeDisplay();
    this.fetchAeropuertos();
    let vue = this;
    // this.updateTime();
    this.map.on('load', () => {
      this.loadImages(() => {
        this.setupAirportLayer();

        setInterval(() => {
          this.updateAirportCapacities();
  
        }, 1000);  // Actualiza cada segundo
      });
    });
  
  },
  destroyed() {
    //clearInterval(this.setInterval);
  },
  beforeDestroy() {
    // Detener cualquier intervalo de tiempo y limpiar los datos antes de que el componente sea destruido
    this.resetSimulationData();
  },
  methods: {
    toggleCheckbox(type) {
    if (type === 'id') {
      this.buscarPorCiudadOrigen = false;
      this.buscarPorCiudadDestino = false;
    } else if (type === 'origen') {
      this.buscarPorId = false;
      this.buscarPorCiudadDestino = false;
    } else if (type === 'destino') {
      this.buscarPorId = false; 
      this.buscarPorCiudadOrigen = false;
    }
  },



  
  mostrarEnvio(envio) {
       this.currentDateTimeInfo = this.parseDateTime(this.currentDateTime); // Convertir la fecha correctamente
        this.detalle = { tipo: 'envio', datos: envio };
        if (envio && envio.ruta && envio.ruta.vuelos) {
    envio.ruta.vuelos.forEach(vuelo => {
      this.drawFlightRoute(vuelo);
    });
  }
        if (envio.estadoEnvio === "En vuelo") {
            // Find the flight the envio is on
            const vuelo = envio.ruta.vuelos.find(v => `${v.ciudadOrigen}-${v.ciudadDestino}` === envio.ciudadActual);
            if (vuelo) {
                const isFlightVisible = this.map.queryRenderedFeatures({ layers: [`avion-${vuelo.id}`] }).length > 0;
                
                if (isFlightVisible) {
                    // Change the flight icon
                    this.map.setLayoutProperty(`avion-${vuelo.id}`, 'icon-image', 'flight-selected-icon');
                    setTimeout(() => {
                        this.resetFlightIcon(vuelo);
                    }, 5000);
                } else {
                    // Highlight the departure airport
                    const aeropuerto = this.aeropuertos.find(a => a.codigoOACI === vuelo.ciudadOrigen);
                    if (aeropuerto) {
                        this.mostrarAeropuertoFlight(aeropuerto);
                    }
                }
            }
        } else {
            // Highlight the current airport
            const aeropuerto = this.aeropuertos.find(a => a.codigoOACI === envio.ciudadActual);
            if (aeropuerto) {
                this.mostrarAeropuertoFlight(aeropuerto);
            }
        }
    },
    mostrarAeropuerto(aeropuerto) {
      
      this.currentDateTimeInfo = this.parseDateTime(this.currentDateTime); // Convertir la fecha correctamente
      this.detalle = { tipo: 'aeropuerto', datos: aeropuerto };
    
    // Reset any previously selected airport icon
    if (this.selectedAirport) {
        this.map.setLayoutProperty('aeropuertosLayer', 'icon-image', [
            'match',
            ['get', 'codigoOACI'],
            this.selectedAirport.codigoOACI,
            this.selectedAirport['icon-image'], // Revert to the original icon
            ['get', 'icon-image']
        ]);
    }

    // Update the selected airport
    this.selectedAirport = aeropuerto;

    // Change the selected airport icon
    this.map.setLayoutProperty('aeropuertosLayer', 'icon-image', [
        'match',
        ['get', 'codigoOACI'],
        aeropuerto.codigoOACI,
        'airport-selected-icon',
        ['get', 'icon-image']
    ]);

    // Center the map on the selected airport
    //this.map.flyTo({ center: aeropuerto.coordinates, zoom: 12 }); para ponerlo mas grande
    this.map.flyTo({ center: aeropuerto.coordinates, zoom: 2.5 });
    // Show a popup with airport information (optional)
    new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(aeropuerto.coordinates)
        .addTo(this.map);

    // Reset the icon back to its original state after 5 seconds
    setTimeout(() => {
        this.resetAirportIcon(aeropuerto);
    }, 5000);


  },

  resetAirportIcon(aeropuerto) {
    this.map.setLayoutProperty('aeropuertosLayer', 'icon-image', [
        'match',
        ['get', 'codigoOACI'],
        aeropuerto.codigoOACI,
        this.calculateIcon(aeropuerto.capacidadDeAlmacenamientoUsado / aeropuerto.capacidadAlmacenamientoMaximo),
        ['get', 'icon-image']
    ]);

    // Clear the selected airport reference
    this.selectedAirport = null;
},


parseDateTime(dateTimeStr) {
    const [datePart, timePart] = dateTimeStr.split(', ');
    const [day, month, year] = datePart.split('/');
    const date = `${year}-${month}-${day}`;
    const time = timePart.replace(' UTC', '');
    return new Date(`${date}T${time}Z`);
  },


mostrarAeropuertoFlight(aeropuerto) {

    
    // Reset any previously selected airport icon
    if (this.selectedAirport) {
        this.map.setLayoutProperty('aeropuertosLayer', 'icon-image', [
            'match',
            ['get', 'codigoOACI'],
            this.selectedAirport.codigoOACI,
            this.selectedAirport['icon-image'], // Revert to the original icon
            ['get', 'icon-image']
        ]);
    }

    // Update the selected airport
    this.selectedAirport = aeropuerto;

    // Change the selected airport icon
    this.map.setLayoutProperty('aeropuertosLayer', 'icon-image', [
        'match',
        ['get', 'codigoOACI'],
        aeropuerto.codigoOACI,
        'airport-selected-icon',
        ['get', 'icon-image']
    ]);

    // Center the map on the selected airport
    //this.map.flyTo({ center: aeropuerto.coordinates, zoom: 12 }); para ponerlo mas grande
    this.map.flyTo({ center: aeropuerto.coordinates, zoom: 2.5 });
    // Show a popup with airport information (optional)
    new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(aeropuerto.coordinates)
        .addTo(this.map);

    // Reset the icon back to its original state after 5 seconds
    setTimeout(() => {
        this.resetAirportIcon(aeropuerto);
    }, 5000);


  },

  convertToUTC(date) {
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    },
  mostrarVuelo(vuelo) {
    this.currentDateTimeInfo = this.parseDateTime(this.currentDateTime); // Convertir la fecha correctamente
        this.detalle = { tipo: 'vuelo', datos: vuelo };

        const isFlightVisible = this.map.queryRenderedFeatures({ layers: [`avion-${vuelo.id}`] }).length > 0;
           console.log("gaaaaa");
        if (isFlightVisible) {
            // Change the flight icon
            this.map.setLayoutProperty(`avion-${vuelo.id}`, 'icon-image', 'flight-selected-icon');
            this.drawFlightRoute(vuelo);
            setTimeout(() => {
                this.resetFlightIcon(vuelo);
                this.removeFlightRoute(vuelo);
            }, 5000);
        } else {

          const currentTimeAux = this.simulationDateTime.getTime();

          const fechaHora = new Date();

          const fechaHoraGMT0 = new Date(fechaHora.getTime() + fechaHora.getTimezoneOffset() * 60000); // Convertir a GMT0

          const fechaHoraActual = this.convertToUTC(this.parseDateTime(this.currentDateTime)); // Convert the current date correctly

            const arrivalTime = new Date(vuelo.fechaHoraLlegadaGMT0);
   
          //  const currentTime = currentTimeAux.getTime();

            const arrivalTimeInMs = arrivalTime.getTime();
   
            this.drawFlightRoute(vuelo);
            console.log("gaaaaadaasasdwa8");
setTimeout(() => {
  this.removeFlightRoute(vuelo);
}, 5000);

     //       console.log("FECHAAAA ", fechaHoraActual, "----", vuelo.fechaHoraLlegadaGMT0, "----", currentTime, "----", arrivalTimeInMs);
            const hasArrived = vuelo.fechaHoraLlegadaGMT0 < currentTimeAux;
            if (currentTimeAux >= arrivalTimeInMs) {
                // Highlight the arrival airport
                const aeropuertoDestino = this.aeropuertos.find(a => a.codigoOACI === vuelo.ciudadDestino);
                if (aeropuertoDestino) {
                    this.mostrarAeropuertoFlight(aeropuertoDestino);
                }
            } else {
                // Highlight the departure airport
                const aeropuertoOrigen = this.aeropuertos.find(a => a.codigoOACI === vuelo.ciudadOrigen);
                if (aeropuertoOrigen) {
                    this.mostrarAeropuertoFlight(aeropuertoOrigen);
                }
            }
            }
          },
            drawFlightRoute(vuelo) {
  const routeSourceId = `route-${vuelo.id}`;
  const arrowHeadSourceId = `arrow-head-${vuelo.id}`;

  if (this.map.getSource(routeSourceId)) {
    this.map.removeLayer(routeSourceId);
    this.map.removeSource(routeSourceId);
  }

  if (this.map.getSource(arrowHeadSourceId)) {
    this.map.removeLayer(arrowHeadSourceId);
    this.map.removeSource(arrowHeadSourceId);
  }

  this.map.addSource(routeSourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [vuelo.origen, vuelo.destino]
      }
    }
  });

  this.map.addLayer({
    id: routeSourceId,
    type: 'line',
    source: routeSourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#FF0000',
      'line-width': 2
    }
  });

  // Calcula el ángulo para la rotación del triángulo
  const bearing = this.calculateBearing(vuelo.origen, vuelo.destino);

  this.map.addSource(arrowHeadSourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: vuelo.destino
      }
    }
  });

  this.map.addLayer({
    id: arrowHeadSourceId,
    type: 'symbol',
    source: arrowHeadSourceId,
    layout: {
      'text-field': '▲', // Carácter Unicode para triángulo
      'text-size': 30,
      'text-rotate': bearing,
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#FF0000'
    }
  });

  setTimeout(() => {
    this.removeFlightRoute(vuelo);
  }, 5000);
            },

removeFlightRoute(vuelo) {
  const routeSourceId = `route-${vuelo.id}`;
  const arrowHeadSourceId = `arrow-head-${vuelo.id}`;

  if (this.map.getSource(routeSourceId)) {
    this.map.removeLayer(routeSourceId);
    this.map.removeSource(routeSourceId);
  }

  if (this.map.getSource(arrowHeadSourceId)) {
    this.map.removeLayer(arrowHeadSourceId);
    this.map.removeSource(arrowHeadSourceId);
  }
},


calculateArrowHead(origin, destination) {
  const angle = this.calculateBearing(origin, destination);
  const length = 0.05; // longitud de la cabeza de la flecha

  const arrowPoint1 = this.destinationPoint(destination, angle - 135, length);
  const arrowPoint2 = this.destinationPoint(destination, angle + 135, length);

  return [arrowPoint1, destination, arrowPoint2];
},

destinationPoint(point, angle, distance) {
  const radians = angle * (Math.PI / 180);
  const newLat = point[1] + distance * Math.sin(radians);
  const newLng = point[0] + distance * Math.cos(radians);
  return [newLng, newLat];
},

    resetFlightIcon(vuelo) {
    this.map.setLayoutProperty(`avion-${vuelo.id}`, 'icon-image', this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima));
},
    formatCoordinates(coordinates) {
    return coordinates.map(coord => coord.toFixed(2)).join(', ');
  },


    toggleInfo() {
      this.isInfoOpen = !this.isInfoOpen;
    },
    toGMT0(date) {
    return new Date(date.toISOString()); // Asegura que la fecha se convierta correctamente a GMT
  },
  resetSimulationData() {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      this.pendingFlights = [];
      this.allVuelos = [];
      // Reinicia otros datos según sea necesario
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

    getCiudadYPais(codigoOACI) {
    if (codigoOACI.includes('-')) {
      // Caso de vuelo, obtener ciudades y países de origen y destino
      const [codigoOrigen, codigoDestino] = codigoOACI.split('-');
      const aeropuertoOrigen = this.mapaAeropuertos[codigoOrigen];
      const aeropuertoDestino = this.mapaAeropuertos[codigoDestino];
      if (aeropuertoOrigen && aeropuertoDestino) {
        return `${aeropuertoOrigen.nombreCiudad}, ${aeropuertoOrigen.pais} - ${aeropuertoDestino.nombreCiudad}, ${aeropuertoDestino.pais}`;
      } else {
        return 'Datos de aeropuertos no encontrados';
      }
    } else {
      
      // Caso de un solo aeropuerto
      const aeropuerto = this.mapaAeropuertos[codigoOACI];
      if (aeropuerto) {
      //  console.log(`${aeropuerto.nombreCiudad}, ${aeropuerto.pais}`);
        return `${aeropuerto.nombreCiudad}, ${aeropuerto.pais}`;
      } else {
        return 'Aeropuerto no encontrado';
      }
    }
  },


    fetchAeropuertos() {
      console.log(urlBase+'/api/aeropuertos' );
      axios.get(urlBase + '/api/aeropuertos')
        .then(response => {
          this.aeropuertos = response.data;
                  // Llenar el mapa de aeropuertos indexado por codigoOACI
                  this.mapaAeropuertos = this.aeropuertos.reduce((map, aeropuerto) => {
          map[aeropuerto.codigoOACI] = aeropuerto;
          return map;
        }, {});
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
      const fechaHora = new Date();
    const fechaHoraGMT0 = new Date(fechaHora.getTime() + fechaHora.getTimezoneOffset() * 60000); // Convertir a GMT0
    const fecha = fechaHoraGMT0.toISOString().split('T')[0];
    const hora = fechaHoraGMT0.toTimeString().split(' ')[0].substring(0, 5);
      axios.get(urlBase +`/api/diaDia/aeropuertos?fecha=${fecha}&hora=${hora}`)
        .then(response => {
          this.aeropuertos = response.data;
          this.mapaAeropuertos = this.aeropuertos.reduce((map, aeropuerto) => {
          map[aeropuerto.codigoOACI] = aeropuerto;
          return map;
        }, {});
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

    toggleLegend() {
      this.isLegendOpen = !this.isLegendOpen;
    },


    calculateIcon(capacityRatio) {
      if (capacityRatio < 0.10) return 'airport-green';
      else if (capacityRatio < 0.25) return 'airport-orange';
      return 'airport-red';
    },



    calculateFlightIcon(capacidadCargaUsado, capacidadCargaMaxima) {
      const ratio = capacidadCargaUsado / capacidadCargaMaxima;
    if (ratio < 0.10) return 'flight-green';  // Asegúrate de que estos iconos existen en tu estilo Mapbox
    else if (ratio < 0.30) return 'flight-orange';
    else return 'flight-red';
    },



    updateAirportCapacities() {
      if (this.map.getSource('aeropuertos') && this.geojsonAeropuertos) {
        this.geojsonAeropuertos.features = this.aeropuertos.map(a => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: a.coordinates },
          properties: {
            ...a,
            'icon-image': this.calculateIcon(a.capacidadDeAlmacenamientoUsado / a.capacidadAlmacenamientoMaximo)
          }
        }));
        this.map.getSource('aeropuertos').setData(this.geojsonAeropuertos);
      }
    },



    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },



    // Add a method to animate only visible flights
    animateVisibleFlights() {
    // Ensure that bounds is a LngLatBounds object
    const bounds = this.map.getBounds();
   // console.log('Bounds:', bounds);

    // Manually check if a point is within the bounds
    const visibleFlights = this.filteredVuelos.filter(vuelo => {
        const [lng, lat] = vuelo.origen;
        return (
            lng >= bounds.getWest() &&
            lng <= bounds.getEast() &&
            lat >= bounds.getSouth() &&
            lat <= bounds.getNorth()
        );
    });

    visibleFlights.forEach(vuelo => this.animateFlight(vuelo));
},

    // Modify checkAndAnimateFlights to use animateVisibleFlights

 
    toGMT0Check(date) {
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ));
},
    checkAndAnimateFlights() {
      
      const currentTime = this.simulationDateTime.getTime();
     // console.log(`Tiempo de simulación actual: ${new Date(this.currentDateTime).toISOString()}`);
      
      this.pendingFlights.forEach(vuelo => {
        const vueloStartTimeGMT0 = this.toGMT0Check(new Date(vuelo.fechaHoraSalidaGMT0));
        const vueloStartTime = vueloStartTimeGMT0.getTime();
   // console.log(`Tiempo de simulación actual vuelos star: ${new Date(vuelo.fechaHoraSalidaGMT0).toISOString()}`);
    if (currentTime >= vueloStartTime && !vuelo.animated) {
      vuelo.animated = true; // Marcar el vuelo como animado
     // console.log(`Animando vuelo con ID ${vuelo.id} a las ${new Date(vueloStartTime).toISOString()}`);
      vuelo.isActive = false;

      this.animateFlight(vuelo);
    }
  });

      this.pendingFlights = this.pendingFlights.filter(vuelo => !vuelo.animated); // Remover los vuelos animados

      // Call animateVisibleFlights periodically

     // this.animateVisibleFlights();

    },
    updateCurrentDateTimeDisplay() {
      
      const currentDateTimeGMT0 = this.toGMT0(new Date());
     // console.log("udpate TIME", currentDateTimeGMT0);
    this.currentDateTime = currentDateTimeGMT0.toLocaleString('es-ES', {
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
  let imagesToLoad = [
    'airport-green',
    'airport-orange',
    'airport-red',
    'flight-green',
    'flight-orange',
    'flight-red'
  ];
  let loadedImages = 0;
  const totalImages = imagesToLoad.length + 1; // +1 para la imagen adicional
  const imageLoaded = () => {
    loadedImages++;
  //  console.log(`Image loaded: ${loadedImages}/${totalImages}`);
    if (loadedImages === totalImages) {
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
      imageLoaded();
    });
  });

  // Cargar la imagen seleccionada por separado
  this.map.loadImage('/img/airport-selected-icon.png', (error, image) => {
    if (error) {
      console.error('Error loading image: /img/airport-selected-icon.png', error);
      return;
    }
    this.map.addImage('airport-selected-icon', image);
    imageLoaded();
  });


  this.map.loadImage('/img/flight-selected-icon.png', (error, image) => {
    if (error) {
      console.error('Error loading image: /img/flight-selected-icon.png', error);
      return;
    }
    this.map.addImage('flight-selected-icon', image);
    imageLoaded();
  });
  
},


onAirportMouseEnter(event) {
    const feature = event.features[0];
    const aeropuerto = this.aeropuertos.find(a => a.codigoOACI === feature.properties.codigoOACI);
    if (aeropuerto) {
      this.currentAirportCode = this.getCiudadYPais( aeropuerto.codigoOACI);
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
      this.fetchAeropuertos();
    const currentDateTimeGMT0 = this.toGMT0Inicio(new Date());
    const fechaInicio = currentDateTimeGMT0.toISOString().split('T')[0];
    const fechaInicioHora = currentDateTimeGMT0.toISOString().split('T')[1].substring(0, 5);
    console.log('Fecha y hora en GMT 0:', fechaInicio + ' ' + fechaInicioHora);

 //console.log("HOLA", currentDateTimeGMT0.toISOString()); 
 this.simulationDateTime = new Date(`${fechaInicio}T${fechaInicioHora}:00Z`);


 this.loadVuelosEnCamino(fechaInicio, fechaInicioHora)
    .then(vuelos => {
      vuelos.forEach(vuelo => this.animateFlightAntes(vuelo));
    })
    .catch(error => {
      console.error("Error loading vuelos en camino:", error);
    });
 

      this.startSimulationLoop(fechaInicio,fechaInicioHora); 
    
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




    animateFlightAntes(vuelo) {
   // console.log("LEGGOO CURREN");
    const sourceId = `vuelo-${vuelo.id}`;
    const bearing = this.calculateBearing(vuelo.origen, vuelo.destino);

    if (!this.map.getSource(sourceId)) {
     // console.log(`Updating source ${sourceId}`);
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
    const fechaHora = new Date();
    const fechaHoraGMT0 = new Date(fechaHora.getTime() + fechaHora.getTimezoneOffset() * 60000); // Convertir a GMT0
    const currentTime = new Date(new Date().toISOString()); // Ensure current time is in GMT0
   // console.log("FECHA ACTUALLLLLLLLLLLLLLLLLL GAAAAAAAAAAA", fechaHoraGMT0);
  const flightStartTime = new Date(vuelo.fechaHoraSalidaGMT0);
  const flightEndTime = new Date(vuelo.fechaHoraLlegadaGMT0);

    const elapsedTime = (fechaHoraGMT0 - flightStartTime) / 1000; // Elapsed time in seconds
    const totalFlightTime = (flightEndTime - flightStartTime) / 1000; // Total flight time in seconds

    const flightProgress = Math.min(elapsedTime / totalFlightTime, 1); // Ensure progress is at most 1

    const startLatLng = vuelo.origen;
    const endLatLng = vuelo.destino;

    const currentLat = startLatLng[1] + (endLatLng[1] - startLatLng[1]) * flightProgress;
    const currentLng = startLatLng[0] + (endLatLng[0] - startLatLng[0]) * flightProgress;

    const steps = 10000; // Number of animation steps
    const interval = (totalFlightTime * 1000) / steps; // Interval between steps in milliseconds

    let currentStep = flightProgress * steps;
    const incrementLat = (endLatLng[1] - startLatLng[1]) / steps;
    const incrementLng = (endLatLng[0] - startLatLng[0]) / steps;

    const move = () => {
      if (currentStep <= steps) {
        const currentLat = startLatLng[1] + incrementLat * currentStep;
        const currentLng = startLatLng[0] + incrementLng * currentStep;

       // console.log(`Updating position to: [${currentLng}, ${currentLat}]`);

        this.map.getSource(sourceId).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [currentLng, currentLat]
          },
          properties: {
            id: vuelo.id,
            'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
            'icon-rotate': bearing
          } 
        });

        currentStep++;
        setTimeout(move, interval);
      } else {
        // Ensure the final position is exact
        this.map.getSource(sourceId).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: endLatLng
          },
          properties: {
            id: vuelo.id,
            'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
            'icon-rotate': bearing
          }
        });

        setTimeout(() => {
          if (this.map.getLayer(`avion-${vuelo.id}`)) {
            this.map.removeLayer(`avion-${vuelo.id}`);
          }
          if (this.map.getSource(sourceId)) {
            this.map.removeSource(sourceId);
          }
        }, 1000);
      }
    };

    move();
  },
      // Método modificado animateFlight para usar vuelo.fechaHoraSalidaGMT0 y vuelo.fechaHoraLlegadaGMT0
     /* animateFlightAntes(vuelo) {
  console.log("LEGGOO CURREN");
  const sourceId = `vuelo-${vuelo.id}`;
  const bearing = this.calculateBearing(vuelo.origen, vuelo.destino);

  const currentTimeGMT0 = new Date();
  const departureTimeGMT0 = new Date(vuelo.fechaHoraSalidaGMT0);
  const elapsedTime = (currentTimeGMT0 - departureTimeGMT0) / 1000; // Elapsed time in seconds
  const totalFlightTime = this.parseDurationToMinutes(vuelo.tiempoEstimadoVuelo) * 60; // Total flight time in seconds
  const progress = Math.min(elapsedTime / totalFlightTime, 1); // Progress ratio (capped at 1)

  const interpolate = (start, end, factor) => start + (end - start) * factor;

  const startLatLng = [
    interpolate(vuelo.origen[0], vuelo.destino[0], progress),
    interpolate(vuelo.origen[1], vuelo.destino[1], progress)
  ];

  if (!this.map.getSource(sourceId)) {
    console.log(`Updating source ${sourceId}`);
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
          coordinates: startLatLng
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
  const realTimeSeconds = flightDurationSimulationSeconds / 1;  // Convert to real time seconds based on 360 simulated seconds = 1 real second

  console.log(flightDurationMinutes);
  const steps = 10000; // MEJORA VISUALIZACIÓN PERO SE DESFASA ALGO EL TIEMPO PERO SE VE MAS RÁPIDO
  const interval = (realTimeSeconds * 1000) / steps;  // DEBE HABER SUFICIENTES SALTOS POR SEGUNDO O X TIEMPO PARA QUE SE VISUALICE EN TIEMPO REAL
  console.log(steps);

  const endLatLng = vuelo.destino;

  let currentStep = 0;
  const incrementLat = (endLatLng[1] - startLatLng[1]) / steps;
  const incrementLng = (endLatLng[0] - startLatLng[0]) / steps;

  const move = () => {
    if (currentStep <= steps) {
      const currentLat = startLatLng[1] + incrementLat * currentStep;
      const currentLng = startLatLng[0] + incrementLng * currentStep;

      this.map.getSource(sourceId).setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [currentLng, currentLat]
        },
        properties: {
          id: vuelo.id,
          'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
          'icon-rotate': bearing
        }
      });

      currentStep++;
      setTimeout(move, interval);
    } else {
      // Asegúrate de que la posición final sea la exacta
      this.map.getSource(sourceId).setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: endLatLng
        },
        properties: {
          id: vuelo.id,
          'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
          'icon-rotate': bearing
        }
      });
      setTimeout(() => {
        if (this.map.getLayer(`avion-${vuelo.id}`)) {
          this.map.removeLayer(`avion-${vuelo.id}`);
        }
        if (this.map.getSource(sourceId)) {
          this.map.removeSource(sourceId);
        }
      }, 1000);
    }
  };

  move();
},*/
    async loadVuelosEnCamino(fecha, hora) {
    try {
      const response = await axios.get(urlBase +`/api/diaDia/vuelosEnCamino`, {
        params: {
          fecha: fecha,
          hora: hora
        }
      });
    //  console.log("Vuelos en camino:", response.data);
        const vuelosConPaquetes = response.data.filter(vuelo => vuelo.capacidadCargaUsado > 0);
        let vuelosSinPaquetes = response.data.filter(vuelo => vuelo.capacidadCargaUsado === 0);

        // Limit vuelosSinPaquetes to a maximum of 600 flights
        if (vuelosSinPaquetes.length > 600) {
            vuelosSinPaquetes = vuelosSinPaquetes.slice(0, 600);
        }

        // Combine the lists, with all vuelosConPaquetes and limited vuelosSinPaquetes
        const combinedVuelos = [...vuelosConPaquetes, ...vuelosSinPaquetes];

        this.primerosVuelos = combinedVuelos;
        return combinedVuelos;
    } catch (error) {
      console.error("Error fetching vuelos en camino:", error);
      throw error;
    }
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
        'icon-image': ['get', 'icon-image'], // Usar la propiedad 'icon-image' de las características
        'icon-size': 0.5,
        'icon-allow-overlap': true
      }
    });
  }
},

/*

    async startSimulationLoop(fechaInicio, fechaInicioHora) {
      this.simulationDateTime = this.toGMT0Inicio(new Date());
      this.pendingFlights = [];
      this.allVuelos = [];
      this.updateCurrentDateTimeDisplay();
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
      }
      await this.fetchSimulationResults(fechaInicio, fechaInicioHora);

      let realSecondsElapsed = 0; 
      this.simulationInterval = setInterval(async () => {
        this.updateAirportData();
        const fechaInicioaUX = this.simulationDateTime.toISOString().split('T')[0];
      const fechaInicioHoraAUX = this.simulationDateTime.toISOString().split('T')[1].substring(0, 5);
       // console.log("TIEMPO ACTUALIZADO CONTINUO", fechaInicioaUX+ fechaInicioHoraAUX);
        console.log("SEGUNDOS", realSecondsElapsed);
        this.simulationDateTime = new Date(this.simulationDateTime.getTime() + 1000);
    this.updateCurrentDateTimeDisplay();
          this.planificacionEnEsperaCancelar = true; // Mostrar el botón "Cancelar"
          this.planificacionEnEsperaCancelar = true; // Mostrar el botón "Cancelar"
          this.planificacionEnEsperaDetener = true;
          this.toggleIniciarDetener = true; // Mostrar el botón de "Iniciar Simulación"
          this.validarFechaIniciarPlanificacion = false;
          this.isButtonDisabled = false;
          this.showFullscreenButton = true;
          realSecondsElapsed++;

          // AQUI COMIENZA LA SIMULACION
          let vue = this;
          //vue.toggleIniciarDetener = false;
          this.validarFechaIniciarPlanificacion = false;
          vue.toggleReanudar = false;
          this.isAnimating = true;
          this.searchEnabled = true;
          if (!this.isSimulating) {
          
            this.isSimulating = true;
          //  await this.delay(delayAux); 
            


          }
          if (realSecondsElapsed % 300 === 0) {
      const fechaInicioaUX = this.simulationDateTime.toISOString().split('T')[0];
      const fechaInicioHoraAUX = this.simulationDateTime.toISOString().split('T')[1].substring(0, 5);

      console.log("TIEMPO ACTUALIZADO 5 MINUTOS", fechaInicioaUX + fechaInicioHoraAUX);

      await this.fetchSimulationResults(fechaInicioaUX, fechaInicioHoraAUX);
    }

          
    this.checkAndAnimateFlights();
  

      }, 1000); // Ejecutar cada segundo en tiempo real
    },*/



    actualizarContadoresVuelos() {
  //    console.log("hola");

const now = this.simulationDateTime.getTime();

  //console.log(`Tiempo de simulación actual actualizar vuelos: ${new Date(now).toISOString()}`);
const allFlightsVuelos = [...this.pendingFlights, ...this.filteredVuelos, ...this.allVuelos, ...this.primerosVuelos];
//console.log("hola2");
 allFlightsVuelos.forEach(vuelo => {
  //console.log("hola3");
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
toGMT0Inicio(date) {
  // Convertir la fecha y hora a GMT
  const gmtDate = new Date(date.toISOString());
  return gmtDate;
},


    async startSimulationLoop(fechaInicio, fechaInicioHora) {

  this.simulationDateTime = this.toGMT0Inicio(new Date());
  this.pendingFlights = [];
  this.allVuelos = [];
  this.updateCurrentDateTimeDisplay();
  if (this.simulationInterval) {
    clearInterval(this.simulationInterval);
  }
  await this.fetchSimulationResults(fechaInicio, fechaInicioHora);

  let realSecondsElapsed = 0; 
  let startTime = performance.now();


  this.planificacionEnEsperaCancelar = true; // Mostrar el botón "Cancelar"
    this.planificacionEnEsperaDetener = true;
    this.toggleIniciarDetener = true; // Mostrar el botón de "Iniciar Simulación"
    this.validarFechaIniciarPlanificacion = false;
    this.isButtonDisabled = false;
    this.showFullscreenButton = true;
   

  this.simulationInterval = setInterval(async () => {
    let currentTime = performance.now();
    let elapsedTime = (currentTime - startTime) / 1000;
    startTime = currentTime;
    //this.startAutoUpdatePaquetes(); 
    // Actualiza simulationDateTime basado en el tiempo transcurrido real
    this.simulationDateTime = new Date(this.simulationDateTime.getTime() + elapsedTime * 1000);
    //console.log("Tiempo actual de simulación start loop:", this.simulationDateTime.toISOString());
    //console.log("Segundos", realSecondsElapsed);
    this.updateCurrentDateTimeDisplay();
    this.actualizarContadoresVuelos();

    realSecondsElapsed += elapsedTime;

    if (realSecondsElapsed >= 300) {
      realSecondsElapsed = 0;
      const fechaInicioaUX = this.simulationDateTime.toISOString().split('T')[0];
      const fechaInicioHoraAUX = this.simulationDateTime.toISOString().split('T')[1].substring(0, 5);
     

    //  console.log("TIEMPO ACTUALIZADO 5 MINUTOS", fechaInicioaUX + fechaInicioHoraAUX);
      await this.fetchSimulationResults(fechaInicioaUX, fechaInicioHoraAUX);
    }
   if (realSecondsElapsed >= 15) {
    this.updateAirportData();
    }
    
    this.checkAndAnimateFlights();
   }, 1000); // Ejecutar cada segundo en tiempo real
 
},




    async fetchSimulationResults(fecha, hora) {
      //console.log(fecha + hora);
      try {
        const saltoTemporal = 5; // Define el salto temporal según tus necesidades
      const response = await axios.get(`${urlBase}/api/diaDia/resultados`, {
        params: {
          fecha: fecha,
          hora: hora,
          saltoTemporal: saltoTemporal
        }
      });
       console.log("Resultados de la simulación:", response.data);
        const fetchedVuelos = response.data.vuelosOrdenadoGMT0;

        console.log("Vuelos disponibles SACADOS:", fetchedVuelos);
        let filteredVuelos = [];

        let count = 0;

        // Procesar los vuelos en vuelosOrdenadoGMT0
        fetchedVuelos.forEach(vuelo => {
          vuelo.animated = false; // Agregar propiedad animated
          filteredVuelos.push(vuelo);
          this.pendingFlights.push(vuelo);
          this.allVuelos.push(vuelo); // Acumular vuelos
          count++;
        });

        // Ordenar los vuelos por fecha y hora de salida
        filteredVuelos.sort((a, b) => new Date(a.fechaHoraSalidaGMT0) - new Date(b.fechaHoraSalidaGMT0));

       // console.log("CUENTA ACTUALIZADOS:" + count);
        //this.vuelosOrdenadoGMT0 = filteredVuelos;
        // this.filteredVuelos = filteredVuelos; // Actualizar el estado de filteredVuelos aquí
        this.$set(this, 'filteredVuelos', [...this.pendingFlights]); 
       // console.log("Vuelos disponibles ACTUALIZADOS:", filteredVuelos);
       // console.log("Contenido de allVuelos después de fetchSimulationResults:", this.allVuelos);
      } catch (error) {
        console.error("Error obteniendo resultados de la simulación:", error);
      }
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

     // console.log("LEGGOO CURREN");
      const sourceId = `vuelo-${vuelo.id}`;
      const bearing = this.calculateBearing(vuelo.origen, vuelo.destino);
      if (!this.map.getSource(sourceId)) {
    //    console.log(`Updating source ${sourceId}`);
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
    const realTimeSeconds = flightDurationSimulationSeconds / 1;  // Convert to real time seconds based on 360 simulated seconds = 1 real second

   // console.log(flightDurationMinutes);
    const steps = 10000; // MEJORA VISUALIZACIÓN PERO SE DESFASA ALGO EL TIEMPO PERO SE VE MAS RÁPIDO
    const interval = (realTimeSeconds * 1000) / steps;  // DEBE HABER SUFICIENTES SALTOS POR SEGUNDO O X TIEMPO PARA QUE SE VISUALICE EN TIEMPO REAL
   // console.log(steps);

    const startLatLng = vuelo.origen;
    const endLatLng = vuelo.destino;

    let currentStep = 0;
    const incrementLat = (endLatLng[1] - startLatLng[1]) / steps;
    const incrementLng = (endLatLng[0] - startLatLng[0]) / steps;

    const move = () => {
        if (currentStep <= steps) {
            const currentLat = startLatLng[1] + incrementLat * currentStep;
            const currentLng = startLatLng[0] + incrementLng * currentStep;

        //    console.log(`Updating position to: [${currentLng}, ${currentLat}]`);

            if (this.map.getSource(sourceId)) {
                this.map.getSource(sourceId).setData({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [currentLng, currentLat]
                    },
                    properties: {
                        id: vuelo.id,
                        'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
                        'icon-rotate': bearing
                    }
                });
            }


            currentStep++;
            setTimeout(move, interval);
        } else {
            // Asegúrate de que la posición final sea la exacta
            this.map.getSource(sourceId).setData({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: endLatLng
                },
                properties: {
                    id: vuelo.id,
                    'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima),
                    'icon-rotate': bearing
                }
            });
            setTimeout(() => {
                if (this.map.getLayer(`avion-${vuelo.id}`)) {
                    this.map.removeLayer(`avion-${vuelo.id}`);
                }
                if (this.map.getSource(sourceId)) {
                    this.map.removeSource(sourceId);
                }
            }, 1000);
        }
    };

    move();
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


    onAirportClick(event) {
      this.currentDateTimeInfo = this.parseDateTime(this.currentDateTime); // Convertir la fecha correctamente
     // console.log(this.currentDateTimeInfo);
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
      this.currentDateTimeInfo = this.parseDateTime(this.currentDateTime); // Convertir la fecha correctamente
      console.log(this.currentDateTimeInfo);
  const vueloId = event.features[0].properties.id;
  //console.log(event.features[0].properties.id);
  const allFlights = [...this.pendingFlights, ...this.filteredVuelos, ...this.allVuelos, ...this.primerosVuelos];
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
    const fechaHora = new Date();
    const fechaHoraGMT0 = new Date(fechaHora.getTime() + fechaHora.getTimezoneOffset() * 60000); // Convertir a GMT0
    const fecha = fechaHoraGMT0.toISOString().split('T')[0];
    const hora = fechaHoraGMT0.toTimeString().split(' ')[0].substring(0, 5);

    try {
    //  console.log(`Buscando aeropuertos con cadena: ${cadena}, fecha: ${fecha}, hora: ${hora}`);
      const response = await axios.get(`${urlBase}/api/diaDia/aeropuerto`, {
        params: {
          cadena: cadena,
          fecha: fecha,
          hora: hora
        }
      });
   //   console.log("Resultados de la búsqueda:", response.data);
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
      const fechaHora = new Date();
    const fechaHoraGMT0 = new Date(fechaHora.getTime() + fechaHora.getTimezoneOffset() * 60000); // Convertir a GMT0
    const fecha = fechaHoraGMT0.toISOString().split('T')[0];
    const hora = fechaHoraGMT0.toTimeString().split(' ')[0].substring(0, 5);

      try {
        console.log(`Buscando envios con cadena: ${cadena}, fecha: ${fecha}, hora: ${hora}`);
        const response = await axios.get(`${urlBase}/api/diaDia/paquete`, {
          params: {
            cadena: cadena,
            fecha: fecha,
            hora: hora
          }
        });
        this.resultadosBusquedaEnvio = response.data;
      //  console.log(response.data);
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
      const fechaHora = new Date();
    const fechaHoraGMT0 = new Date(fechaHora.getTime() + fechaHora.getTimezoneOffset() * 60000); // Convertir a GMT0
    const fecha = fechaHoraGMT0.toISOString().split('T')[0];
    const hora = fechaHoraGMT0.toTimeString().split(' ')[0].substring(0, 5);
    let tipo = '';
      if (this.buscarPorId) {
        tipo = 'por_id';
      } else if (this.buscarPorCiudadOrigen) {
        tipo = 'por_ciudad_origen';
      } else if (this.buscarPorCiudadDestino) {
        tipo = 'por_ciudad_destino';
      }

      if (tipo) {
        try {
          const response = await axios.get(urlBase + '/api/diaDia/vuelo', {
            params: {
              cadena: cadena,
              tipo: tipo,
              fecha: fecha
            }
          });
          this.resultadosBusquedaVuelo = response.data;
        } catch (error) {
          console.error("Error fetching vuelos:", error);
          this.resultadosBusquedaVuelo = []; // Ensure results are cleared on error
        }
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
    },


    
    downloadDetails(type) {
   
   let fecha = this.currentDateTimeInfo.toISOString().split('T')[0];
   let hora = this.currentDateTimeInfo.toISOString().substr(11, 5); // Extraer la hora correctamente en formato HH:mm
  
 let content = '';
 if (type === 'vuelo' && this.detalle.tipo === 'vuelo') {
   content = `
     Información del Vuelo con fecha ${fecha} y hora ${hora}:
     Id: ${this.detalle.datos.id}
     Aeropuerto de Salida: ${this.getCiudadYPais(this.detalle.datos.ciudadOrigen)}
     Aeropuerto de Llegada: ${this.getCiudadYPais(this.detalle.datos.ciudadDestino)}
     Fecha y Hora de Salida: ${this.formatDateTime(this.detalle.datos.fechaHoraSalidaGMT0)}
     Fecha y Hora de Llegada: ${this.formatDateTime(this.detalle.datos.fechaHoraLlegadaGMT0)}
     Tiempo Estimado de Vuelo: ${this.formatDuration(this.detalle.datos.tiempoEstimadoVuelo)}
     Paquetes: ${this.detalle.datos.paquetesAlmacenados.length === 0 ? 'No hay paquetes' : ''}
     ${this.detalle.datos.paquetesAlmacenados.map(paquete => `
       ID del Paquete: ${paquete.id}
       ID del Envío: ${paquete.idEnvio}
       Cantidad de Paquetes: ${paquete.cantidadPaquetes}
     `).join('\n')}
   `;
 } else if (type === 'aeropuerto' && this.detalle.tipo === 'aeropuerto') {
   content = `
     Información del Aeropuerto con fecha ${fecha} y hora ${hora}:
     Ciudad y País: ${this.detalle.datos.nombreCiudad}, ${this.detalle.datos.pais}
     Coordenadas: ${this.formatCoordinates(this.detalle.datos.coordinates)}
     Paquetes almacenados: ${this.detalle.datos.paquetes.length === 0 ? 'No hay paquetes' : ''}
     ${this.detalle.datos.paquetes.map(paquete => `
       ID del Paquete: ${paquete.id}
       ID del Envío: ${paquete.idEnvio}
       Cantidad de Paquetes: ${paquete.cantidadPaquetes}
     `).join('\n')}
   `;
 } else if (type === 'envio' && this.detalle.tipo === 'envio') {
   content = `
     Plan de Vuelo del Envío ${this.detalle.datos.idEnvio} con fecha ${fecha} y hora ${hora}:
     ${this.detalle.datos.ruta.vuelos.length === 0 ? 'No tiene plan de vuelo' : ''}
     ${this.detalle.datos.ruta.vuelos.map((vuelo, index) => `
       Vuelo #${index + 1}:
       id del vuelo: ${vuelo.id}
       Aeropuerto de Salida: ${this.getCiudadYPais(vuelo.ciudadOrigen)}
       Aeropuerto de Llegada: ${this.getCiudadYPais(vuelo.ciudadDestino)}
       Fecha y Hora de Salida: ${this.formatDateTime(vuelo.fechaHoraSalidaGMT0)}
       Fecha y Hora de Llegada: ${this.formatDateTime(vuelo.fechaHoraLlegadaGMT0)}
     `).join('\n')}
   `;
 }
 const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
 const link = document.createElement('a');
 link.href = URL.createObjectURL(blob);
 link.download = `Detalles_${type}.doc`;
 link.click();
},
downloadDetailsModal(type, data) {
//console.log("EEEEEEEEE");
   let fecha = this.currentDateTimeInfo.toISOString().split('T')[0];
   let hora = this.currentDateTimeInfo.toISOString().substr(11, 5); // Extraer la hora correctamente en formato HH:mm
  
 let content = '';

 if (type === 'vuelo') {
 // console.log("fecha", fecha, " ",hora );
   content = `
     Información del Vuelo con fecha ${fecha} y hora ${hora}:
     Id: ${data.id}
     Aeropuerto de Salida: ${this.getCiudadYPais(data.ciudadOrigen)}
     Aeropuerto de Llegada: ${this.getCiudadYPais(data.ciudadDestino)}
     Capacidad de Carga Máxima: ${data.capacidadCargaMaxima}
     Capacidad de Carga Usado: ${data.capacidadCargaUsado}
     Fecha y Hora de Salida: ${this.formatDateTime(data.fechaHoraSalidaGMT0)}
     Fecha y Hora de Llegada: ${this.formatDateTime(data.fechaHoraLlegadaGMT0)}
     Tiempo Estimado de Vuelo: ${this.formatDuration(data.tiempoEstimadoVuelo)}
     Paquetes: ${data.paquetesAlmacenados.length === 0 ? 'No hay paquetes' : ''}
     ${data.paquetesAlmacenados.map(paquete => `
       ID del Paquete: ${paquete.id}
       ID del Envío: ${paquete.idEnvio}
       Cantidad de Paquetes: ${paquete.cantidadPaquetes}
     `).join('\n')}
   `;
 } else if (type === 'aeropuerto') {
  //console.log("fecha", fecha, " ",hora );
   content = `
     Información del Aeropuerto con fecha ${fecha} y hora ${hora}:
     Ciudad: ${data.nombreCiudad}
     País: ${data.pais}
     Capacidad de Almacenamiento Máximo: ${data.capacidadAlmacenamientoMaximo}
     Capacidad de Almacenamiento Usado: ${data.capacidadDeAlmacenamientoUsado}
     Coordenadas: ${this.formatCoordinates(data.coordinates)}
     Paquetes almacenados: ${data.paquetes.length === 0 ? 'No hay paquetes' : ''}
     ${data.paquetes.map(paquete => `
       ID del Paquete: ${paquete.id}
       ID del Envío: ${paquete.idEnvio}
       Cantidad de Paquetes: ${paquete.cantidadPaquetes}
     `).join('\n')}
   `;
 }
 const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
 const link = document.createElement('a');
 link.href = URL.createObjectURL(blob);
 link.download = `Detalles_${type}.doc`;
 link.click();
},


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
  width: 40%;
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


.paquetes-list {
  max-height: 200px; /* Ajusta esta altura según tus necesidades */
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.paquetes-title {
  color: #00B074; /* Color azul para el título de "Paquetes" */
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.paquete-item {
  background: #ffffff;
  border: 1px solid #00B074;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  color: #333;
}

.paquete-item p {
  margin: 5px 0;
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
  width: 40%;
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
  max-width: 230px;
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
  font-size: 15px;
  color: black !important;
  /* Cambia el color de la letra a negro */
  background-color: rgb(110, 110, 110) !important;
  /* Fondo rojo para el card */
  font-weight: bold !important;
  /* Letra en negrita */
}


.search-result-card:hover {
  background-color: #929292 !important;
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
  width: 40%;
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






.vuelos-carga-info {
  position: absolute;
  top: 70px; /* Ajusta este valor para moverlo más abajo */
  right: 10px;
  color: black; /* Cambiar el color de texto a negro */
  background-color: white; /* Fondo blanco */
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
  background-color: #817e7e;
  border-radius: 5px;
  overflow: hidden;
}

.carga-bar-inner {
  height: 15px; /* Ajuste de tamaño */
  background-color: #4caf50;
  width: 0;
}




.detail-container {
  position: absolute;
  top: 180px;
  left: 255px;
  width: 400px;
  max-height: 100px;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  /* Alto z-index para asegurar que está sobre otros elementos */

}


.custom-input {


font-weight: bold;

padding: 5px;
border-radius: 3px;
width: 100%;
box-sizing: border-box;
}

.custom-input::placeholder {
color: #aaa; /* Color del placeholder */
}




.checkbox-label {
  color: #e0e0e0; /* Un color claro */
} 

.checkbox-title {
  color: #e0e0e0; /* Un color claro */
  font-weight: bold;
  font-size: 1rem;
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
.flight-selected-icon {
  background-image: url('/img/flight-selected-icon.png');
}

.airport-selected-icon{
  background-image: url('/img/airport-selected-icon.png');
}
</style>