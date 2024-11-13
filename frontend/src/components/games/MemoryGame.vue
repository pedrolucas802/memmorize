<template>
  <div v-if="gameFinished" class="congrats-screen">
    <div class="congrats-message">
      <h1>Parabéns!</h1>
      <p>Você concluiu o jogo em {{ timer }} segundos!</p>
      <p>Sua pontuação foi de: {{ score }} pontos</p>
      <button @click="goToHome">Voltar à Tela Inicial</button>
    </div>
    <Confetti />
  </div>

  <div v-else-if="gameStarted" class="game-container">
    <div class="timer">Cronômetro: {{ timer }}s</div>
    <div class="memory-game">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="memory-card"
        @click="flipCard(index)"
      >
        <img v-if="card.flipped || card.matched" :src="card.image" alt="Card Image">
        <div v-else class="card-back"></div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Carregando o jogo...</p>
  </div>

  <!-- Botão de Sair, sempre visível no final da página -->
  <div class="exit-button-container">
    <button @click="goToHome" class="exit-button">Sair</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Confetti from 'vue-confetti';
import axios from 'axios';
// import axios from 'axios'; // Descomentado quando o backend estiver disponível

interface Card {
  image: string;
  flipped: boolean;
  matched: boolean;
}

export default defineComponent({
  components: {
    Confetti,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const selectedTheme = ref<string | null>(route.query.theme as string || null);
    const selectedDifficulty = ref<string | null>(route.query.difficulty as string || null);
    const gameStarted = ref<boolean>(false);
    const gameFinished = ref<boolean>(false);
    const cards = ref<Card[]>([]);
    const flippedCardIndex = ref<number | null>(null);
    const timer = ref(0);
    const score = ref(0); // Adiciona variável de pontuação
    let interval: number;

    // Mapeamento para o número de pares de cartas baseado na dificuldade
    const difficultyCardCounts = {
      Fácil: 8,
      Médio: 12,
      Difícil: 16,
    };

    const themeImages: { [key: string]: string[] } = {
      Arte: ['/images/arte/arte-card (1).svg', '/images/arte/arte-card (2).svg', '/images/arte/arte-card (3).svg', '/images/arte/arte-card (4).svg', '/images/arte/arte-card (5).svg', '/images/arte/arte-card (6).svg', '/images/arte/arte-card (7).svg', '/images/arte/arte-card (8).svg', '/images/arte/arte-card (9).svg', '/images/arte/arte-card (10).svg', '/images/arte/arte-card (11).svg', '/images/arte/arte-card (12).svg', '/images/arte/arte-card (13).svg', '/images/arte/arte-card (14).svg', '/images/arte/arte-card (15).svg', '/images/arte/arte-card (16).svg'],
      História: ['/images/historia/historia-card (1).svg', '/images/historia/historia-card (2).svg', '/images/historia/historia-card (3).svg', '/images/historia/historia-card (4).svg', '/images/historia/historia-card (5).svg', '/images/historia/historia-card (6).svg', '/images/historia/historia-card (7).svg', '/images/historia/historia-card (8).svg', '/images/historia/historia-card (9).svg', '/images/historia/historia-card (10).svg', '/images/historia/historia-card (11).svg', '/images/historia/historia-card (12).svg', '/images/historia/historia-card (13).svg', '/images/historia/historia-card (14).svg', '/images/historia/historia-card (15).svg', '/images/historia/historia-card (16).svg'],
      Museus: ['/images/museus/museus-card (1).svg', '/images/museus/museus-card (2).svg', '/images/museus/museus-card (3).svg', '/images/museus/museus-card (4).svg', '/images/museus/museus-card (5).svg', '/images/museus/museus-card (6).svg', '/images/museus/museus-card (7).svg', '/images/museus/museus-card (8).svg', '/images/museus/museus-card (9).svg', '/images/museus/museus-card (10).svg', '/images/museus/museus-card (11).svg', '/images/museus/museus-card (12).svg', '/images/museus/museus-card (13).svg', '/images/museus/museus-card (14).svg', '/images/museus/museus-card (15).svg', '/images/museus/museus-card (16).svg'],
      Natureza: ['/images/natureza/natureza-card (1).svg', '/images/natureza/natureza-card (2).svg', '/images/natureza/natureza-card (3).svg', '/images/natureza/natureza-card (4).svg', '/images/natureza/natureza-card (5).svg', '/images/natureza/natureza-card (6).svg', '/images/natureza/natureza-card (7).svg', '/images/natureza/natureza-card (8).svg', '/images/natureza/natureza-card (9).svg', '/images/natureza/natureza-card (10).svg', '/images/natureza/natureza-card (11).svg', '/images/natureza/natureza-card (12).svg', '/images/natureza/natureza-card (13).svg', '/images/natureza/natureza-card (14).svg', '/images/natureza/natureza-card (15).svg', '/images/natureza/natureza-card (16).svg'],
    };

    const setupGame = () => {
      const images = themeImages[selectedTheme.value as string] || [];
      const numPairs = difficultyCardCounts[selectedDifficulty.value as "Fácil" | "Médio" | "Difícil"] || 8;

      const selectedImages = [];
      while (selectedImages.length < numPairs) {
        selectedImages.push(...images.slice(0, numPairs - selectedImages.length));
      }

      const duplicatedCards = [...selectedImages, ...selectedImages];
      cards.value = shuffleCards(
        duplicatedCards.map(image => ({ image, flipped: false, matched: false }))
      );

      gameStarted.value = true;
      startTimer();
    };

    const shuffleCards = (cards: Card[]): Card[] => {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      return cards;
    };

    const flipCard = (index: number) => {
      if (!cards.value[index].flipped && !cards.value[index].matched) {
        cards.value[index].flipped = true;
        if (flippedCardIndex.value === null) {
          flippedCardIndex.value = index;
        } else {
          checkForMatch(index);
        }
      }
    };

    const checkForMatch = (index: number) => {
      const firstCard = cards.value[flippedCardIndex.value as number];
      const secondCard = cards.value[index];

      if (firstCard.image === secondCard.image) {
        firstCard.matched = true;
        secondCard.matched = true;
        checkGameFinished();
      } else {
        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
        }, 1000);
      }
      flippedCardIndex.value = null;
    };

    const checkGameFinished = () => {
      if (cards.value.every(card => card.matched)) {
        gameFinished.value = true;
        clearInterval(interval);
        calculateScore();
        // Enviar pontuação ao backend (comentado enquanto backend não disponível)
        try {
           axios.post(`${process.env.VUE_APP_API_URL}/api/game/register-match`, { score: score.value }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
          });
        } catch (error) {
          console.error('Erro ao registrar a partida:', error);
        }
        
      }
    };

    const calculateScore = () => {
      const maxScore = selectedDifficulty.value === "Fácil" ? 2000
                      : selectedDifficulty.value === "Médio" ? 2500
                      : 3000;
      const penaltyFactor = selectedDifficulty.value === "Fácil" ? 10
                          : selectedDifficulty.value === "Médio" ? 7
                          : 5;
      score.value = Math.max(0, maxScore - (timer.value * penaltyFactor));
    };

    const startTimer = () => {
      interval = setInterval(() => {
        timer.value += 1;
      }, 1000);
    };

    const goToHome = () => {
      router.push({ name: 'UserHome' });
    };

    onMounted(() => {
      if (selectedTheme.value) {
        setupGame();
      }
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
    });

    return {
      gameStarted,
      gameFinished,
      cards,
      flipCard,
      timer,
      score,
      goToHome,
    };
  },
});
</script>


<style scoped>
.game-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 40px;
}

.memory-game {
  display: grid;
  grid-template-columns: repeat(8, 1fr); /* 8 cards por linha em telas grandes */
  gap: 10px;
  justify-content: center;
}

/* Timer */
.timer {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.2em;
  font-weight: bold;
}

/* Card Style */
.memory-card {
  width: 100px;
  height: 150px;
  border-radius: 8px;
  background-color: #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s;
}

.memory-card img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.card-back {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #888888;
}

/* Congrats Screen */
.congrats-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
}

.congrats-message h1 {
  font-size: 3em;
  margin-bottom: 0.5em;
}

.congrats-message p {
  font-size: 1.5em;
  margin-bottom: 1em;
}

.congrats-message button {
  font-size: 1em;
  padding: 10px 20px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.congrats-message button:hover {
  background-color: #45a049;
}

/* Responsividade */
@media (max-width: 1200px) {
  .memory-game {
    grid-template-columns: repeat(6, 1fr); /* 6 cards por linha */
  }
  .memory-card {
    width: 90px;
    height: 135px;
  }
}

@media (max-width: 992px) {
  .memory-game {
    grid-template-columns: repeat(4, 1fr); /* 4 cards por linha */
  }
  .memory-card {
    width: 80px;
    height: 120px;
  }
}

@media (max-width: 768px) {
  .memory-game {
    grid-template-columns: repeat(3, 1fr); /* 3 cards por linha */
  }
  .memory-card {
    width: 70px;
    height: 105px;
  }
}

@media (max-width: 576px) {
  .memory-game {
    grid-template-columns: repeat(4, 1fr); /* 2 cards por linha */
  }
  .memory-card {
    width: 60px;
    height: 90px;
  }
}


@media (max-width: 350px) {
  .memory-game {
    grid-template-columns: repeat(3, 1fr); /* 2 cards por linha */
  }
  .memory-card {
    width: 50px;
    height: 80px;
  }
}

.exit-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  /* position: fixed; */
  bottom: 20px;
  left: 0;
  right: 0;
}

.exit-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.exit-button:hover {
  background-color: #c9302c;
}


</style>
