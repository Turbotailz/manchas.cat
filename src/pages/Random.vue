<template>
  <q-page class="flex flex-center">
    <div class="photograph">
      <photograph v-bind="image" @click="goToImage" />
    </div>
    <button id="random" @click="refresh">
      <q-icon name="autorenew" />
      Randomise
    </button>
  </q-page>
</template>

<script>
import Photograph from 'components/Photograph';
import { defineComponent, ref, computed } from 'vue';
import api from '../util/api';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Home',
  components: {
    Photograph,
  },
  setup() {
    let image = ref('');
    const router = useRouter();
    async function refresh() {
      const { data } = await api.get('/');
      image.value = data;
    }
    function goToImage() {
      router.push({ name: 'image', params: { image: image.value.id }});
    }

    refresh();

    return {
      image,
      refresh,
      goToImage,
    }
  }
})
</script>

<style lang="scss">
.photograph {
  width: 550px;
  height: 700px;
  position: relative;

  .polaroid {
    position: absolute;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
  }
}

#random {
  position: absolute;
  right: 80px;
  font-size: 2rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform .2s;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
