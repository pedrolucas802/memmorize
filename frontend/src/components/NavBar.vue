<template>
  <nav class="navbar">
    <div class="navbar-start">
      <img src="@/assets/Elephant.png" alt="Icon" width="45" height="40" class="navbar-logo" />
      <ul class="navbar-menu">
        <li
            v-for="item in items"
            :key="item.label"
            :class="{ active: item.label === activeItem }"
        >
          <a @click="navigateTo(item)">{{ item.label }}</a>
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <button class="logout-button p-2.5 mr-5" @click="confirmLogout()">
        Sair
        <i class="pi pi-sign-out logout-icon" style="margin-left: 10px;"></i>
      </button>
      <ConfirmPopup />
      <Toast />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const activeItem = ref<string | null>(null);

const items = [
  { label: 'Início', routeName: 'UserHome' },
  { label: 'Jogo da Memória', routeName: 'ThemeAndDifficulty' },
  { label: 'Ranking', routeName: 'RankingPage' },
];

const navigateTo = (item: { label: string; routeName: string }) => {
  activeItem.value = item.label;
  router.push({ name: item.routeName });
};

const logout = () => {
  localStorage.removeItem('jwtToken');
  toast.add({
    severity: 'info',
    summary: 'Logout',
    detail: 'Você foi deslogado com sucesso.',
    life: 3000,
  });
  router.push({ name: 'Login' });
};

const confirmLogout = () => {
  confirm.require({
    message: 'Tem certeza de que deseja sair?',
    accept: logout,
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Cancelado',
        detail: 'Ação de logout cancelada.',
        life: 3000,
      });
    },
  });
};
</script>

<style scoped>
/* Navbar base */
.navbar {
  display: flex;
  justify-content: space-between; /* Align items on start and end */
  align-items: center;
  padding: 10px 20px;
  background-color: #43636E;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-family: 'Baloo 2', sans-serif;
  color: white;
}

/* Alinhar logo e menu à esquerda */
.navbar-start {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Logo */
.navbar-logo {
  height: 40px;
}

/* Menu central alinhado à esquerda */
.navbar-menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-menu li {
  margin: 0 15px;
}

.navbar-menu li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  transition: color 0.3s;
}

/* Efeito hover */
.navbar-menu li a:hover {
  color: #d1d1d1;
  cursor: pointer;
}

/* Navbar end */
.navbar-end {
  display: flex;
  align-items: center;
}

/* Logout button styles */
.logout-button {
  background-color: #d9534f;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c9302c;
}
</style>
