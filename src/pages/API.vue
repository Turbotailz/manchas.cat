<template>
  <q-page class="api-docs column items-start justify-start">
    <h1>API reference</h1>
    <p>
      So you want to steal my cat and use his photos on the internet? I don't blame you, he's bloody cute. Here's an open API for you to use in your projects.
    </p>
    <api-reference
      title="Get a random image"
      description="Returns a random image from the database"
      :base="baseUrl"
      path="/"
    />
    <api-reference
      title="Get the latest image"
      description="Returns the latest image based on the 'taken_at' field"
      :base="baseUrl"
      path="/latest"
    />
    <api-reference
      title="Get all images"
      description="Returns a paginated set of all images, accepts the parameters 'page' and 'sort'"
      :base="baseUrl"
      path="/all"
      :params="[ params.PAGE, params.SORT ]"
    />
    <api-reference
      title="Get a specific image"
      description="If you have a valid image ID, you can use it to fetch the image data"
      :base="baseUrl"
      path="/:id"
      :route-params="[ routeParams.IMAGE_ID ]"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ApiReference from 'components/ApiReference';

export default defineComponent({
  components: {
    ApiReference,
  },
  name: 'API',
  setup() {
    const apiUrl = process.env.API_URL;
    const baseUrl = ref(apiUrl);
    const params = ref({
      PAGE: {
        key: 'page',
        type: 'number',
        default: 1,
        validate: (value) => {
          const num = Number(value);
          if (!num) return false;
          return num > 0 && num <= 9999;
        }
      },
      SORT: {
        key: 'sort',
        type: 'select',
        default: 'desc',
        options: ['desc', 'asc',],
      },
    });
    const routeParams = ref({
      IMAGE_ID: {
        key: 'id',
        default: '',
      }
    });

    return {
      baseUrl,
      params,
      routeParams,
    }
  }
})
</script>

<style lang="scss">
.api-docs {
  padding: 2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;

  h1 {
    font-size: 2.5rem;
    line-height: 1;
    margin: 0 0 2rem;
    width: 100%;
    text-align: center;
  }

  hr {
    width: 100%;
    border-color: dimgrey;
    opacity: .5;
    margin: 1rem 0;
  }
}
</style>
