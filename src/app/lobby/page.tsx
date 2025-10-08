"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";

interface Room {
  id: number;
  name: string;
  host: string;
  players: number;
  maxPlayers: number;
  status: "waiting" | "playing" | "finished";
}

export default function Lobby() {
  const [createRoomModal, setCreateRoomModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "waiting" | "playing"
  >("all");

  // Mock data
  const [rooms] = useState<Room[]>([
    {
      id: 1,
      name: "Комната 1",
      host: "Игрок123",
      players: 3,
      maxPlayers: 8,
      status: "waiting",
    },
    {
      id: 2,
      name: "Быстрая игра",
      host: "ProGamer",
      players: 6,
      maxPlayers: 10,
      status: "playing",
    },
    {
      id: 3,
      name: "Новички приветствуются",
      host: "Helper",
      players: 2,
      maxPlayers: 6,
      status: "waiting",
    },
    {
      id: 4,
      name: "Профи лига",
      host: "Master",
      players: 8,
      maxPlayers: 8,
      status: "playing",
    },
    {
      id: 5,
      name: "Вечерняя игра",
      host: "NightOwl",
      players: 1,
      maxPlayers: 5,
      status: "waiting",
    },
  ]);

  const filteredRooms = rooms.filter(
    (room) => filterStatus === "all" || room.status === filterStatus,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "text-green-600 dark:text-green-400";
      case "playing":
        return "text-yellow-600 dark:text-yellow-400";
      case "finished":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Ожидание";
      case "playing":
        return "В игре";
      case "finished":
        return "Завершена";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-gray-700">
        <Link href="/">
          <h1 className="text-3xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
            💰 Ограбление Банка
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white">👤 Игрок123</span>
          <Button variant="secondary" size="sm">
            Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Title and Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Лобби</h2>
            <p className="text-gray-300">Выберите комнату или создайте новую</p>
          </div>
          <Button size="lg" onClick={() => setCreateRoomModal(true)}>
            + Создать комнату
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Все комнаты
          </button>
          <button
            onClick={() => setFilterStatus("waiting")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "waiting"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Ожидание игроков
          </button>
          <button
            onClick={() => setFilterStatus("playing")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "playing"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            В игре
          </button>
        </div>

        {/* Rooms List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} hover>
              <Link href={`/room/${room.id}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {room.name}
                    </h3>
                    <span
                      className={`text-sm font-semibold ${getStatusColor(room.status)}`}
                    >
                      {getStatusText(room.status)}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">👑 Хост:</span>
                      <span>{room.host}</span>
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">👥 Игроки:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {room.players}/{room.maxPlayers}
                        </span>
                      </p>

                      {/* Progress bar */}
                      <div className="flex-1 ml-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(room.players / room.maxPlayers) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    disabled={
                      room.status !== "waiting" ||
                      room.players >= room.maxPlayers
                    }
                  >
                    {room.players >= room.maxPlayers
                      ? "Полная"
                      : "Присоединиться"}
                  </Button>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-400">Комнаты не найдены</p>
          </div>
        )}
      </main>

      {/* Create Room Modal */}
      <Modal
        isOpen={createRoomModal}
        onClose={() => setCreateRoomModal(false)}
        title="Создать комнату"
      >
        <form className="space-y-4">
          <Input
            label="Название комнаты"
            type="text"
            placeholder="Введите название комнаты"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Максимум игроков
            </label>
            <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500">
              <option value="4">4 игрока</option>
              <option value="6">6 игроков</option>
              <option value="8">8 игроков</option>
              <option value="10">10 игроков</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="w-5 h-5" />
              <span>Приватная комната</span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setCreateRoomModal(false)}
            >
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Создать
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
