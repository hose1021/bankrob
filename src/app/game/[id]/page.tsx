"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BankCodeDisplay from "../../components/BankCodeDisplay";
import Button from "../../components/Button";
import Card from "../../components/Card";
import GameCard from "../../components/GameCard";
import {
  checkWinCondition,
  createGame,
  discardCard,
  getPhaseInfo,
  makeNightAttempt,
  nextPhase,
  resolveVoting,
  toRoman,
  voteForPlayer,
} from "../../lib/game-logic";
import type { GameState } from "../../lib/game-types";

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState(1);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [messages, setMessages] = useState<
    Array<{ author: string; text: string; isSystem?: boolean }>
  >([]);
  const [newMessage, setNewMessage] = useState("");

  // Инициализация игры
  useEffect(() => {
    const playerNames = ["Игрок1", "Игрок2", "Игрок3", "Игрок4", "Игрок5"];
    const initialGame = createGame(playerNames);
    setGameState(initialGame);
    setMessages(prev => [...prev, { 
      author: 'Система', 
      text: 'Игра началась! Роли розданы.', 
      isSystem: true 
    }]);
  }, []);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Загрузка игры...
      </div>
    );
  }

  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);
  const alivePlayers = gameState.players.filter((p) => p.isAlive);
  const phaseInfo = getPhaseInfo(gameState.phase);

  function addSystemMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { author: "Система", text, isSystem: true },
    ]);
  }

  function handleNextPhase() {
    let newState = nextPhase(gameState);
    newState = checkWinCondition(newState);
    setGameState(newState);
    addSystemMessage(`Начинается фаза: ${getPhaseInfo(newState.phase).title}`);
  }

  function handleDiscardCard() {
    if (!selectedCard || !currentPlayer) return;

    try {
      const newState = discardCard(gameState, currentPlayerId, selectedCard);
      setGameState(newState);
      setSelectedCard(null);
      addSystemMessage(`${currentPlayer.name} сбросил карту`);
    } catch (error) {
      alert((error as Error).message);
    }
  }

  function handleNightAttempt() {
    if (selectedDigit === null || selectedPosition === null) {
      alert("Выберите цифру и позицию");
      return;
    }

    try {
      const newState = makeNightAttempt(
        gameState,
        selectedDigit,
        selectedPosition,
      );
      const correctDigit = newState.bankCode.digits.get(selectedPosition);
      const isCorrect = correctDigit === selectedDigit;

      setGameState(newState);
      setSelectedDigit(null);
      setSelectedPosition(null);

      if (isCorrect) {
        addSystemMessage(
          `✅ Грабители угадали! Позиция ${toRoman(selectedPosition)}: ${selectedDigit}`,
        );
      } else {
        addSystemMessage(
          `❌ Грабители ошиблись. Позиция ${toRoman(selectedPosition)}: ${selectedDigit} (неверно)`,
        );
      }
    } catch (error) {
      alert((error as Error).message);
    }
  }

  function handleVote() {
    if (!selectedPlayer) {
      alert("Выберите игрока для голосования");
      return;
    }

    try {
      let newState = voteForPlayer(gameState, currentPlayerId, selectedPlayer);

      // Проверяем, все ли проголосовали
      if (newState.dayVotes.size === alivePlayers.length) {
        newState = resolveVoting(newState);
        const eliminatedPlayer = newState.players.find(
          (p) =>
            !p.isAlive &&
            gameState.players.find((op) => op.id === p.id)?.isAlive,
        );
        if (eliminatedPlayer) {
          addSystemMessage(
            `${eliminatedPlayer.name} был исключен голосованием! Роль: ${eliminatedPlayer.role === "robber" ? "Грабитель" : "Клиент банка"}`,
          );
        }
      }

      setGameState(newState);
      setSelectedPlayer(null);
    } catch (error) {
      alert((error as Error).message);
    }
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (newMessage.trim() && currentPlayer) {
      setMessages([
        ...messages,
        { author: currentPlayer.name, text: newMessage },
      ]);
      setNewMessage("");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-700 bg-black/30">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">💰 Ограбление Банка</h1>
          <div className="px-4 py-2 bg-purple-600 rounded-lg">
            <span className="text-white font-bold">
              Раунд {gameState.round}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <select
              value={currentPlayerId}
              onChange={(e) => setCurrentPlayerId(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold"
            >
              {gameState.players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => router.push("/lobby")}
          >
            Выйти
          </Button>
        </div>
      </header>

      {/* Game Phase Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-4">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-1">
            {phaseInfo.title}
          </h2>
          <p className="text-white/90">{phaseInfo.description}</p>
        </div>
      </div>

      <main className="container mx-auto px-6 py-6">
        {/* Game Over Screen */}
        {gameState.phase === "game-over" && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="max-w-2xl w-full text-center">
              <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                🏆 Игра окончена!
              </h2>
              <div className="text-3xl mb-6">
                {gameState.winner === "robbers" ? (
                  <div className="text-red-600">🦹 Победили грабители!</div>
                ) : (
                  <div className="text-blue-600">
                    🏦 Победили клиенты банка!
                  </div>
                )}
              </div>
              <BankCodeDisplay bankCode={gameState.bankCode} showAll={true} />
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Результаты:
                </h3>
                {gameState.players.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3 rounded-lg ${p.isAlive ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                  >
                    <span className="font-semibold">{p.name}</span> -{" "}
                    {p.role === "robber" ? "🦹 Грабитель" : "🏦 Клиент"} -{" "}
                    {p.isAlive ? "✓ Жив" : "✗ Выбыл"}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-4">
                <Button
                  className="flex-1"
                  onClick={() => router.push("/lobby")}
                >
                  Вернуться в лобби
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  Новая игра
                </Button>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Player Info */}
          <div className="space-y-4">
            {/* Current Player Card */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Ваша роль
              </h3>
              {currentPlayer && (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-5xl mb-2">
                      {currentPlayer.role === "robber" ? "🦹" : "🏦"}
                    </div>
                    <div
                      className={`text-xl font-bold ${currentPlayer.role === "robber" ? "text-red-600" : "text-blue-600"}`}
                    >
                      {currentPlayer.role === "robber"
                        ? "Грабитель"
                        : "Клиент банка"}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Основная карта:
                    </h4>
                    <div className="flex justify-center">
                      <GameCard card={currentPlayer.mainCard} />
                    </div>
                  </div>

                  {currentPlayer.additionalCards.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Дополнительные карты:
                      </h4>
                      <div className="flex gap-2 justify-center flex-wrap">
                        {currentPlayer.additionalCards.map((card) => (
                          <div key={card.id} className="transform scale-75">
                            <GameCard
                              card={card}
                              onClick={() => setSelectedCard(card.id)}
                              selected={selectedCard === card.id}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Players List */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Игроки ({alivePlayers.length}/{gameState.players.length})
              </h3>
              <div className="space-y-2">
                {gameState.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      player.isAlive
                        ? selectedPlayer === player.id
                          ? "bg-yellow-200 dark:bg-yellow-700 ring-2 ring-yellow-400"
                          : "bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
                        : "bg-gray-300 dark:bg-gray-800 opacity-50"
                    }`}
                    onClick={() =>
                      player.isAlive && setSelectedPlayer(player.id)
                    }
                  >
                    <span className="text-xl">
                      {player.role === "robber" ? "🦹" : "🏦"}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {player.name}
                      </div>
                      {!player.isAlive && (
                        <div className="text-xs text-red-600">Выбыл</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center Column - Game Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Bank Code */}
            <BankCodeDisplay
              bankCode={gameState.bankCode}
              showAll={gameState.phase === "game-over"}
            />

            {/* Game Actions */}
            <Card className="min-h-[400px]">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Игровые действия
              </h3>

              {gameState.phase === "setup" && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎭</div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Роли розданы, карты выданы. Изучите свою роль и карты.
                  </p>
                  <Button onClick={handleNextPhase}>Начать игру</Button>
                </div>
              )}

              {gameState.phase === "card-exchange" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      Выберите дополнительную карту и игрока для обмена. Это
                      происходит только в первом раунде.
                    </p>
                  </div>
                  {selectedCard && selectedPlayer && (
                    <Button
                      onClick={() => {
                        addSystemMessage(
                          `${currentPlayer?.name} предлагает обмен`,
                        );
                        setSelectedCard(null);
                        setSelectedPlayer(null);
                      }}
                    >
                      Предложить обмен
                    </Button>
                  )}
                  <Button variant="secondary" onClick={handleNextPhase}>
                    Пропустить обмен
                  </Button>
                </div>
              )}

              {gameState.phase === "card-discard" && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      Выберите одну дополнительную карту для сброса. Если цифра
                      совпадает с кодом, она будет раскрыта!
                    </p>
                  </div>
                  {selectedCard && (
                    <Button onClick={handleDiscardCard}>
                      Сбросить выбранную карту
                    </Button>
                  )}
                  {currentPlayer && currentPlayer.additionalCards.length === 1 && (
                    <div className="mt-4">
                      <p className="text-green-600 dark:text-green-400 mb-3 font-semibold">
                        ✓ Вы сбросили карту!
                      </p>
                      <Button onClick={handleNextPhase} variant="secondary">
                        Продолжить к ночной фазе →
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {gameState.phase === "night" &&
                currentPlayer?.role === "robber" && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                      <p className="text-gray-800 dark:text-gray-200 mb-4">
                        Выберите цифру и позицию для взлома кода:
                      </p>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Цифра:</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                            <button
                              key={digit}
                              onClick={() => setSelectedDigit(digit)}
                              className={`p-3 rounded-lg font-bold text-xl ${
                                selectedDigit === digit
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {digit}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Позиция:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {Array.from(gameState.bankCode.digits.keys()).map(
                            (pos) => (
                              <button
                                key={pos}
                                onClick={() => setSelectedPosition(pos)}
                                className={`px-4 py-2 rounded-lg font-bold ${
                                  selectedPosition === pos
                                    ? "bg-yellow-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                {toRoman(pos)}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedDigit !== null && selectedPosition !== null && (
                      <Button onClick={handleNightAttempt}>
                        Подобрать код: {selectedDigit} на позиции{" "}
                        {toRoman(selectedPosition)}
                      </Button>
                    )}
                    
                    {gameState.nightAttempts.length > 0 && selectedDigit === null && selectedPosition === null && (
                      <div className="mt-4">
                        <p className="text-green-600 dark:text-green-400 mb-3 font-semibold">
                          ✓ Попытка взлома сделана!
                        </p>
                        <Button onClick={handleNextPhase} variant="secondary">
                          Продолжить к дню →
                        </Button>
                      </div>
                    )}
                  </div>
                )}

              {gameState.phase === "night" &&
                currentPlayer?.role === "client" && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 animate-pulse">🌙</div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Ночь... Грабители работают над взломом кода.
                    </p>
                    {gameState.nightAttempts.length > 0 && (
                      <div className="mt-6">
                        <p className="text-white mb-3">Грабители сделали свой ход...</p>
                        <Button onClick={handleNextPhase} variant="secondary">
                          Продолжить к дню →
                        </Button>
                      </div>
                    )}
                  </div>
                )}

              {gameState.phase === "day" && (
                <div className="space-y-4">
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      Обсуждайте в чате и выбирайте подозреваемого для
                      голосования
                    </p>
                  </div>
                  <Button onClick={handleNextPhase} variant="secondary">
                    Перейти к голосованию
                  </Button>
                </div>
              )}

              {gameState.phase === "voting" && (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      Выберите игрока для исключения (слева в списке игроков)
                    </p>
                  </div>
                  {selectedPlayer && selectedPlayer !== currentPlayerId && (
                    <Button onClick={handleVote}>
                      Голосовать за{" "}
                      {
                        gameState.players.find((p) => p.id === selectedPlayer)
                          ?.name
                      }
                    </Button>
                  )}
                </div>
              )}

              {(gameState.phase === "night-result" ||
                gameState.phase === "day-result") && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Результаты фазы показаны в чате
                  </p>
                  <Button onClick={handleNextPhase}>Продолжить</Button>
                </div>
              )}

              {/* Discarded Cards */}
              {gameState.discardedCards.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Сброшенные карты:
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {gameState.discardedCards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg font-bold"
                      >
                        {card.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Chat */}
          <div>
            <Card className="h-[600px] flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                💬 Чат
              </h3>

              <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {messages.map((msg, idx) => (
                  <div
                    key={`msg-${idx}-${msg.author}-${msg.text.substring(0, 20)}`}
                    className={`p-2 rounded-lg text-sm ${
                      msg.isSystem
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-center font-semibold"
                        : msg.author === currentPlayer?.name
                          ? "bg-blue-100 dark:bg-blue-900 ml-2"
                          : "bg-gray-100 dark:bg-gray-700 mr-2"
                    }`}
                  >
                    {!msg.isSystem && (
                      <div className="font-semibold text-xs mb-1">
                        {msg.author}
                      </div>
                    )}
                    <p className="text-gray-800 dark:text-gray-200">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Сообщение..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <Button type="submit" size="sm">
                  📤
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
