"use client";

import { toRoman } from "../lib/game-logic";
import type { Card } from "../lib/game-types";

interface GameCardProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
}

export default function GameCard({
  card,
  onClick,
  selected = false,
}: GameCardProps) {
  const isRobberCard = card.isRobber;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`
        relative w-32 h-48 rounded-xl cursor-pointer
        transform transition-all duration-300
        ${selected ? "scale-110 ring-4 ring-yellow-400" : "hover:scale-105"}
        ${onClick ? "cursor-pointer" : "cursor-default"}
      `}
    >
      <div
        className={`
        w-full h-full rounded-xl p-4 flex flex-col items-center justify-center
        shadow-2xl border-4
        ${
          isRobberCard
            ? "bg-gradient-to-br from-red-600 to-red-800 border-red-900"
            : "bg-gradient-to-br from-blue-600 to-blue-800 border-blue-900"
        }
      `}
      >
        {isRobberCard ? (
          <>
            <div className="text-6xl mb-2">🦹</div>
            <div className="text-white font-bold text-lg text-center">
              Грабитель
            </div>
          </>
        ) : card.type === "main" ? (
          <>
            <div className="text-7xl font-bold text-white mb-2">
              {card.value}
            </div>
            <div className="text-white font-bold text-2xl">
              {card.position ? toRoman(card.position) : ""}
            </div>
            <div className="text-white/80 text-xs mt-2">Клиент банка</div>
          </>
        ) : (
          <>
            <div className="text-8xl font-bold text-white">{card.value}</div>
            <div className="text-white/80 text-xs mt-2">Дополнительная</div>
          </>
        )}

        {card.type === "main" && (
          <div className="absolute top-2 right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-black font-bold text-sm">★</span>
          </div>
        )}
      </div>
    </button>
  );
}
