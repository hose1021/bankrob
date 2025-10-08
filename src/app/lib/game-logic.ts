// Игровая логика "Ограбление Банка"

import type {
  BankCode,
  Card,
  CodeAttempt,
  ExchangeOffer,
  GamePlayer,
  GameState,
  PlayerRole,
} from "./game-types";

// Константы игры
const PLAYER_CONFIGS = {
  5: { robbers: 2, clients: 3 },
  7: { robbers: 3, clients: 4 },
  9: { robbers: 4, clients: 5 },
  11: { robbers: 5, clients: 6 },
  13: { robbers: 6, clients: 7 },
};

const ROMAN_NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

/**
 * Создает новую игру
 */
export function createGame(playerNames: string[]): GameState {
  const playerCount = playerNames.length;

  if (!PLAYER_CONFIGS[playerCount as keyof typeof PLAYER_CONFIGS]) {
    throw new Error(`Недопустимое количество игроков: ${playerCount}`);
  }

  const config = PLAYER_CONFIGS[playerCount as keyof typeof PLAYER_CONFIGS];
  const players = createPlayers(playerNames, config.robbers, config.clients);
  const bankCode = generateBankCode(config.clients);

  return {
    phase: "setup",
    round: 1,
    players,
    bankCode,
    discardedCards: [],
    currentExchanges: [],
    nightAttempts: [],
    dayVotes: new Map(),
    eliminatedPlayers: [],
    phaseTimer: 0,
  };
}

/**
 * Создает игроков и раздает карты
 */
function createPlayers(
  names: string[],
  robbersCount: number,
  clientsCount: number,
): GamePlayer[] {
  const totalPlayers = names.length;
  const roles: PlayerRole[] = [
    ...Array(robbersCount).fill("robber"),
    ...Array(clientsCount).fill("client"),
  ];

  // Перемешиваем роли
  shuffleArray(roles);

  // Генерируем код банка
  const codeDigits = generateCodeDigits(clientsCount);

  // Создаем дополнительные карты (все цифры кода + случайные)
  const additionalCardPool = createAdditionalCardPool(codeDigits, totalPlayers);

  const players: GamePlayer[] = names.map((name, index) => {
    const role = roles[index];
    const mainCard = createMainCard(role, codeDigits[index]);
    const card1 = additionalCardPool.pop();
    const card2 = additionalCardPool.pop();
    if (!card1 || !card2) {
      throw new Error("Недостаточно дополнительных карт");
    }
    const additionalCards = [card1, card2];

    return {
      id: index + 1,
      name,
      role,
      mainCard,
      additionalCards,
      isAlive: true,
      isReady: false,
    };
  });

  return players;
}

/**
 * Создает основную карту игрока
 */
function createMainCard(
  role: PlayerRole,
  codeInfo?: { value: number; position: number },
): Card {
  if (role === "robber") {
    return {
      id: `main-robber-${Math.random()}`,
      type: "main",
      isRobber: true,
    };
  }

  return {
    id: `main-client-${Math.random()}`,
    type: "main",
    value: codeInfo?.value,
    position: codeInfo?.position,
    isRobber: false,
  };
}

/**
 * Генерирует цифры кода банка
 */
function generateCodeDigits(
  clientsCount: number,
): Array<{ value: number; position: number }> {
  const digits: number[] = [];

  // Генерируем уникальные цифры
  while (digits.length < clientsCount) {
    const digit = Math.floor(Math.random() * 10);
    if (!digits.includes(digit)) {
      digits.push(digit);
    }
  }

  return digits.map((value, index) => ({
    value,
    position: index + 1,
  }));
}

/**
 * Создает пул дополнительных карт
 */
function createAdditionalCardPool(
  codeDigits: Array<{ value: number; position: number }>,
  totalPlayers: number,
): Card[] {
  const cards: Card[] = [];

  // Добавляем карты с цифрами кода (без позиции)
  for (const { value } of codeDigits) {
    cards.push({
      id: `add-${value}-${Math.random()}`,
      type: "additional",
      value,
    });
  }

  // Добавляем случайные карты
  const totalNeeded = totalPlayers * 2; // По 2 карты каждому игроку
  while (cards.length < totalNeeded) {
    cards.push({
      id: `add-rand-${Math.random()}`,
      type: "additional",
      value: Math.floor(Math.random() * 10),
    });
  }

  shuffleArray(cards);
  return cards;
}

/**
 * Генерирует код банка
 */
function generateBankCode(clientsCount: number): BankCode {
  const digits = new Map<number, number>();
  const usedDigits = new Set<number>();

  for (let pos = 1; pos <= clientsCount; pos++) {
    let digit: number;
    do {
      digit = Math.floor(Math.random() * 10);
    } while (usedDigits.has(digit));

    digits.set(pos, digit);
    usedDigits.add(digit);
  }

  return {
    digits,
    revealed: new Set(),
  };
}

/**
 * Обрабатывает предложение обмена картой
 */
export function proposeCardExchange(
  gameState: GameState,
  fromPlayerId: number,
  toPlayerId: number,
  cardId: string,
): GameState {
  if (gameState.phase !== "card-exchange") {
    throw new Error("Обмен картами возможен только в фазе обмена");
  }

  const offer: ExchangeOffer = {
    fromPlayerId,
    toPlayerId,
    cardId,
    status: "pending",
  };

  return {
    ...gameState,
    currentExchanges: [...gameState.currentExchanges, offer],
  };
}

/**
 * Принимает или отклоняет обмен
 */
export function respondToExchange(
  gameState: GameState,
  playerId: number,
  offerId: number,
  accept: boolean,
  responseCardId?: string,
): GameState {
  const exchanges = [...gameState.currentExchanges];
  const offer = exchanges[offerId];

  if (!offer || offer.toPlayerId !== playerId) {
    throw new Error("Недействительное предложение обмена");
  }

  if (accept && responseCardId) {
    // Выполняем обмен
    const players = [...gameState.players];
    const fromPlayer = players.find((p) => p.id === offer.fromPlayerId)!;
    const toPlayer = players.find((p) => p.id === offer.toPlayerId)!;

    const fromCard = fromPlayer.additionalCards.find(
      (c) => c.id === offer.cardId,
    )!;
    const toCard = toPlayer.additionalCards.find(
      (c) => c.id === responseCardId,
    )!;

    // Меняем карты местами
    fromPlayer.additionalCards = fromPlayer.additionalCards.map((c) =>
      c.id === offer.cardId ? toCard : c,
    );
    toPlayer.additionalCards = toPlayer.additionalCards.map((c) =>
      c.id === responseCardId ? fromCard : c,
    );

    offer.status = "accepted";

    return {
      ...gameState,
      players,
      currentExchanges: exchanges,
    };
  }

  offer.status = "rejected";
  return {
    ...gameState,
    currentExchanges: exchanges,
  };
}

/**
 * Сбрасывает карту игрока
 */
export function discardCard(
  gameState: GameState,
  playerId: number,
  cardId: string,
): GameState {
  if (gameState.phase !== "card-discard") {
    throw new Error("Сброс карт возможен только в фазе сброса");
  }

  const players = [...gameState.players];
  const player = players.find((p) => p.id === playerId)!;

  const cardIndex = player.additionalCards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    throw new Error("Карта не найдена");
  }

  const [discardedCard] = player.additionalCards.splice(cardIndex, 1);

  // Проверяем, соответствует ли сброшенная карта коду банка
  if (discardedCard.value !== undefined) {
    for (const [position, digit] of gameState.bankCode.digits) {
      if (digit === discardedCard.value) {
        gameState.bankCode.revealed.add(position);
      }
    }
  }

  return {
    ...gameState,
    players,
    discardedCards: [...gameState.discardedCards, discardedCard],
  };
}

/**
 * Грабители делают попытку взлома кода
 */
export function makeNightAttempt(
  gameState: GameState,
  digit: number,
  position: number,
): GameState {
  if (gameState.phase !== "night") {
    throw new Error("Попытка взлома возможна только ночью");
  }

  const attempt: CodeAttempt = { digit, position };

  // Проверяем правильность попытки
  const correctDigit = gameState.bankCode.digits.get(position);
  const isCorrect = correctDigit === digit;

  if (isCorrect) {
    gameState.bankCode.revealed.add(position);
  }

  return {
    ...gameState,
    nightAttempts: [...gameState.nightAttempts, attempt],
  };
}

/**
 * Голосование за исключение игрока
 */
export function voteForPlayer(
  gameState: GameState,
  voterId: number,
  targetId: number,
): GameState {
  if (gameState.phase !== "voting") {
    throw new Error("Голосование возможно только в фазе голосования");
  }

  const dayVotes = new Map(gameState.dayVotes);
  dayVotes.set(voterId, targetId);

  return {
    ...gameState,
    dayVotes,
  };
}

/**
 * Подсчитывает голоса и исключает игрока
 */
export function resolveVoting(gameState: GameState): GameState {
  const voteCounts = new Map<number, number>();

  for (const targetId of gameState.dayVotes.values()) {
    voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1);
  }

  // Находим игрока с наибольшим количеством голосов
  let maxVotes = 0;
  let eliminatedId = 0;

  for (const [playerId, votes] of voteCounts) {
    if (votes > maxVotes) {
      maxVotes = votes;
      eliminatedId = playerId;
    }
  }

  if (eliminatedId > 0) {
    const players = gameState.players.map((p) =>
      p.id === eliminatedId ? { ...p, isAlive: false } : p,
    );

    return {
      ...gameState,
      players,
      eliminatedPlayers: [...gameState.eliminatedPlayers, eliminatedId],
    };
  }

  return gameState;
}

/**
 * Проверяет условия победы
 */
export function checkWinCondition(gameState: GameState): GameState {
  const alivePlayers = gameState.players.filter((p) => p.isAlive);
  const aliveRobbers = alivePlayers.filter((p) => p.role === "robber");
  const _aliveClients = alivePlayers.filter((p) => p.role === "client");

  // Грабители выбыли - победа клиентов
  if (aliveRobbers.length === 0) {
    return {
      ...gameState,
      winner: "clients",
      phase: "game-over",
    };
  }

  // Код полностью раскрыт - победа грабителей
  const codeLength = gameState.bankCode.digits.size;
  if (gameState.bankCode.revealed.size === codeLength) {
    return {
      ...gameState,
      winner: "robbers",
      phase: "game-over",
    };
  }

  return gameState;
}

/**
 * Переход к следующей фазе
 */
export function nextPhase(gameState: GameState): GameState {
  const phaseOrder: Array<GameState["phase"]> = [
    "setup",
    "card-exchange",
    "card-discard",
    "night",
    "night-result",
    "day",
    "voting",
    "day-result",
  ];

  const currentIndex = phaseOrder.indexOf(gameState.phase);
  let nextPhase: GameState["phase"];

  if (gameState.phase === "day-result") {
    // После результата дня - снова ночь (новый раунд)
    nextPhase = "night";
    return {
      ...gameState,
      phase: nextPhase,
      round: gameState.round + 1,
      dayVotes: new Map(),
      nightAttempts: [],
    };
  }

  if (currentIndex === -1 || currentIndex === phaseOrder.length - 1) {
    nextPhase = "setup";
  } else {
    nextPhase = phaseOrder[currentIndex + 1];
  }

  // Пропускаем обмен картами после первого раунда
  if (nextPhase === "card-exchange" && gameState.round > 1) {
    nextPhase = "card-discard";
  }

  return {
    ...gameState,
    phase: nextPhase,
  };
}

/**
 * Перемешивает массив
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Получает информацию о текущей фазе
 */
export function getPhaseInfo(phase: GameState["phase"]): {
  title: string;
  description: string;
} {
  const phaseInfo = {
    setup: {
      title: "🎭 Подготовка",
      description: "Раздача ролей и карт",
    },
    "card-exchange": {
      title: "🔄 Обмен картами",
      description: "Игроки могут обмениваться дополнительными картами",
    },
    "card-discard": {
      title: "🗑️ Сброс карты",
      description: "Каждый игрок сбрасывает одну дополнительную карту",
    },
    night: {
      title: "🌙 Ночь",
      description: "Грабители подбирают цифру кода",
    },
    "night-result": {
      title: "🌅 Результат ночи",
      description: "Показываются результаты ночной попытки",
    },
    day: {
      title: "☀️ День",
      description: "Обсуждение и поиск грабителей",
    },
    voting: {
      title: "🗳️ Голосование",
      description: "Голосование за подозреваемого",
    },
    "day-result": {
      title: "📊 Результат голосования",
      description: "Показываются результаты голосования",
    },
    "game-over": {
      title: "🏆 Игра окончена",
      description: "Подведение итогов",
    },
  };

  return phaseInfo[phase];
}

/**
 * Форматирует римское число
 */
export function toRoman(num: number): string {
  return ROMAN_NUMERALS[num - 1] || num.toString();
}
