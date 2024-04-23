<template>
  <card>
    
    <h5 slot="header" class="title" v-if="id != 'modificarUsuario'">Registro de nuevo usuario</h5>
    <h5 slot="header" class="title" v-else>Modificar datos de usuario</h5>

    
    <div class="row">

      <div class="col-md-3 pr-md-1">
        <div class="form-group">
          <slot name="label">
            <label class="control-label">
              Tipo Usuario
            </label>
          </slot>
          <select class="input-group-prepend form-control" v-model="usuario" @change="asignarTipo(usuario)">
              <option style="color:black" v-for="usuario in usuarios" :key="usuario.id" :value="usuario">
                {{usuario.tipo.replace('_', ' ')}}
              </option>
          </select>
        </div>
      </div>


      <div class="col-md-4">
        <div class="col-md-6 pr-md-1 form-group">
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
      </div>

    </div>

    <div class="row">
      <div class="col-md-5 pr-md-1">
        <base-input label="Nombres y Apellidos"
                  v-model="data_usuario.nombreRazonSocial"                  
                  placeholder="Nombres y apellidos">
        </base-input>
      </div>
    </div>

    <div class="row">  
      <div class="col-md-5 pr-md-1">
        <base-input label="DNI o RUC"
                  v-model="data_usuario.numeroDocumento"
                  placeholder="DNI o RUC">
        </base-input>
      </div>
    </div>

    <div class="row">  
      <div class="col-md-5 pr-md-1">
        <base-input label="Nombre representante legal"
                  v-if="tipo_juridico"
                  v-model="data_usuario.nombreRepresentante"
                  placeholder="Nombre representante legal">
        </base-input>
      </div>
    </div>

    <div class="row">  
      <div class="col-md-5 pr-md-1">
        <base-input label="DNI representante legal"
                  v-if="tipo_juridico"
                  v-model="data_usuario.dniRepresentante"
                  placeholder="DNI representante legal">
        </base-input>
      </div>
    </div>

    <div class="row">  
      <div class="col-md-5 pr-md-1">
        <base-input label="Nombre contacto"
                  v-if="tipo_juridico"
                  v-model="data_usuario.nombreContacto"
                  placeholder="Nombre contacto">
        </base-input>
      </div>
    </div>

    <div class="row">  
      <div class="col-md-5 pr-md-1">
        <base-input label="DNI contacto"
                  v-if="tipo_juridico"
                  v-model="data_usuario.dniContacto"
                  placeholder="DNI contacto">
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-5 pr-md-1" v-bind:class="[isEmailValid()]">
        <base-input label="Email address"
                  v-model="data_usuario.correo"
                  type="email"
                  placeholder="mike@email.com">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <base-input label="Dirección"
                  v-model="data_usuario.direccion"
                  placeholder="Dirección">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input label="Teléfono"
                  v-model="data_usuario.telefono"
                  placeholder="Teléfono">
        </base-input>
      </div>
      <div class="col-md-4 pr-md-1">
        <base-input type="date"
                  v-if="!tipo_juridico"
                  label="Fecha de nacimiento"
                  format= "yyyy-MM-dd"
                  v-model="fecha_N">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input label="Nombre de usuario"
            v-model="data_usuario.username"
            placeholder="Nombre de usuario">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input type="password"
            v-model="data_usuario.password"
            label="Contraseña"
            placeholder="Contraseña">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input type="password"
            v-model="data_usuario.confirmar_password"
            label="Confirmar contraseña"
            placeholder="Confirmar contraseña">
        </base-input>
      </div>
    </div>
    <b-button v-b-modal.modal-save slot="footer" type="primary" class="btn-primary" fill v-if="id != 'modificarUsuario'">Crear usuario</b-button>
    <b-button v-b-modal.modal-modify slot="footer" type="primary" class="btn-primary" fill v-else>Modificar usuario</b-button>
    <b-modal id="modal-save" title="Agregar Usuario"
        @ok="registrarUsuario">
        ¿Deseas registrar el usuario?
    </b-modal>
    <b-modal id="modal-modify" title="Modificar Usuario"
        @ok="modificarUsuario">
        ¿Deseas modificar los datos del usuario?
    </b-modal>
    <b-button slot="footer" fill @click="regresarAlListar()">Regresar</b-button>
  </card>
</template>
<script>
  import axios from 'axios';
  import Authentication from '@/store/authentication.js';

  import NotificationTemplateRegisterUserSuccess from '../Notifications/NotificationTemplateRegisterUserSuccess'; 
  import NotificationTemplateModifiyUserSuccess from '../Notifications/NotificationTemplateModifiyUserSuccess';
  import NotificationTemplateRegisterUserError from '../Notifications/NotificationTemplateRegisterUserError';

  const TIPO_OPERARIO = 'OPERARIO'; //1
  const TIPO_NATURAL = 'CLIENTE_NATURAL'; //2
  const TIPO_JURIDICO = 'CLIENTE_JURIDICO'; //3
  const TIPO_GERENTE = 'GERENTE'; //6
  const TIPO_ADMIN = 'ADMIN'; //5
  const TIPO_SA = 'SUPER_ADMIN'; //4

  export default {
    props: {
      id: {
        type: String,
        default: () => {
          return "";
        }
      }
    },
    data() {
      return{
        data_usuario:{
          id: null,
          numeroDocumento: '',
          nombreRazonSocial:'',
          correo:'',
          direccion:'',
          fechaNacimiento:'',
          tipoDocumento:'',
          telefono:'',
          username:'',
          idioma:'',
          tipoUsuario: 0,
          dniRepresentante: '',
          nombreRepresentante: '',
          dniContacto: '',
          nombreContacto: '',
          pais:'',
          ciudad:'',
          codigoOaci:'',
          password:'',
          confirmar_password:'',
          idSede: -1
        },
        fecha_N: '',
        tipo_juridico: false,
        usuarios:[],
        usuario: {},
        sedes:[],
        sede:{},
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        }
      }
    },
    methods:{
      isEmailValid: function() {
          let vue = this;
          return (vue.data_usuario.correo == " ")? "" : (vue.reg.test(vue.data_usuario.correo)) ? 'has-success' : 'has-error';
      },
      asignarTipo(usuario){
        let vue = this;
        vue.data_usuario.tipoUsuario = usuario.id;
        if(usuario.id == 3)
          vue.tipo_juridico = true;
        else
          vue.tipo_juridico = false;
      },
      obtenerCiudad(sede){
        let vue = this;
        vue.data_usuario.pais = sede.pais.nombre;
        vue.data_usuario.ciudad = sede.pais.ciudad;
        vue.data_usuario.codigoOaci = sede.codigoOaci;
        vue.data_usuario.idSede = sede.id;
      },
      esCamposCompletos(){
        let vue = this;

        if(vue.data_usuario.tipoUsuario == 3){
            if (vue.data_usuario.tipoUsuario != 0 && vue.data_usuario.codigoOaci != '' &&
              vue.data_usuario.pais != '' && vue.data_usuario.ciudad != '' &&
              vue.data_usuario.correo != '' && vue.data_usuario.username != '' &&
              vue.data_usuario.password != '' && vue.data_usuario.nombreRazonSocial != '' &&
              vue.data_usuario.numeroDocumento != '' && vue.data_usuario.telefono != '' &&
              vue.data_usuario.direccion != '' &&
              vue.data_usuario.tipoDocumento != '' && vue.data_usuario.dniRepresentante != '' &&
              vue.data_usuario.nombreRepresentante != '' && vue.data_usuario.dniContacto != '' &&
              vue.data_usuario.nombreContacto != '')
            return true;
            
        }else{
            if (vue.data_usuario.tipoUsuario != 0 && vue.data_usuario.codigoOaci != '' &&
                vue.data_usuario.pais != '' && vue.data_usuario.ciudad != '' &&
                vue.data_usuario.correo != '' && vue.data_usuario.username != '' &&
                vue.data_usuario.password != '' && vue.data_usuario.nombreRazonSocial != '' &&
                vue.data_usuario.numeroDocumento != '' && vue.data_usuario.telefono != '' &&
                vue.data_usuario.direccion != '' && vue.data_usuario.fechaNacimiento != '' &&
                vue.data_usuario.tipoDocumento != '')
              return true;
        }
        return false;
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
      modificarUsuario(){
        let vue = this;

        if(vue.data_usuario.tipoUsuario != 3){
          vue.data_usuario.fechaNacimiento = vue.fecha_N.substring(0,4) + "-" +
                                             vue.fecha_N.substring(5,7) + "-" +
                                             vue.fecha_N.substring(8,10);
        }
        if(vue.esCamposCompletos() && (vue.data_usuario.confirmar_password == vue.data_usuario.password)){

          axios.post(vue.$store.state.appUri+'/usuarios/insertar', vue.data_usuario)
          .then(response=>{
            vue.notifyVue('top', 'center',2,NotificationTemplateModifiyUserSuccess);            
          })
          .catch(function (error) {
            vue.notifyVue('top', 'center',4, NotificationTemplateRegisterUserError);
            console.log(error);
          });
        }else{
          vue.notifyVue('top', 'center',4, NotificationTemplateRegisterUserError);
        }
      },
      registrarUsuario(){
        let vue = this;
        

        if(vue.data_usuario.tipoUsuario != 3){
          vue.data_usuario.fechaNacimiento = vue.fecha_N.substring(0,4) + "-" +
                                             vue.fecha_N.substring(5,7) + "-" +
                                             vue.fecha_N.substring(8,10);
        }
        

        if(vue.esCamposCompletos() && (vue.data_usuario.confirmar_password == vue.data_usuario.password)){
          
          
          axios.post(vue.$store.state.appUri+'/usuarios/insertar', vue.data_usuario)
          .then(response=>{
            vue.notifyVue('top', 'center',2,NotificationTemplateRegisterUserSuccess);
            
            vue.data_usuario.numeroDocumento='';
            vue.data_usuario.nombreRazonSocial='';
            vue.data_usuario.correo='';
            vue.data_usuario.direccion='';
            vue.data_usuario.fechaNacimiento='';
            vue.data_usuario.tipoDocumento='';
            vue.data_usuario.telefono='';
            vue.data_usuario.username='';
            vue.data_usuario.idioma='';
            vue.data_usuario.tipoUsuario=0;
            vue.data_usuario.dniRepresentante='';
            vue.data_usuario.nombreRepresentante='';
            vue.data_usuario.dniContacto='';
            vue.data_usuario.nombreContacto='';
            vue.data_usuario.pais='';
            vue.data_usuario.ciudad='';
            vue.data_usuario.codigoOaci='';
            vue.data_usuario.password='';
            vue.data_usuario.confirmar_password='';
            vue.data_usuario.idSede=-1;

            vue.fecha_N = '';
            
          })
          .catch(function (error) {
            vue.notifyVue('top', 'center',4,NotificationTemplateRegisterUserError);
            console.log(error);
          });
        }else{
          vue.notifyVue('top', 'center',4,NotificationTemplateRegisterUserError);
        }
      },
      regresarAlListar: function(){
        switch(Authentication.getProfile().tipoUsuario){
          case TIPO_SA:
            this.$router.push('/admin/usuarios');
            break;
          case TIPO_ADMIN:
            this.$router.push('/admin/usuarios');
            break;
          case TIPO_GERENTE:
            this.$router.push('/gerente/usuarios');
            break;
        }
      }
    },
    mounted(){
      let vue = this;
      /*
      vue.data_usuario.numeroDocumento = Authentication.getProfile().numeroDocumento;
      axios.get(this.$store.state.appUri+'/usuarios/buscar/' + vue.data_usuario.numeroDocumento)
      .then(function(response){
          vue.data_usuario.id = response.data.usuario.id;
          vue.data_usuario.email = response.data.usuario.correo;
          vue.data_usuario.usuario = response.data.usuario.username;
          vue.data_usuario.telefono = response.data.usuario.telefono;
          vue.data_usuario.direccion = response.data.usuario.direccion;
          vue.data_usuario.fecha_nacimiento = response.data.usuario.fecha_nacimiento.substring(0,4)+"-"+response.data.usuario.fecha_nacimiento.substring(5,7)+"-"+response.data.usuario.fecha_nacimiento.substring(8,10);
          //console.log(response.data.usuario.fecha_nacimiento.substring(0,4)+"-"+response.data.usuario.fecha_nacimiento.substring(5,7)+"-"+response.data.usuario.fecha_nacimiento.substring(8,10));
          vue.data_usuario.tipoUsuario = response.data.usuario.tipoUsuario;
          vue.data_usuario.nombres = response.data.usuario.nombreRazonSocial;
          vue.data_usuario.numeroDocumento = response.data.usuario.numeroDocumento;
          vue.data_usuario.tipoDocumento = response.data.usuario.tipoDocumento;
          vue.data_usuario.idioma = response.data.usuario.idioma;
      });
      */
      if(vue.id == 'modificarUsuario'){
        axios.get(vue.$store.state.appUri + '/usuarios/buscarPorId/' + vue.$route.params.idUsuario).then(function(response){
          console.log(response.data);
          // axios.get(vue.$store.state.appUri+'/usuarios/obtenerDatosSede/'+ vue.$route.params.idUsuario)
          // .then(function(response){
          //   vue.data_usuario.idSede = response.data.sede.id;
          //   vue.data_usuario.codigoOaci = response.data.sede.codigoOaci;
          //   vue.data_usuario.pais = response.data.sede.pais.nombre;
          //   vue.data_usuario.ciudad = response.data.sede.pais.ciudad;
          //   vue.sede = response.data.sede;
          // });
          
          switch(response.data.usuario.tipoUsuario){
            case TIPO_OPERARIO:
              vue.data_usuario.tipoUsuario = 1;
              vue.usuario = {id: 1, tipo: TIPO_OPERARIO};
              break;
            case TIPO_NATURAL:
              vue.data_usuario.tipoUsuario = 2;
              vue.usuario = {id: 2, tipo: TIPO_NATURAL};
              break;
            case TIPO_JURIDICO:
              vue.data_usuario.tipoUsuario = 3;
              vue.usuario = {id: 3, tipo: TIPO_JURIDICO};
              vue.tipo_juridico = true;
              break;
            case TIPO_SA:
              vue.data_usuario.tipoUsuario = 4;
              vue.usuario = {id: 4, tipo: TIPO_SA};
              break;
            case TIPO_ADMIN:
              vue.data_usuario.tipoUsuario = 5;
              vue.usuario = {id: 5, tipo: TIPO_ADMIN};
              break;
            case TIPO_GERENTE:
              vue.data_usuario.tipoUsuario = 6;
              vue.usuario = {id: 6, tipo: TIPO_GERENTE};
              break;

          }
          vue.data_usuario.id = vue.$route.params.idUsuario;
          vue.data_usuario.numeroDocumento = response.data.usuario.numeroDocumento;
          vue.data_usuario.nombreRazonSocial = response.data.usuario.nombreRazonSocial;
          vue.data_usuario.correo = response.data.usuario.correo;
          vue.data_usuario.direccion = response.data.usuario.direccion;
          if(!vue.tipo_juridico){
            vue.data_usuario.fechaNacimiento = response.data.usuario.fechaNacimiento.substring(0,4) + "-" +
                                             response.data.usuario.fechaNacimiento.substring(5,7) + "-" +
                                             response.data.usuario.fechaNacimiento.substring(8,10);
          }
          vue.data_usuario.tipoDocumento = response.data.usuario.tipoDocumento;
          vue.data_usuario.telefono = response.data.usuario.telefono;
          vue.data_usuario.username = response.data.usuario.username;
          vue.data_usuario.idioma = response.data.usuario.idioma;
          vue.data_usuario.dniRepresentante = response.data.usuario.representanteLegalDni;
          vue.data_usuario.nombreRepresentante = response.data.usuario.representanteLegalNombre;
          vue.data_usuario.dniContacto = response.data.usuario.dniContacto;
          vue.data_usuario.nombreContacto = response.data.usuario.nombreContacto;
          vue.data_usuario.idSede = response.data.idSede;
          vue.data_usuario.codigoOaci = response.data.codigoOaci;
          vue.data_usuario.pais = response.data.pais;
          vue.data_usuario.ciudad = response.data.ciudad;

          vue.fecha_N = vue.data_usuario.fechaNacimiento;

          axios.get(vue.$store.state.appUri+'/sedes/listarSedes')
          .then(function(response){
            vue.sedes = response.data;
            vue.sedes.forEach(element =>{
              if (element.id == vue.data_usuario.idSede) vue.sede = element;
            })
          });
        })
      }

      if(vue.id != 'modificarUsuario') {
        axios.get(this.$store.state.appUri+'/sedes/listarSedes')
        .then(function(response){
          vue.sedes = response.data;
        });
      }

      switch(Authentication.getProfile().tipoUsuario){
        case TIPO_OPERARIO:
          vue.usuarios=[];
          vue.data_usuario.tipoDocumento = 'dni';
          break;
        case TIPO_NATURAL :
          vue.usuarios=[];
          vue.data_usuario.tipoDocumento = 'dni';
          break;
        case TIPO_JURIDICO:
          vue.usuarios=[];
          vue.data_usuario.tipoDocumento = 'ruc';
          break;
        case TIPO_GERENTE:
          vue.usuarios=[
              { id: 1, tipo: TIPO_OPERARIO }
          ];
          vue.data_usuario.tipoDocumento = 'dni';
          vue.data_usuario.tipoUsuario = 1;
          vue.usuario = vue.usuarios[0];
          break;
        case TIPO_ADMIN:
          vue.usuarios=[
              { id: 1, tipo: TIPO_OPERARIO },
              { id: 2, tipo: TIPO_NATURAL },
              { id: 3, tipo: TIPO_JURIDICO },
              { id: 6, tipo: TIPO_GERENTE }
          ];
          vue.data_usuario.tipoDocumento = 'dni';
          break;
        case TIPO_SA:
          vue.usuarios=[
              { id: 1, tipo: TIPO_OPERARIO },
              { id: 2, tipo: TIPO_NATURAL },
              { id: 3, tipo: TIPO_JURIDICO },
              { id: 4, tipo: TIPO_SA },
              { id: 6, tipo: TIPO_GERENTE },
              { id: 5, tipo: TIPO_ADMIN }
          ];
          vue.data_usuario.tipoDocumento = 'dni';
          break;
      }        
    }
  }
</script>
<style>
</style>
