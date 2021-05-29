<template>
  <q-page>
    <q-infinite-scroll @load="onLoad">

      <div class="images row q-col-gutter-xl q-pa-xl">
        <div class="col-xs-6 col-md-3" v-for="image in images" :key="`image_${image.id}`">
          <photograph v-bind="image" @click="goToImage(image.id)" />
        </div>
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
    let images = ref([]);
    const router = useRouter();
    let lastPage;

    function goToImage(id) {
      router.push({ name: 'Image', params: { id }});
    }

    async function onLoad(index, done) {
      const { data: { data, pagination } } = await api.get('/all/latest', { params: { page: index }});
      if (pagination.lastPage) {
        lastPage = pagination.lastPage;
      }
      images.value = images.value.concat(data);
      done(index === lastPage);
    }

    return {
      images,
      onLoad,
      goToImage,
    }
  }
})
</script>

<style lang="scss">
.images {
  .polaroid {
    padding: 1rem;
    transition: all .2s;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
    h2 {
      font-size: 2rem;
      margin: 0;
    }

    p {
      font-size: 1rem;
    }
  }
}
</style>
