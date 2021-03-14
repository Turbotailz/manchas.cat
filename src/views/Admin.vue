<template>
  <div id="admin" class="container">
    <h1>Admin</h1>
    <div class="sections">
      <section class="images">
        <h2>
          Images
          <span v-if="imagesPagination">({{imagesPagination.total}} total)</span>
        </h2>
        <ul>
          <li v-for="image in images" :key="image.id">
            <img :src="image.source" :alt="image.caption">
            <div class="image-data">
              <div>
                <span class="label">ID</span>
                <span>{{ image.id }}</span>
              </div>
              <div>
                <span class="label">Caption</span>
                <span>{{ image.caption || 'none' }}</span>
              </div>
              <div>
                <span class="label">Taken at</span>
                <span>{{ image.taken_at || 'none' }}</span>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <section class="upload" @drop.prevent="handleFileDrop" @dragover.prevent>
        <h2>Upload images</h2>
        <ul>
          <li v-for="file in files" :key="file.name">
            {{ file.name }} - {{ file.size }} b
          </li>
        </ul>
        <label for="uploadFile">Add images</label>
        <input type="file" id="uploadFile" multiple="true" @change="handleFileInput">
        <button :disabled="!canUpload" @click="doUpload">Upload</button>
      </section>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http';

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
      const { data: { data, pagination } } = await http.get('/all', { params: { page }});
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
      ([...files]).forEach(file => {
        console.dir(file);
        this.files.push({ ...file, progress: null, success: null });
      });
    },
    removeFile(file) {
      this.files = this.files.filter(f => f !== file);
    },
    async doUpload() {
      const promises = this.files.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          await http.post('/upload', formData, {
            onUploadProgress: progressEvent => console.log(progressEvent)
          });
          file.success = true;
        } catch (error) {
          file.success = false;
          console.error(error);
        }
      });
    }
  },
  created() {
    this.getImages();
  }
}
</script>

<style lang="scss">
#admin {
  margin-top: 6rem;

  .sections {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: flex-start;
  }

  section {
    background: rgba(0,0,0,.1);
    padding: 2rem;
    width: calc(50% - 2rem);
  }

  .images {
    ul {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        display: flex;
        background: white;
        border: 1px solid rgba(0,0,0,.2);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: .5rem;

        img {
          width: 6rem;
          height: 6rem;
          object-fit: cover;
          margin-right: .5rem;
        }

        .image-data {
          display: flex;
          flex: 1 0 auto;
          flex-wrap: wrap;
          font-size: .9rem;

          > div {
            width: 50%;
            display: flex;
            flex-direction: column;
            padding-top: .5rem;

            .label {
              line-height: 1;
              font-size: .8rem;
              opacity: .6;
            }
          }
        }
      }
    }
  }

  .upload {
    label {
      display: block;
      text-align: center;
      padding: .25rem;
      background: lawngreen;

      &:hover {
        background: greenyellow;
        cursor: pointer;
      }
    }

    input {
      display: none;
    }

    button {
      width: 100%;
    }
  }
}
</style>