
<template>
  <div class="login-container">
    <!-- Left Side with the Logo and Tagline -->
    <div class="login-brand">
      <div class="brand-container">
      <img src="img/MAIN.png" alt="Redex Logo" class="logo">
    
      <h1 class="brand">
        <span class="brand-title">Redex</span><span class="brand-title-point">.</span>
      </h1>
      <p class="brand-tagline">Always on Time</p>
    </div>
  </div>
    <!-- Right Side with the Login Form -->
    <div class="login-form">
      <h2>¡Bienvenido!</h2>
      <p class="intro-text">Envía o gestiona tus paquetes con <span class="brand-highlight">Redex</span>.</p>
      <form @submit.prevent="onSubmit">
        <label for="email" class="input-label">Usuario</label>
        <input type="email" v-model="form.email" placeholder="Correo electrónico" required>
        <label for="password" class="input-label">Contraseña</label>
        <input type="password" v-model="form.password" placeholder="Contraseña" required>
        <router-link
          to="/maps">
        
        <button type="submit" class="btn link-like">Ingresar</button>   </router-link>
        <div class="login-options">
    <label class="checkbox-label">
      <input type="checkbox" v-model="form.remember"> Recuérdame
      <a href="#" class="forgot-password">¿Olvidaste la contraseña?</a>
    </label>
  
  </div>

  <div class="login-divider">
    <span>-------------------O-------------------</span>
  </div>

  <button type="button" class="login-google">
    <img src="img/google.png" alt="Google icon" class="google-icon"> Ingresa con Google
  </button>
      </form>
    </div>
  </div>
</template>

<script>
// ... Importa tus componentes y librerías necesarias

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
    };
  },
  methods: {
    onSubmit() {
      // Aquí manejarías el envío del formulario
    },
  },
};

</script>

<style scoped>
.brand-container {
  text-align: left;
  padding-right: 0%; 
  justify-content: center;
}

.brand {
  margin-bottom: -10px; /* Ajusta esto para aumentar el espacio entre el título y el subtítulo */
}
.login-container {
  display: flex;
  height: 100vh;
  background: #FFFFFF;
}
.login-brand {
  flex-basis: 45%; /* Esto asignará el 45% del ancho disponible al contenedor del formulario */
  padding: 80px;
  flex: 1;
  background: #D9F3EA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-brand h1 {
  color: #333333;
}
.login-form {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
}
.login-form h2 {
  color: #202020;
  font-weight: bold;
}
.login-form form {
  width: 100%; /* Puede ajustar esto para cambiar el ancho del formulario */
  max-width: 350px; /* Esto limitará el ancho máximo del formulario */
  display: flex;
  flex-direction: column;

}
.login-options a {
  font-weight: bold; /* Hace el texto en negrita */
  color: #00B074; /* Cambia esto por el color que prefieras */
  text-decoration: none; /* Elimina el subrayado */
}
input[type=email],
input[type=password] {
  width: 100%; /* Esto hará que los campos de entrada y botones usen todo el ancho disponible del formulario */
  padding: 5px;
  border-radius: 10px;
  border: 1.5px solid;
  margin-bottom: 1rem;

}

.input-label {
  color: #202020; /* Cambia esto por el color que prefieras para los labels */
  font-weight: bold;
  align-self: start; /* Alinea la etiqueta a la izquierda del contenedor */
  margin-bottom: 5px; /* Espacio entre la etiqueta y el campo de entrada */
}
.intro-text {
  color: #353535; /* Color general del texto */
}
.brand-highlight {
  color: #353535; /* Color específico para 'Redex' */
  font-weight: bold;
}


button[type=submit] {
  background: #34C759;
  color: white;
  padding: 5px; /* Ajusta el padding para cambiar el tamaño */
  font-size: 1rem; /* Ajusta el tamaño de la fuente si es necesario */
  margin-bottom: 1rem; /* Espacio entre los botones y otros elementos */
  border-radius: 10px;
  font-weight: bold; 
  border: 1px solid #34C759;
}
button[type=button] {
  background: #353535;
  color: white;
  padding: 8px; /* Ajusta el padding para cambiar el tamaño */
  font-size: 1rem; /* Ajusta el tamaño de la fuente si es necesario */
  margin-bottom: 1rem; /* Espacio entre los botones y otros elementos */
  border-radius: 10px;
  font-weight: bold; 
  border: 1px solid #353535;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #202020;
}
.login-divider span {
  background: #fff;
  padding: 1rem 1rem;
}
.login-divider {
  text-align: center;
  margin: 10px 0; /* Aumenta el espacio antes y después del divisor */
}


.btn.link-like {
 
  padding: 8.5px;

  cursor: pointer;
  display: inline-block;
}



.login-google {
  padding: 8.5px;

  cursor: pointer;
  display: inline-block;
}

.btn.link-like:hover {
  background-color: #FFFFFF; /* Añade un efecto suave al pasar el mouse */
  color: #FFFFFF;
  background: #12116e;
  border: 1px solid #FFFFFF;
}

.login-google:hover {
  background-color: #FFFFFF; /* Añade un efecto suave al pasar el mouse */
  color: #FFFFFF;
  background: #12116e;
  border: 1px solid #FFFFFF;
}

.logo {
  width: 600px; /* Ancho fijo */
  height: 400px; /* Altura fija */
 /* Esto asegura que la imagen cubra el espacio asignado sin deformarse */
}
/* Personaliza el título */
.brand-title {
  color: #333333; /* Cambia esto por el código de color que prefieras */
  font-size: 3em; /* Cambia esto para ajustar el tamaño */
  font-weight: bold;
  display:  inline;
}
.brand-title-point {
  color: #00B074; /* Cambia esto por el código de color que prefieras para el punto */
  font-size: 3em; 
  font-weight: bold;/* Asegúrate de que esto coincida con el tamaño de 'Redex' para alineación vertical */
}

/* Personaliza el subtítulo */
.brand-tagline {
  color: #B9BBBD; /* Cambia esto por el código de color que prefieras */
  font-size: 2.5em; /* Cambia esto para ajustar el tamaño */
  font-weight: medium;
 
}

.checkbox-label {
  display: flex;
  align-items: center;
}

.google-icon {
  margin-right: 10px; /* Añade un pequeño margen a la derecha del icono */
  width: 20px; /* Ajusta esto según el tamaño del icono que prefieras */
  height: 20px; /* Ajusta esto según el tamaño del icono que prefieras */
}

.forgot-password{
  padding-left: 50px;
}

.input, .btn {
  border-radius: 10px;

}
.btn {
  padding: 8px 20px;
  font-weight: bold;
  cursor: pointer;
  display: block;
  width: 100%; /* Hace que el botón ocupe todo el ancho del contenedor form */
  margin-top: 10px;
}
.ingresar {
  background-color: #34C759; /* Color de fondo para el botón ingresar */
  color: white;
}
</style>
