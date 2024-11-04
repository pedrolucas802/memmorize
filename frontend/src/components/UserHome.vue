<template>
  <div>
    <NavBar />
    <!-- Conteúdo da página UserHome -->
    <div class="user-home-content">
      <h1>Olá, {{ user.name }}! Receba às boas-vindas ao Memorize!</h1>
      <div class="user-stats">
        <h2>Seu ranking atual é: {{ user.rank }}</h2>
        <h2>Sua pontuação total é: {{ user.score }}</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';

// Definição da interface para o ranking dos usuários
interface LeaderboardUser {
  name: string;
  totalScore: number;
}

export default defineComponent({
  components: {
    NavBar,
  },
  setup() {
    const user = ref({
      name: '',
      rank: null as number | null,
      score: 0,
    });

    // Obtenha o token JWT armazenado (exemplo usando localStorage)
    const token = localStorage.getItem('jwtToken');

    // Função para buscar ranking e encontrar o usuário logado
    const fetchUserRanking = async () => {
      try {
        const response = await axios.get<LeaderboardUser[]>('/leaderboard', {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token ao cabeçalho
          },
        });

        // Dados do ranking de todos os usuários
        const leaderboard = response.data;

        // Encontre a posição do usuário logado
        const userIndex = leaderboard.findIndex((u: LeaderboardUser) => u.name === user.value.name);
        
        if (userIndex !== -1) {
          user.value.rank = userIndex + 1; // Posição no ranking (índice + 1)
          user.value.score = leaderboard[userIndex].totalScore;
        } else {
          console.warn("Usuário não encontrado no ranking.");
        }
      } catch (error) {
        console.error("Erro ao buscar o ranking:", error);
      }
    };

    // Função para definir o nome do usuário logado (simulação)
    const loadUserName = () => {
      // Exemplo de como definir o nome do usuário a partir de uma fonte local (substitua conforme necessário)
      user.value.name = localStorage.getItem('userName') || 'Usuário'; // Ajuste conforme sua lógica de autenticação
    };

    onMounted(() => {
      loadUserName();
      fetchUserRanking();
    });

    return {
      user,
    };
  },
});
</script>

<style scoped>
.user-home-content {
  padding: 2rem;
  text-align: center;
}

.user-stats {
  margin-top: 1.5rem;
}

h1 {
  font-size: 24px;
  color: #43636E;
  font-weight: bold;
}

h2 {
  font-size: 18px;
  color: gray;
  margin-top: 1rem;
}
</style>
