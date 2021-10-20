<template>
  <q-page class="flex flex-center">
    <div class="photograph">
      <photograph v-if="image" :key="`image_${image.id}`" v-bind="image" />
      <photograph v-if="loading" key="image_loading">
        <div class="text-image">
          <q-spinner color="white" size="64" />
          <p class="q-mt-lg">Fetching image...</p>
        </div>
      </photograph>
      <photograph v-else-if="loadingError" key="image_error" @click="refresh">
        <div class="text-image error">
          <p class="q-mb-lg">Oh noes :( </p>
          <p class="q-mb-lg">Couldn't fetch image</p>
          <p>Try again</p>
        </div>
      </photograph>
    </div>
  </q-page>
</template>

<script>
import Photograph from 'components/Photograph';
import { defineComponent, ref, computed } from 'vue';
import api from '../util/api';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Home',
  components: {
    Photograph,
  },
  setup() {
    const route = useRoute();

    let loading = ref(true);
    let loadingError = ref(false);
    let image = ref('');

    async function refresh() {
      const { params: { id } } = route;
      loading.value = true;
      loadingError.value = false;
      try {
        const { data } = await api.get(`/${id}`);
        image.value = data;
      } catch {
        loadingError.value = true;
      } finally {
        loading.value = false;
      }
    }

    refresh();

    return {
      loading,
      loadingError,
      image,
      refresh,
    }
  }
})
</script>

<style lang="scss">
.photograph {
  width: 300px;
  height: 400px;
  max-width: 90%;
  position: relative;

  @media (min-width: $breakpoint-xs-max) {
    width: 550px;
    height: 700px;
  }

  .polaroid {
    position: absolute;
    transition: all 0.2s ease;

    .text-image {
      background: black;
      height: 550px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      p {
        font-size: 2rem;
        text-align: center;
        line-height: 1;

        @media (min-width: $breakpoint-sm-min) {
          font-size: 5rem;
        }
      }

      &.error p {
        font-size: 2rem;

        @media (min-width: $breakpoint-sm-min) {
          font-size: 4rem;
        }
      }
    }
  }
}
</style>
