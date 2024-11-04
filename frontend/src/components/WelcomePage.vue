<template>
  <div class="welcome-container">
    <h2 class="welcome-title">Você já tem uma conta?</h2>
    <div class="button-group">
      <button @click="goToLogin" class="welcome-button">Sim</button>
      <button @click="goToRegister" class="welcome-button success">Não</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    const goToLogin = () => {
      router.push({ name: 'Login' });
    };

    const goToRegister = () => {
      router.push({ name: 'RegisterPage' });
    };

    return {
      goToLogin,
      goToRegister,
    };
  },
});
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 50px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #43636E;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  gap: 20px;
}

.welcome-button {
  padding: 12px 24px;
  background-color: #43636E;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.welcome-button.success {
  background-color: #42b983;
}

.welcome-button:hover {
  /* background-color: #36a373; */
  transform: scale(1.05);
}
</style>
