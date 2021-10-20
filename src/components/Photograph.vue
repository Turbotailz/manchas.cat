<template>
  <figure class="polaroid">
    <picture v-if="source_medium">
      <q-img :src="source_medium" :placeholder-src="source_small" :ratio="1" fit="cover" :alt="`Manchas on ${date}`" spinner-color="white" no-transition />
    </picture>
    <slot v-else />
    <figcaption class="text-black">
      <h2 class="text-weight-bold">Manchas</h2>
      <p class="q-my-none">{{ date }}</p>
    </figcaption>
  </figure>
</template>

<script>
import parseDate from '../util/parse-date';

export default {
  name: 'Photograph',
  props: {
    type: {
      type: String,
      default: 'image',
    },
    source_medium: {
      type: String,
      default: '',
    },
    source_small: {
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
      return parseDate(this.taken_at);
    },
  }
}
</script>

<style lang="scss">
.polaroid {
  margin: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(180deg, #f5f2f1, #fdfcf5);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 64px rgba(0,0,0,.5);
  font-family: 'Permanent Marker', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  @media (min-width: $breakpoint-sm-min) {
    padding: 1.5rem;
  }

  .q-img__content, .q-img__loading {
    transition: none;
    box-shadow: inset 0 0 128px rgba(0,0,0,0.666), inset 0 0 8px rgba(0,0,0,.5);
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

.body--dark {
  .polaroid {
    background: linear-gradient(180deg, #bbaca4, #fdfcf5);
    box-shadow: 0 0 64px rgba(0, 0, 0, .75);
  }
}
</style>
