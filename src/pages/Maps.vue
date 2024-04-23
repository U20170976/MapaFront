<template>
  <div>
    <MglMap :accessToken="accessToken" 
            :mapStyle="mapStyle" :center="center" 
            :zoom="zoom" style="height:750px!important;" 
            :renderWorldCopies = false
            @onload="onMapLoaded">

      <MglNavigationControl
        position="top-center">
      </MglNavigationControl> 

      <MglGeojsonLayer
        :sourceId="sedes.data.id"
        :source="sedes"
        :layerId="sedesLayer.id"
        :layer="sedesLayer">
      </MglGeojsonLayer>

      <MglGeojsonLayer
        :sourceId="sedesCount.data.id"
        :source="sedesCount"
        :layerId="sedesLayerCount.id"
        :layer="sedesLayerCount">
      </MglGeojsonLayer>

      <MglGeojsonLayer
        :sourceId="rutas.data.id"
        :source="rutas"
        :layerId="rutasLayer.id"
        :layer="rutasLayer">
      </MglGeojsonLayer>

      <MglGeojsonLayer
        :sourceId="rutasCount.data.id"
        :source="rutasCount"
        :layerId="rutasLayerCount.id"
        :layer="rutasLayerCount">
      </MglGeojsonLayer>
      
    </MglMap>
    <!-- <div id="map" style="height:750px!important;"></div> -->

    
    <div class="row" style="margin-top:40px!important"> 
      <div class="col-md-3 pr-md-1">
        <base-input label="Fecha Inicio"
                  type="date"
                  format= "yyyy-MM-dd"
                  placeholder="Fecha Inicio"
                  v-model="fecha_inicio_simulacion">
        </base-input>
      </div>
      <div class="col-md-3 pr-md-1">
        <base-input label="Fecha Fin"
                  type="date"
                  format= "yyyy-MM-dd"
                  placeholder="Fecha Fin"
                  v-model="fecha_fin_simulacion">
        </base-input>
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

export default {
  components: {
    MglMap,
    MglNavigationControl,
    MglGeojsonLayer
  },
  data() {
    return {
      toggleIniciarDetener: true,
      toggleReanudar: false,
      accessToken: this.$store.state.map.token, // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      center: [5,15],
      zoom: 2,
      sedes:{
        type:'geojson',
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        data: {
          "id" : "sedes",
          "type": "FeatureCollection",
          "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          "features": Mapa.features
        },
        cluster:false,
        clusterMaxZoom: 14,
        clusterRadius: 50
      },
      sedesCount:{
        type:'geojson',
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        data: {
          "id" : "sedesCount",
          "type": "FeatureCollection",
          "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          "features": Mapa.features
        },
        
        cluster:false,
        clusterMaxZoom: 14,
        clusterRadius: 50
      },
      rutas:{
        type:'geojson',
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        data: {
          "id" : "rutas",
          "type": "FeatureCollection",
          "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          "features": Mapa2.features
        },
        cluster:false,
        clusterMaxZoom: 14,
        clusterRadius: 50
      },
      rutasCount:{
        type:'geojson',
        //data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        data: {
          "id" : "rutasCount",
          "type": "FeatureCollection",
          "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          "features": Mapa2.features
        },
        cluster:false,
        clusterMaxZoom: 14,
        clusterRadius: 50
      },
      sedesLayer:{
        id: 'sedesLayer',
        type: 'circle',
        source: 'sedes',
        filter: ['has', 'capacidad'],
        paint: {
            'circle-color':'#3b9e6e',
            'circle-radius':26

        }
      },
      sedesLayerCount:{
        id:'sedesLayerCount',
        type: 'symbol',
        source: 'sedesCount',
        filter: ['has', 'capacidad'],
        layout: {
            'text-field': '{capacidad}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
      },
      rutasLayer:{
        id: 'rutasLayer',
        type: 'circle',
        source: 'rutas',
        filter: ['has', 'capacidad'],
        paint: {
            'circle-color':'#8965e0',
            'circle-radius':15

        }
      },
      rutasLayerCount:{
        id:'rutasLayerCount',
        type: 'symbol',
        source: 'rutasCount',
        filter: ['has', 'capacidad'],
        layout: {
            'text-field': '{capacidad}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
      },

      myInterval: null,
      myIntervalReplan:null,

      fecha_inicio_simulacion: null,
      fecha_fin_simulacion: null,

      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      }
      
    }
  },
  mounted(){
    
    let vue = this;

  },
  destroyed:{
  },
  methods: {
    onMapLoaded(event) {
      // in component
      this.map = event.map;
      // or just to store if you want have access from other components
      this.$store.map = event.map;
    },
    iniciarSimulacion(){
      let vue = this;
      vue.toggleIniciarDetener = false;
      vue.toggleReanudar = false;

/*
      vue.myInterval = setInterval(()  =>{
        axios.get(vue.$store.state.appUri + '/sedes/listarSedes')
        .then(function(response){
          console.log(response.data)
          response.data.forEach(element => {  
            Mapa.features.push(
              { "type": "Feature",
                "properties": { "id": element.codigoOaci,  "capacidad": element.codigoOaci + ":  " + element.numero_paquetes.toString() },
                "geometry": { "type": "Point", "coordinates": [element.coordenadas[1],element.coordenadas[0],0.0]}
              }
            );       
          });
        })
        .catch(function(error){
          console.log(error);
        });
      }, 10000);
*/

      /*MOSTRAR RUTAS*/
      
      axios.post(vue.$store.state.appUri + '/simulacion/simular/'+ vue.fecha_inicio_simulacion.substring(8,10)+
                                                              '/'+vue.fecha_inicio_simulacion.substring(5,7)+
                                                              '/'+vue.fecha_inicio_simulacion.substring(0,4)+
                                                              '/'+vue.fecha_fin_simulacion.substring(8,10)+
                                                              '/'+vue.fecha_fin_simulacion.substring(5,7)+
                                                              '/'+vue.fecha_fin_simulacion.substring(0,4)+
                                                              '/'+Authentication.getProfile().id)
      .then(function(response){
        Simulation.runSimulation(response.data.simulacion.id);
        console.log(Simulation.getIdSimulation());

        /*
        axios.post(vue.$store.state.appUri + '/algoritmos/replanificacion2/'  +vue.fecha_inicio_simulacion.substring(8,10)+
                                                                          '/'+vue.fecha_inicio_simulacion.substring(5,7)+
                                                                          '/'+vue.fecha_inicio_simulacion.substring(0,4)+
                                                                          '/'+vue.fecha_fin_simulacion.substring(8,10)+
                                                                          '/'+vue.fecha_fin_simulacion.substring(5,7)+
                                                                          '/'+vue.fecha_fin_simulacion.substring(0,4)+
                                                                          '/'+Simulation.getIdSimulation());  
        */

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hour = date.getUTCHours();
        var min = date.getUTCMinutes();

        if(hour + 4 >= 24){
          hour= hour + 4 - 24;
        }

        axios.post(vue.$store.state.appUri + '/algoritmos/replanificacion/'  +vue.fecha_inicio_simulacion.substring(8,10)+
                                                                          '/'+vue.fecha_inicio_simulacion.substring(5,7)+
                                                                          '/'+vue.fecha_inicio_simulacion.substring(0,4)+
                                                                          '/'+hour.toString()+'/'+min.toString()+'/'+Simulation.getIdSimulation());



        /*TIMER REPLANIFICACION*/
        vue.myIntervalReplan = setInterval(()  =>{

          var date = new Date();
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          var hour = date.getUTCHours();
          var min = date.getUTCMinutes();
          var diaSim;

          if(hour + 4 >= 24){
            hour= hour + 4 - 24;
            diaSim = Number(vuefecha_inicio_simulacion) + 1;
          }else{
            hour= hour + 4;
          }

          axios.post(vue.$store.state.appUri + '/algoritmos/replanificacion/'  +diaSim.toString()+//  vue.fecha_inicio_simulacion.substring(8,10)+
                                                                            '/'+vue.fecha_inicio_simulacion.substring(5,7)+
                                                                            '/'+vue.fecha_inicio_simulacion.substring(0,4)+
                                                                            '/'+hour.toString()+'/'+min.toString()+'/'+Simulation.getIdSimulation())
          .then(function(response){
            axios.post(vue.$store.state.appUri + '/paquetes/actualizarEstadoPaquetes/' +day.toString()+
                                                                                    '/'+month.toString()+
                                                                                    '/'+year.toString()+
                                                                                    '/'+hour.toString()+
                                                                                    '/'+min.toString())
          });
        }, 600000);


        /*TIMER MAPA*/
        vue.myInterval = setInterval(()  =>{          


          axios.get(vue.$store.state.appUri + '/simulacion/mapa/'+Simulation.getIdSimulation())
          .then(function(response2){

            if(response2.data.c != null){              
              console.log("SE DETIENE LA SIMULACION");
              console.log(response2.data);
              Simulation.stopSimulation();
              clearInterval(vue.myInterval);
              this.notifyVue('top', 'center',4,NotificationTemplatePaqueteError);
            }else{
              console.log(response2.data);
              //Mapa.features = [];
              //Mapa2.features = [];
              
              response2.data.sedes.forEach(element => {               
                
              Mapa.features.push(
                  { "type": "Feature",
                    "properties": { "id": element.codigoOaci,  "capacidad": element.codigoOaci + ":  " + Math.abs(element.numero_paquetes).toString() },
                    "geometry": { "type": "Point", "coordinates": [element.latitud,element.longitud,0.0]}
                  }
                );       
              });


              response2.data.rutasDto.forEach(element => {  
              Mapa2.features.push(
                  { "type": "Feature",
                    "properties": { "id": element.id,  "capacidad": element.numero_paquetes_ruta.toString() },
                    "geometry": { "type": "Point", "coordinates": [element.coordenadas[1],element.coordenadas[0],0.0]}
                  }
                );       
              });
            }


          });
        }, 300000);

      });


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
    async simu(){
      let vue = this;
      let response = axios.post(vue.$store.state.appUri + '/algoritmos/replanificacion2/'  +vue.fecha_inicio_simulacion.substring(8,10)+
                                                                                        '/'+vue.fecha_inicio_simulacion.substring(5,7)+
                                                                                        '/'+vue.fecha_inicio_simulacion.substring(0,4)+
                                                                                        '/'+vue.fecha_fin_simulacion.substring(8,10)+
                                                                                        '/'+vue.fecha_fin_simulacion.substring(5,7)+
                                                                                        '/'+vue.fecha_fin_simulacion.substring(0,4)+
                                                                                        '/'+Simulation.getIdSimulation());
        console.log(response.data);  
    },
    notifyVue(verticalAlign, horizontalAlign,color,componente) {
      //const color = 4;
      //console.log(color);
      this.$notify({
        component: componente,
        icon: "tim-icons icon-bell-55",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: this.type[color],
        timeout: 0
      });
    }


    /*
    calcularTriangulacion(x1,x2,y1,y2,porcentaje){

      var distanciaX = Math.abs(x1-x2)*porcentaje;
      var distanciaY = Math.abs(y1-y2)*porcentaje;

      var nuevaCoordenada = [];

      if(x1>x2){
        nuevaCoordenada.push(x1-distanciaX);
      }else{
        nuevaCoordenada.push(x1+distanciaX);
      }

      if(y1>y2){
        nuevaCoordenada.push(y1-distanciaY);
      }else{
        nuevaCoordenada.push(y1+distanciaY);
      }

      return nuevaCoordenada.push(0.00);
    }
    */
  }
}
</script>
<style>
</style>
