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
          <td class="ranking-position">{{ index + 1 }}</td>
          <td class="ranking-name">{{ user.name }}</td>
          <td class="ranking-score">{{ user.totalScore }}</td>
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

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/game/leaderboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Token JWT
          },
        });
        leaderboard.value = response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Erro ao buscar o ranking:", error.response.data.error);
        } else {
          console.error("Erro ao conectar com o servidor.");
        }
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
  border-radius: 10px;
  margin: 2rem auto;
  width: 90%;
  max-width: 900px;
}

.ranking-title {
  font-size: 28px;
  color: #43636E;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Ranking Table Styling */
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Baloo 2', sans-serif;
  background-color: white;
  border-radius: 10px;
  overflow: hidden; /* Ensures rounded corners are applied */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ranking-table th,
.ranking-table td {
  padding: 12px 15px;
  text-align: center;
}

.ranking-table th {
  background-color: #43636E; /* Header background color */
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
}

.ranking-table td {
  font-size: 16px;
  color: #3a3a3a;
}

.ranking-table tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternate row color */
}

.ranking-table tr:hover {
  background-color: #eef3f7; /* Highlight on hover */
  cursor: pointer; /* Add hover effect */
}

/* Styling specific columns */
.ranking-position {
  font-weight: bold;
  font-size: 18px;
  color: #007bff;
}

.ranking-name {
  font-weight: bold;
  color: #3a3a3a;
}

.ranking-score {
  font-weight: bold;
  color: #28a745;
}

@media (max-width: 768px) {
  .ranking-container {
    width: 95%;
  }

  .ranking-table th,
  .ranking-table td {
    font-size: 14px;
    padding: 10px;
  }
}
</style>
