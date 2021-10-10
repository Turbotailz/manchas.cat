<template>
  <q-page class="flex flex-center">
    <div class="photographs" v-touch-swipe="handleSwipe">
      <template v-if="images.length">
        <transition-group name="polaroid-pictures">
          <photograph v-for="image in displayedImages" :key="`image_${image.id}`" v-bind="image" @click="goToImage(image.id)" />
          <photograph v-if="displayedImages.length < 3" key="image_last" @click="goToAllImages">
            <div class="text-image">
              <p>See all images...</p>
            </div>
          </photograph>
        </transition-group>
      </template>
      <template v-else>
          <photograph v-if="loading" key="image_loading">
            <div class="text-image">
              <q-spinner color="white" size="64" />
              <p class="q-mt-lg">Fetching images...</p>
            </div>
          </photograph>
          <photograph v-else-if="loadingError" key="image_error" @click="refresh">
            <div class="text-image error">
              <p class="q-mb-lg">Oh noes :( </p>
              <p class="q-mb-lg">Couldn't fetch images</p>
              <p>Try again</p>
            </div>
          </photograph>
      </template>
    </div>
    <button v-if="images.length > 3" @click="prevImage" id="prev-button" class="home-buttons">
      &lt;
    </button>
    <button v-if="images.length > 3" @click="nextImage" id="next-button" class="home-buttons">
      &gt;
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
    let loading = ref(true);
    let loadingError = ref(false);
    let images = ref([]);
    let currentIndex = ref(0);
    const router = useRouter();
    async function refresh() {
      loading.value = true;
      loadingError.value = false;
      try {
        const { data: { data } } = await api.get('/all/latest');
        images.value = data;
      } catch {
        loadingError.value = true;
      } finally {
        loading.value = false;
      }
    }
    const displayedImages = computed(() => {
      const { value } = images;
      const index = currentIndex.value;

      return value.slice(index, index + 3);
    });
    function prevImage() {
      const { length } = images.value;
      const index = currentIndex;
      index.value = index.value === 0 ? length : index.value - 1;
    }
    function nextImage() {
      const { length } = images.value;
      const index = currentIndex;
      index.value = index.value >= length ? 0 : index.value + 1;
    }
    function goToImage(id) {
      router.push({ name: 'image', params: { id }});
    }
    function goToAllImages() {
      router.push({ name: 'all-images'});
    }
    function handleSwipe(event) {
      const { direction } = event;
      switch (direction) {
        case 'left':
          prevImage();
          return;
        case 'right':
          nextImage();
          return;
        default:
          return;
      }
    }

    refresh();

    return {
      loading,
      loadingError,
      images,
      displayedImages,
      refresh,
      nextImage,
      prevImage,
      goToImage,
      goToAllImages,
      handleSwipe,
    }
  }
})
</script>

<style lang="scss">
.photographs {
  width: 250px;
  max-width: 80%;
  height: 350px;
  position: relative;
  perspective: 1000px;

  @media (min-width: $breakpoint-sm-min) {
    width: 550px;
    height: 700px;
  }

  .polaroid {
    position: absolute;
    transition: all 0.2s ease;
    transform-style: preserve-3d;

    &:nth-child(1) {
      filter: brightness(1);
      transform: rotateX(0) rotateZ(0);
      z-index: 30;

      &:hover {
        transform: rotateX(0) rotateZ(0) scale(1.05);
        cursor: pointer;
      }
    }

    &:nth-child(2) {
      filter: brightness(.5);
      transform: rotateX(5deg) rotateZ(-15deg) translate(-60px, -20px);
      z-index: 20;
    }

    &:nth-child(3) {
      filter: brightness(.25);
      transform: rotateX(5deg) rotateZ(-30deg) translate(-120px, -40px);
      z-index: 10;
    }

    &:nth-child(4) {
      transform: rotateX(5deg) rotateZ(-30deg) translate(-120px, -40px);
      z-index: 5;
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
        font-size: 1.5rem;

        @media (min-width: $breakpoint-sm-min) {
          font-size: 4rem;
        }
      }
    }
  }
}

.home-buttons {
  position: absolute;
  font-size: 3rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform .2s;
  bottom: 5%;
  font-family: 'Permanent Marker', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  &:hover {
    transform: scale(1.5);
  }

  @media (min-width: $breakpoint-sm-min) {
    bottom: 50%;
    font-size: 6rem;
  }
}

#prev-button {
  left: 80px;
}
#next-button {
  right: 80px;
}

.polaroid-pictures {
  &-enter-from {
    filter: brightness(0);
    transform: rotate(-30deg) rotateZ(-15deg) translate(-180px, -60px);
  }

  &-enter-to {
    filter: brightness(.25);
    transform: rotateX(5deg) rotateZ(-30deg) translate(-120px, -40px);
  }

  &-move {
    opacity: 1;
  }

  &-leave-from {
    opacity: 1;
    transform: rotateX(0) rotateZ(0);
    z-index: 30;
  }

  &-leave-to {
    opacity: 0;
    transform: rotateX(-5deg) rotateZ(15deg) translate(60px, 20px);
    z-index: 40;
  }
}
</style>
