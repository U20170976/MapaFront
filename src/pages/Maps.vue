<template>
  
  <div class="map-container">
   
   <div class="datetime-display">
     {{ currentDateTime }}
   </div>
   <div class="map-search-container">
     
     <input class="search-input" type="text" placeholder="Buscar envío">
     <input class="search-input" type="text" placeholder="Buscar aeropuerto">
     <input class="search-input" type="text" placeholder="Buscar vuelo">
   </div>
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

   
<MglMap
   class="main-map"
   :accessToken="accessToken"
   :mapStyle="mapStyle"
   :center="center"
   :zoom="zoom"
   style="height:750px!important;"
   @load="onMapLoaded"
 >
 />
   <!-- Antes estaba asi si puede cambiar algo para despues
 <MglNavigationControl
        position="top-center">
      </MglNavigationControl> 
    -->
 <MglGeojsonLayer
        :sourceId="'aeropuertos'"
        :layerId="'aeropuertosLayer'"
        :type="'symbol'"
        :source="geojsonAeropuertos"
        :layout="{
          'icon-image': ['get', 'icon-image'],
          'icon-size': 1.0,
          'icon-allow-overlap': true
        }"
        @click="onAirportClick"
      />


  <MglGeojsonLayer
  v-for="(vuelo, index) in filteredVuelos"
  :key="`vuelo-layer-${index}`"
  :sourceId="`vuelo-${index}`"
  :layerId="`avion-${index}`"
  :type="'symbol'"
  :source="createGeojsonSourceForVuelo(vuelo)"
  :layout="{
    'icon-image': ['get', 'icon-image'],
    'icon-size': 1.0,
    'icon-allow-overlap': true
  }"
  @click="onFlightClick"
/>

        <!-- Antes estaba asi si puede cambiar algo para despues
    <MglGeojsonLayer
      v-for="(envio, index) in envios"
      :key="`envio-layer-${index}`"
      :sourceId="`envio-${index}`"
      :layerId="`avionLayer-${envio.id}`"
      :type="'symbol'"
      :source="createGeojsonSourceForEnvio(envio)"
      :layout="{
        'icon-image': ['get', 'icon-image'],
        'icon-size': 1.0,
        'icon-allow-overlap': true
      }"
      @click="onFlightClick"
    />
    -->
 </MglMap>

 <div class="row" style="margin-top:40px!important"> 
      <div class="col-md-3 pr-md-1">
        <base-input label="Fecha Inicio"
                  type="date"
                  format= "yyyy-MM-dd"
                  placeholder="Fecha Inicio"
                  v-model="fecha_inicio_simulacion">
        </base-input>
      </div>

    </div>

    <div v-for="modal in openFlightModals" :key="modal.id" class="modal-overlay-flight" @click="closeFlightModal(modal.id)">
  <div class="modal-content-flight" @click.stop>
    <h2>Información del Vuelo</h2>
    <p><strong>Ciudad Origen:</strong> {{ modal.data.ciudadOrigen }}</p>
    <p><strong>Ciudad Destino:</strong> {{ modal.data.ciudadDestino }}</p>
    <p><strong>Hora de Salida:</strong> {{ modal.data.horaSalida }}</p>
    <p><strong>Hora de Llegada:</strong> {{ modal.data.horaLlegada }}</p>
    <p><strong>Capacidad de Carga Máxima:</strong> {{ modal.data.capacidadCargaMaxima }}</p>
    <p><strong>Capacidad de Carga Usado:</strong> {{ modal.data.capacidadCargaUsado }}</p>
    <p><strong>Fecha de Salida:</strong> {{ modal.data.fechaHoraSalidaGMT0 }}</p>
    <p><strong>Fecha de Llegada:</strong> {{ modal.data.fechaHoraLlegadaGMT0 }}</p>
    <p><strong>Tiempo Estimado de Vuelo:</strong> {{ modal.data.tiempoEstimadoVuelo }}</p>
    <button class="modal-button-flight" @click="closeFlightModal(modal.id)">Cerrar</button>
  </div>
</div>

 <div v-for="modal in openModals" :key="modal.id" class="modal-overlay-airport" @click="closeAirportModal(modal.id)">
      <div class="modal-content-airport" @click.stop>
        <h2>Información del Aeropuerto</h2>
        <p><strong>Nombre:</strong> {{ modal.data.nombreCiudad }}</p>
        <p><strong>País:</strong> {{ modal.data.pais }}</p>
        <p><strong>Capacidad de Almacenamiento Máximo:</strong> {{ modal.data.capacidadAlmacenamientoMaximo }}</p>
        <p><strong>Capacidad de Almacenamiento Usado:</strong> {{ modal.data.capacidadDeAlmacenamientoUsado }}</p>
        <p><strong>Coordenadas:</strong> {{ modal.data.coordinates.join(', ') }}</p>
        <button class="modal-button-airport" @click="closeAirportModal(modal.id)">Cerrar</button>
      </div>
    </div>
   <!-- <div id="map" style="height:750px!important;"></div> -->


  <div v-if="isVisibleResumen" >
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


   <div class="row">
     <div class="col-md-3" style="margin-top:40px!important" v-show="toggleIniciarDetener"> 
       <b-button  v-b-modal.modal-iniciar slot="footer" type="primary" fill>Iniciar</b-button>
       <b-modal id="modal-iniciar"
           @ok="iniciarSimulacion">
           ¿Deseas iniciar la simulación?
       </b-modal>
     </div>
     <div class="col-md-3" style="margin-top:40px!important" v-show="!toggleIniciarDetener"> 
       <b-button  v-b-modal.modal-cancelar slot="footer" type="primary" fill>Cancelar</b-button>
       <b-modal id="modal-cancelar"
           @ok="cancelarSimulacion">
           ¿Deseas cancelar la simulación?
       </b-modal>
     </div>
     <div class="col-md-3" style="margin-top:40px!important" v-show="!toggleIniciarDetener && !toggleReanudar"> 
       <b-button  v-b-modal.modal-detener slot="footer" type="primary" fill>Detener</b-button>
       <b-modal id="modal-detener"
           @ok="detenerSimulacion">
           ¿Deseas detener la simulacion?
       </b-modal>
     </div>
     <div class="col-md-3" style="margin-top:40px!important" v-show="!toggleIniciarDetener && toggleReanudar"> 
       <b-button  v-b-modal.modal-reanudar slot="footer" type="primary" fill>Reanudar</b-button>
       <b-modal id="modal-reanudar"
           @ok="reanudarSimulacion">
           ¿Deseas reanudar la simulación?
       </b-modal>
     </div>
     <div class="col-md-3" style="margin-top:40px!important">
        <b-button @click="iniciarPlanificacion" type="primary" fill>Iniciar Planificacion</b-button>
      </div>
   
   </div>
  </div>
</template>

<script>
import Mapbox from "mapbox-gl";
import {MglMap, MglNavigationControl, MglGeojsonLayer} from "vue-mapbox";
import Mapa from '@/store/map.json';
import Mapa2 from '@/store/map2.json';
import axios from 'axios';
import Authentication from '@/store/authentication.js';
import Simulation from '@/store/simulation.js';


const 
aeropuertos = [
/*{
        id: 0,
        codigoOACI: "SKBO",
        nombreCiudad: "Bogotá",
        pais: "Colombia",
        codigoIATA: "bogo",
        husoHorario: -5,
        capacidadAlmacenamientoMaximo: 430,
        capacidadDeAlmacenamientoUsado: 400,
        latitud: "4.70139",
        longitud: "-74.1469",
        coordinates: ["-74.1469", "4.70139"],
        usoAlmacenamiento: {}
      },
      {
        id: 1,
        codigoOACI: "SEQM",
        nombreCiudad: "Quito",
        pais: "Ecuador",
        codigoIATA: "quit",
        husoHorario: -5,
        capacidadAlmacenamientoMaximo: 410,
        capacidadDeAlmacenamientoUsado: 240,
        latitud: "0.113333",
        longitud: "-78.3583",
        coordinates: ["-78.3583", "0.113333"],
        usoAlmacenamiento: {}
      },
      {
        id: 2,
        codigoOACI: "SVMI",
        nombreCiudad: "Caracas",
        pais: "Venezuela",
        codigoIATA: "cara",
        husoHorario: -4,
        capacidadAlmacenamientoMaximo: 400,
        capacidadDeAlmacenamientoUsado: 0,
        latitud: "10.6031",
        longitud: "-66.9903",
        coordinates: ["-66.9903", "10.6031"],
        usoAlmacenamiento: {}
      },
      {
        id: 3,
        codigoOACI: "SBBR",
        nombreCiudad: "Brasilia",
        pais: "Brasil",
        codigoIATA: "bras",
        husoHorario: -3,
        capacidadAlmacenamientoMaximo: 480,
        capacidadDeAlmacenamientoUsado: 0,
        latitud: "-15.8645",
        longitud: "-47.9178",
        coordinates: ["-47.9178", "-15.8645"],
        usoAlmacenamiento: {}
      }*/
    ];


    const calendarioVuelos = {
      "2024-01-11": [
            {
                "id": 1,
                "ciudadOrigen": "RKSI",
                "ciudadDestino": "LOWW",
                "horaSalida": "00:01:00",
                "horaLlegada": "20:36:00",
                "capacidadCargaMaxima": 340,
                "capacidadCargaUsado": 0,
                "fechaSalida": "2024-01-02",
                "fechaLlegada": "2024-01-02",
                "tiempoEstimadoVuelo": "PT3H35M",
                "fechaHoraSalidaGMT0": "2024-01-10T15:01:00",
                "fechaHoraLlegadaGMT0": "2024-01-10T18:36:00",
                "latitud": "37Â° 27' 48\" N",
                "longitud": "126Â° 26' 24\" E",
                "origen": [
                    126.44,
                    37.46333333333334
                ],
                "destino": [
                    16.570833333333333,
                    48.11083333333333
                ]
            },
            {
                "id": 2,
                "ciudadOrigen": "RKSI",
                "ciudadDestino": "VTBS",
                "horaSalida": "00:09:00",
                "horaLlegada": "03:31:00",
                "capacidadCargaMaxima": 340,
                "capacidadCargaUsado": 0,
                "fechaSalida": "2024-01-02",
                "fechaLlegada": "2024-01-02",
                "tiempoEstimadoVuelo": "PT5H22M",
                "fechaHoraSalidaGMT0": "2024-01-10T15:09:00",
                "fechaHoraLlegadaGMT0": "2024-01-10T20:31:00",
                "latitud": "37Â° 27' 48\" N",
                "longitud": "126Â° 26' 24\" E",
                "origen": [
                    126.44,
                    37.46333333333334
                ],
                "destino": [
                    100.74722222222222,
                    13.680833333333332
                ]
            },
            {
                "id": 3,
                "ciudadOrigen": "RKSI",
                "ciudadDestino": "UMMS",
                "horaSalida": "00:20:00",
                "horaLlegada": "22:03:00",
                "capacidadCargaMaxima": 300,
                "capacidadCargaUsado": 0,
                "fechaSalida": "2024-01-02",
                "fechaLlegada": "2024-01-02",
                "tiempoEstimadoVuelo": "PT3H43M",
                "fechaHoraSalidaGMT0": "2024-01-10T15:20:00",
                "fechaHoraLlegadaGMT0": "2024-01-10T19:03:00",
                "latitud": "37Â° 27' 48\" N",
                "longitud": "126Â° 26' 24\" E",
                "origen": [
                    126.44,
                    37.46333333333334
                ],
                "destino": [
                    28.0325,
                    53.8825
                ]
            },
          ]
    };


const       envios = [
      {
        id: 0,
        idEnvio: "SBBR000000001",
        ciudadOrigen: "SBBR",
        ciudadDestino: "SEQM",
        fechaEnvio: "2024-03-03",
        horaEnvio: "00:01:00",
        cantidadPaquetes: 2,
       // estadoEnvio: null,
        ruta: {
          id: 0,
          vuelos: [
            {
              id: 0,
              ciudadOrigen: "SBBR",
              ciudadDestino: "SEQM",
              horaSalida: "02:16:00",
              horaLlegada: "14:08:00",
              capacidadCargaMaxima: 340,
              capacidadCargaUsado: 300,
              fechaSalida: "2024-03-03",
              fechaLlegada: "2024-03-03",
              tiempoEstimadoVuelo: "PT6H52M",
              origen: [-47.9178, -15.8645], // Bogotá
              destino: [-78.3583, 0.113333], // Quito
            }
          ],
          fitness: 33908.51018350059,
          cantidadVuelos: 1
        }
      },
      {
        id: 1,
        idEnvio: "SVMI000000001",
        ciudadOrigen: "SVMI",
        ciudadDestino: "SKBO",
        fechaEnvio: "2024-01-03",
        horaEnvio: "00:03:00",
        cantidadPaquetes: 2,
      //  estadoEnvio: null,
        ruta: {
          id: 1,
          vuelos: [
            {
              id: 1,
              ciudadOrigen: "SVMI",
              ciudadDestino: "SBBR",
              horaSalida: "02:05:00",
              horaLlegada: "07:28:00",
              capacidadCargaMaxima: 300,
              capacidadCargaUsado: 2,
              fechaSalida: "2024-01-03",
              fechaLlegada: "2024-01-03",
              tiempoEstimadoVuelo: "PT6H23M",
              origen: [-66.9903, 10.6031], // Bogotá
              destino:[-47.9178, -15.8645], // Quito
            },
            {
              id: 2,
              ciudadOrigen: "SBBR",
              ciudadDestino: "SEQM",
              horaSalida: "15:33:00",
              horaLlegada: "17:14:00",
              capacidadCargaMaxima: 300,
              capacidadCargaUsado: 280,
              fechaSalida: "2024-01-03",
              fechaLlegada: "2024-01-03",
              tiempoEstimadoVuelo: "PT2H41M",
              origen:[-47.9178, -15.8645], // Bogotá
              destino: [-78.3583, 0.113333],  // Quito
            },
            {
              id: 3,
              ciudadOrigen: "SEQM",
              ciudadDestino: "SKBO",
              horaSalida: "19:28:00",
              horaLlegada: "06:08:00",
              capacidadCargaMaxima: 360,
              capacidadCargaUsado: 390,
              fechaSalida: "2024-01-03",
              fechaLlegada: "2024-01-04",
              tiempoEstimadoVuelo: "PT15H40M",
              origen: [-78.3583, 0.113333], // Bogotá
              destino:  [-74.1469, 4.70139],  // Quito
            }

          ],
          fitness: 32067.93361867229,
          cantidadVuelos: 3
        }
      }
    ];




export default {
  props: ['title', 'content', 'isVisible','isVisibleResumen'],
 components: {
   MglMap,
   MglNavigationControl,
   MglGeojsonLayer
 },
 data() {
   return {
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
     currentDateTime: new Date().toLocaleString('es-ES', { 
       timeZone: 'America/Lima', 
       year: 'numeric',
       month: '2-digit',
       day: '2-digit',
       hour: '2-digit', 
       minute: '2-digit', 
       timeZoneName: 'short' 
     }),
     toggleIniciarDetener: true,
     toggleReanudar: false,
     accessToken: this.$store.state.map.token, // your access token. Needed if you using Mapbox maps
     mapStyle: 'mapbox://styles/mapbox/dark-v10',
     center: [5,15],
     zoom: 2,
    

     myInterval: null,
     myIntervalReplan:null,

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
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          id: vuelo.id,
          'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima)
        },
        geometry: {
          type: 'Point',
          coordinates: vuelo.origen
        }
      }]
    };
  },
  // Otras funciones...

 
      envios: [
      {
        id: 0,
        idEnvio: "SBBR000000001",
        ciudadOrigen: "SBBR",
        ciudadDestino: "SEQM",
        fechaEnvio: "2024-03-03",
        horaEnvio: "00:01:00",
        cantidadPaquetes: 2,
        estadoEnvio: null,
        ruta: {
          id: 0,
          vuelos: [
            {
              id: 0,
              ciudadOrigen: "SBBR",
              ciudadDestino: "SEQM",
              horaSalida: "02:16:00",
              horaLlegada: "14:08:00",
              capacidadCargaMaxima: 340,
              capacidadCargaUsado: 300,
              fechaSalida: "2024-03-03",
              fechaLlegada: "2024-03-03",
              tiempoEstimadoVuelo: "PT6H52M",
              origen: [-47.9178, -15.8645], // Bogotá
              destino: [-78.3583, 0.113333], // Quito
            }
          ],
          fitness: 33908.51018350059,
          cantidadVuelos: 1
        }
      },
      {
        id: 1,
        idEnvio: "SVMI000000001",
        ciudadOrigen: "SVMI",
        ciudadDestino: "SKBO",
        fechaEnvio: "2024-01-03",
        horaEnvio: "00:03:00",
        cantidadPaquetes: 2,
        estadoEnvio: null,
        ruta: {
          id: 1,
          vuelos: [
            {
              id: 1,
              ciudadOrigen: "SVMI",
              ciudadDestino: "SBBR",
              horaSalida: "02:05:00",
              horaLlegada: "07:28:00",
              capacidadCargaMaxima: 300,
              capacidadCargaUsado: 2,
              fechaSalida: "2024-01-03",
              fechaLlegada: "2024-01-03",
              tiempoEstimadoVuelo: "PT6H23M",
              origen: [-66.9903, 10.6031], // Bogotá
              destino:[-47.9178, -15.8645], // Quito
            },
            {
              id: 2,
              ciudadOrigen: "SBBR",
              ciudadDestino: "SEQM",
              horaSalida: "15:33:00",
              horaLlegada: "17:14:00",
              capacidadCargaMaxima: 300,
              capacidadCargaUsado: 280,
              fechaSalida: "2024-01-03",
              fechaLlegada: "2024-01-03",
              tiempoEstimadoVuelo: "PT2H41M",
              origen:[-47.9178, -15.8645], // Bogotá
              destino: [-78.3583, 0.113333],  // Quito
            },
            {
              id: 3,
              ciudadOrigen: "SEQM",
              ciudadDestino: "SKBO",
              horaSalida: "19:28:00",
              horaLlegada: "06:08:00",
              capacidadCargaMaxima: 360,
              capacidadCargaUsado: 390,
              fechaSalida: "2024-01-03",
              fechaLlegada: "2024-01-04",
              tiempoEstimadoVuelo: "PT15H40M",
              origen: [-78.3583, 0.113333], // Bogotá
              destino:  [-74.1469, 4.70139],  // Quito
            }

          ],
          fitness: 32067.93361867229,
          cantidadVuelos: 3
        }
      }
    ],
     currentFlightIndex: 0,
     isSimulating: false,
    
    
     
   }
 },
 mounted(){
  console.log("Aeropuertos disponibles:", aeropuertos);
  console.log("Vuelos disponibles:", calendarioVuelos);

  this.fetchAeropuertos();
   let vue = this;
   this.updateTime();
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
 destroyed(){
  clearInterval(this.setInterval); 
 },
 methods: {
  fetchAeropuertos() {
    axios.get('http://localhost/api/aeropuertos')
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
  if ( vuelo.capacidadCargaUsado > vuelo.capacidadCargaMaxima) {
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


  
updateTime() {
    if (!this.fecha_inicio_simulacion) {
      console.error("Fecha de inicio de simulación no está definida");
      return;
    }

    //const startDateTime = new Date(this.fecha_inicio_simulacion + 'T00:00:00Z');
    const startDateTime = new Date('2024-01-07T14:30:00Z');
    
    this.simulationDateTime = startDateTime;
    this.updateCurrentDateTimeDisplay();

    this.simulationInterval = setInterval(() => {
      this.simulationDateTime = new Date(this.simulationDateTime.getTime() + 360000); // Agregar// Agregar 6 minutos al tiempo de simulación cada segundo en tiempo real
      this.updateCurrentDateTimeDisplay();
      this.checkAndAnimateFlights();
    }, 1000);
  },

  checkAndAnimateFlights() {
    const currentTime = this.simulationDateTime.getTime();
    console.log(`Tiempo de simulación actual: ${new Date(currentTime).toISOString()}`);
    this.pendingFlights.forEach(vuelo => {
      const vueloStartTime = new Date(vuelo.fechaHoraSalidaGMT0).getTime();

const cincoHorasEnMilisegundos = 5 * 60 * 60 * 1000; // 5 horas convertidas a milisegundos
const nuevoVueloStartTime = new Date(vueloStartTime - cincoHorasEnMilisegundos);
      if (currentTime >= nuevoVueloStartTime && !vuelo.animated) {
        vuelo.animated = true; // Marcar el vuelo como animado
        console.log(`Animando vuelo con ID ${vuelo.id} a las ${new Date(vueloStartTime).toISOString()}`);
        this.animateFlight(vuelo);
      }
    });
    this.pendingFlights = this.pendingFlights.filter(vuelo => !vuelo.animated); // Remover los vuelos animados
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
   if (loadedImages === imagesToLoad.length ) {
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


onMapLoaded(event) {
  // Establecer referencia al mapa en componente y store global si es necesario
  this.map = event.map;
  this.$store.map = event.map;

  // Cargar todas las imágenes necesarias antes de configurar las capas
  this.loadImages(() => {
    // Una vez que las imágenes estén cargadas, configurar las capas
    this.setupAirportLayer(); // Configurar la capa de aeropuertos primero
   // this.setupFlightLayers(); // Configurar las capas de vuelos después
   this.map.on('click', 'aeropuertosLayer', this.onAirportClick);

    // Animar vuelos solo después de que todo está correctamente configurado
    this.animateFlights();  // Luego inicia la animación
    
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
 vue.toggleIniciarDetener = false;
 vue.toggleReanudar = false;
 this.isAnimating = true;
 if (!this.isSimulating) {
   this.isSimulating = true;
   this.updateTime(); 
 //  this.setupFlightLayers();  // Configura las capas primero
  // this.animateFlights();  // Luego inicia la animación
 };
 /*this.envios.forEach(envio => {
      envio.ruta.vuelos.forEach(vuelo => {
        vuelo.capacidadCargaUsado += envio.cantidadPaquetes;  // Incrementar capacidad usada al iniciar el vuelo
        this.updateAirportCapacitiesColapse(vuelo.ciudadOrigen, -envio.cantidadPaquetes); // Disminuir capacidad usada al iniciar el vuelo
      });
      //this.animateEnvio(envio);
    });*/
},

async iniciarPlanificacion() {
try {
      // Iniciar la simulación
      const response = await axios.get('http://localhost/api/simulacion/semanal/iniciar');
      console.log("Simulación iniciada:", response.data);
      await this.checkSimulationStatus();

// Esperar un tiempo antes de obtener los resultados
setTimeout(async () => {
  await this.fetchSimulationResults();
}, 25000); // Ajusta el tiempo de espera según sea necesario

    

    } catch (error) {
      console.error("Error iniciando simulación:", error);
    }
  },


  async checkSimulationStatus() {
    try {
      const response = await axios.get('http://localhost/api/simulacion/semanal/estado');
      console.log("Estado de la simulación:", response.data);
      // Manejar la respuesta de estado si es necesario
    } catch (error) {
      console.error("Error verificando estado de simulación:", error);
    }
  },

  async fetchSimulationResults() {
    try {
      const response = await axios.get('http://localhost/api/simulacion/semanal/resultados');
      console.log("Resultados de la simulación:", response.data);

      const fetchedVuelos = response.data.calendarioVuelos;
      const fechaInicio = new Date('2024-01-01T00:00:00');
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + 7);

      const filteredVuelos = {};
      this.pendingFlights = [];

      let count = 0;

      Object.keys(fetchedVuelos).forEach(fecha => {
        if (count >= 20) return;
        const fechaVuelo = new Date(fecha);
        if (fechaVuelo >= fechaInicio && fechaVuelo <= fechaFin) {
          console.log(fechaVuelo+"  "+fechaInicio+"   "+ fechaFin);
          const vuelosDelDia = fetchedVuelos[fecha];
          filteredVuelos[fecha] = [];
          vuelosDelDia.forEach(vuelo => {
            if (count < 20) {
              vuelo.animated = false; // Agregar propiedad animated
              filteredVuelos[fecha].push(vuelo);
              this.pendingFlights.push(vuelo);
              count++;
            }
          });
        }
      });
      this.calendarioVuelos = filteredVuelos;
      console.log("Vuelos disponibles ACTUALIZADOS:", filteredVuelos);
    } catch (error) {
      console.error("Error obteniendo resultados de la simulación:", error);
    }
  },


animateFlights() {
        console.log("Animating Flights with filtered flights:", JSON.stringify(this.filteredVuelos, null, 2));
        this.filteredVuelos.forEach(vuelo => {
            this.animateFlight(vuelo);
        });
    },

 /*   animateEnvio(envio) {
      let currentFlight = 0;
      const moveNextFlight = () => {
        if (currentFlight < envio.ruta.vuelos.length) {
          this.animateFlight(envio.ruta.vuelos[currentFlight],envio.cantidadPaquetes ,envio.id, () => {
            currentFlight++;
            moveNextFlight();
          });
        }
      };
      moveNextFlight();
    },

*/
    animateFlight(vuelo ) {
      if ( vuelo.capacidadCargaUsado > vuelo.capacidadCargaMaxima) {

    this.collapseReason = 'EXCESO DE PAQUETES EN VUELOS';
    console.log("Collapse detected!");
    //this.showCollapseAlert("collapseReason", "llapseDetails");
    this.handleCollapse();
    return; //AVISO CON ESTO SE PODRIA PARAR EL MOVIMIENTO
  }
 // console.log(`Updating capacities for ${vuelo.ciudadDestino} with ${cantidadPaquetes} packages`);

  this.updateAirportCapacitiesColapse(vuelo.ciudadDestino, vuelo.cantidadPaquetes);
  console.log(vuelo);
  const sourceId = `vuelo-${vuelo.id}`;
      if (!this.map.getSource(sourceId)) {
        console.log(`Updating source ${sourceId}`);
        this.map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {
              id: vuelo.id,
          'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima)
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
            'icon-size': 0.5,
            'icon-allow-overlap': true
          }
        });
 
     /*   this.map.on('click', `avion-${envioId}`, (e) => {
          console.log("LLega");
  const vueloId = e.features[0].properties.id; // Obtener el ID del vuelo del evento
  const vuelo = this.envios.find(envio => envio.id === envioId).ruta.vuelos.find(v => v.id === vueloId);
  this.onFlightClick(e, vuelo);
});*/  this.map.on('click', `avion-${vuelo.id}`, (e) => {
  const vueloId = e.features[0].properties.id;
          const clickedVuelo = this.filteredVuelos.find(v => v.id === vueloId);
          this.onFlightClick(e, clickedVuelo);
        });

      }
      console.log("sadas")
      const flightDurationMinutes = this.parseDurationToMinutes(vuelo.tiempoEstimadoVuelo);
      const flightDurationSimulationSeconds = flightDurationMinutes * 60;
      const realTimeSeconds = flightDurationSimulationSeconds / 360;  // Convert to real time seconds based on 2160 simulated seconds = 1 real second

 // Number of animation steps

      console.log(flightDurationMinutes)
   //   console.log(realTimePerSimulatedSecond)
   const steps = 100; // Define the total number of steps for smooth animation
  const interval = (realTimeSeconds * 1000) / steps; 
      console.log(steps)
   // let steps =336;
    let currentStep = 0;
    let currentPos = [...vuelo.origen];
    const incrementLat = (vuelo.destino[1] - vuelo.origen[1]) / steps;
    const incrementLng = (vuelo.destino[0] - vuelo.origen[0]) / steps;

    const move = () => {
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
              'icon-image': this.calculateFlightIcon(vuelo.capacidadCargaUsado, vuelo.capacidadCargaMaxima)
            }
          });
        }
        currentStep++;
      //  requestAnimationFrame(move);
      setTimeout(move, interval);
      }
    };
    move();
    },
  
    updateAirportCapacitiesColapse(codigoOACI, paquetes) {
   //   console.log(`Updating capacities for ${codigoOACI} with ${paquetes} packages`);
   this.collapseReason = 'EXCESO DE PAQUETES EN AEROPUERTOS';
    const aeropuerto = aeropuertos.find(a => a.codigoOACI === codigoOACI);
    if (aeropuerto) {
        aeropuerto.capacidadDeAlmacenamientoUsado += paquetes;
        console.log(`New storage used: ${aeropuerto.capacidadDeAlmacenamientoUsado}/${aeropuerto.capacidadAlmacenamientoMaximo}`);
        if (aeropuerto.capacidadDeAlmacenamientoUsado > aeropuerto.capacidadAlmacenamientoMaximo) {
            console.log("Airport collapse detected!");
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
  if ( aeropuertos.some(aero => aero.capacidadDeAlmacenamientoUsado > aero.capacidadAlmacenamientoMaximo) || 
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

   detenerSimulacion(){
     let vue = this;
     vue.toggleIniciarDetener = false;
     vue.toggleReanudar = true;
     
   },
   reanudarSimulacion(){
     let vue = this;
     vue.toggleIniciarDetener = false;
     vue.toggleReanudar = false;
   },
   cancelarSimulacion(){
     let vue = this;
     vue.toggleIniciarDetener = true;
     console.log("SE DETIENE LA SIMULACION");
     clearInterval(vue.myInterval);
     Simulation.stopSimulation();
     console.log(vue.fecha_fin_simulacion);
   },
 
   onAirportClick(event) {
      const feature = event.features[0];
      
      const aeropuerto = this.aeropuertos.find(a => a.codigoOACI === feature.properties.codigoOACI);
      console.log(aeropuerto)
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
    console.log("Información del vuelo clickeado:", vuelo);
    if (vuelo) {
      this.openFlightModals.push({
        id: `${vuelo.id}-${new Date().getTime()}`,
        data: vuelo
      });
    }
  },
    closeFlightModal(id) {
      this.openFlightModals = this.openFlightModals.filter(modal => modal.id !== id);
    },



 },
 computed: {
  /*
  filteredEnvios() {
    const fechaInicio = new Date(this.fecha_inicio_simulacion);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 7);

    const filtered = this.envios.filter(envio => {
      return envio.ruta.vuelos.some(vuelo => {
        const fechaSalida = new Date(`${vuelo.fechaSalida}T${vuelo.horaSalida}`);
        const fechaLlegada = new Date(`${vuelo.fechaLlegada}T${vuelo.horaLlegada}`);

        return fechaSalida >= fechaInicio && fechaLlegada <= fechaFin;
      });
    });

  
    return filtered;
  },*/
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
 padding: 5px 10px;
 border-radius: 5px;
 z-index: 1001; /* Asegúrate de que esté visible sobre el mapa */
}

.map-container {
 position: relative;
 height: 100vh;
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

.map-search-container {
 .map-search-container {
 position: absolute;
 top: 60px;
 left: 10px; /* Ajusta según necesidad */
 z-index: 1000;
 width: 200px; /* Ancho fijo para todos los inputs */
 padding: 10px;
 background-color: rgba(0, 0, 0, 0.5);
 display: flex;
 flex-direction: column; /* Cambio aquí */
 align-items: flex-start; /* Alinear al inicio (izquierda) */
}
}

.search-input {
 flex: 1;
 margin: 0 5px;
 padding: 10px;
 border: none;
 border-radius: 5px;
}

.main-map {
 height: 100%;
 width: 100%;
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
 font-size: 1em; /* Ajusta el tamaño como desees */
 color: #fff; /* Color para 'Redex' */
 font-weight: bold;
}

.brand-title-point {
 font-size: 1em; /* Asegúrate de que sea del mismo tamaño que .brand-title para alineación adecuada */
 color: #00B074; /* Color para el punto */
 font-weight: bold;
}

.brand-tagline {
 font-size: 1em; /* Ajusta el tamaño del tagline */
 color: #B9BBBD; /* Color para 'Always on Time' */
 font-weight: bold;
 margin-bottom: 199px;
 display: flex;
 align-items: baseline; /* Alinea correctamente el texto y el punto */
 gap: 0.2em; /* Ajusta el espacio entre 'Redex' y el punto */
}

/* Si deseas que 'Redex.' esté en una sola línea, puedes usar display: flex en el contenedor */
.brand {
 display: flex;
 align-items: baseline; /* Alinea correctamente el texto y el punto */
 gap: 0.2em; /* Ajusta el espacio entre 'Redex' y el punto */
 
 margin-bottom: -5px; /* Ajusta esto para aumentar el espacio entre el título y el subtítulo */

}





.map-legend {
 color: black; /* Cambia el color de texto a negro */
 position: absolute;
 bottom: 120px;
 right: 20px;
 z-index: 1000;
 background: #fff;
 padding: 10px;
 border-radius: 5px;
 box-shadow: 0 2px 4px rgba(0,0,0,0.3);
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
 margin: 0; /* Remove margin-top when visible */
 display: none; /* Hidden by default */
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

.less-50 { background: red; }
.between-50-80 { background: orange; }
.greater-80 { background: green; }

.icon {
 width: 16px;
 height: 16px;
 display: inline-block;
 background-size: contain;
 background-repeat: no-repeat;
 margin-right: 10px;
}

.modal-content {
  background: white; /* Fondo blanco para alto contraste */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  color: black; /* Color de texto general a negro */
  width: auto;
  max-width: 500px; /* Ajusta el ancho máximo según necesites */
  text-align: left; /* Asegura que el texto esté alineado a la izquierda */
}

.modal-content h2 {
  color: red; /* Color rojo para el título del colapso */
  font-weight: bold;
  margin: 0 auto; /* Centra la imagen */
}

.modal-content strong {
  color: red; /* Color rojo para las palabras clave */
  font-weight: bold;
}

.modal-content p, .modal-content ul {
  color: black; /* Resto del texto en negro */
}

.modal-button {
  background-color: red; /* Fondo rojo para el botón */
  color: white; /* Texto blanco para el botón */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px; /* Espaciado superior para separarlo del contenido */
  font-weight: bold;
}

.modal-button:hover {
  background-color: darkred; /* Un rojo más oscuro al pasar el mouse */
}
.modal-content li strong {
  color: black; /* Cambia el color de los términos clave a negro */
  font-weight: normal; /* Si deseas que no sean bold */
}

.modal-content li {
  color: black; /* Todos los textos de los items en negro */
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
  z-index: 10000; /* Alto z-index para asegurar que está sobre otros elementos */
}

.collapse-icon {
  background-image: url('/img/carita.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 50px; /* Ajusta el tamaño según tus necesidades */
  height: 50px; /* Ajusta el tamaño según tus necesidades */
  display: block;
  margin: 0 auto; /* Centra la imagen */
}





.modal-content-airport {
  background: white; /* Fondo blanco para alto contraste */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  color: black; /* Color de texto general a negro */
  width: auto;
  max-width: 500px; /* Ajusta el ancho máximo según necesites */
  text-align: left; /* Asegura que el texto esté alineado a la izquierda */
  display: flex;
  flex-direction: column; /* Alinea el contenido verticalmente */
  align-items: left; /* Centra horizontalmente el contenido */
}

.modal-content-airport h2 {
  color: #00B074; /* Color verde para el título del colapso */
  font-weight: bold;
  margin: 0 auto; /* Centra la imagen */
}

.modal-content-airport strong {
  color: #00B074; /* Color verde para las palabras clave */
  font-weight: bold;
}

.modal-content-airport p, .modal-content-airport ul {
  color: black; /* Resto del texto en negro */
}

.modal-button-airport {
  background-color: #00B074; /* Fondo verde para el botón */
  color: white; /* Texto blanco para el botón */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px; /* Espaciado superior para separarlo del contenido */
  font-weight: bold;
  align-self: center; /* Centra el botón horizontalmente */
}

.modal-button-airport:hover {
  background-color: darkgreen; /* Un verde más oscuro al pasar el mouse */
}

.modal-content-airport li strong {
  color: black; /* Cambia el color de los términos clave a negro */
  font-weight: normal; /* Si deseas que no sean bold */
}

.modal-content-airport li {
  color: black; /* Todos los textos de los items en negro */
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
  z-index: 10000; /* Alto z-index para asegurar que está sobre otros elementos */
}



.modal-content-flight {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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

.modal-content-flight p, .modal-content-flight ul {
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





.airplane-icon { background-image: url('/img/avion.png'); }
.airport-icon { background-image: url('/img/ubi.png'); }
.airport-green { background-image: url('/img/airport-green.png'); }
.airport-orange { background-image: url('/img/airport-orange.png'); }
.airport-red { background-image: url('/img/airport-red.png'); }
.flight-green { background-image: url('/img/flight-green.png'); }
.flight-orange { background-image: url('/img/flight-orange.png'); }
.flight-red { background-image: url('/img/flight-red.png'); }

</style>