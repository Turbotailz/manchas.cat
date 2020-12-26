<template>
  <div id="app">
    <img src="@/assets/manchas001.jpg" alt="Manchas">
    <div class="intro">
      <p>Hello, my name is</p>
      <h1>Manchas :3</h1>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
html, body {
  height: 100%;
}

body {
  margin: 0;
  display: flex;
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
  background: #000;
}

#app {
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
}

#app > img {
  position: absolute;
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.intro {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 50%;
  padding: 8rem;
  font-size: 2rem;
}

h1, p {
  margin: 0;
}
</style>
