<template>
  <card>
    <h5 slot="header" class="title">{{title}}</h5>


    <div class="row">
        <div class="col-md-9 m-l-10 p-t-5">
            <base-input placeholder="Buscar"
                        v-model="searchWord"
                        @keypress.enter="filterTracking(searchWord)">
            </base-input>
        </div>
    </div>

    
    <div v-if="isLoading"><loader-spinner></loader-spinner></div>
    <div class="row" v-else>        
        <div class="col-md-12" v-if="!showMessage">
            <base-table :data="clientTable.data"
                :columns="clientTable.columns"
                thead-classes="text-primary"
                :searchWord="searchWord2"
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
  import { BaseAlert } from '@/components';

  const tableColumns =   ["Detalle", "Sede Actual" ,"Sede Origen", "Sede Destino"];
  export default {
    components: {
      BaseTable,
      LoaderSpinner,
      NoDataFound
    },
    data() {
      return {
        clientTable: {
          title: "Client Table",
          columns: [...tableColumns],
          data: []
        },
        title: "",
        searchWord: "",
        searchWord2: "",        
        isLoading: false,
        showMessage: true,
        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        },        
        listaBoolean: {detalle:false,eliminar:false,modificar:false}
      }
    },
    mounted(){
      
    },
    methods:{   
      
      filterTracking:function(searchWord){
        let vue = this;
        
        
        vue.isLoading = true;
        if(vue.searchWord != ""){   
          axios.post(this.$store.state.appUri+'/paquetes/obtenerHistorial', {codigoTracking: searchWord})
          .then(function(response){
              if(response.data.lenght != 0){

                var sOrigen = response.data.nombrePaisOrigen;
                var sDestino = response.data.nombrePaisDestino;

                vue.clientTable.data = [];
                response.data.historialPaquete.forEach(element => {
                  vue.clientTable.data.push({

                      "detalle": element.fecha_llegada_sede_actual,
                      "sede actual": element.sedeActual.pais.nombre,
                      "sede origen": sOrigen,
                      "sede destino": sDestino

                  });
                });
                vue.showMessage = false;
              }
              vue.isLoading = false;
          }).catch(function (error) {
              console.log(error);
          })
        }
      },
      notifyVue(verticalAlign, horizontalAlign,color,componente) {
        //const color = 4;
        console.log(color);
        this.$notify({
          component: componente,
          icon: "tim-icons icon-bell-55",
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: this.type[color],
          timeout: 0
        });
      }
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
