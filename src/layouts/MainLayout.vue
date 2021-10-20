<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark">
      <q-tabs align="center">
        <q-route-tab label="Latest" to="/" exact />
        <q-route-tab label="All" to="/images" exact />
        <q-route-tab label="Random" to="/random" exact />

        <q-separator vertical dark inset spaced="xl" />

        <q-route-tab label="API" to="/api" exact />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const $q = useQuasar();
    $q.dark.set('auto');
  }
})
</script>
