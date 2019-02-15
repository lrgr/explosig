<template>
  <div id="auth">
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
import { mapMutations } from 'vuex';
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

                if(currToken !== undefined && currToken !== null && currToken.length > 0) {
                  // Set isProtected to know to show a log out button
                  this.setIsProtected(true);
                } else {
                  // No need for log out button, so set to false
                  this.setIsProtected(false);
                }
            })
            .catch(() => {
                this.loading = false;
                this.authenticated = false;
            });
    },
    getToken() {
      return window.localStorage.getItem('EXPLOSIG_API_TOKEN');
    },
    ...mapMutations([
      'setIsProtected'
    ])
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
#auth {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-darkgray;
  margin: 0px;
  overflow-x: hidden;
}

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
