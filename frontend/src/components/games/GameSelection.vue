<template>
  <div class="game-selection">
    <h2 v-if="!gameSelected">Escolha um jogo:</h2>
    <button v-if="!gameSelected" @click="selectGame('memory')">Jogo da Memória</button>
    <button v-if="!gameSelected" @click="startCrossword">Palavra Cruzada</button>

    <!-- Se o usuário escolher o Jogo da Memória, exibimos a seleção de tema -->
    <div v-if="gameSelected === 'memory'" class="theme-selection">
      <h2>Escolha um tema:</h2>
      <div class="themes">
        <button v-for="theme in themes" :key="theme" @click="selectTheme(theme)">
          {{ theme }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameSelection',
  data() {
    return {
      themes: ['Arte', 'Geografia', 'História', 'Museus', 'Natureza'], // Temas disponíveis
      gameSelected: null as string | null, // Armazena o jogo selecionado
    };
  },
  methods: {
    // Método chamado quando o usuário escolhe o jogo da memória
    selectGame(game: string): void {
      this.gameSelected = game;
    },
    // Método para redirecionar para o jogo de palavras cruzadas
    startCrossword(): void {
      this.$router.push('/crossword'); // Redireciona para o jogo de palavras cruzadas
    },
    // Método para redirecionar para o jogo da memória com o tema escolhido
    selectTheme(theme: string): void {
      this.$router.push({ name: 'MemoryGame', query: { theme } }); // Redireciona para o Jogo da Memória com o tema selecionado
    },
  },
});
</script>

<style scoped>
.game-selection, .theme-selection {
  text-align: center;
  margin-top: 100px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
