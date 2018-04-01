<template>
  <div id="app">
    <NavBar></NavBar>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/NavBar.vue'
import SelectData from './components/SelectData.vue'
import Spinner from './components/Spinner.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    NavBar,
    SelectData,
    Spinner
  }
}
</script>

<style lang="scss">
@import './variables.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-darkgray;
  margin: 0px;
}
</style>
