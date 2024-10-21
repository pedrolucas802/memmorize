<template>
  <div id="app">
    <NavBar></NavBar>
    <div class="content-wrapper">
      <LoginForm></LoginForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from "@/components/LoginForm.vue";
import NavBar from "@/components/NavBar.vue";

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    LoginForm
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.content-wrapper {
  margin: 100px;
  padding: 25px;
}
</style>
