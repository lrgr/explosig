<template>
    <div class="login-form">
        <div>
            <h1>ExploSig</h1>
            <div v-if="message">
                {{ message }}
            </div>
            <input type="password" v-model="password" @keypress.enter="tryLogin" />
            <br>
            <VButton :btnSecondary="true" @click="tryLogin">Log In</VButton>
        </div>
    </div>
</template>

<script>
import VButton from './VButton.vue';
import API from './../api.js';

export default {
  name: 'Login',
  components: {
      VButton
  },
  data() {
      return {
          message: undefined,
          password: ''
      };
  },
  methods: {
      tryLogin() {
          API.login(this.password)
            .then((response) => {
                window.localStorage.setItem('EXPLOSIG_API_TOKEN', response['token']);
                this.$emit('login', this.password);
            })
            .catch(() => {
                this.message = "Authentication failed. Please try again.";
            });
      }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.login-form {
    width: 100%;
    text-align: center;
    div {
        input {
            padding: 12px 20px;
            border: 2px solid $color-gray;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 16px;
        }
        .btn {
            margin-top: 0.5rem;
            display: inline-block;
        }
    }
}
</style>
