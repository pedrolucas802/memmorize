<template>
  <div v-if="gameStarted" class="memory-game">
    <div v-for="(card, index) in cards" :key="index" class="memory-card" @click="flipCard(index)">
      <!-- Caminho direto da imagem usando a pasta public -->
      <img v-if="card.flipped || card.matched" :src="card.image" alt="Card Image">
      <div v-else class="card-back"></div>
    </div>
  </div>
  <div v-else>
    <p>Carregando o jogo...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

interface Card {
  image: string;
  flipped: boolean;
  matched: boolean;
}

export default defineComponent({
  setup() {
    const route = useRoute(); // Obtém a rota atual para o tema
    const selectedTheme = ref<string | null>(route.query.theme as string || null);
    const gameStarted = ref<boolean>(false);
    const cards = ref<Card[]>([]);
    const flippedCardIndex = ref<number | null>(null);

    // Caminhos de imagens usando a pasta public
    const themeImages: { [key: string]: string[] } = {
      Arte: [
        '/images/arte/arte-card1.png',
        '/images/arte/arte-card2.png',
        '/images/arte/arte-card3.png',
      ],
      Geografia: [
        '/images/geografia/geografia-card1.png',
        '/images/geografia/geografia-card2.png',
      ],
      História: [
        '/images/historia/historia-card1.png',
        '/images/historia/historia-card2.png',
      ],
      Museus: [
        '/images/museus/museus-card1.png',
        '/images/museus/museus-card2.png',
      ],
      Natureza: [
        '/images/natureza/natureza-card1.png',
        '/images/natureza/natureza-card2.png',
      ],
    };

    const setupGame = () => {
      const images = themeImages[selectedTheme.value as string];
      if (images) {
        const duplicatedCards = [...images, ...images]; // Duplica as cartas
        cards.value = shuffleCards(
          duplicatedCards.map(image => ({ image, flipped: false, matched: false }))
        );
        gameStarted.value = true;
      }
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
      } else {
        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
        }, 1000);
      }
      flippedCardIndex.value = null;
    };

    // Inicia o jogo se um tema estiver selecionado
    if (selectedTheme.value) {
      setupGame();
    }

    return {
      gameStarted,
      cards,
      flipCard,
    };
  },
});
</script>

<style scoped>
.memory-game {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.memory-card {
  width: 100px;
  height: 150px;
  background-color: #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s;
}

.memory-card img {
  max-width: 100%;
  max-height: 100%;
}

.card-back {
  width: 100%;
  height: 100%;
  background-color: #333;
}
</style>
