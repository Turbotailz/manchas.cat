<template>
  <div id="home">
    <div class="image">
      <transition name="fade">
        <img v-if="image" :src="image.source" alt="Manchas">
      </transition>
    </div>
    <div class="intro">
      <p>Hello, my name is</p>
      <h1>Manchas</h1>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http';

export default {
  name: 'Home',
  data() {
    return {
      image: null,
    }
  },
  methods: {
    async getImage() {
      const { data } = await http.get('/');
      this.image = data;
    },
  },
  created() {
    this.getImage();
  }
}
</script>

<style lang="scss">
#home {
  min-height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  align-items: flex-end;
  justify-content: center;

  > .image {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;

    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }

  .intro {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 8rem;
    font-size: 2rem;
    align-items: center;
  }

  h1, p {
    margin: 0;
    line-height: 1.4;
  }
}
</style>