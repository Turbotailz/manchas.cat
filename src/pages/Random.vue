<template>
  <q-page class="flex flex-center">
    <div class="photograph">
      <transition-group name="random-image">
        <photograph v-if="image" :key="`image_${image.id}`" v-bind="image" @click="goToImage" />
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
      </transition-group>
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
    const router = useRouter();

    let loading = ref(true);
    let loadingError = ref(false);
    let image = ref('');

    async function refresh() {
      loading.value = true;
      loadingError.value = false;
      try {
        const { data } = await api.get('/');
        image.value = data;
      } catch {
        loadingError.value = true;
      } finally {
        loading.value = false;
      }
    }
    function goToImage() {
      router.push({ name: 'image', params: { image: image.value.id }});
    }

    refresh();

    return {
      loading,
      loadingError,
      image,
      refresh,
      goToImage,
    }
  }
})
</script>

<style lang="scss">
.photograph {
  width: 300px;
  max-width: 90%;
  height: 400px;
  position: relative;

  @media (min-width: $breakpoint-sm-min) {
    width: 550px;
    height: 700px;
  }

  .polaroid {
    position: absolute;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }

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

#random {
  position: absolute;
  bottom: 8%;
  font-size: 2rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform .2s;

  @media (min-width: $breakpoint-lg-min) {
    bottom: unset;
    right: 10%;
  }

  &:hover {
    transform: scale(1.1);
  }
}

.random-image {
  &-enter-from {
    opacity: 0;
    transform: scale(1.1) translateX(-50%);
  }
  &-leave-to {
    opacity: 0;
    transform: scale(0.9) translateX(50%);
  }
}
</style>
