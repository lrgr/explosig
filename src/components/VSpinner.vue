<template>
    <div class="hollow-dots-spinner" :style="{'margin': margin, 'display': display}">
        <div class="dot" :style="{'border-color': color}"></div>
        <div class="dot" :style="{'border-color': color}"></div>
        <div class="dot" :style="{'border-color': color}"></div>
    </div>
</template>

<script>
export default {
  name: 'VSpinner',
  props: {
      'color': {
          type: String,
          default: "#648381"
      },
      'margin': {
          type: String,
          default: "30px 0"
      },
      'display': {
          type: String,
          default: "block"
      }
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';

.hollow-dots-spinner, .hollow-dots-spinner * {
    box-sizing: border-box;
}

.hollow-dots-spinner {
    margin: 30px 0px;
    height: 15px;
    width: calc(30px * 3);
}

.hollow-dots-spinner .dot {
    width: 15px;
    height: 15px;
    margin: 0 calc(15px / 2);
    border: 3px solid;
    border-radius: 50%;
    float: left;
    transform: scale(0);
    animation: hollow-dots-spinner-animation 1000ms ease infinite 0ms;
}

.hollow-dots-spinner .dot:nth-child(1) {
    animation-delay: calc(300ms * 1);
}

.hollow-dots-spinner .dot:nth-child(2) {
    animation-delay: calc(300ms * 2);
}

.hollow-dots-spinner .dot:nth-child(3) {
    animation-delay: calc(300ms * 3);

}

@keyframes hollow-dots-spinner-animation {
    50% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

</style>
