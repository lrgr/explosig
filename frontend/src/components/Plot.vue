<template>
    <div>
        <div class="navbar">
            <span class="title">{{ plot_title }}</span>
            <div class="right-button-group">
                <span class="button">Signatures</span>
                <span class="button">Samples</span>
                <span class="button">Clinical</span>
            </div>
        </div>
  </div>
</template>

<script>

export default {
  name: 'Plot',
  data: function() { 
        return {
            openOptions: null
        };
  },
  components: {
      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.navbar {
    width: 100%;
    background-color: $color-lgray;
    padding: 0.5rem 0rem;
}

span.title {
    text-decoration: none;
    color: $color-white;
    font-size: 1.5rem;
    margin: 0 1rem;
}
.right-button-group {
    float: right;
    margin: 0.3rem 0.5rem;
}
span.button {
    color: $color-white;
    background-color: $color-darkgray;
    margin: 0rem 0.5rem;
    padding: 0.3rem;
    border-radius: 0.2rem;
    cursor: pointer;

    &.button-inverse {
        background-color: $color-lgreen;
        color: $color-darkgray;
    }
}
.modal-background {
    z-index: 1;
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100vh;
    background-color: black;
    opacity: 0.4;
}
.modal {
    z-index: 2;
    top: 10vh;
    left: 10%;
    height: 80vh;
    width: 80%;
    position: absolute;
    background-color: $color-white;

    .modal-inner {
        margin: 1rem;

        .modal-close {
            float: right;
            cursor: pointer;
        }
    }
}
</style>
