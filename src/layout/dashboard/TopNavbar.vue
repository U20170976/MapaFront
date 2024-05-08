<template> 
  <nav class="navbar navbar-expand-lg navbar-absolute"
       :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}">


    <div class="container-fluid">
      <header class="map-header">
      <h1 class="brand">
        <span class="brand-title">Redex</span><span class="brand-title-point">.</span>
      </h1>
      <p class="brand-tagline">Always on Time</p>
   
    </header>

      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{toggled: $sidebar.showSidebar}">
     
          <button type="button"
                  class="navbar-toggler"
                  aria-label="Navbar toggle button"
                  @click="toggleSidebar">
                  
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        
        <p class="navbar-brand">{{routeName}}</p>
      </div>


      <button class="navbar-toggler" type="button"
              @click="toggleMenu"
              data-toggle="collapse"
              data-target="#navigation"
              aria-controls="navigation-index"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
          
            <base-dropdown tag="li"
                           :menu-on-right="!$rtl.isRTL"
                           title-tag="a"
                           class="nav-item"
                           menu-classes="dropdown-navbar">
              <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
                <div class="photo">
                  <img src="img/anime3.png">
                </div>
                <b class="caret d-none d-lg-block d-xl-block"></b>
                <p class="d-lg-none">
                  Salir
                </p>
              </a>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item" @click="goProfile()">Perfil</a>
              </li>

              <div class="dropdown-divider"></div>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item" @click="logoutProfile()">Salir</a>
              </li>
            </base-dropdown>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </nav>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions';
  import Modal from '@/components/Modal';

  import Authentication from '@/store/authentication.js';

  export default {
    components: {
      CollapseTransition,
      Modal
    },
    computed: {
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      },
      isRTL() {
        return this.$rtl.isRTL;
      }
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchModalVisible: false,
        searchQuery: ''
      };
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      goProfile(){
        let vue = this;
        //Authentication.logout();
        vue.$router.push('/profile');
      },
      logoutProfile(){
        let vue = this;
        Authentication.logout();
        vue.$router.push('/login');

      }
    }
  };
</script>
<style>
.brand-title {
  font-size: 1em; /* Ajusta el tamaño como desees */
  color: #fff; /* Color para 'Redex' */
  font-weight: bold;
}

.brand-title-point {
  font-size: 1em; /* Asegúrate de que sea del mismo tamaño que .brand-title para alineación adecuada */
  color: #00B074; /* Color para el punto */
  font-weight: bold;
}

.brand-tagline {
  font-size: 1em; /* Ajusta el tamaño del tagline */
  color: #363636; /* Color para 'Always on Time' */
  font-weight: bold;

  display: flex;
  align-items: baseline; /* Alinea correctamente el texto y el punto */
  gap: 0.2em; /* Ajusta el espacio entre 'Redex' y el punto */
  margin-top: -15px;
}

/* Si deseas que 'Redex.' esté en una sola línea, puedes usar display: flex en el contenedor */
.brand {
  display: flex;
  align-items: baseline; /* Alinea correctamente el texto y el punto */
  gap: 0.2em; /* Ajusta el espacio entre 'Redex' y el punto */
  
  margin-bottom: 15px; /* Ajusta esto para aumentar el espacio entre el título y el subtítulo */

}
.navbar-brand {
  margin-right: 20px; 
  font-weight: bold;
}
.container-fluid {
  display: flex;
  align-items: center; /* Asegura que todo esté alineado verticalmente */
  justify-content: space-between; /* Distribuye el espacio entre los elementos */
}
.navbar-header, .navbar-profile {
  display: flex;
  align-items: center;
}
.map-header, .navbar-profile {
  flex: 1; /* Ambos toman igual cantidad de espacio */
  justify-content: center; /* Centra los elementos dentro de cada contenedor */
  text-align: center; /* Centra el texto dentro de los elementos */
}
.navbar-header {
  display: flex;
  align-items: center; /* Asegura que todo esté alineado verticalmente */
  margin-top: 200px;
}

.map-header {
  margin-right: 20px; /* Ajusta el margen según sea necesario */
}
.dropdown-toggle.nav-link {
  display: flex;
  align-items: center; /* Asegura que la imagen y el texto estén alineados verticalmente */
  margin-bottom: 20%;
}

.photo img {
  width: 40px; /* Ajusta el tamaño de la imagen según sea necesario */
  height: 40px;
  border-radius: 50%; /* Hace la imagen circular */
  margin-right: 10px; /* Añade margen a la derecha de la imagen */

}
</style>