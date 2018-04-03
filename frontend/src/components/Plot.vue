<template>
    <div>
        <div class="optionsbar">
            <span class="title">Plot Title</span>
            <div class="right-button-group">
                <span class="button">Signatures</span>
                <span class="button">Samples</span>
                <span class="button">Clinical</span>
            </div>
        </div>
        <div class="plot">

        </div>
  </div>
</template>

<script>

export default {
  name: 'Plot',
  data: function() { 
        return {
            plot_title: "test",
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

.optionsbar {
    width: 100%;
    background-color: $color-lgray;
    padding: 0.5rem 0rem;

    span.title {
        text-decoration: none;
        color: $color-white;
        font-size: 1.2rem;
        margin: 0 1rem;
    }
    .right-button-group {
        float: right;
        margin: 0.2rem 0.5rem;
    }
}

span.button {
    color: $color-white;
    background-color: $color-darkgray;
    margin: 0rem 0.4rem;
    padding: 0.1rem 0.3rem;
    font-size: 1rem;
    border-radius: 0.2rem;
    cursor: pointer;

    &.button-inverse {
        background-color: $color-lgreen;
        color: $color-darkgray;
    }
}
.plot {
    border: 1px solid $color-lgray;;
    height: 25rem;
}
</style>
