<template>
  <div>
    <NavBar />
    <div class="">
      <h2 class="main-title">Prepare-se para o Jogo!</h2>

      <div class="theme-difficulty-selection">
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

      <div class="theme-difficulty-selection">
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
/* Overall Page Styling */
.theme-difficulty-selection {
  text-align: center;
  font-family: 'Baloo 2', sans-serif;
  background-color: #f7f9fc;
  border-radius: 10px;
  max-width: 900px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.main-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #43636E;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Section Styling */
.selection {
  margin-top: 30px;
}

.title-selection {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
  color: #3a3a3a;
  text-transform: uppercase;
}

/* Button Group Styling */
.button-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Selected Button */
button.selected {
  background-color: #43636E;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:hover:not(.selected) {
  background-color: #e8f0f4;
  color: #43636E;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

/* Badge Styling */
.selected-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.badge {
  background-color: #edf2f7;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  color: #43636E;
  font-weight: bold;
  border: 1px solid #d1d9e1;
  text-transform: uppercase;
}

/* Start Button Styling */
.start-game {
  margin-top: 40px;
}

.start-button {
  background-color: #42b983;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.start-button:hover {
  background-color: #36a373;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .theme-difficulty-selection {
    padding: 20px;
  }

  .main-title {
    font-size: 24px;
  }

  button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .badge {
    font-size: 12px;
    padding: 8px 16px;
  }

  .start-button {
    font-size: 18px;
    padding: 12px 24px;
  }
}
</style>
