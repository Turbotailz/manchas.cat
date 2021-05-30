<template>
  <figure class="polaroid">
    <picture v-if="source">
      <q-img :src="source" :ratio="1" fit="cover" alt="Manchas" spinner-color="white" />
    </picture>
    <slot v-else />
    <figcaption class="text-black">
      <h2 class="text-weight-bold">Manchas</h2>
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 64px rgba(0,0,0,.75);

  @media (min-width: $breakpoint-sm-min) {
    padding: 1.5rem;
  }

  .q-img__content, .q-img__loading {
    transition: none;
    box-shadow: inset 0 0 128px black, inset 0 0 8px rgba(0,0,0,.5);
  }

  picture {
    background: black;
    pointer-events: none;
  }

  figcaption {
    h2 {
      font-size: 2.5rem;
      margin: .5rem 0 0;
    }

    p {
      font-size: 1.25rem;
    }
  }
}
</style>
