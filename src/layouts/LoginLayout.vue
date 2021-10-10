<template>
  <q-layout view="lhr lpR lfr" class="bg-grey-9 text-white">

    <q-page-container>
      <q-page padding class="fit row wrap justify-center items-center">
        <q-card class="bg-black text-white" style="width: 320px">
          <q-card-section>
            Login
          </q-card-section>

          <q-separator dark />

          <q-card-section class="q-gutter-y-md">
            <q-input dark outlined label="email" v-model="email" />
            <q-input dark outlined label="password" type="password" v-model="password" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn @click="doLogin" flat>Login</q-btn>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import api from '../util/api';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async doLogin() {
      try {
        const { email, password } = this;
        await api.post('/auth', { email, password });
        await this.$router.push('/admin');
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Could not login',
        });
        console.error(error);
      }
    }
  }
}
</script>
