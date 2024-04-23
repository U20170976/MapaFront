<template>
  <card>
    <h5 slot="header" class="title">Información de la Sede</h5>

    
    <div class="row">     

      <div class="col-md-4 pr-md-1">
        <div class="form-group">

          <base-input label="Nombre de la sede"
                    v-model="sede.nombre"
                    disabled>
          </base-input>

        </div>
      </div>

    </div>

    <div class="row">
      <div class="col-md-4 pr-md-2 ">          
          <base-input label="Gerente de la sede"
                    v-model="sede.gerente"
                    disabled>
          </base-input>          
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 pr-md-2 ">          
          <base-input label="Codigo Oaci de la sede"
                    v-model="sede.codigoOaci"
                    disabled>
          </base-input>          
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 pr-md-1 ">
        <base-input label="Ciudad"
                  v-model="sede.ciudad"
                  disabled>
        </base-input>
      </div>
    </div>

      <div class="row">
        <div class="col-md-4 pr-md-1">
          <base-input label="País"
                    v-model="sede.pais"
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
                    label="Capacidad máxima de la sede"
                    v-model="sede.capacidad_maxima" 
                    >
          </base-input>
      </div>

      <!-- 
      actualizar el servicio para que vaya cambiando el valor
      -->
      <div class="col-md-5 pr-md-1">
        <base-input label="Cantidad de paquetes en la sede"
                  v-model="sede.numero_paquetes"
                  disabled>
        </base-input>
      </div>

    </div>
    
    <base-button slot="footer" type="primary" fill @click="enviarSede()">Aceptar</base-button>
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
        sede:{
          id:'',
          nombre:null,
          codigoOaci:null,
          prefijoCiudad:null,
          ciudad:null,
          pais:null,
          gerente:'',
          numero_paquetes:0,
          capacidad_maxima: null,
          nombreGerente:''
        },
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
      console.log('Inicio Modificar');
      axios.get(vue.$store.state.appUri+'/sedes/obtenerPorId/'+ vue.$route.params.idSede)
      .then(function(response){
      //console.log(response.data);
            vue.sede.id = vue.$route.params.idSede;
            vue.sede.codigoOaci = response.data.sede.codigoOaci;
            vue.sede.prefijoCiudad = response.data.sede.prefijo_ciudad;
            vue.sede.nombre = response.data.sede.nombre.replace('_',' ')+'('+vue.sede.prefijoCiudad+')';
            vue.sede.numero_paquetes = response.data.sede.numero_paquetes;
            vue.sede.capacidad_maxima = response.data.sede.capacidad_maxima;
            vue.sede.ciudad = response.data.sede.pais.ciudad;
            vue.sede.pais = response.data.sede.pais.nombre;
            vue.sede.gerente = (response.data.sede.gerente === null)?'Gerente':response.data.sede.gerente;
      console.log(vue.sede);
      //vue.capacidad_max=vue.sede.capacidad_maxima
      })
    },
    methods:{
      enviarSede(){
        let vue = this;
        console.log('enviarSede');
        if(vue.sede.capacidad_maxima == null || vue.sede.capacidad_maxima < 600 || vue.sede.capacidad_maxima > 1000 ){
          this.notifyVue('top', 'center',4,NotificationTemplateSedeError);
          //vue.capacidad_max= vue.sede.capacidad_maxima;
          vue.sede.capacidad_maxima= null;
        }else{
          console.log(vue.capacidad_max);
          axios.post(vue.$store.state.appUri+'/sedes/actualizarCapacidadMaxima/'+vue.sede.id, {"capacidad_max":vue.sede.capacidad_maxima})
          .then(response => {
            this.notifyVue('top', 'center',2,NotificationTemplateSedeSuccess)

          })
          .catch(e => {
            vue.errors.push(e)
          });
        }
        
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
      },
      regresarAlListar(){
        this.$router.push('/admin/sedes');
      }
    },
    props: {
      
    }
  }
</script>
<style>
</style>
