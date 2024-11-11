import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue'; // Página de login
import RegisterPage from '../components/RegisterPage.vue';
import LoginForm from '../components/LoginForm.vue'; // Página de login
import UserHome from '../components/UserHome.vue'; // Página de estatísticas do usuário
import ThemeAndDifficultySelection from '../components/games/ThemeAndDifficultSelection.vue'; // Tela de seleção de tema/dificuldade
import MemoryGame from '../components/games/MemoryGame.vue';
import RankingPage from '../components/RankingPage.vue';

const routes = [
  { path: '/', name: 'WelcomePage', component: WelcomePage },
  { path: '/register', name: 'RegisterPage', component: RegisterPage },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/home',
    name: 'UserHome',
    component: UserHome,
  },
  {
    path: '/select',
    name: 'ThemeAndDifficulty',
    component: ThemeAndDifficultySelection,
  },
  {
    path: '/memory',
    name: 'MemoryGame',
    component: MemoryGame,
  },
  {
    path: '/ranking',
    name: 'RankingPage',
    component: RankingPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
