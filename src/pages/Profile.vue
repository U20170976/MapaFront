<template>
  <div class="row">
    <div class="col-md-8">
      <edit-profile-form :model="model">
      </edit-profile-form>
    </div>
    <div class="col-md-4">
      <user-card :user="user"></user-card>
    </div>
  </div>
</template>
<script>
  import EditProfileForm from './Profile/EditProfileForm';
  import UserCard from './Profile/UserCard';
  import axios from 'axios';
  import Authentication from '@/store/authentication.js';
  export default {
    components: {
      EditProfileForm,
      UserCard
    },
    data() {
      return {
        model: {
          company: 'Creative Code Inc.',
          email: 'mike@email.com',
          username: 'michael23',
          firstName: 'Mike',
          lastName: 'Andrew',
          address: 'Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09',
          city: 'Melbourne',
          country: 'Australia',
          about: 'Lamborghini Mercy, Your chick she so thirsty, I\'m in that two seat Lambo.'
        },
        user: {
          fullName: 'Nombre usuario',
          title: 'Usuario cliente',
          //description: `Se coloca alguna descripción del usuario `
        },
        data_usuario:{
          id: 0,
          numeroDocumento: '',
          nombreRazonSocial:'',
          correo:'',
          direccion:'',
          fechaNacimiento:'',
          tipoDocumento:'',
          telefono:'',
          usuario:'',
          idioma:'',
          tipoUsuario:'',
          password:'',
          confirmar_password:'',
        }
      }
    },
    mounted(){

      let vue = this;
      vue.data_usuario = Authentication.getProfile();
      vue.user.title = vue.data_usuario.tipoUsuario;
      vue.user.fullName = vue.data_usuario.nombreRazonSocial; 

    }
  }
</script>
<style>
</style>
