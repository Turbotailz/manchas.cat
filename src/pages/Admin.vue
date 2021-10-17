<template>
  <q-page id="admin" class="container" padding>
    <div class="row q-gutter-x-lg">
      <div class="col">
        <q-table
          title="Images"
          :rows="images"
          row-key="id"
          v-model:pagination="imagesPagination"
          :loading="imagesLoading"
          @request="getImages"
          dark
          :rows-per-page-options="[10]"
          :columns="imageColumns"
        >
          <template #body="props">
            <q-tr :props="props" :key="props.row.id">
              <q-td key="image" :props="props">
                <q-img :src="props.row.source_small" :ratio="1" width="100px" />
              </q-td>
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="sources" :props="props">
                <div>
                  <q-chip color="white" text-color="black" size="sm" class="text-weight-bold">Small</q-chip>
                  <a :href="props.row.source_small" target="_blank">{{ props.row.source_small }}</a>
                </div>
                <div>
                  <q-chip color="white" text-color="black" size="sm" class="text-weight-bold">Medium</q-chip>
                  <a :href="props.row.source_medium" target="_blank">{{ props.row.source_medium }}</a>
                </div>
                <div>
                  <q-chip color="white" text-color="black" size="sm" class="text-weight-bold">Large</q-chip>
                  <a :href="props.row.source_large" target="_blank">{{ props.row.source_large }}</a>
                </div>
              </q-td>
              <q-td key="taken_at" :props="props">
                {{ parseDate(props.row.taken_at) }}
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn icon="delete" dense @click="deleteImage(props.row.id)" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-4">
        <q-uploader
          class="full-width full-height"
          :url="uploadUrl"
          label="Upload images"
          multiple
          accept=".jpg, image/*"
          @rejected="onRejected"
          @uploaded="onUploaded"
          @failed="onFailed"
          color="black"
          dark
          :max-file-size="104857600"
          with-credentials
          field-name="file"
        />
        {{ uploadUrl }}
      </div>
    </div>
  </q-page>
</template>

<script>
import api from '../util/api';
import parseDate from '../util/parse-date';

const imageColumns = () => [
  {
    name: 'image',
    label: 'Image',
    align: 'left',
  },
  {
    name: 'id',
    label: 'ID',
    align: 'left',
  },
  {
    name: 'sources',
    label: 'Sources',
    align: 'left',
  },
  {
    name: 'taken_at',
    label: 'Date taken',
    align: 'left',
  },
  {
    name: 'delete',
    label: 'Delete',
    align: 'right',
  },
];

export default {
  name: 'Admin',
  data() {
    return {
      images: [],
      imagesPagination: null,
      imagesLoading: null,
      files: [],
    }
  },
  methods: {
    async getImages({ pagination: { page = 1 }}) {
      try {
        this.imagesLoading = true;
        const { data: { data, pagination } } = await api.get('/all', { params: { page }});
        this.images = data;
        this.imagesPagination = {
          page: pagination.currentPage,
          rowsPerPage: pagination.perPage,
          rowsNumber: pagination.total,
        };
      } catch {
        this.images = [];
        this.imagesPagination = null;
      } finally {
        this.imagesLoading = false;
      }
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      });
    },
    onUploaded(info) {
      console.log(info)
      this.$q.notify({
        type: 'positive',
        message: `${info.files.length} images were uploaded successfully`
      });
    },
    onFailed(info) {
      this.$q.notify({
        type: 'negative',
        message: `${info.files.length} images could not be uploaded`
      });
    },
    parseDate,
    async deleteImage(id) {
      try {
        await api.delete(`/${id}`);
        this.$q.notify({
          type: 'positive',
          message: `Image ID ${id} was deleted`
        });
        this.getImages({ pagination: { page: this.imagesPagination.page }});
      } catch {
        this.$q.notify({
          type: 'negative',
          message: `Image ID ${id} could not be deleted`
        });
      }
    },
  },
  created() {
    this.getImages({ pagination: { page: 1 }});
  },
  computed: {
    imageColumns,
    uploadUrl() {
      return process.env.API_URL + '/upload';
    }
  }
}
</script>

<style lang="scss">
.q-uploader {
  max-height: 90%;
}
.q-uploader__list {
  display: flex;
  flex-wrap: wrap;
}

.q-uploader__file + .q-uploader__file {
  margin: 0;
}

a {
  color: $primary;
}
</style>
