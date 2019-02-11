<template>
  <div id="app">
    <App v-if="authenticated" />
    <Login v-if="!loading && !authenticated" @login="checkToken" />
    <div v-if="loading" class="auth-loader">
        <h1>ExploSig</h1>
        <div>
            <VSpinner />
        </div>
    </div>
  </div>
</template>

<script>
import API from './../api.js';

// child components
import App from './App.vue';
import Login from './Login.vue';
import VSpinner from './VSpinner.vue';

export default {
  name: 'Auth',
  components: {
    App,
    Login,
    VSpinner
  },
  data() {
    return {
        loading: true,
        authenticated: false
    };
  },
  created() {
      this.checkToken();
  },
  methods: {
    checkToken() {
        const currToken = this.getToken();
        API.checkToken(currToken)
            .then(() => {
                API.token = currToken;
                this.loading = false;
                this.authenticated = true;
            })
            .catch(() => {
                this.loading = false;
                this.authenticated = false;
            });
    },
    getToken() {
      return window.localStorage.getItem('EXPLOSIG_API_TOKEN');
    }
  }
}
</script>

<style scoped lang="scss">
.auth-loader {
    display: inline-block;
    text-align: center;
    width: 100%;
    div {
        display: inline-block;
        margin: 0 auto;
    }
}
</style>
