<template>
  <div class="row">
    <div class="col-md-8">
      <edit-profile-form :model="model">
      </edit-profile-form>
    </div>
  </div>
</template>
<script>
  import listadoPaquetes from './Operario/listadoPaquetes';
  import RegisterPackage from './Operario/RegisterPackage';
  export default {
    components: {
      listadoPaquetes,
      RegisterPackage
    }
  }
</script>
<style>
</style>
