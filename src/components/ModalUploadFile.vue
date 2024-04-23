<template>
  <div>
    <ul v-if="files.length" class="p-5 dropzone">
      <div v-for="(file, index) in files" :key="file.id">
        <span class="word"><i class="tim-icons icon-single-copy-04"></i> {{file.name}} <span @click.prevent="remove(file)" style="cursor:pointer; color: #fd5d93;"> x </span></span>
      </div>
    </ul>
    <ul v-else>
      <td colspan="7">
        <div class="text-center p-5 dropzone">
          <h4 class="word">Arrastre un archivo y suéltelo<br/>o</h4>
          <label for="file" class="btn btn-lg btn-primary">Selecionar Archivo</label>
        </div>
      </td>
    </ul>
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
    </div>
    <file-upload
        class="btn btn-primary"
        :post-action="path"
        :multiple="true"
        :drop="true"
        :drop-directory="true"
        v-model="files"
        ref="upload">
        Selecionar Archivo
    </file-upload>
    <button type="button" class="btn btn-success" style="float:right" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
      <i class="tim-icons icon-cloud-upload-94"></i> Subir
    </button>
    <button type="button" class="btn btn-danger" style="float:right" v-else @click.prevent="$refs.upload.active = false">
      <i class="tim-icons icon-button-pause"></i> Detener
    </button>
  </div>
</template>

<script> 
  import FileUpload from 'vue-upload-component'; 
    
  export default {
    name: 'modal-upload-file',
    props: {
        path:{
            type: String,
            default: "",
            description: "Post action to upload file"
        }
    },
    components: {
      FileUpload
    },
    data() {
      return {
        files: []
      }
    },
    mounted(){
      
    },
    methods:{
        remove:function(file){
            this.$refs.upload.remove(file);
        }
    }
  }
</script>

<style>
.word{
    color: black !important;
}
</style>