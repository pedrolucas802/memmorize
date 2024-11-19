<template>
  <div class="game-container">
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
          <img v-if="card.flipped || card.matched" :src="card.image" alt="Card Image" loading="lazy">
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
    const score = ref(0);
    let interval: number;

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

    const isCheckingMatch = ref(false); // fix: only two cards at a time

    const flipCard = (index: number) => {
      if (isCheckingMatch.value || cards.value[index].flipped || cards.value[index].matched) {
        return;
      }

      cards.value[index].flipped = true;

      if (flippedCardIndex.value === null) {
        flippedCardIndex.value = index;
      } else {
        isCheckingMatch.value = true;
        checkForMatch(index);
      }
    };

    const checkForMatch = (index: number) => {
      const firstCard = cards.value[flippedCardIndex.value as number];
      const secondCard = cards.value[index];

      if (firstCard.image === secondCard.image) {
        firstCard.matched = true;
        secondCard.matched = true;
        checkGameFinished();
        isCheckingMatch.value = false;
      } else {
        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
          isCheckingMatch.value = false;
        }, 1500);
      }

      flippedCardIndex.value = null;
    };

    const checkGameFinished = () => {
      if (cards.value.every(card => card.matched)) {
        gameFinished.value = true;
        clearInterval(interval);
        calculateScore();
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

    const preloadImages = (images: any) => {
      images.forEach((image: any) => {
        const img = new Image();
        img.src = image;
      });
    };

    onMounted(() => {
      if (selectedTheme.value) {
        setupGame();
        preloadImages(cards.value.map((card) => card.image));
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
  padding: 2rem;
  text-align: center;
  border-radius: 10px;
  margin: 2rem auto;
  width: 90%;
  max-width: 900px;
}

/* Timer Styling */
.timer {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5em;
  font-weight: bold;
  color: #007bff;
  background: white;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Memory Game Grid */
.memory-game {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* Default: 6 cards per row */
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

/* Card Styling */
.memory-card {
  width: 120px;
  height: 170px;
  border-radius: 8px;
  background-color: #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.4s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.memory-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2em;
  font-weight: bold;
  letter-spacing: 2px;
}

/* Congrats Screen Styling */
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
  z-index: 10;
}

.congrats-message h1 {
  font-size: 3em;
  margin-bottom: 0.5em;
  color: #4caf50;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
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
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.congrats-message button:hover {
  background-color: #45a049;
  transform: translateY(-3px);
}

/* Exit Button */
.exit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.exit-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.exit-button:hover {
  background-color: #c9302c;
  transform: translateY(-3px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .memory-game {
    grid-template-columns: repeat(5, 1fr); /* 5 cards per row */
  }
}

@media (max-width: 992px) {
  .memory-game {
    grid-template-columns: repeat(4, 1fr); /* 4 cards per row */
  }

  .memory-card {
    width: 100px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .memory-game {
    grid-template-columns: repeat(3, 1fr); /* 3 cards per row */
  }

  .memory-card {
    width: 90px;
    height: 135px;
  }
}

@media (max-width: 576px) {
  .memory-game {
    grid-template-columns: repeat(2, 1fr); /* 2 cards per row */
  }

  .memory-card {
    width: 80px;
    height: 120px;
  }
}
</style>
