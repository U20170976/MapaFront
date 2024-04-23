<template>
  <card>   
    <h5 slot="header" class="title">{{title}}</h5>
    <div class="row">
        <div class="col-md-10 m-l-10 p-t-5">
            <base-input placeholder="Buscar" v-model="searchWord">
            </base-input>
        </div>
    </div>

    <div v-if="isLoading"><loader-spinner></loader-spinner></div>
    <div class="row" v-else>        
        <div class="col-md-12" v-if="!showMessage">
            <base-table :data="simulacionTable.data"
                :columns="simulacionTable.columns"
                thead-classes="text-primary"
                :searchWord="searchWord"
                :setAcciones="listaBoolean"
                :actions="false"
                :select="true"
                :combo="false">
            </base-table>
        </div>
        <div v-else class="col-md-12"><no-data-found></no-data-found></div>
    </div>
  </card>
</template>


<script>
  import {BaseTable, LoaderSpinner, NoDataFound} from "@/components";
  import axios from 'axios';
  import Authentication from '@/store/authentication.js';
  // import emailjs from 'emailjs-com';

  export default {
    components: {
      BaseTable,
      LoaderSpinner,
      NoDataFound
    },
    data() {
      return {
        simulacionTable: {
          title: "Simulacion Table",
          columns: [],
          data: []
        },
        title: "",
        searchWord: "",
        isLoading: true,
        showMessage: true,
        listaBoolean: {detalle:false,eliminar:false,modificar:true}
        // emailParams: {
        //   to_email: "danel.campana@pucp.pe",
        //   to_name: "Alejandro",
        //   from_name: this.$store.state.email.fromName,
        //   message_html: "Hola, saludos desde Redex"
        // }
      };
    },
    mounted(){
      let vue = this;
      vue.tableData = vue.simulacionTable.data;

      vue.title = "Gestión de Rutas";
      vue.simulacionTable.columns = ['ID', 'F. Inicio', 'F. Fin', 'Estado','Usuario Empleado'];
      axios.get(vue.$store.state.appUri + '/simulacion/listarSimulaciones')
      .then(function(response){

        if(response.data.length != 0){

          response.data.forEach(element => {
            if(element.empleado.id == Authentication.getProfile().id){
              vue.simulacionTable.data.push({
                "ID": element.id,
                "f. inicio": element.fecha_ini.substring(0,10),
                "f. fin": element.fecha_fin.substring(0,10),
                "estado": element.estado,
                "usuario empleado": element.empleado.username
              })
            }
          vue.showMessage = false;
          
          });
        }
        vue.isLoading = false;

      });

    },
    methods:{
      
      // sendEmail: function(){
      //   emailjs.send(this.$store.state.email.service,this.$store.state.email.templateId,this.emailParams,this.$store.state.email.userId)
      //   .then(function(response) {
      //       console.log('SUCCESS!', response.status, response.text);
      //     }, function(error) {   
      //       console.log('FAILED...', error);
      //     });
      // }
    },
    props: {
      id: {
        type: String,
        default: () => {
          return "";
        }
      }
    }
  }
</script>
<style>
</style>
