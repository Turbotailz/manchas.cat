<template>
  <div id="app">
    <nav>
      <div class="container">
        <div id="logo">
          <router-link to="/">Manchas :3</router-link>
        </div>
        <div class="routes">
          <ul>
            <li><router-link to="/api">API</router-link></li>
            <li><router-link to="/discord">Discord</router-link></li>
            <li><router-link to="/admin">⚙</router-link></li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  min-height: 100%;
  margin: 0;
  display: flex;
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222;
  background: #FFF;
}

#app {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  > nav {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    display: flex;
    height: 4rem;
    background: rgba(0,0,0,.75);

    .container {
      display: flex;
      justify-content: space-between;
    }

    #logo {
      display: flex;
      font-size: 1.5rem;
      font-weight: bold;
    }

    a {
      display: flex;
      align-items: center;
    }

    .routes {
      display: flex;

      ul {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;

        li {
          display: flex;

          a {
            padding: 0 1rem;
          }
        }
      }
    }
  }
}

.container {
  width: 100%;
  padding: 0 1rem;
  max-width: 90rem;
  margin: 0 auto;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0 0 1rem;
  line-height: 1;
}

a {
  color: lawngreen;
  text-decoration: none;
  transition: all .2s;

  &:hover {
    color: greenyellow;
  }
}

label {
  margin-bottom: .5rem;
}

input {
  height: 2rem;
  padding: 0 .5rem;
  font: inherit;
  border: none;
  background: white;
  margin-bottom: 1rem;
}

button {
  height: 2rem;
  font: inherit;
  border: none;
  background: lawngreen;
  transition: all .2s;

  &:not([disabled]):hover {
    background: greenyellow;
    cursor: pointer;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
