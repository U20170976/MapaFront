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
              <select class="form-control" v-model="clienteDestino.codigoOACI" required>
                <option value="" disabled selected hidden>Seleccione una ciudad y país</option>
                <option v-for="paisDestino in filteredPaisesDestino" :key="paisDestino.id" :value="`${paisDestino.codigoOACI}`">
                  {{ paisDestino.nombreCiudad }} - {{ paisDestino.pais }}
                </option>
              </select>
               <!-- Mensaje de error -->
              <div v-if="!clienteDestino.codigoOACI && formSubmitted" class="invalid-feedback">
                Por favor, seleccione una ciudad y país.
              </div>
            </div>
            <!--
            <div class="form-group">
              <label>Descripción(opcional)</label>
              <input type="text" class="form-control" placeholder="Descripción" v-model="descripcionPaquete">
            </div>
            -->
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
              <!--
              <div v-if="email && !isEmailValid" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
              -->
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
              <!--
              <div v-if="email && !isEmailValid" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
              -->
            </div>
            <div class="form-group">
              <label>Número de Teléfono</label>
              <input type="text" class="form-control" placeholder="Número de Teléfono" v-model="clienteDestino.telefono">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--<div class="row mt-4">
      <base-button slot="footer" type="primary" fill @click="enviarPaquete">Registrar Paquete</base-button>
      <base-button slot="footer" type="primary" fill @click="registrarEnvio">Registrar Envío</base-button>
      <base-button slot="footer" fill @click="regresarAlListar">Regresar</base-button>
    </div>-->
  
    <div class="button-container">
      <base-button slot="footer" fill @click="regresarAlListar">Regresar</base-button>
      <base-button slot="footer" type="primary" fill @click="registrarEnvio">Registrar Envío</base-button>
    </div>
  </card>
</template>


<script>
  import { BaseTable } from "@/components";
  import axios from 'axios';
  //import { useToast } from 'vue-toastification';
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
      ResumenEnvio
    },
    data() {
      return {
        formSubmitted: false,
        fechaEnvio: '',
        horaEnvio: '',  
        clienteOrigen:{
          id:'',
          ciudadPais: '', /*Aqui se guardaría el valor, pero en paisOrigen y ciudadOrigen ya se guarda los valores que se encuentran por defecto*/
          codigoOACI: "",
          nombreCompleto: '',
          email:'',
          telefono:'',
          numDniRuc:''
        },
        clienteDestino:{
          id:"",
          ciudadPais: "",
          codigoOACI: "",
          nombreCompleto: "",
          email:"",
          telefono:"",
          numDniRuc:""
        },
        descripcionPaquete: "",
        cantidadPaquetes: '',
        estadoEnvio: 'En Almacén',
        paisOrigen: "",
        ciudadOrigen:"",
        loading: true,
        error: '',
        selectedSede: "", // Inicializa como cadena vacía
        /*
        lpaisesDestino: [
          { id: 1, pais: { nombre: 'Perú' }, ciudad: { nombre: 'Lima' } },
          { id: 2, pais: { nombre: 'Argentina' }, ciudad: { nombre: 'Buenos Aires' } },
          { id: 3, pais: { nombre: 'Chile' }, ciudad: { nombre: 'Santiago' } }
          // Agrega más paises con ciudades según sea necesario
        ],
        */
        lpaisesDestino: [],
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
      
      this.fetchPaisesDestino();
    },
    computed: {
      filteredPaisesDestino() {
        return this.lpaisesDestino.filter(paisDestino => {
                                                          return `${paisDestino.codigoOACI}` !== `SPIM`;
                                                         });
      }
    },
    methods:{
      async fetchPaisesDestino() {
        try {
          const response = await axios.get('http://localhost/api/aeropuertos/getall');
      
          //this.lpaisesDestino = response.data;
          // Asumiendo que response.data es un arreglo de objetos con la estructura adecuada
          
          this.lpaisesDestino = response.data.sort((a, b) => {
            // Si a.pais y b.pais son cadenas de texto, se pueden comparar directamente
            if (a.pais < b.pais) return -1;
            if (a.pais >= b.pais) return 1;
            return 0;
          });
          
        } catch (error) {
          this.error = 'Error al cargar los datos';
          console.error(error);
        }
      },

      obtenerUbicacionActual(position){
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.paisOrigen = data.countryName;
            this.ciudadOrigen = data.city;
            this.clienteOrigen.ciudadPais = this.ciudadOrigen + " - " + this.paisOrigen;
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
      regresarAlListar(){
        console.log('listadoPaquetes llamado');
        this.$router.push('listadoPaquetes');
      },
      obtenerFechaHoraActual() {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}${month}${day}`;

        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`;

        return {
          fechaEnvio: formattedDate,
          horaEnvio: formattedTime
        };
      },
      /*
      {
    "idEnvio": "15",
    "ciudadOrigen": "Sevilla",
    "ciudadDestino": "Lima",
    "ciudadActual": "Lima",
    "fechaEnvio": "20240803",
    "horaEnvio": "15:00",
    "cantidadPaquetes": 4,
    "estadoEnvio": "aa",
    "coordinates": null,
    "ruta": null
}
*/
      async registrarEnvio() {
        const dateTime = this.obtenerFechaHoraActual();
        this.fechaEnvio = dateTime.fechaEnvio;
        this.horaEnvio = dateTime.horaEnvio;
        this.formSubmitted = true;
        try {
          const payload = {
            ciudadOrigen: "SPIM", //this.clienteOrigen.ciudadPais, // "Lima-Peru",
            ciudadDestino: this.clienteDestino.codigoOACI, // "Brasilia-Brasil",
            ciudadActual: "SPIM",//this.clienteOrigen.ciudadPais, // "Lima-Peru",
            fechaEnvio: this.fechaEnvio,
            horaEnvio: this.horaEnvio,
            idEnvio: "154",
            cantidadPaquetes: this.cantidadPaquetes,
            estadoEnvio: this.estadoEnvio
          };

          // Llamada a la API
          const response = await axios.post('http://localhost/api/paquete/register/showall', payload);

          // Suponiendo que la respuesta tiene un campo `success` para indicar éxito
          //if (response.data.success) {
          if (response.data.id !== 0){
            console.log('Envío registrado exitosamente:', response.data);
            //this.$toast.success('El envío se ha registrado exitosamente.');
            // Muestra una notificación de éxito
            /*
            this.$notify({
              component: NotificationTemplatePaqueteSuccess,
              horizontalAlign: 'center',
              verticalAlign: 'top',
            });
            */
            // Navega a la página de resumen del envío
            //this.$router.push({ name: 'Resumen de Envío', params: { idEnvio: response.data } });
            /*
            this.$router.push({ 
                name: 'Resumen de Envío', 
                props: { envio: response.data }
            });*/

            this.$router.push({ name: 'Resumen de Envío', params: { envio: response.data } });

          } else {
            console.error('Error en la respuesta:', response.data);
            // Muestra una notificación de error
            //this.$toast.error('Hubo un error al registrar el envío.');
            /*
            this.$notify({
              component: NotificationTemplatePaqueteError,
              horizontalAlign: 'center',
              verticalAlign: 'top',
            });
            */
          }
        } catch (error) {
          console.error('Error al registrar el envío: ', error);
          // Muestra una notificación de error
          //this.$toast.error('Hubo un error al registrar el envío.');
          /*
          this.$notify({
            component: NotificationTemplatePaqueteError,
            horizontalAlign: 'center',
            verticalAlign: 'top',
          });
          */
        }
      }

    }
  }
</script>
<style>
/*Posiciona el botón a la derecha el button-container y el right-aligned*/
  .button-container {
    display: flex;
    justify-content: space-between;
    width: 100%; /* Asegura que el contenedor ocupe todo el ancho */
    padding: 0 10px; /* Opcional: Añade un poco de padding si deseas espacio a los lados */
  }
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
