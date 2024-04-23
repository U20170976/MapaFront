<template>
  <card>
    <h5 slot="header" class="title">Información de la Ruta</h5>

    
    <div class="row">    

      <div class="col-md-4 pr-md-1">
        <div class="form-group">

          <base-input label="ID"
                    v-model="ruta.id"
                    disabled>
          </base-input>

        </div>
      </div>

    </div>

    <div class="row">
      <div class="col-md-4 pr-md-2 ">          
          <base-input type="number"
                    label="Capacidad contratada"
                    v-model="ruta.capacidad_contratada">
          </base-input>          
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 pr-md-2 ">          
          <base-input label="Fecha salida Origen"
                    v-model="ruta.fechaOrigen"
                    disabled>
          </base-input>          
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 pr-md-1 ">
        <base-input label="Fecha llegada Destino"
                  v-model="ruta.fechaDestino"
                  disabled>
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input label="Número de paquetes en la ruta"
                  v-model="ruta.numero_paquetes_ruta"
                  disabled>
        </base-input>
      </div>
    </div>

    
    <div class="row">      

      <!-- 
      actualizar para que se pueda cambiar el valor
      -->
      <div class="col-md-5 pr-md-1">
          <base-input type="number" min="600" max='1000'
                    label="Hora inicio (min.)"
                    v-model="horainicio" 
                    >
          </base-input>
      </div>

      <!-- 
      actualizar el servicio para que vaya cambiando el valor
      -->
      <div class="col-md-5 pr-md-1">
        <base-input type="number" min="600" max='1000'
                  label="Hora fin (min.)"
                  v-model="horafin">
        </base-input>
      </div>

    </div>
    
    <base-button slot="footer" type="primary" fill @click="enviarRuta()">Aceptar</base-button>
    <base-button slot="footer" fill @click="regresarAlListar()">Cancelar</base-button>

  </card>
</template>


<script>
  import axios from 'axios';
  import NotificationTemplate from '../Notifications/NotificationTemplate';
  import NotificationTemplateSedeSuccess from '../Notifications/NotificationTemplateSedeSuccess';
  import NotificationTemplateSedeError from '../Notifications/NotificationTemplateSedeError';
  import { BaseAlert } from '@/components';

  export default {
    components: {
      
    },
    data() {
      return {
        ruta:{
          id: null,
          capacidad_contratada: 0,
          fechaOrigen: null,
          fechaDestino: null,
          numero_paquetes_ruta: null,
          capacidad_min: null,
          capacidad_max: null
        },
        horainicio: 100,
        horafin: 500,
        capacidad_max: null,
        errors: [],
        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        }

      };
    },
    mounted(){
      let vue = this;
      
      axios.get(vue.$store.state.appUri+'/rutas/obtenerPorId/'+ vue.$route.params.idRuta) 
      .then(function(response){
        //console.log(vue.$route.params.idRuta);
        //console.log(response.data);

        vue.ruta.id = Number(vue.$route.params.idRuta); // FALTA PASAR COMO ENTERO
        vue.ruta.capacidad_contratada = Number(response.data.capacidad_contratada); // FALTA PASAR COMO ENTERO
        vue.ruta.fechaOrigen = response.data.fechaOrigen.substring(0,10);
        vue.ruta.fechaDestino = response.data.fechaDestino.substring(0,10);
        vue.ruta.numero_paquetes_ruta = response.data.numero_paquetes_ruta;
        vue.ruta.capacidad_min = response.data.capacidad_min;
        vue.ruta.capacidad_max = response.data.capacidad_max;
      })
      .catch(e => {
        vue.errors.push(e)
      });
    },
    methods:{
      enviarRuta(){
        let vue = this;
        vue.ruta.id = Number(vue.ruta.id);
        vue.ruta.capacidad_contratada = Number(vue.ruta.capacidad_contratada);
        console.log(vue.ruta);
        if(vue.ruta.capacidad_contratada==null){
          this.notifyVue('top', 'center',4,NotificationTemplateSedeError);
        }else{
          //vue.ruta.id = Number(vue.ruta.id);
          //vue.ruta.capacidad_contratada = Number(response.data.capacidad_contratada);
          axios.post(vue.$store.state.appUri+'/rutas/actualizar',vue.ruta)
          .then(response => {
            
            this.notifyVue('top', 'center',2,NotificationTemplateSedeSuccess)
          })
          .catch(e => {
            vue.errors.push(e)
          });    
        }
      },
      notifyVue(verticalAlign, horizontalAlign,color,componente) {        
        this.$notify({
          component: componente,
          icon: "tim-icons icon-bell-55",
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: this.type[color],
          timeout: 0
        });
      },
      regresarAlListar(){
        this.$router.push('/admin/rutas');
      }
    },
    props: {
      
    }
  }
</script>
<style>
</style>
