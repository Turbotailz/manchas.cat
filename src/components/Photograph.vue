<template>
  <figure class="polaroid">
    <picture v-if="type === 'image'">
      <q-img :src="source" :ratio="1" fit="cover" alt="Manchas" spinner-color="white"/>
    </picture>
    <div class="last-image" v-if="type === 'last'">
      <p>See all images...</p>
    </div>

    <figcaption class="text-black">
      <h2 class="text-weight-bold q-mt-lg q-mb-md">Manchas</h2>
      <p class="q-my-none">{{ date }}</p>
    </figcaption>
  </figure>
</template>

<script>
import { isValid, parseJSON } from 'date-fns';

export default {
  name: 'Photograph',
  props: {
    type: {
      type: String,
      default: 'image',
    },
    source: {
      type: String,
      default: '',
    },
    taken_at: {
      type: String,
      default: '',
    }
  },
  computed: {
    date() {
      const date = parseJSON(this.taken_at);
      if (isValid(date)) {
        const [ day, month, year ] = [ date.getDate(), date.getMonth(), date.getFullYear() ];
        return `${day}/${month}/${year}`;
      }

      return ' ';
    },
  }
}
</script>

<style lang="scss">
.polaroid {
  margin: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(180deg, #bbaca4, #fdfcf5);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 64px rgba(0,0,0,.75);

  .q-img__content, .q-img__loading {
    transition: none;
    box-shadow: inset 0 0 128px black, inset 0 0 8px rgba(0,0,0,.5);
  }

  picture {
    background: black;
  }

  figcaption {
    p {
      font-size: 1.5rem;
    }
  }

  .last-image {
    background: black;
    height: 550px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      font-size: 5rem;
      text-align: center;
      line-height: 1;
    }
  }
}
</style>
