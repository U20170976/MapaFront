<template>
  <card>
    <h2 slot="header" class="title">Registrar Envío</h2>
   
    <div class="card mt-4">
      <div class="card-header">
        <h4 class="card-title">Datos del Envío</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>Ciudad, País - Origen</label>
              <input type="text" class="form-control" :value="`${ciudadOrigen} - ${paisOrigen}`" disabled>
            </div>
            <div class="form-group">
              <label>Cantidad de Paquetes</label>
              <input type="text" class="form-control" placeholder="Cantidad de Paquetes" v-model="cantidadPaquetes">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Ciudad, País - Destino</label>
              <select class="form-control" v-model="clienteDestino.ciudadPais">
                <option value="" disabled selected hidden>Seleccione una ciudad y país</option>
                <option v-for="paisDestino in lpaisesDestino" :key="paisDestino.id" :value="paisDestino">
                  {{ paisDestino.ciudad.nombre }}, {{ paisDestino.pais.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Descripción(opcional)</label>
              <input type="text" class="form-control" placeholder="Descripción" v-model="descripcionPaquete">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Columna 1: Datos del contacto que va a entregar el paquete -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Datos del Contacto que Envía</h4>
          </div>
          <div class="card-body">
            
            <div class="form-group">
              <label>DNI / RUC</label>
              <!--<input type="text" class="form-control" placeholder="DNI o RUC" v-model="clienteOrigen.numDniRuc" @keypress.enter="filterClient(clienteOrigen.numDniRuc)">-->
              <input type="text" class="form-control" placeholder="DNI o RUC" v-model="clienteOrigen.numDniRuc">
            </div>
            <div class="form-group">
              <label>Nombres y Apellidos</label>
              <input type="text" class="form-control" placeholder="Nombres y Apellidos" v-model="clienteOrigen.nombreCompleto">
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" class="form-control" placeholder="email@email.com" v-model="clienteOrigen.email">
              <div v-if="email && !isEmailValid" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
            </div>
            <div class="form-group">
              <label>Número de Teléfono</label>
              <input type="text" class="form-control" placeholder="Número de Teléfono" v-model="clienteOrigen.telefono">
            </div>
          </div>
        </div>
      </div>

      <!-- Columna 2: Datos del contacto que va a recibir el paquete -->
      <div class="col-md-6">
        
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Datos del Contacto que Recibe</h4>
          </div>
          <div class="card-body">
            
            <div class="form-group">
              <label>DNI / RUC</label>
              <!--<input type="text" class="form-control" placeholder="DNI o RUC" v-model="dniinput" @keypress.enter="filterClient(dniinput)">-->
              <input type="text" class="form-control" placeholder="DNI o RUC" v-model="clienteDestino.numDniRuc">
            </div>
            <div class="form-group">
              <label>Nombres y Apellidos</label>
              <input type="text" class="form-control" placeholder="Nombres y Apellidos" v-model="clienteDestino.nombreCompleto">
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="text" class="form-control" placeholder="Correo Electrónico" v-model="clienteDestino.email">
              <div v-if="email && !isEmailValid" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
            </div>
            <div class="form-group">
              <label>Número de Teléfono</label>
              <input type="text" class="form-control" placeholder="Número de Teléfono" v-model="clienteDestino.telefono">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <!--<base-button slot="footer" type="primary" fill @click="enviarPaquete">Registrar Paquete</base-button>-->
      <base-button slot="footer" type="primary" fill @click="registrarEnvio">Registrar Envío</base-button>
      <base-button slot="footer" fill @click="regresarAlListar">Regresar</base-button>
    </div>
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
  import ResumenEnvio from "../Operario/ResumenEnvio"; // Ajusta la ruta según la ubicación del componente

  import Authentication from '@/store/authentication.js';


  export default {
    components: {
      BaseTable,
      listadoPaquetes,
      ResumenEnvio,
    },
    data() {
      return {
        clienteOrigen:{
          id:'',
          ciudadPais: '', /*Aqui se guardaría el valor, pero en paisOrigen y ciudadOrigen ya se guarda los valores que se encuentran por defecto*/
          nombreCompleto: '',
          email:'',
          telefono:'',
          numDniRuc:''
        },
        clienteDestino:{
          id:'',
          ciudadPais: '',
          nombreCompleto: '',
          email:'',
          telefono:'',
          numDniRuc:''
        },
        descripcionPaquete: '',
        cantidadPaquetes: '',
        paisOrigen: '',
        ciudadOrigen:"",
        loading: true,
        error: '',
        selectedSede: "", // Inicializa como cadena vacía
        lpaisesDestino: [
          { id: 1, pais: { nombre: 'Perú' }, ciudad: { nombre: 'Lima' } },
          { id: 2, pais: { nombre: 'Argentina' }, ciudad: { nombre: 'Buenos Aires' } },
          { id: 3, pais: { nombre: 'Chile' }, ciudad: { nombre: 'Santiago' } }
          // Agrega más paises con ciudades según sea necesario
        ],
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,

        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        }

      };
    },
    mounted(){
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(this.obtenerUbicacionActual, this.handleLocationError);
      } 
      else {
        this.paisOrigen = "Peru";
        this.ciudadOrigen = "Lima";
        this.error = "La geolocalización no está disponible en este navegador.";
        this.loading = false;
      }
      /*
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
      */
    },
/*
    computed: {
      isEmailValid() {
        return this.reg.test(this.email);
      },
      emailValidationClass() {
        if (this.email === '') {
          return '';
        }
        return this.isEmailValid ? 'has-success' : 'has-error';
      }
    },
*/
    methods:{
      /*
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
      */
      obtenerUbicacionActual(position){
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.paisOrigen = data.countryName;
            this.ciudadOrigen = data.city;
            this.loading = false;
          })
          .catch(error => {
            console.error("Error al obtener la información del país:", error);
            this.error = "Error al obtener la información del país.";
            this.loading = false;
          });
      },
      handleLocationError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            this.error = "El usuario denegó la solicitud de geolocalización.";
            break;
          case error.POSITION_UNAVAILABLE:
            this.error = "La información de ubicación no está disponible.";
            break;
          case error.TIMEOUT:
            this.error = "Se agotó el tiempo de espera al intentar obtener la ubicación.";
            break;
          case error.UNKNOWN_ERROR:
            this.error = "Se produjo un error desconocido al obtener la ubicación.";
            break;
        }
        this.loading = false;
      },
      /*
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
      */
      registrarEnvio() {
        console.log('registrarEnvio llamado');
        this.$router.push('ResumenEnvio');
      },
      regresarAlListar(){
        console.log('listadoPaquetes llamado');
        this.$router.push('listadoPaquetes');
      }
    },
    props: {

    }
  }
</script>
<style>
  /* Asegúrate de que el texto dentro de las opciones del select sea negro */
  .form-control option {
    color: black
  }

  /* Asegúrate de que el texto del select principal sea visible cuando se selecciona */
  .form-control {
    color: white;
  }

  .has-success .form-control {
    border-color: #28a745;
  }
  .has-error .form-control {
    border-color: #dc3545;
  }
  .invalid-feedback {
    color: #dc3545;
  }
</style>
