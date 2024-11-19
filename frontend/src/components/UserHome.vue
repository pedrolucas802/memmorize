<template>
  <div>
    <NavBar />
    <!-- Conteúdo da página UserHome -->
    <div class="user-home-content">
      <h1>Olá, {{ user.name }}! Receba às boas-vindas ao Memorize!</h1>
      <div class="dashboard">
        <div class="dashboard-card">
          <h2>Seu ranking atual:</h2>
          <p class="dashboard-value">{{ user.rank }}</p>
        </div>
        <div class="dashboard-card">
          <h2>Sua pontuação total:</h2>
          <p class="dashboard-value">{{ formattedScore }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';
import router from "@/router";

// Definição da interface para o ranking dos usuários
interface LeaderboardUser {
  name: string;
  totalScore: number;
}

interface LeaderboardUserRankScore {
  rank: number;
  score: number;
  name: string;
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

    const checkAuthentication = () => {
      if (!token) {
        console.warn('Token JWT não encontrado. Redirecionando para a página de login.');
        router.push('/login');
      }
    };

    const token = localStorage.getItem('jwtToken');

    const fetchUserRanking = async () => {
      try {
        const response = await axios.get<LeaderboardUserRankScore>(`${process.env.VUE_APP_API_URL}/api/game/leaderboard/me`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        const {rank,score, name} = response.data;

        user.value.rank = rank
        user.value.score = score
        user.value.name = name


        // const userIndex = leaderboard.findIndex((u: LeaderboardUser) => u.name === user.value.name);
        
        // if (userIndex !== -1) {
        //   user.value.rank = userIndex + 1; 
        //   user.value.score = leaderboard[userIndex].totalScore;
        // } else {
        //   console.warn("Usuário não encontrado no ranking.");
        // }
      } catch (error) {
        console.error("Erro ao buscar o ranking:", error);
      }
    };

    const loadUserName = () => {
      user.value.name = localStorage.getItem('userName') || 'Usuário';
    };

    const formattedScore = computed(() => {
      return user.value.score.toLocaleString('en-US');
    });

    onMounted(() => {
      checkAuthentication();
      loadUserName();
      fetchUserRanking();
    });

    return {
      user,
      formattedScore
    };
  },
});
</script>

<style scoped>
.user-home-content {
  padding: 2rem;
  text-align: center;
  background-color: white; /* Subtle background color */
  border-radius: 10px;
  margin: 2rem auto;
  width: 80%;
}

h1 {
  font-size: 32px;
  color: #43636E;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.dashboard {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  margin-top: 2rem;
}

.dashboard-card {
  background: #f7f9fc;
  flex: 1;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.dashboard-card h2 {
  font-size: 20px;
  font-weight: bold;
  color: #6c757d; /* Muted color for card title */
  margin-bottom: 1rem;
}

.dashboard-value {
  font-size: 56px;
  font-weight: bold;
  color: #43636E; /* Highlighted value */
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
    gap: 1.5rem;
  }

  .dashboard-card {
    width: 100%;
  }
}
</style>
