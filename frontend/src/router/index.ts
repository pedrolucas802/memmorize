import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import GameSelection from '../components/games/GameSelection.vue'; // Página com as opções de jogos
import MemoryGame from '../components/games/MemoryGame.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/games', // Caminho para a página de seleção de jogos
    name: 'GameSelection',
    component: GameSelection, // Componente da página de seleção de jogos
  },
  {
    path: '/memory', // Caminho para a página de seleção de jogos
    name: 'MemoryGame',
    component: MemoryGame, // Componente da página de seleção de jogos
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
