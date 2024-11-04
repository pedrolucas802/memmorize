<template>
  <div>
    <NavBar />
    <div class="theme-difficulty-selection">
      <h2 class="main-title">Prepare-se para o Jogo!</h2>

      <div class="selection">
        <h3 class="title-selection">Escolha um tema:</h3>
        <div class="button-group">
          <button 
            v-for="theme in themes" 
            :key="theme" 
            @click="selectTheme(theme)"
            :class="{ selected: theme === selectedTheme }"
          >
            {{ theme }}
          </button>
        </div>
      </div>

      <div class="selection">
        <h3 class="title-selection">Escolha uma dificuldade:</h3>
        <div class="button-group">
          <button 
            v-for="level in difficulties" 
            :key="level" 
            @click="selectDifficulty(level)"
            :class="{ selected: level === selectedDifficulty }"
          >
            {{ level }}
          </button>
        </div>
      </div>

      <div class="selected-info" v-if="selectedTheme && selectedDifficulty">
        <span class="badge">Tema Selecionado: {{ selectedTheme }}</span>
        <span class="badge">Dificuldade Selecionada: {{ selectedDifficulty }}</span>
      </div>

      <div class="start-game" v-if="selectedTheme && selectedDifficulty">
        <button @click="startGame" class="start-button">Iniciar Jogo</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

export default defineComponent({
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const themes = ['Arte', 'História', 'Museus', 'Natureza'];
    const difficulties = ['Fácil', 'Médio', 'Difícil'];

    const selectedTheme = ref<string | null>(null);
    const selectedDifficulty = ref<string | null>(null);

    const selectTheme = (theme: string) => {
      selectedTheme.value = theme;
    };

    const selectDifficulty = (level: string) => {
      selectedDifficulty.value = level;
    };


    const startGame = () => {
      const game = route.query.game;
      router.push({
        name: 'MemoryGame',
        query: {
          game,
          theme: selectedTheme.value,
          difficulty: selectedDifficulty.value,
        },
      });
    };

    return {
      themes,
      difficulties,
      selectedTheme,
      selectedDifficulty,
      selectTheme,
      selectDifficulty,
      startGame,
    };
  },
});
</script>

<style scoped>
/* Estilos gerais da página */
.theme-difficulty-selection {
  text-align: center;
  margin-top: 50px;
  padding-bottom: 50px; /* Espaço extra no final da tela */
  font-family: 'Baloo 2', sans-serif;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.selection {
  margin-top: 20px;
}

.title-selection {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

/* Estilo dos botões */
.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
}

button {
  margin: 10px;
  padding: 12px 24px;
  background-color: white;
  color: #43636E;
  border: 2px solid #43636E;
  border-radius: 8px;
  font-family: 'Baloo 2', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Efeito de seleção */
button.selected,
button.selected:hover {
  background-color: #43636E;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilo hover */
button:hover:not(.selected) {
  background-color: #EBF1F4;
  color: #43636E;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

/* Estilos de badges para tema e dificuldade selecionados */
.selected-info {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.badge {
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 8px 16px;
  color: #43636E;
  font-weight: 600;
}

/* Botão de iniciar jogo */
.start-game {
  margin-top: 30px;
}

.start-button {
  background-color: #42b983;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.start-button:hover {
  background-color: #36a373;
  transform: scale(1.05);
}
</style>
