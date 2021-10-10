<template>
  <q-page id="admin" class="container" padding>
    <div class="row">
      <div class="col"></div>
      <div class="col-4">
        <q-uploader
          class="full-width full-height"
          url="http://localhost:6969/upload"
          label="Upload images"
          multiple
          accept=".jpg, image/*"
          @rejected="onRejected"
          color="black"
          dark
          :max-file-size="104857600"
          with-credentials
          field-name="file"
        />
      </div>
    </div>

<!--      <section class="images">-->
<!--        <h2>-->
<!--          Images-->
<!--          <span v-if="imagesPagination">({{imagesPagination.total}} total)</span>-->
<!--        </h2>-->
<!--        <ul>-->
<!--          <li v-for="image in images" :key="image.id">-->
<!--            <img :src="image.source" :alt="image.caption">-->
<!--            <div class="image-data">-->
<!--              <div>-->
<!--                <span class="label">ID</span>-->
<!--                <span>{{ image.id }}</span>-->
<!--              </div>-->
<!--              <div>-->
<!--                <span class="label">Caption</span>-->
<!--                <span>{{ image.caption || 'none' }}</span>-->
<!--              </div>-->
<!--              <div>-->
<!--                <span class="label">Taken at</span>-->
<!--                <span>{{ image.taken_at || 'none' }}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </section>-->
<!--      <section class="upload" @drop.prevent="handleFileDrop" @dragover.prevent>-->
<!--        <h2>Upload images</h2>-->
<!--        <ul>-->
<!--          <li v-for="file in files" :key="file.name">-->
<!--            {{ file.file.name }} - {{ file.file.size }}b-->
<!--            <progress v-if="file.progress.total" :max="file.progress.total" :value="file.progress.loaded" />-->
<!--          </li>-->
<!--        </ul>-->
<!--        <label for="uploadFile">Add images</label>-->
<!--        <input type="file" id="uploadFile" multiple="true" @change="handleFileInput">-->
<!--        <button :disabled="!canUpload" @click="doUpload">Upload</button>-->
<!--      </section>-->
  </q-page>
</template>

<script>
import api from '../util/api';
import exifr from 'exifr';

export default {
  name: 'Admin',
  data() {
    return {
      images: null,
      imagesPagination: null,
      files: [],
    }
  },
  computed: {
    canUpload() {
      return this.files.length;
    }
  },
  methods: {
    async getImages(page = 1) {
      const { data: { data, pagination } } = await api.get('/all', { params: { page }});
      this.images = data;
      this.imagesPagination = pagination;
    },
    handleFileDrop(e) {
      this.addFiles(e.dataTransfer.files);
    },
    handleFileInput(e) {
      this.addFiles(e.target.files);
    },
    addFiles(files) {
      if (!files) return;
      ([...files]).forEach(async (fileItem) => {
        const taken_at = await exifr.parse(fileItem, ['DateTimeOriginal']);
        const file = {
          file: fileItem,
          progress: { total: null, loaded: null },
          success: null,
          taken_at
        }
        this.files.push(file);
      });
    },
    removeFile(file) {
      this.files = this.files.filter(f => f !== file);
    },
    async doUpload() {
      const promises = this.files.map(async (file) => {
        console.log(file);
        try {
          const formData = new FormData();
          formData.append('file', file.file);
          const result = await api.post('/upload', formData, {
            onUploadProgress: ({ total, loaded }) => {
              file.progress.total = total;
              file.progress.loaded = loaded;
            }
          });
          file.success = true;
          return result;
        } catch (error) {
          file.success = false;
          console.error(error);
        }
      });

      const results = await Promise.all(promises);
      console.log(results);

      await this.getImages();
    },
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }
  },
  created() {
    this.getImages();
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
</style>
