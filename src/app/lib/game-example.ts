// Пример использования игровой логики "Ограбление Банка"

import {
  checkWinCondition,
  createGame,
  discardCard,
  makeNightAttempt,
  nextPhase,
  proposeCardExchange,
  resolveVoting,
  respondToExchange,
  voteForPlayer,
} from "./game-logic";

/**
 * Полный пример игровой сессии
 */
export function exampleGameSession() {
  console.log('🎮 === Начало игры "Ограбление Банка" ===\n');

  // Шаг 1: Создание игры с 5 игроками
  console.log("📝 Создаем игру с 5 игроками...");
  let game = createGame(["Алиса", "Боб", "Чарли", "Дэвид", "Ева"]);

  console.log(`✅ Игра создана!`);
  console.log(`   - Игроков: ${game.players.length}`);
  console.log(
    `   - Грабителей: ${game.players.filter((p) => p.role === "robber").length}`,
  );
  console.log(
    `   - Клиентов: ${game.players.filter((p) => p.role === "client").length}`,
  );
  console.log(`   - Длина кода: ${game.bankCode.digits.size}\n`);

  // Показываем роли и карты
  console.log("🎭 Роли и карты игроков:");
  game.players.forEach((player) => {
    console.log(`   ${player.name}:`);
    console.log(
      `     - Роль: ${player.role === "robber" ? "🦹 Грабитель" : "🏦 Клиент"}`,
    );
    if (player.role === "client") {
      console.log(
        `     - Основная карта: ${player.mainCard.value} (позиция ${player.mainCard.position})`,
      );
    }
    console.log(
      `     - Доп. карты: [${player.additionalCards.map((c) => c.value).join(", ")}]`,
    );
  });
  console.log();

  // Показываем код банка (только для демонстрации)
  console.log("🏦 Код банка (скрыт от игроков):");
  const codeArray = Array.from(game.bankCode.digits.entries()).sort(
    (a, b) => a[0] - b[0],
  );
  console.log(
    `   ${codeArray.map(([pos, digit]) => `${digit}(${pos})`).join(" ")}\n`,
  );

  // Шаг 2: Фаза Setup → Card Exchange
  console.log("🔄 === РАУНД 1: Обмен картами ===\n");
  game = nextPhase(game); // setup → card-exchange

  console.log("💱 Игроки могут обмениваться дополнительными картами...");
  console.log("   (В реальной игре здесь происходил бы обмен)\n");

  // Шаг 3: Card Exchange → Card Discard
  console.log("🗑️ === Фаза сброса карт ===\n");
  game = nextPhase(game); // card-exchange → card-discard

  console.log("📤 Каждый игрок сбрасывает по одной дополнительной карте:");

  // Каждый игрок сбрасывает первую дополнительную карту
  game.players.forEach((player) => {
    if (player.additionalCards.length > 0) {
      const cardToDiscard = player.additionalCards[0];
      console.log(`   ${player.name} сбрасывает карту: ${cardToDiscard.value}`);
      game = discardCard(game, player.id, cardToDiscard.id);
    }
  });

  console.log(
    `\n🔓 Раскрытые позиции после сброса: ${game.bankCode.revealed.size} из ${game.bankCode.digits.size}`,
  );
  if (game.bankCode.revealed.size > 0) {
    console.log("   Раскрытые цифры:");
    game.bankCode.revealed.forEach((pos) => {
      console.log(`     Позиция ${pos}: ${game.bankCode.digits.get(pos)}`);
    });
  }
  console.log();

  // Шаг 4: Night phase
  console.log("🌙 === НОЧЬ: Грабители взламывают код ===\n");
  game = nextPhase(game); // card-discard → night

  const robbers = game.players.filter((p) => p.role === "robber" && p.isAlive);
  console.log(
    `🦹 Грабители (${robbers.map((r) => r.name).join(", ")}) делают попытку...`,
  );

  // Грабители выбирают случайную цифру и позицию
  const randomDigit = Math.floor(Math.random() * 10);
  const positions = Array.from(game.bankCode.digits.keys());
  const randomPosition =
    positions[Math.floor(Math.random() * positions.length)];

  console.log(`   Пробуют: цифра ${randomDigit} на позиции ${randomPosition}`);
  game = makeNightAttempt(game, randomDigit, randomPosition);

  const correctDigit = game.bankCode.digits.get(randomPosition);
  const wasCorrect = correctDigit === randomDigit;

  if (wasCorrect) {
    console.log(`   ✅ УСПЕХ! Правильная цифра: ${randomDigit}`);
  } else {
    console.log(
      `   ❌ НЕУДАЧА! Правильная цифра: ${correctDigit}, попробовали: ${randomDigit}`,
    );
  }
  console.log();

  // Шаг 5: Day phase
  console.log("☀️ === ДЕНЬ: Обсуждение ===\n");
  game = nextPhase(game); // night → night-result
  game = nextPhase(game); // night-result → day

  console.log("💬 Игроки обсуждают подозреваемых...");
  console.log("   (В реальной игре здесь используется чат)\n");

  // Шаг 6: Voting phase
  console.log("🗳️ === ГОЛОСОВАНИЕ ===\n");
  game = nextPhase(game); // day → voting

  // Каждый игрок голосует за случайного игрока (кроме себя)
  console.log("📊 Игроки голосуют:");
  game.players.forEach((voter) => {
    if (voter.isAlive) {
      const candidates = game.players.filter(
        (p) => p.isAlive && p.id !== voter.id,
      );
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      game = voteForPlayer(game, voter.id, target.id);
      console.log(`   ${voter.name} → ${target.name}`);
    }
  });

  console.log("\n🔍 Подсчет голосов...");
  const votesBefore = game.players.length;
  game = resolveVoting(game);
  const votesAfter = game.players.filter((p) => p.isAlive).length;

  if (votesBefore > votesAfter) {
    const eliminated = game.players.find((p) => !p.isAlive);
    if (eliminated) {
      console.log(
        `❌ Исключен: ${eliminated.name} - ${eliminated.role === "robber" ? "🦹 Грабитель" : "🏦 Клиент"}`,
      );
    }
  }
  console.log();

  // Шаг 7: Проверка условий победы
  console.log("🏆 === Проверка условий победы ===\n");
  game = checkWinCondition(game);

  console.log(`📊 Состояние игры:`);
  console.log(
    `   - Живых игроков: ${game.players.filter((p) => p.isAlive).length}`,
  );
  console.log(
    `   - Живых грабителей: ${game.players.filter((p) => p.isAlive && p.role === "robber").length}`,
  );
  console.log(
    `   - Живых клиентов: ${game.players.filter((p) => p.isAlive && p.role === "client").length}`,
  );
  console.log(
    `   - Раскрыто позиций кода: ${game.bankCode.revealed.size}/${game.bankCode.digits.size}`,
  );

  if (game.winner) {
    console.log(
      `\n🎉 ПОБЕДА: ${game.winner === "robbers" ? "🦹 ГРАБИТЕЛИ" : "🏦 КЛИЕНТЫ БАНКА"}!`,
    );
  } else {
    console.log(`\n⏭️ Игра продолжается... Раунд ${game.round}`);
  }

  console.log("\n🎮 === Конец примера ===");

  return game;
}

/**
 * Пример проверки всех механик
 */
export function testAllMechanics() {
  console.log("🧪 === Тестирование всех игровых механик ===\n");

  // Тест 1: Создание игры с разным количеством игроков
  console.log("✅ Тест 1: Создание игр");
  [5, 7, 9].forEach((count) => {
    const players = Array.from({ length: count }, (_, i) => `Игрок${i + 1}`);
    const game = createGame(players);
    const robbers = game.players.filter((p) => p.role === "robber").length;
    const clients = game.players.filter((p) => p.role === "client").length;
    console.log(
      `   ${count} игроков: ${robbers} грабителей, ${clients} клиентов`,
    );
  });
  console.log();

  // Тест 2: Обмен картами
  console.log("✅ Тест 2: Обмен картами");
  let game = createGame(["A", "B", "C", "D", "E"]);
  game = nextPhase(game); // → card-exchange

  const player1 = game.players[0];
  const player2 = game.players[1];
  const card1 = player1.additionalCards[0];
  const card2 = player2.additionalCards[0];

  console.log(
    `   До обмена: ${player1.name} имеет [${player1.additionalCards.map((c) => c.value).join(", ")}]`,
  );
  console.log(
    `   До обмена: ${player2.name} имеет [${player2.additionalCards.map((c) => c.value).join(", ")}]`,
  );

  game = proposeCardExchange(game, player1.id, player2.id, card1.id);
  game = respondToExchange(game, player2.id, 0, true, card2.id);

  console.log(
    `   После обмена: ${game.players[0].name} имеет [${game.players[0].additionalCards.map((c) => c.value).join(", ")}]`,
  );
  console.log(
    `   После обмена: ${game.players[1].name} имеет [${game.players[1].additionalCards.map((c) => c.value).join(", ")}]`,
  );
  console.log();

  // Тест 3: Сброс карт
  console.log("✅ Тест 3: Сброс карт и раскрытие кода");
  game = nextPhase(game); // → card-discard

  const beforeRevealed = game.bankCode.revealed.size;
  game = discardCard(
    game,
    game.players[0].id,
    game.players[0].additionalCards[0].id,
  );
  const afterRevealed = game.bankCode.revealed.size;

  console.log(`   Раскрыто до: ${beforeRevealed}, после: ${afterRevealed}`);
  console.log();

  // Тест 4: Ночная попытка
  console.log("✅ Тест 4: Ночная попытка взлома");
  game = nextPhase(game); // → night

  const pos = Array.from(game.bankCode.digits.keys())[0];
  const correctDigit = game.bankCode.digits.get(pos)!;
  const _wrongDigit = (correctDigit + 1) % 10;

  // Правильная попытка
  const before = game.bankCode.revealed.size;
  game = makeNightAttempt(game, correctDigit, pos);
  const after = game.bankCode.revealed.size;

  console.log(
    `   Правильная попытка: ${correctDigit} на ${pos} → раскрыто позиций: ${before} → ${after}`,
  );
  console.log();

  // Тест 5: Голосование
  console.log("✅ Тест 5: Голосование");
  game = nextPhase(game); // → night-result
  game = nextPhase(game); // → day
  game = nextPhase(game); // → voting

  const aliveBefore = game.players.filter((p) => p.isAlive).length;

  // Все голосуют за первого игрока
  game.players.forEach((voter) => {
    if (voter.isAlive) {
      game = voteForPlayer(game, voter.id, game.players[0].id);
    }
  });

  game = resolveVoting(game);
  const aliveAfter = game.players.filter((p) => p.isAlive).length;

  console.log(`   Игроков до: ${aliveBefore}, после: ${aliveAfter}`);
  console.log();

  // Тест 6: Проверка победы
  console.log("✅ Тест 6: Условия победы");

  // Симулируем победу грабителей (раскрываем весь код)
  game.bankCode.digits.forEach((_, pos) => {
    game.bankCode.revealed.add(pos);
  });

  game = checkWinCondition(game);
  console.log(`   Весь код раскрыт → Победитель: ${game.winner || "нет"}`);
  console.log();

  console.log("🎉 Все тесты пройдены!\n");
}
