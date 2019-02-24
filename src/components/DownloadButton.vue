<template>
    <div class="download-button-wrapper">
        <button @click="download">Download {{ plotRef }} Plot</button>
    </div>
</template>

<script>
import VButton from './VButton.vue';

export default {
  name: 'DownloadButton',
  props: {
        'plotRef': {
            type: String,
            required: true
        },
        'getRef': {
            type: Function,
            required: true
        }
  },
  components: {
      VButton
  },
  methods: {
      download() {
          let plotComponent = this.getRef(this.plotRef);
          if(plotComponent !== undefined && plotComponent !== null) {
              plotComponent.download().then((uri) => {
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", uri);
                    downloadAnchorNode.setAttribute("download", this.plotRef + ".png");
                    document.body.appendChild(downloadAnchorNode); // required for firefox
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                });
          }
      }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
