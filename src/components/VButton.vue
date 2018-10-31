<template>
    <span 
        @click="$emit('click')"
        class="btn"
        :class="{ 'btn-primary': btnPrimary, 'btn-secondary': btnSecondary, 'btn-selected': btnSelected, 'btn-inverse': btnInverse }"
    >
        <slot></slot>
    </span>
</template>

<script>
import API from '../api.js';

export default {
  name: 'SamplesPicker',
  props: {
      btnPrimary: {
          type: Boolean,
          required: false,
          default: true
      },
      btnSecondary: {
          type: Boolean,
          required: false,
          default: false
      },
      btnSelected: {
          type: Boolean,
          required: false,
          default: false
      },
      btnInverse: {
          type: Boolean,
          required: false,
          default: false
      }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

span.btn {
    padding: 0.3rem;
    border-radius: 0.2rem;
    user-select: none;
    cursor: pointer;

    &.btn-primary {
        background-color: $color-darkgray;
        color: $color-white;
    }

    &.btn-inverse {
        background-color: $color-lgreen;
        color: $color-darkgray;
    }

    &.btn-secondary {
        background-color: $color-green;
        color: $color-darkgray;
    }

    &.btn-selected {
        opacity: 0.4;
    }
}
</style>
