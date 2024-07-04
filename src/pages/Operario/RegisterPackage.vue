<template>
  <card>
    <h2 slot="header" class="title">Registrar Envío</h2>
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    <div class="card mt-4">
      <div class="card-header">
        <h4 class="card-title">Datos del Envío</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>Ciudad, País - Origen</label>
              <select class="form-control" v-model="paquete.ciudadOrigen" required @change="updateDestinos">
                <option value="" disabled selected hidden>Seleccione una ciudad y país</option>
                <option v-for="paisOrigen in lpaisesDestino" :key="paisOrigen.id" :value="`${paisOrigen.codigoOACI}`">
                  {{ paisOrigen.nombreCiudad }} - {{ paisOrigen.pais }}
                </option>
              </select>
              <div v-if="!paquete.ciudadOrigen && formSubmitted" class="invalid-feedback">
                Por favor, seleccione una ciudad y país de origen.
              </div>
            </div>
            <div class="form-group">
              <label>Cantidad de Paquetes</label>
              <input type="text" class="form-control" placeholder="Cantidad de Paquetes" v-model="paquete.cantidadPaquetes" required>
              <div v-if="!paquete.cantidadPaquetes && formSubmitted" class="invalid-feedback">
                Por favor, ingrese la cantidad de paquetes.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Ciudad, País - Destino</label>
              <select class="form-control" v-model="paquete.ciudadDestino" required>
                <option value="" disabled selected hidden>Seleccione una ciudad y país</option>
                <option v-for="paisDestino in filteredPaisesDestino" :key="paisDestino.id" :value="`${paisDestino.codigoOACI}`">
                  {{ paisDestino.nombreCiudad }} - {{ paisDestino.pais }}
                </option>
              </select>
              <div v-if="!paquete.ciudadDestino && formSubmitted" class="invalid-feedback">
                Por favor, seleccione una ciudad y país de destino.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Datos del Contacto que Envía</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>DNI / RUC</label>
              <input type="text" class="form-control" placeholder="DNI o RUC" v-model="clienteManda.documentoIdentidad" required>
              <div v-if="!clienteManda.documentoIdentidad && formSubmitted" class="invalid-feedback">
                Por favor, ingrese el DNI o RUC.
              </div>
            </div>
            <div class="form-group">
              <label>Nombres y Apellidos</label>
              <input type="text" class="form-control" placeholder="Nombres y Apellidos" v-model="clienteManda.nombres" required>
              <div v-if="!clienteManda.nombres && formSubmitted" class="invalid-feedback">
                Por favor, ingrese los nombres y apellidos.
              </div>
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" class="form-control" placeholder="email@email.com" v-model="clienteManda.correo" required>
              <div v-if="!clienteManda.correo && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
            </div>
            <div class="form-group">
              <label>Número de Teléfono</label>
              <input type="text" class="form-control" placeholder="Número de Teléfono" v-model="clienteManda.telefono" required>
              <div v-if="!clienteManda.telefono && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un número de teléfono.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Datos del Contacto que Recibe</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>DNI / RUC</label>
              <input type="text" class="form-control" placeholder="DNI o RUC" v-model="clienteRecibe.documentoIdentidad" required>  
              <div v-if="!clienteRecibe.documentoIdentidad && formSubmitted">
                <div class="invalid-feedback">Por favor, ingrese el DNI o RUC.</div>
                
              </div>
            </div>
            <div class="form-group">
              <label>Nombres y Apellidos</label>
              <input type="text" class="form-control" placeholder="Nombres y Apellidos" v-model="clienteRecibe.nombres" required>
              <div v-if="!clienteRecibe.nombres && formSubmitted" class="invalid-feedback">
                Por favor, ingrese los nombres y apellidos.
              </div>
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" class="form-control" placeholder="Correo Electrónico" v-model="clienteRecibe.correo" required>
              <div v-if="!clienteRecibe.correo && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
            </div>
            <div class="form-group">
              <label>Número de Teléfono</label>
              <input type="text" class="form-control" placeholder="Número de Teléfono" v-model="clienteRecibe.telefono" required>
              <div v-if="!clienteRecibe.telefono && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un número de teléfono.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  import config from "../../config";

  //Definimos las variables globales
  let urlBase = config.urlBase,// aquí guardamos la base de la URL
      //urlRegistrarEnvio = '/api/paquete/register/envio',
      urlRegistrarEnvio = '/api/paquete/register/envio/monitoreo',
      urlListarAeropuertos = '/api/aeropuertos',
      urlGetHuso = '/api/aeropuertos/getHuso/';
  export default {
    components: {
      BaseTable,
      listadoPaquetes,
      ResumenEnvio
    },
    data() {
      return {
        formSubmitted: false,
        paquete: {
          ciudadOrigen: "SPIM",
          ciudadDestino: "",
          ciudadActual: "",
          fechaEnvio: "",
          horaEnvio: "",
          cantidadPaquetes: '',
          estadoEnvio: "En Almacén",
          coordinates: null,
          ruta: null
        },
        clienteManda:{
          documentoIdentidad: "",
          nombres: null,
          correo:"",
          telefono:"",
          tipo:"1"
        },
        clienteRecibe:{
          documentoIdentidad: "",
          nombres: "",
          correo:"",
          telefono:"",
          tipo:"2"
        },
        //descripcionPaquete: "",
        paisOrigen: "",
        ciudadOrigen:"",
        loading: true,
        errorMessage: "",
        error: '',
        selectedSede: "", // Inicializa como cadena vacía
    
        lpaisesDestino: [],
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,

        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        },
        codigoSeleccionado:"",
      };
      
    },
    mounted(){
      this.fetchPaisesDestino();
    },
    computed: {
      filteredPaisesDestino() {
        return this.lpaisesDestino.filter(paisDestino => {
                                                          return `${paisDestino.codigoOACI}` !== this.paquete.ciudadOrigen;
                                                        });
      }
      
    },
    methods:{
      async registrarEnvio() {
        this.formSubmitted = true;
        console.log(this.clienteManda.nombres);
        if (this.paquete.ciudadOrigen && this.paquete.cantidadPaquetes && this.paquete.ciudadDestino &&
          this.clienteManda.documentoIdentidad && this.clienteManda.nombres && this.clienteManda.correo && this.clienteManda.telefono &&
          this.clienteRecibe.documentoIdentidad && this.clienteRecibe.nombres && this.clienteRecibe.correo && this.clienteRecibe.telefono) {
          const dateTime = await this.obtenerFechaHoraActual();
          this.paquete.fechaEnvio = dateTime.fechaEnvio;
          this.paquete.horaEnvio = dateTime.horaEnvio;
          try {
            const payload = {
              paquete: this.paquete,
              clienteManda: this.clienteManda,
              clienteRecibe: this.clienteRecibe
            };
            const response = await axios.post(urlBase + urlRegistrarEnvio, payload);
            if (response.data.id !== 0) {
              console.log('Envío registrado exitosamente:', response.data);
              this.$router.push({ name: 'Resumen de Envío', params: { envio: response.data } });
            } else {
              console.error('Error en la respuesta:', response.data);
              this.errorMessage = 'No se pudo registrar el envío';  // Establece el mensaje de error
            }
          } catch (error) {
            this.errorMessage = 'No se pudo registrar el envío';  // Establece el mensaje de error
            console.error('Error al registrar el envío: ', error);
          }
        }
        else{
          this.errorMessage = 'Por favor, complete todos los campos obligatorios.';  // Establece el mensaje de error
          console.log("Ingresa los datos por favor");
        }
      },
      async fetchPaisesDestino() {
        try {
          //const response = await axios.get('http://localhost/api/aeropuertos');
          console.log(urlBase + urlListarAeropuertos);
          const response = await axios.get(urlBase + urlListarAeropuertos);
      

          this.lpaisesDestino = response.data.sort((a, b) => {
            // Si a.pais y b.pais son cadenas de texto, se pueden comparar directamente
            if (a.pais < b.pais) return -1;
            if (a.pais >= b.pais) return 1;
            return 0;
          });
          
        } catch (error) {
          this.error = 'Error al cargar los datos';
          this.errorMessage = 'Error al cargar los países';  // Establece el mensaje de error
          console.error(error);
        }
      },
      async obtenerHusoHorario(codigo) {
        console.log("codigo seleccionado: ", codigo);
        //console.log("url del huso: ", urlBase + urlGetHuso + `${codigo}`);
        try {
          const response = await axios.get(urlBase + `/api/aeropuertos/getHuso/${codigo}`);
          //const response = await axios.get(urlBase + urlGetHuso + `${codigo}`);
          console.log('Datos recibidos:', response.data);
          // Aquí asumimos que el servicio devuelve un valor numérico que necesitamos
          return response.data;
        } catch (error) {
          console.error('Hubo un problema con la solicitud:', error);
          this.errorMessage = 'Error al registrar el envío';  // Establece el mensaje de error
          return null; // O cualquier valor predeterminado que tenga sentido en tu aplicación
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
            this.loading = false;
          })
          .catch(error => {
            console.error("Error al obtener la información del país:", error);
            //this.error = "Error al obtener la información del país.";
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

      async obtenerFechaHoraActual() {
        const currentDate = new Date();
        
        // Obtener el código seleccionado
        this.codigoSeleccionado = this.paquete.ciudadOrigen;
        console.log('Código de la ciudad de origen seleccionado:', this.codigoSeleccionado);
      // Llamar al método obtenerHusoHorario con el código seleccionado
        const husoNumerico = await this.obtenerHusoHorario(this.codigoSeleccionado);
        console.log("el huso horaraio es: ", husoNumerico);
        currentDate.setHours(currentDate.getHours() + 5 + husoNumerico);
        //currentDate.setHours(currentDate.getHours() + 5 );

        
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

      updateDestinos() {
      // Limpiar la ciudad destino cuando se actualiza la ciudad origen
      this.paquete.ciudadDestino = '';
      // Obtener el código seleccionado
     
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
    display: block; /* Asegúrate de que los mensajes se muestren como bloque */
    font-size: 0.875em; /* Ajusta el tamaño de la fuente si es necesario */
    margin-top: 0.25em; /* Añade margen superior para espaciar los mensajes */
  }
</style>
