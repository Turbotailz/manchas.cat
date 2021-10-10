<template>
  <q-page>
    <q-infinite-scroll @load="onLoad">
      <div class="images row q-col-gutter-md q-col-gutter-md-xl">
        <template v-for="image in images" :key="`image_${image.id}`">
          <div v-if="image.source_medium" class="col-xs-6 col-md-3">
            <photograph v-bind="image" @click="goToImage(image.id)" />
          </div>
        </template>
      </div>
      <template #loading>
        <q-spinner-dots />
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script>
import Photograph from 'components/Photograph';
import { defineComponent, ref, computed } from 'vue';
import api from '../util/api';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Images',
  components: {
    Photograph,
  },
  setup() {
    let loadingError = ref(false);
    let images = ref([]);
    const router = useRouter();
    let lastPage;

    function goToImage(id) {
      router.push({ name: 'image', params: { id }});
    }

    async function onLoad(index, done) {
      loadingError.value = false;
      try {
        const { data: { data, pagination } } = await api.get('/all/latest', { params: { page: index }});
        if (pagination.lastPage) {
          lastPage = pagination.lastPage;
        }
        images.value = images.value.concat(data);
        done(index === lastPage);
      } catch {
        loadingError.value = true;

      }
    }

    return {
      loadingError,
      images,
      onLoad,
      goToImage,
    }
  }
})
</script>

<style lang="scss">
.images {
  padding: 1rem;

  @media (min-width: $breakpoint-sm-min) {
    padding: 4rem;
  }

  .polaroid {
    padding: .5rem;
    transition: all .2s;
    cursor: pointer;

    @media (min-width: $breakpoint-sm-min) {
      padding: 1rem;
    }

    &:hover {
      transform: scale(1.1);
    }

    h2 {
      font-size: 1.25rem;
      margin: 0;
      line-height: 1.5;

      @media (min-width: $breakpoint-sm-min) {
        font-size: 2rem;
      }
    }

    p {
      font-size: .8rem;

      @media (min-width: $breakpoint-sm-min) {
        font-size: 1rem;
      }
    }
  }
}
</style>
