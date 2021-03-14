<template>
  <div id="login" class="container">
    <div class="login-form">
      <h2>Login</h2>
      <label for="email">Email</label>
      <input id="email" type="text" v-model="email">
      <label for="password">Password</label>
      <input id="password" type="password" v-model="password">
      <button @click="doLogin">Login</button>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http';

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
        await http.post('/auth', { email, password });
        await this.$router.push('/admin');
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style lang="scss">
#login {
  height: 100%;
  margin-top: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    background: rgba(0,0,0,0.1);
    border-radius: 4px;
    padding: 2rem;
    width: 100%;
    max-width: 24rem;
    display: flex;
    flex-direction: column;
  }
}
</style>