<!-- src/components/NavBar.vue -->

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
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
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

    return {
      items,
      activeItem,
      navigateTo,
    };
  },
});
</script>

<style scoped>
/* Navbar base */
.navbar {
  display: flex;
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

/* Item ativo */
/* .navbar-menu li.active a {
  border-bottom: 2px solid white;
  color: white;
} */
</style>
