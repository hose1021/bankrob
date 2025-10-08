// Утилиты для игры "Ограбление Банка"

import type { GamePhase, GameRole } from "./types";

/**
 * Форматирует время в секундах в формат MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Возвращает текстовое описание фазы игры
 */
export function getPhaseText(phase: GamePhase): string {
  const phases: Record<GamePhase, string> = {
    roleReveal: "🎭 Раскрытие ролей",
    planning: "📝 Планирование",
    action: "⚡ Действие",
    discussion: "💬 Обсуждение",
    voting: "🗳️ Голосование",
    results: "🏆 Результаты",
  };
  return phases[phase];
}

/**
 * Возвращает описание фазы игры
 */
export function getPhaseDescription(phase: GamePhase): string {
  const descriptions: Record<GamePhase, string> = {
    roleReveal: "Ознакомьтесь со своей ролью и подготовьтесь к игре",
    planning: "Грабители планируют ограбление, полиция готовит защиту",
    action: "Выполняйте свои действия согласно роли",
    discussion: "Обсуждайте произошедшие события и ищите подозреваемых",
    voting: "Голосуйте за игрока, которого хотите исключить",
    results: "Подведение итогов раунда",
  };
  return descriptions[phase];
}

/**
 * Возвращает CSS класс цвета для роли
 */
export function getRoleColor(role: GameRole): string {
  const colors: Record<string, string> = {
    Грабитель: "text-red-600 dark:text-red-400",
    Полицейский: "text-blue-600 dark:text-blue-400",
    Охранник: "text-yellow-600 dark:text-yellow-400",
    Заложник: "text-gray-600 dark:text-gray-400",
  };
  return colors[role] || "text-gray-600 dark:text-gray-400";
}

/**
 * Возвращает аватар для роли
 */
export function getRoleAvatar(role: GameRole): string {
  const avatars: Record<GameRole, string> = {
    Грабитель: "🦹",
    Полицейский: "👮",
    Охранник: "💂",
    Заложник: "🧑",
  };
  return avatars[role];
}

/**
 * Форматирует текущее время в формат HH:MM
 */
export function getCurrentTime(): string {
  return new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Генерирует случайный ID
 */
export function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Проверяет, заполнена ли комната
 */
export function isRoomFull(
  currentPlayers: number,
  maxPlayers: number,
): boolean {
  return currentPlayers >= maxPlayers;
}

/**
 * Возвращает процент заполнения комнаты
 */
export function getRoomFillPercentage(
  currentPlayers: number,
  maxPlayers: number,
): number {
  return Math.round((currentPlayers / maxPlayers) * 100);
}
