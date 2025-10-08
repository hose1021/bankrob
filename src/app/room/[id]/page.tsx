"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";

interface Player {
  id: number;
  name: string;
  role?: string;
  ready: boolean;
  isHost: boolean;
}

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [players] = useState<Player[]>([
    { id: 1, name: "Игрок123", ready: true, isHost: true },
    { id: 2, name: "ProGamer", ready: true, isHost: false },
    { id: 3, name: "Helper", ready: false, isHost: false },
  ]);

  const [settings, setSettings] = useState({
    playerCount: 8,
    roundTime: 10,
    roles: 5,
    discussionTime: 3,
  });

  const [messages, setMessages] = useState([
    { id: 1, author: "Игрок123", text: "Всем привет!", time: "14:20" },
    {
      id: 2,
      author: "ProGamer",
      text: "Привет! Готовы играть?",
      time: "14:21",
    },
    { id: 3, author: "Helper", text: "Да, давайте начнем", time: "14:22" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const currentUser = "Игрок123";
  const isHost = players.find((p) => p.name === currentUser)?.isHost ?? false;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          author: currentUser,
          text: newMessage,
          time: new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  const handleStartGame = () => {
    router.push(`/game/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-gray-700">
        <Link href="/lobby">
          <h1 className="text-3xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
            💰 Ограбление Банка
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white">👤 {currentUser}</span>
          <Link href="/lobby">
            <Button variant="danger" size="sm">
              Покинуть комнату
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Players and Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Info */}
            <Card>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Комната #{params.id}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ожидание игроков... ({players.length}/{settings.playerCount})
              </p>
            </Card>

            {/* Players List */}
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                👥 Игроки
              </h3>
              <div className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${player.ready ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {player.name}
                        {player.isHost && " 👑"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {player.ready ? "✓ Готов" : "Не готов"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Game Settings */}
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ⚙️ Настройки игры
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Количество игроков
                  </label>
                  <input
                    type="number"
                    value={settings.playerCount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        playerCount: Number(e.target.value),
                      })
                    }
                    disabled={!isHost}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    min="4"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Количество ролей
                  </label>
                  <input
                    type="number"
                    value={settings.roles}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        roles: Number(e.target.value),
                      })
                    }
                    disabled={!isHost}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    min="3"
                    max="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Время раунда (мин)
                  </label>
                  <input
                    type="number"
                    value={settings.roundTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        roundTime: Number(e.target.value),
                      })
                    }
                    disabled={!isHost}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    min="5"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Время обсуждения (мин)
                  </label>
                  <input
                    type="number"
                    value={settings.discussionTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        discussionTime: Number(e.target.value),
                      })
                    }
                    disabled={!isHost}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              {!isHost && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Только хост может изменять настройки
                </p>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isHost ? (
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleStartGame}
                  disabled={players.filter((p) => p.ready).length < 3}
                >
                  🎮 Начать игру
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="flex-1"
                  variant={
                    players.find((p) => p.name === currentUser)?.ready
                      ? "secondary"
                      : "primary"
                  }
                >
                  {players.find((p) => p.name === currentUser)?.ready
                    ? "✓ Готов"
                    : "Я готов!"}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                💬 Чат
              </h3>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.author === currentUser
                        ? "bg-blue-100 dark:bg-blue-900 ml-4"
                        : "bg-gray-100 dark:bg-gray-700 mr-4"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {msg.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
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
