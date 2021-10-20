<template>
  <article class="api-reference">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <code>
      <span class="method">{{ method }}</span>
      <span class="base">{{ base }}</span>
      <span class="path">{{ parsedPath }}</span>
      <span class="query" v-if="queryString">{{ queryString }}</span>
    </code>
    <div class="row q-mb-md q-col-gutter-md" v-if="routeParams.length">
      <div class="col-6" v-for="param in routeParams" :key="`${path}?${param.key}`">
        <q-input
          v-model="userParams[param.key]"
          :label="param.key"
          color="green"
          :ref="`${path}?${param.key}`"
        />
      </div>
    </div>
    <div class="row q-mb-md q-col-gutter-md" v-if="params.length">
      <div class="col-6" v-for="param in params" :key="`${path}?${param.key}`">
        <q-input
          v-if="param.type === 'number'"
          v-model="userParams[param.key]"
          type="number"
          :label="param.key"
          color="green"
          :rules="[ param.validate || 'Page number must be between 1 and 9999' ]"
          :ref="`${path}?${param.key}`"
        />
        <q-select
          v-if="param.type === 'select'"
          v-model="userParams[param.key]"
          :options="param.options"
          :label="param.key"
          color="green"
          :ref="`${path}?${param.key}`"
        />
      </div>
    </div>
    <div class="pre-container">
      <header class="flex justify-between">
        <span>Response:</span>
        <q-btn size="sm" @click="getResponse" outline color="green">Try again</q-btn>
      </header>
      <pre>{{ response }}</pre>
    </div>
  </article>
</template>

<script>
import api from '../util/api';

export default {
  name: 'ApiReference',

  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    method: {
      type: String,
      validate: (value) => ['GET', 'POST', 'PUT'].includes(value),
      default: 'GET',
    },
    base: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    params: {
      type: Array,
      default: () => [],
    },
    routeParams: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    const userParams = {};

    for (const param of this.params) {
      userParams[param.key] = param.default;
    }
    for (const param of this.routeParams) {
      userParams[param.key] = param.default;
    }

    return {
      response: '',
      userParams
    }
  },

  computed: {
    queryString() {
      if (!this.params.length) return '';

      let query = '?';

      for (const param of this.params) {
        query += `${param.key}=${this.userParams[param.key]}&`
      }

      query = query.slice(0, -1);

      return query;
    },
    parsedPath() {
      let path = this.path;

      for (const routeParam of this.routeParams) {
        path = this.path.replace(`:${routeParam.key}`, this.userParams[routeParam.key]);
      }

      return path;
    },
    requestUrl() {
      const { base, parsedPath, queryString } = this;
      return base + parsedPath + queryString;
    },
  },

  methods: {
    async getResponse() {
      try {
        const params = [ ...this.params, ...this.routeParams ];
        const response = await Promise.all(params.map(param => this.$refs[`${this.path}?${param.key}`].validate()));
        if (!response.every(Boolean)) return;
        const {data} = await api.get(this.requestUrl);
        this.response = data;
      } catch (error) {
        this.response = error.message;
      }
    }
  },

  async mounted() {
    await this.getResponse();

    // little hacky boi to use a random image for the "specific image" API doc
    if (this.userParams.id === '') {
      this.userParams.id = this.response.id;
    }
  }
}
</script>

<style lang="scss" scoped>
.api-reference {
  border: 1px solid dimgrey;
  border-radius: 4px;
  padding: 0 1rem;
  width: 100%;
  margin: 2rem 0;
  font-family: monospace;

  h2 {
    font-family: $typography-font-family;
    font-size: 1.5rem;
    line-height: 1;
    margin: 1rem 0;
  }

  p {
    width: 100%;
    opacity: .8;
  }

  code {
    width: 100%;
    display: block;
    padding: .5rem 1rem;
    border: 1px solid darkgreen;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: .75rem;

    .method {
      margin-right: .5rem;
      color: green;
    }

    .base {
      opacity: .75;
    }

    .path {
      color: green;
    }

    .query {
      color: green;
      opacity: .5;
    }
  }

  .pre-container {
    width: 100%;
    padding: .5rem 1rem;
    border: 1px solid black;
    border-radius: 4px;
    font-size: .75rem;
    font-family: monospace;
    margin-bottom: 1rem;
  }

  pre {
    display: block;
    width: 100%;
    max-height: 250px;
    max-width: 100%;
    overflow: auto;
  }
}

.body--dark {
  .pre-container {
    background: black;
    color: rgba(255, 255, 255, .66);
    border: 1px solid rgba(255, 255, 255, .5);
  }
}
</style>
