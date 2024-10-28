<template>
  <div class="container mx-auto p-4 sm:p-6 md:p-10">
    <div class="form-wrapper mx-auto w-full md:w-1/2">
      <div class="card shadow-md rounded-md">
        <Form @submit="onSubmit" :validation-schema="schema" class="login-form">
          <div class="grid grid-cols-1 gap-4">
            <!-- Username Field -->
            <Field name="username" v-slot="{ value, handleChange, errorMessage }">
              <InputGroup>
                <InputGroupAddon>
                  <i class="pi pi-user"></i>
                </InputGroupAddon>
                <FloatLabel>
                  <InputText
                    id="username"
                    v-model="username"
                    :model-value="value"
                    @input="handleChange"
                    class="w-full"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <label for="username">Nome do usuário(a)</label>
                </FloatLabel>
              </InputGroup>
              <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
            </Field>

            <!-- Password Field -->
            <Field name="password" v-slot="{ value, handleChange, errorMessage }">
              <InputGroup>
                <InputGroupAddon>
                  <i class="pi pi-lock"></i>
                </InputGroupAddon>
                <FloatLabel>
                  <InputText
                    id="password"
                    type="password"
                    v-model="password"
                    :model-value="value"
                    @input="handleChange"
                    class="w-full"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <label for="password">Senha</label>
                </FloatLabel>
              </InputGroup>
              <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
            </Field>

            <!-- Buttons -->
            <div class="w-full flex flex-row gap-4">
              <Button type="submit" label="Entrar" icon="pi pi-sign-in" class="w-full" />
              <Button label="Registrar" icon="pi pi-user-plus" class="w-full" severity="success" />
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router'; // Importar o roteador para redirecionar após o login
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import FloatLabel from 'primevue/floatlabel';
import InputGroupAddon from "primevue/inputgroupaddon";

export default defineComponent({
  components: {
    InputText,
    Button,
    InputGroup,
    InputGroupAddon,
    FloatLabel,
    Form,
    Field,
  },
  setup() {
    const router = useRouter(); // Instância do roteador

    const username = ref('');
    const password = ref('');

    // Definição de esquema de validação com Yup
    const schema = yup.object({
      username: yup.string().required('O nome de usuário é obrigatório'),
      password: yup.string().required('A senha é obrigatória'),
    });

    // Função para lidar com a submissão do formulário
    const onSubmit = async (values: { username: string; password: string }) => {
      // Aqui você pode adicionar a lógica de autenticação
      // Se a autenticação for bem-sucedida, redireciona o usuário
      console.log('Usuário logado:', values);
      router.push({ name: 'GameSelection' }); // Redireciona para a página de seleção de jogos
    };

    return {
      username,
      password,
      schema,
      onSubmit,
    };
  },
});
</script>

<style scoped>
/* Base Styles */
.card {
  @apply shadow-md rounded-md;
}

.form-wrapper {
  @apply mx-auto; /* Centers the form horizontally */
}

.p-error {
  color: red;
}

.p-invalid {
  border-color: red;
}

/* Responsive using media queries */
@media (max-width: 768px) {
  .form-wrapper {
    width: 90%; /* Make form take more space on small screens */
  }
  .login-form {
    padding: 1rem; /* Add padding for small screens */
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .form-wrapper {
    width: 70%; /* For tablets, form is 70% of the screen */
  }
}

@media (min-width: 1025px) {
  .form-wrapper {
    width: 50%; /* On large screens, form takes 50% width */
  }
}

@media (max-width: 640px) {
  /* Stack buttons vertically on small screens */
  .flex-row {
    flex-direction: column;
  }
}
</style>
