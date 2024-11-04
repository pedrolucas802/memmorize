<template>
  <div class="register-page">
    <h2 class="main-title">Crie sua conta</h2>

    <!-- Mensagem de Sucesso -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Mensagem de Erro (não será exibida enquanto o backend não estiver integrado) -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form v-if="!successMessage" @submit.prevent="onSubmit" class="register-form">
      <!-- Nome -->
      <div class="input-group">
        <label for="name" class="input-label">Nome</label>
        <div class="input-wrapper">
          <span class="input-icon"><i class="pi pi-user"></i></span>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Digite seu nome"
            class="custom-input"
            required
          />
        </div>
      </div>

      <!-- Email -->
      <div class="input-group">
        <label for="email" class="input-label">Email</label>
        <div class="input-wrapper">
          <span class="input-icon"><i class="pi pi-envelope"></i></span>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Digite seu email"
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

      <!-- Botão Registrar -->
      <div class="button-container">
        <button type="submit" class="register-button">Registrar</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
// import axios from 'axios'; // Comentado para não utilizar axios enquanto o backend não estiver disponível

export default defineComponent({
  setup() {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const successMessage = ref('');
    const errorMessage = ref(''); // Mensagem de erro deixada como vazia, pois não será utilizada agora

    const onSubmit = () => {
      // Lógica comentada para integração com o backend:
      /*
      try {
        const response = await axios.post('/register', {
          name: name.value,
          email: email.value,
          password: password.value,
        });
        successMessage.value = 'Registro realizado com sucesso! Redirecionando para a página de login...';
        errorMessage.value = '';
        name.value = '';
        email.value = '';
        password.value = '';
        setTimeout(() => {
          router.push({ name: 'Login' });
        }, 3000);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            errorMessage.value = error.response.data.message || 'Erro ao registrar. Tente novamente.';
          } else {
            errorMessage.value = 'Erro ao registrar. Tente novamente.';
          }
        } else {
          errorMessage.value = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
        }
        successMessage.value = '';
      }
      */

      // Lógica original que simula o registro
      successMessage.value = 'Registro realizado com sucesso! Redirecionando para a página de login...';
      name.value = '';
      email.value = '';
      password.value = '';
      
      // Redireciona para a página de login após 3 segundos
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 3000);
    };

    return {
      name,
      email,
      password,
      successMessage,
      errorMessage,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.register-page {
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

.register-form {
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

/* Estilo do botão de registrar */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.register-button {
  background-color: #42b983;
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

.register-button:hover {
  background-color: #36a373;
  transform: scale(1.05);
}
</style>
