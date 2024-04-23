<template>

  <card>
    <h5 slot="header" class="title">{{title}}</h5>

    <div class="row">
        <div class="col-md-10 m-l-10 p-t-5">
            <base-input placeholder="Buscar" v-model="searchWord">
            </base-input>
        </div>
        <div class="col-md-2">
          <b-button :pressed.sync="filterCompleted" variant="primary">{{toggleLabel()}}</b-button>
        </div>
    </div>
    <div v-if="isLoading"><loader-spinner></loader-spinner></div>
    <div class="row" v-else>
        <div class="col-md-12" v-if="!showMessage">
            <base-table :data="clientTable.paquetes"
                :columns="clientTable.columns"
                thead-classes="text-primary"
                :searchWord="searchWord"
                :setAcciones="listaBoolean"
                :actions="true"
                :toogleFilterKey="toogleFilterKey"
                @signalDetail="showDetail">
            </base-table>
        </div>
        <div v-else class="col-md-12"><no-data-found></no-data-found></div>
    </div>

  </card>
</template>


<script>
  import { BaseTable, LoaderSpinner, NoDataFound } from "@/components";
  import axios from 'axios';
  import Authentication from '@/store/authentication.js';

  const tableColumns =   ["Codigo tracking", "Nombre", "Fecha Registro", "Estado"];
  export default {
    components: {
      BaseTable,
      LoaderSpinner,
      NoDataFound
    },
    data() {
      return {
        clientTable: {
          title: "Admin Table",
          columns: [...tableColumns],
          paquetes:[],
          //data: [...paquetes],//tableData],
          actions: "Acciones"
        },
        isLoading: true,
        showMessage: true,
        title: "",
        searchWord: "",
        toogleFilterKey: "",
        tableData:[],
        filterCompleted: false,
        listaBoolean: {detalle:true,eliminar:false,modificar:false},
        data_usuario:{
          id:'',
          sedeOrigen: '',
          pais: '',          
          numeroDocumento: ''/*,
          nombres:'',
          email:'',
          direccion:'',
          fechaNacimiento:'',
          tipoDocumento:'',
          telefono:'',
          usuario:'',
          idioma:'',
          tipoUsuario:'',
          password:'',
          confirmar_password:'',
          */
        }
      };
    },
    mounted(){
      let vue = this;

      vue.data_usuario.numeroDocumento = Authentication.getProfile().numeroDocumento;

      axios.get(this.$store.state.appUri+'/paquetes/listarNuevo')  //FALTA - DEBERIA LISTAR SOLO SUS PEDIDOS
      .then(function(response){
        if(response.data.length != 0){
          response.data.forEach(element => {

            //if(element.cliente.numeroDocumento == vue.data_usuario.numeroDocumento){
              
              vue.clientTable.paquetes.push({
                "id": element.id,
                "categoria" : element.categoria.descripcion,
                "precio" : element.categoria.precio,
                "clienteNombre": element.cliente.nombreRazonSocial,
                "clienteNumDocumento" : element.cliente.numeroDocumento,
                "clienteCorreo": element.cliente.correo,
                "clienteDireccion": element.cliente.direccion,
                "codigo tracking": element.codigoTracking,
                "nombre": element.descripcion,
                "fecha registro": element.fecha_registro.substring(0,4)+"/"+element.fecha_registro.substring(5,7)+"/"+element.fecha_registro.substring(8,10),
                "estado": element.estado.replace("_", " ")
                //"destino": element.activo ? "Activo": "Inactivo"
              });

            //}
            if(vue.clientTable.paquetes.length == 0) vue.showMessage = true;
            else vue.showMessage = false;         
          });
        }else{
          vue.showMessage = true;
        }
        vue.isLoading = false;
        //console.log(vue.clientTable.paquetes);
      })
    },
    methods:{
      toggleLabel:function(){
        if(this.filterCompleted){
          this.toogleFilterKey = "ENTREGADO";
          return "En Curso";
        }
        else {
          this.toogleFilterKey = "";
          return "Todos";
        }
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
      showDetail:function(item){

        var detalle = "Nombre de persona que envía: " + item.clienteNombre + "----------------\n" +
                      "Número de documento: " + item.clienteNumDocumento + "----------------\n" +
                      "Categoria: " + item.categoria + "----------------\n" +
                      "Precio: " + item.precio + "----------------\n" +
                      "Correo: " + item.clienteCorreo + "----------------\n" +
                      "Dirección: " + item.clienteDireccion + "----------------\n";

        this.$bvModal.msgBoxOk(
            detalle
          ,{          
          title: 'Detalle de paquete'
        }
        );
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
