<template>
  <card>
    <h5 slot="header" class="title">Registrar paquete</h5>

    <div class="row">
      <div class="col-md-5 pr-md-1">
        <base-input label="Código tracking (disabled)"
                  placeholder="Company"
                  disabled>
        </base-input>
      </div>
    </div>



    <div class="row">

      

      <div class="col-md-4">
        <div class="col-md-10 pr-md-1">
          <base-input label="País origen"
                    :placeholder="data_usuario.pais"
                    disabled>                    
          </base-input>
        </div>
        <div class="col-md-10 pr-md-1">
          <base-input label="DNI / RUC"
                    placeholder="DNI o RUC" v-model="dniinput"
                    @keypress.enter="filterClient(dniinput)">
          </base-input>
        </div>
        <div class="col-md-10 pr-md-1">
          <base-input label="Nombres y Apellidos"
                    placeholder="Nombres y Apellidos"
                    v-model="cliente.nombreRazonSocial"  style="color:white" >
          </base-input>
        </div>
        <div class="col-md-10 pr-md-1" >
          <base-input label="Email"
                    type="email"
                    placeholder="email@email.com"
                    v-model="cliente.correo">
          </base-input>
        </div>

        
      </div>
      


      <div class="col-md-4">
        
        <div class="col-md-10 pr-md-1 form-group">
          <slot name="label">
            <label class="control-label">
              País
            </label>
          </slot>
          <select class="input-group-prepend form-control" v-model="sede" @change="obtenerCiudad(sede)">
              <option style="color:black" v-for="sede in sedes" :key="sede.id" :value="sede">
                {{sede.pais.nombre}}
              </option>
          </select>
        </div>
        <div class="col-md-10 pr-md-1" v-bind:class="[isEmailValid()]">
          <base-input label="Email"
                    type="email"
                    placeholder="email@email.com"
                    v-model="email">
          </base-input>
        </div>
        <div class="col-md-10 pr-md-1">
          <base-input label="Dirección"
                    placeholder="Dirección">
          </base-input>
        </div>
        <div class="col-md-10 pr-md-1">
          <base-input label="Ciudad"
              placeholder="Ciudad"
              v-model="ciudad">
          </base-input>
        </div>
      </div>





      <div class="col-md-4">
        
        <base-button slot="footer" type="primary" fill v-on:click="addItem">Añadir Paquete</base-button>

        <div class="col-md-6 pr-md-1 form-group">
          <slot name="label">
            <label class="control-label">
              Categoria
            </label>
          </slot>
          <select class="input-group-prepend form-control" v-model="categoria">
              <option style="color:black" v-for="categoria in categorias" :key="categoria.id" :value="categoria">
                {{categoria.descripcion}}
              </option>
          </select>
        </div>
        <div class="col-md-8">
          <base-input>
          <label>Descripción del paquete</label>
            <textarea rows="4" cols="80"
                class="form-control"
                placeholder="Colocar alguna descripción del paquete" v-model="paquete.descripcion">
            </textarea>
          </base-input>
        </div>
        <card title="Lista de paquetes">
          <div>
            <base-table :data="table1.data"
                  :columns="table1.columns"
                  thead-classes="text-primary">
            </base-table>
          </div>
        </card>
      </div>

      

    </div>
  
    <base-button slot="footer" type="primary" fill @click="enviarPaquete()">Registrar Paquete</base-button>
    <base-button slot="footer" fill @click="regresarAlListar()">Regresar</base-button>

  </card>
</template>


<script>
  import { BaseTable } from "@/components";
  import axios from 'axios';
  import NotificationTemplate from '../Notifications/NotificationTemplate';
  import NotificationTemplatePaqueteSuccess from '../Notifications/NotificationTemplatePaqueteSuccess';
  import NotificationTemplatePaqueteError from '../Notifications/NotificationTemplatePaqueteError';
  import { BaseAlert } from '@/components';
  import listadoPaquetes from "../Operario/listadoPaquetes";

  import Authentication from '@/store/authentication.js';

  const tableColumns =  ["Descripcion", "Categoria"];

  export default {
    components: {
      BaseTable,
      listadoPaquetes
    },
    data() {
      return {
        table1: {
          title: "Registro paquetes",
          columns: [...tableColumns],
          data: []
        },
        data_usuario:{
          id:'',
          sedeOrigen: '',
          pais: ''
          /*
          numeroDocumento: '',
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
        },
        paises:[],
        pais:{},
        sedes:[],
        sede:{},
        ciudad:"",
        clientes:[],
        categorias:[],
        categoria:{},
        dniinput:"",
        cliente:{},

        paquete:[],

        email: '',
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,

        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        }

      };
    },
    mounted(){
      let vue = this;


      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var hour = date.getUTCHours();
      var min = date.getUTCMinutes();
      console.log("Hora");
      console.log(day.toString().slice(-2) + month.toString().slice(-2) + year.toString().slice(-2) + hour.toString().slice(-2) + min.toString().slice(-2));

      vue.data_usuario.id = Authentication.getProfile().id;

      axios.get(this.$store.state.appUri+'/usuarios/obtenerDatosSede/' + vue.data_usuario.id)
      .then(function(response){
        vue.data_usuario.sedeOrigen = response.data.sede.codigoOaci;
        vue.data_usuario.pais = response.data.sede.pais.nombre;
      }),

      axios.get(this.$store.state.appUri+'/sedes/listarSedes')
      .then(function(response){
        vue.sedes = response.data;
      }),
      axios.get(this.$store.state.appUri+'/usuarios/listar')
      .then(function(response){
        vue.clientes = response.data;
      }),
      axios.get(this.$store.state.appUri+'/categorias/findAll')
      .then(function(response){
        vue.categorias = response.data;
      })
    },
    methods:{
      filterClient:function(numeroDocumento){
        let vue = this;
        var lista = vue.clientes.filter(
          function(cust){
            return cust.numeroDocumento==numeroDocumento
          }
        )
        vue.cliente = lista[0];
      },
      addItem(){

        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getUTCHours();
        let min = date.getUTCMinutes();

        
        console.log(day+month+year+hour+min);
        if(this.categoria.id == null || this.paquete.descripcion == null || this.email == null){
            this.notifyVue('top', 'center',4,NotificationTemplatePaqueteError);
            return;
        }

        

        var paquete = {
          oaci_sede_origen:this.paquete.oaci_sede_origen,
          oaci_sede_destino:this.paquete.oaci_sede_destino,
          id_categoria:this.categoria.id,
          descripcion:this.paquete.descripcion,
          fecha_registro:"2020-05-18T08:34:00.000", // COLOCAR FECHA ACTUAL
          estado:"EN_ALMACEN",
          numeroDocumento:this.dniinput,
          codigo:     this.paquete.oaci_sede_origen + "-" +
                      year.toString()+month.toString()+day.toString()+"-"+
                      hour.toString()+":"+min.toString()+"-"+
                      this.oaci_sede_destino
        }
        var paqueteTabla = {
          descripcion:this.paquete.descripcion,
          categoria:this.categoria.descripcion          
        }
        this.table1.data.push(paqueteTabla);
        this.paquete.push(paquete);
        //console.log(this.paquete);
        //console.log(this.categoria);
      },
      obtenerCategoria(categoria){
          this.categoria = categoria;
          //console.log(categoria);
      },
      obtenerCiudad(sede){
        let vue = this;
          vue.ciudad = sede.pais.ciudad;
          vue.paquete.oaci_sede_origen = vue.data_usuario.sedeOrigen;
          vue.paquete.oaci_sede_destino = sede.codigoOaci;
          //console.log(this.ciudad);
      },
      isEmailValid: function() {
          return (this.email == " ")? "" : (this.reg.test(this.email)) ? 'has-success' : 'has-error';
      },
      isPackageEmpty: function() {
          return (this.table1.data.length == 0) ? this.notifyVue('top', 'center',4,NotificationTemplatePaqueteError) : 'has-error';
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
      enviarPaquete(){
        let vue = this;

        if(this.table1.data.length == 0 || this.email==null || this.dniinput==null || this.cliente.nombreRazonSocial==null ){
          this.notifyVue('top', 'center',4,NotificationTemplatePaqueteError);
        }else{
            axios.post(vue.$store.state.appUri+'/paquetes/insertarLista', vue.paquete)
            .then(response => {})
            .catch(e => {
              vue.errors.push(e)
            });
            vue.paquete = [];
            vue.table1.data = [];
            this.notifyVue('top', 'center',2,NotificationTemplatePaqueteSuccess)
        }
      },
      regresarAlListar(){
        this.$router.push('listadoPaquetes');
      }
    },
    props: {

    }
  }
</script>
<style>
</style>
