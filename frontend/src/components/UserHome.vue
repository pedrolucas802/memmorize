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

    onMounted(() => {
      checkAuthentication();
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
