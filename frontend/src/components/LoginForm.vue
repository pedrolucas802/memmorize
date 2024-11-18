<template>
  <div class="login-page">
    <h2 class="main-title">Faça login na sua conta</h2>

    <!-- Mensagem de Sucesso -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Mensagem de Erro (não será exibida enquanto o backend não estiver integrado) -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form v-if="!successMessage" @submit.prevent="onSubmit" class="login-form">
      <!-- Nome do usuário -->
      <div class="input-group">
        <label for="username" class="input-label">Nome do usuário</label>
        <div class="input-wrapper">
          <span class="input-icon"><i class="pi pi-user"></i></span>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Digite o seu e-mail"
            class="custom-input"
            required
          />
        </div>
      </div>

      <!-- Senha -->
      <div class="input-group">
        <label for="password" class="input-label">Senha</label>
        <div class="input-wrapper">
          <span class="input-icon"><i class="pi pi-lock"></i></span>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Digite sua senha"
            class="custom-input"
            required
          />
        </div>
      </div>

      <!-- Botão de Login -->
      <div class="button-container">
        <button type="submit" class="login-button">Entrar</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');

    const checkJWT = () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        router.push({ name: 'UserHome' });
      }
    };

    const onSubmit = async () => {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/auth/login`, {
          email: username.value,
          password: password.value,
        });

        localStorage.setItem('jwtToken', response.data.token);

        successMessage.value = 'Login realizado com sucesso! Redirecionando para a página inicial...';
        errorMessage.value = '';
        username.value = '';
        password.value = '';

        setTimeout(() => {
          router.push({ name: 'UserHome' });
        }, 3000);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          errorMessage.value = error.response.data.error || 'Email ou senha incorretos.';
        } else {
          errorMessage.value = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
        }
        successMessage.value = '';
      }
    };

    onMounted(() => {
      checkJWT();
    });

    return {
      username,
      password,
      successMessage,
      errorMessage,
      onSubmit,
    };
  },
});
</script>


<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Baloo 2', sans-serif;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #43636E;
  margin-bottom: 20px;
}

.login-form {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Estilo do grupo de input */
.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 16px;
  font-weight: bold;
  color: #43636E;
  margin-bottom: 5px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #43636E;
  border-radius: 8px;
  padding: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-icon {
  margin-right: 10px;
  color: #43636E;
}

.custom-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #43636E;
}

.custom-input::placeholder {
  color: #a0a0a0;
}

/* Mensagem de sucesso */
.success-message {
  background-color: #42b983;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

/* Mensagem de erro */
.error-message {
  background-color: #d9534f;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

/* Estilo do botão de login */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.login-button {
  background-color: #43636E;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.login-button:hover {
  background-color: #365555;
  transform: scale(1.05);
}
</style>
