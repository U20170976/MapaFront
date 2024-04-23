<template>
  <div>
    <div class="page-header page-header-small">
      <parallax
        class="page-header-image"
        style="background-image: url('img/bg6.jpg')"
      >
      </parallax>
      <div class="content-center">
        <div class="container">
          <h1 class="title">REDEX</h1>
          <!--div class="text-center">
            <a href="#pablo" class="btn btn-primary btn-icon btn-round">
              <i class="fab fa-facebook-square"></i>
            </a>
            <a href="#pablo" class="btn btn-primary btn-icon btn-round">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#pablo" class="btn btn-primary btn-icon btn-round">
              <i class="fab fa-google-plus"></i>
            </a>
          </div-->
        </div>
      </div>
    </div>
    
    <div class="section section-about-us">
      <div class="container">
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto text-center">
            <h2 class="title">Tracking</h2>
            
            <fg-input placeholder="Ingrese el código tracking..."
                      v-model="searchWord">
            </fg-input>
            
            <div id="modals">
              <n-button type="primary"
                        @click.native="[modals.classic = true, filterTracking(searchWord)]"
                        >
                Buscar
              </n-button>
            </div>


            <!--ACA SE DEBE INSERTAR LA INFORMACION QUE SE EXTRAIGA DEL TRACKING-->
            <modal-index v-if="activado" :show.sync="modals.classic" headerClasses="justify-content-center">
              <h5 slot="header" class="title title-up">Información del paquete</h5>
              <p v-for="detalle in detalles" :key="detalle"> 
                {{detalle}}
              </p>
              <template slot="footer">
                <n-button type="danger" @click.native="[modals.classic = false, activado = false]">
                  Cerrar
                </n-button>
              </template>
            </modal-index>

          </div>
        </div>
      </div>

      


    </div>



    <div class="section section-team text-center">
      <div class="container">
        <div class="team">
          <div class="row">
            <div class="col-md-4">
              <div class="team-player">
                
                <p class="category text-primary">Sobre nosotros</p>
                <p class="blockquote blockquote-primary">
                  You can write here details about one of your team members. You
                  can give more details about what they do. Feel free to add
                  some <a href="#">links</a> for people to be able to follow
                  them outside the site.
                </p>
                <p class="category text-primary">Contáctanos</p>
                <p class="blockquote blockquote-primary">
                  You can write here details about one of your team members. You
                  can give more details about what they do. Feel free to add
                  some <a href="#">links</a> for people to be able to follow
                  them outside the site.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="team-player">
                
                <p class="category text-primary">Precios</p>
                <p class="blockquote blockquote-primary">
                  You can write here details about one of your team members. You
                  can give more details about what they do. Feel free to add
                  some <a href="#">links</a> for people to be able to follow
                  them outside the site.
                </p>
                <p class="category text-primary">Destinos</p>
                <p class="blockquote blockquote-primary">
                  You can write here details about one of your team members. You
                  can give more details about what they do. Feel free to add
                  some <a href="#">links</a> for people to be able to follow
                  them outside the site.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="team-player">
                
                <p class="category text-primary">Servicios, términos y condiciones</p>
                <p class="blockquote blockquote-primary">
                  You can write here details about one of your team members. You
                  can give more details about what they do. Feel free to add
                  some <a href="#">links</a> for people to be able to follow
                  them outside the site.
                </p>                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CardIndex, Button, FormGroupInput, ModalIndex, Parallax} from '@/components';
import axios from 'axios';


export default {
  name: 'landing',
  bodyClass: 'landing-page',
  components: {
    CardIndex,
    ModalIndex,
    Parallax,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput
  },
  data() {
    return {
      form: {
        firstName: '',
        email: '',
        message: ''
      },
      modals: {
        classic: false,
        mini: false
      },
      detalles:[],
      searchWord: "",
      activado: false
    };
  },
  mounted(){
    
  },
  methods:{

    filterTracking:function(searchWord){
      let vue = this;
      
        if(vue.searchWord != ""){        
          axios.post(this.$store.state.appUri + '/paquetes/obtenerHistorial', {codigoTracking: searchWord})
          .then(function(response){
              if(response.data.lenght != 0){
                vue.activado = true;
                response.data.historialPaquete.forEach(element => {
                  vue.detalles.push(
                      '* ' + element.fecha_llegada_sede_actual + ' | ' + element.sedeActual.pais.nombre + ' | ' + element.sedeActual.codigoOaci
                  );
                });
              }
          }).catch(function (error) {
            console.log(error);
          })
          vue.searchWord="";
          vue.detalles = [];
      }
      
    }

  }
};
</script>
<style></style>
