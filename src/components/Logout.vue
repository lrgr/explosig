<template>
    <div class="logout-wrapper">
        <VButton :btnSecondary="true" @click="tryLogout">Log Out</VButton>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

import VButton from './VButton.vue';
import API from './../api.js';

export default {
  name: 'Logout',
  components: {
      VButton
  },
  methods: {
      tryLogout() {
          API.logout()
            .then((response) => {
                this.logout();
            })
            .catch(() => {
                console.log('Logout failed.');
                // But still perform the logout anyway
                this.logout();
            });
      },
      logout() {
            window.localStorage.removeItem('EXPLOSIG_API_TOKEN');
            this.setIsProtected(false);
            // Perform refresh
            window.location.href = "/";
      },
      ...mapMutations([
          'setIsProtected'
      ])
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';


</style>
