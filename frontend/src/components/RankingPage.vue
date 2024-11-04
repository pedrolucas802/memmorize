<template>
  <div>
    <NavBar />
    <div class="ranking-container">
      <h1 class="ranking-title">Ranking de Usuários</h1>
      <table class="ranking-table">
        <thead>
          <tr>
            <th>Posição</th>
            <th>Nome</th>
            <th>Pontuação Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in leaderboard" :key="user.name">
            <td>{{ index + 1 }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.totalScore }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';

interface LeaderboardUser {
  name: string;
  totalScore: number;
}

export default defineComponent({
  name: "RankingPage",  // Atualize o nome do componente para RankingPage
  components: {
    NavBar,
  },
  setup() {
    const leaderboard = ref<LeaderboardUser[]>([]);

    // Função para buscar o ranking dos usuários
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/leaderboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Adiciona o token JWT no cabeçalho
          },
        });
        leaderboard.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar o ranking:", error);
      }
    };

    onMounted(() => {
      fetchLeaderboard();
    });

    return {
      leaderboard,
    };
  },
});
</script>

<style scoped>
.ranking-container {
  padding: 2rem;
  text-align: center;
}

.ranking-title {
  font-size: 24px;
  color: #43636E;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Estilo da tabela */
.ranking-table {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-collapse: collapse;
  font-family: 'Baloo 2', sans-serif;
}

.ranking-table th,
.ranking-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.ranking-table th {
  background-color: #8a989c;
  color: white;
  font-weight: bold;
}

.ranking-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.ranking-table tr:hover {
  background-color: #f1f1f1;
}
</style>
