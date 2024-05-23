<template>
  <div class="search-filters">
    <h2>Filtros de búsqueda:</h2>
    <form @submit.prevent="onSearch">
      <div class="form-group">
        <label for="codigoEnvio">Código de envío</label>
        <input v-model="filters.codigoEnvio" type="text" id="codigoEnvio" placeholder="Código de envío" />
      </div>
      <div class="form-group">
        <label for="origen">Ciudad, País - origen</label>
        <input v-model="filters.origen" type="text" id="origen" placeholder="Ciudad, País - origen" />
      </div>
      <div class="form-group">
        <label for="destino">Ciudad, País - destino</label>
        <input v-model="filters.destino" type="text" id="destino" placeholder="Ciudad, País - destino" />
      </div>
      <div class="form-group">
        <label for="estado">Estado de envío</label>
        <select v-model="filters.estado" id="estado">
          <option value="">Seleccionar estado</option>
          <option value="en_camino">En camino</option>
          <option value="entregado">Entregado</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>
      <button type="submit">Buscar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SearchFilters',
  data() {
    return {
      filters: {
        codigoEnvio: '',
        origen: '',
        destino: '',
        estado: ''
      }
    };
  },
  methods: {
    onSearch() {
      this.$emit('search', this.filters);
    }
  }
};
</script>

<style scoped>
.search-filters {
  /* estilos para el componente de filtros de búsqueda */
}
</style>
