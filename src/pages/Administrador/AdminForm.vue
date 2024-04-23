<template>
  <card>   
    <h5 slot="header" class="title">{{title}}</h5>
    <div class="row">
        <div class="col-md-10 m-l-10 p-t-5">
            <base-input placeholder="Buscar" v-model="searchWord">
            </base-input>
        </div>
        <div class="col-md-2">    
            <base-button v-b-modal.modal-upload :icon="true" type="primary" fill><i class="tim-icons icon-upload"></i></base-button>
            <b-modal id="modal-upload" :title="titleAgregar" :hide-footer="true">
              <modal-upload-file :path="uploadPath"></modal-upload-file>
            </b-modal>
            <base-button :icon="true" fill @click="removeBatch()"  v-if="id == 'sedes'"><i class="tim-icons icon-trash-simple"></i></base-button>
        </div>
    </div>
    <div class="col-md-12 text-right mb-3" v-if="id == 'usuarios' || id == 'usuarios-gerente'">
        <base-button type="primary" fill @click="anadirUsuario()">Añadir Nuevo Usuario</base-button>
    </div>

    <div v-if="isLoading"><loader-spinner></loader-spinner></div>
    <div class="row" v-else>        
        <div class="col-md-12" v-if="!showMessage">
            <base-table :data="adminTable.data"
                :columns="adminTable.columns"
                thead-classes="text-primary"
                :searchWord="searchWord"
                :setAcciones="listaBoolean"
                :actions="true"
                :select="true"
                :combo="false"
                @signalRemove="remove"
                @signalModify="modify">
            </base-table>
        </div>
        <div v-else class="col-md-12"><no-data-found></no-data-found></div>
    </div>
  </card>
</template>


<script>
  import {BaseTable, LoaderSpinner, NoDataFound, ModalUploadFile} from "@/components";
  import axios from 'axios';
  import ModificarSede from '../Administrador/ModificarSede'
  import Authentication from '@/store/authentication.js';
  import NotificationTemplateEliminateSedeSuccess from '../Notifications/NotificationTemplateEliminateSedeSuccess';
  import NotificationTemplateEliminateSedeError from '../Notifications/NotificationTemplateEliminateSedeError';
  import NotificationTemplateEliminateRutaSuccess from '../Notifications/NotificationTemplateEliminateRutaSuccess';
  import NotificationTemplateEliminateRutaError from '../Notifications/NotificationTemplateEliminateRutaError';
  

  export default {
    components: {
      BaseTable,
      ModificarSede,
      LoaderSpinner,
      NoDataFound,
      ModalUploadFile
    },
    data() {
      return {
        adminTable: {
          title: "Admin Table",
          columns: [],
          data: [],
        },        
        idsede:'',
        title: "",
        searchWord: "",
        isLoading: true,
        showMessage: true,
        listaBoolean: {detalle:false,eliminar:false,modificar:true},
        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        },
        sedes: [],
        titleAgregar: "",
        files:[],
        uploadPath: "",
      };
    },
    mounted(){
      let vue = this;
      vue.tableData = vue.adminTable.data;
      switch(vue.id){
        case "rutas":
          vue.title = "Gestión de Rutas";
          vue.titleAgregar = "Agregar archivo de rutas";
          vue.adminTable.columns = ['Codigo', 'Origen', 'Destino', 'Capacidad','Estado'];
          vue.uploadPath = vue.$store.state.appUri + "";
          axios.get(vue.$store.state.appUri + '/rutas/listarRutasNuevo')
          .then(function(response){
            console.log(response.data);
            if(response.data.length != 0){
              vue.showMessage = false;
              response.data.forEach(element => {
                vue.adminTable.data.push({
                  "select": false,
                  "codigo": element.id, 
                  "origen": element.nombreSedeOrigen.replace("sede_", ""), 
                  "destino": element.nombreSedeDestino.replace("sede_", ""),
                  "capacidad": element.capacidad_contratada,
                  "estado": element.activo ? "Activo" : "Inactivo"
                })
              });
            }
            vue.isLoading = false;
          });
          break;
        case "usuarios":
          vue.title = "Gestión de Usuarios";
          vue.titleAgregar = "Agregar archivo de usuarios";
          vue.adminTable.columns = ['Tipo Documento', 'Documento', 'Nombre/Razon Social', 'Rol'];
          vue.uploadPath = vue.$store.state.appUri + "";
          axios.get(this.$store.state.appUri+'/usuarios/listar')
          .then(function(response){
            if(response.data.length != 0){
              vue.showMessage = false;
              response.data.forEach(element => {
                  vue.adminTable.data.push({
                    "select": false,
                    "id": element.id,
                    "tipo documento": element.tipoDocumento, 
                    "documento": element.numeroDocumento, 
                    "nombre/razon social": element.nombreRazonSocial,
                    "rol": element.tipoUsuario.replace("_", " ").toLowerCase(),
                    "estado": element.activo ? "Activo" : "Inactivo"
                  });
                });
            }
            vue.isLoading = false;
          });
          break;
        case "usuarios-gerente":
          vue.title = "Gestión de Usuarios";
          vue.titleAgregar = "Agregar archivo de usuarios";
          vue.adminTable.columns = ['Tipo Documento', 'Documento', 'Nombre/Razon Social'];
          vue.uploadPath = vue.$store.state.appUri + "";
          var idUsuario = Authentication.getProfile().id;
          axios.get(vue.$store.state.appUri+'/usuarios/obtenerDatosSede/'+ idUsuario)
          .then(function(response){
            var idSede = response.data.sede.id;
            axios.get(vue.$store.state.appUri+'/usuarios/listarOperariosDeSede/' + idSede)
            .then(function(response){
              if(response.data.length != 0){
                vue.showMessage = false;
                response.data.forEach(element => {
                    vue.adminTable.data.push({
                      "select": false,
                      "id": element.id,
                      "tipo documento": element.tipoDocumento, 
                      "documento": element.numeroDocumento, 
                      "nombre/razon social": element.nombreRazonSocial,
                      "rol": element.tipoUsuario.replace("_", " ").toLowerCase(),
                      "estado": element.activo ? "Activo" : "Inactivo"
                    });
                  });
              }
              vue.isLoading = false;
            });
          });
          
          break;
        case "sedes":
          vue.title = "Gestión de Sedes";
          vue.titleAgregar = "Agregar archivo de sedes";
          vue.adminTable.columns = ['Codigo', 'Nombre', 'OACI', 'Locacion', 'Estado'];
          vue.uploadPath = vue.$store.state.appUri + "";
          axios.get(vue.$store.state.appUri + '/sedes/listarSedes')
          .then(function(response){
            if(response.data.length != 0){
              vue.showMessage = false;
              response.data.forEach(element => {
                vue.adminTable.data.push({
                  "select": false,
                  "codigo": element.id, 
                  "nombre": element.nombre.replace("sede_", "Sede de "),
                  "oaci": element.codigoOaci, 
                  "prefijoCiudad": element.prefijoCiudad,
                  "capacidad": element.numero_paquetes,
                  "capacidad_max": element.capacidad_max,
                  "locacion": element.pais.nombre + " - " + element.pais.ciudad,
                  "estado": element.activo ? "Activo": "Inactivo"
                })
              });
            }
            vue.isLoading = false;
          });
          break;
      }
    },
    methods:{
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
      anadirUsuario: function(){
        this.$router.push('/admin/crearUsuario');
      },
      remove: function(item){
        let vue = this;        
        switch(vue.id){
          case "rutas":            
            axios.post(this.$store.state.appUri + '/rutas/darDeBaja/' + item.codigo).then(function(confirm){
              vue.notifyVue('top', 'center',2, NotificationTemplateEliminateRutaSuccess);
              vue.$forceUpdate();
            })
            .catch(function(error){
              vue.notifyVue('top', 'center',4, NotificationTemplateEliminateRutaError);
              console.log(error);
            });
            break;
          case "sedes":
            axios.post(this.$store.state.appUri + '/sedes/darDeBaja/' + item.codigo).then(function(confirm){
              vue.notifyVue('top', 'center',2, NotificationTemplateEliminateSedeSuccess);
              vue.$forceUpdate();
            })
            .catch(function(error){
              vue.notifyVue('top', 'center',4, NotificationTemplateEliminateSedeError);
              console.log(error);
            });
            break;
          case "usuarios":
            break;
        } 
      },
      removeBatch: function(){
        let vue = this;
        switch(vue.id){
          case "rutas":
            break;
          case "sedes":
            var codigos = {ids: []};
            vue.adminTable.data.forEach(function(item){
              if(item.select) return codigos.ids.push(item.codigo);
            });
            vue.$bvModal.msgBoxConfirm('Por favor, confirme para continuar.',{
              title: 'Eliminar',
              size: 'sm',
              okTitle: 'Sí',
              cancelTitle: 'No',
              hideHeaderClose: false,
              centered: false
            }).then(confirm => {
              if(confirm){
                axios.post(this.$store.state.appUri + '/sedes/darDeBajaMasivo', codigos).then(function(confirm){                  
                  vue.notifyVue('top', 'center',2, NotificationTemplateEliminateSedeSuccess);
                  vue.$forceUpdate();
                });
              }
            })
            .catch(function (error) {
              vue.notifyVue('top', 'center',4, NotificationTemplateEliminateSedeError);
              console.log(error);
            });
            
            break;
          case "usuarios":
            break;
        } 
      },
      modify: function(item){
        let vue = this;
        switch(vue.id){
          case "rutas":
            var idRuta = item.codigo;
            vue.$router.push({name: "Modificar ruta", params: {idRuta: item.codigo}});
            break;
          case "sedes":
            console.log('Antes');
            console.log(item);
            var idSede = item.codigo;
            vue.$router.push({name: "Modificar sede", params: {idSede: item.codigo}});
            console.log('Despues');
            break;
          case "usuarios":
            vue.$router.push('/admin/modificarUsuario/' + item.id); 
        
            break;
          case "usuarios-gerente":
            vue.$router.push({name: "Modificación de usuarios", params: {idUsuario: item.id}});
            break;
        }
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
.drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
</style>
