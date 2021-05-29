<template>
  <q-page class="flex flex-center">
    <div class="photographs">
      <template v-if="images.length">
        <transition-group name="polaroid-pictures" mode="in-out">
          <photograph v-for="image in displayedImages" :key="`image_${image.id}`" v-bind="image" @click="goToImage(image.id)" />
          <photograph v-if="displayedImages.length < 3" key="image_last" type="last" @click="goToAllImages" />
        </transition-group>
      </template>
    </div>
    <button @click="prevImage" id="prev-button">
      &lt;
    </button>
    <button @click="nextImage" id="next-button">
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
    let images = ref([]);
    let currentIndex = ref(0);
    const router = useRouter();
    async function refresh() {
      const { data: { data } } = await api.get('/all/latest');
      images.value = data;
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

    refresh();

    return {
      images,
      displayedImages,
      refresh,
      nextImage,
      prevImage,
      goToImage,
      goToAllImages,
    }
  }
})
</script>

<style lang="scss">
.photographs {
  width: 550px;
  height: 700px;
  position: relative;
  perspective: 1000px;

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
  }
}

#prev-button {
  position: absolute;
  left: 80px;
  font-size: 6rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform .2s;

  &:hover {
    transform: scale(1.5);
  }
}
#next-button {
  position: absolute;
  right: 80px;
  font-size: 6rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform .2s;

  &:hover {
    transform: scale(1.5);
  }
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
