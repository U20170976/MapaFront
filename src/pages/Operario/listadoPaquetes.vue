<template>
  <card>
    <h5 slot="header" class="title">{{title}}</h5>


    <div class="row">
        <div class="col-md-12 m-l-10 p-t-5">
            <base-input placeholder="Buscar" v-model="searchWord">
            </base-input>
        </div>
        <!-- <div class="col-md-2">    
            <base-button :icon="true" type="primary" fill><i class="tim-icons icon-upload"></i></base-button>
            <base-button :icon="true" fill><i class="tim-icons icon-trash-simple"></i></base-button>
        </div> -->
        <div class="col-md-12 text-right mb-3">
            <base-button type="primary" style="margin-right:10px" fill @click="anadirPaquete()" >Añadir Nuevo Paquete</base-button>
            <base-button type="primary" fill @click="enviarPaquetes()">Actualizar Estados</base-button>
        </div>
        
    </div>
    <div v-if="isLoading"><loader-spinner></loader-spinner></div>
    <div class="row" v-else>
        <div class="col-md-12"  v-if="!showMessage">
            <base-table :data="operarioTable.paquetes"
                :columns="operarioTable.columns"
                thead-classes="text-primary"
                :searchWord="searchWord"
                :setAcciones="listaBoolean"
                :combo="true"
                :actions="false"
                :select="false"
                @signalState="actualizarPaquete"
                >
            </base-table>
        </div>
        <div v-else class="col-md-12"><no-data-found></no-data-found></div>

    </div >

  </card>
</template>


<script>
  import {BaseTable,LoaderSpinner, NoDataFound} from "@/components";
  import RegisterPackage from "@/pages/Operario"
  import axios from 'axios';
  import Authentication from '@/store/authentication.js';
  
  import NotificationTemplateUpdatePackageSuccess from '../Notifications/NotificationTemplateUpdatePackageSuccess';
  import NotificationTemplateUpdatePackageError from '../Notifications/NotificationTemplateUpdatePackageError';
  
  const tableColumns = ["Codigo tracking","Nombre Cliente", "Sede Destino","Categoria","Fecha Registro"];
  //const tableColumns = ["Codigo tracking", "Nombre", "Fecha Registro", "Estado"];
  export default {
    components: {
      BaseTable,
      LoaderSpinner,
      NoDataFound,
      RegisterPackage
    },
    data() {
      return {
        operarioTable: {
          title: "Admin Table",
          columns: [...tableColumns],
          paquetes:[],
          //actions: "Acciones"
          estados:[]
        },        
        title: "",
        searchWord: "",
        isLoading: true,
        showMessage: true,
        listaBoolean: {detalle:false,eliminar:false,modificar:false},
        idSede: "",
        tableData:[], 
        actualizados:[],
        errors:[],
        paquetes:[],
        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        }
      };
    },
    mounted(){
      let vue = this;
      var idUsuario = Authentication.getProfile().id;
      //vue.tableData = vue.adminTable.paquetes;
      axios.get(this.$store.state.appUri+'/usuarios/obtenerDatosSede/'+idUsuario)
      .then(function(response){
        // console.log(response.data.sede.id);
        vue.idSede = response.data.sede.id;
        // console.log(vue.idSede);
        //vue.idSede = 1;
        axios.get(vue.$store.state.appUri+'/sedes/listarPaquetesEnAlmacen2/'+vue.idSede)//colocar el idSede del Operario
        .then(function(response){
        // console.log(response.data);
        if(response.data.length != 0){
            response.data.forEach(element => {
            vue.operarioTable.paquetes.push({
            "codigo tracking": element.codigoTracking,
            "nombre cliente": element.cliente.nombreRazonSocial,
            "sede destino": element.nombreSede.replace('_',' '),
            "fecha registro": element.fecha_registro.substring(0,4)+"/"+element.fecha_registro.substring(5,7)+"/"+element.fecha_registro.substring(8,10),
            "categoria": element.categoria.descripcion,
            "idPaquete": element.id,
            "estado": element.estado.replace('_',' ')
            //"destino": element.activo ? "Activo": "Inactivo"
          })
          vue.paquetes.push({
            "id": element.id,
            "oaci_sede_destino": element.oaci_sede_destino,
            "id_categoria": element.categoria.id,
            "descripcion": element.descripcion,
            "fecha registro": element.fecha_registro,
            "estado": element.estado
          })        
          });
          vue.showMessage = false;
        }
        vue.isLoading = false;
        // console.log(vue.operarioTable.paquetes);
        })

      })
      

    },
    methods:{
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
      filterTable:function(searchWord){
        let vue = this;
        tableData = vue.tableData.filter(
          function(row){
            return (JSON.stringify(row)).includes(searchWord);
          }
        )
        vue.adminTable.data = tableData;
      },
      actualizarPaquete:function(item, state){
        let vue = this;
        // console.log(state+item.idPaquete);
        vue.paquetes.forEach(element => {
          // console.log(element.estado);
          // console.log(element.id);
          if(element.id == item.idPaquete){
            element.estado= state;
          // console.log(element.estado);
          }
        })
      },
      enviarPaquetes(){
        let vue = this;
        // console.log(vue.paquetes);
        axios.post(vue.$store.state.appUri+'/paquetes/actualizarLista', vue.paquetes)
        .then(response => {
          vue.notifyVue('top', 'center',2, NotificationTemplateUpdatePackageSuccess);
          vue.$forceUpdate();
        })
        .catch(e => {
          vue.errors.push(e)
          vue.notifyVue('top', 'center',4, NotificationTemplateUpdatePackageError); 
        });
        vue.paquetes = [];
      },
      anadirPaquete(){
        this.$router.push('RegisterPackage');
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
