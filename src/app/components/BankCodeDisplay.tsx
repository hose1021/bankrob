"use client";

import { toRoman } from "../lib/game-logic";
import type { BankCode } from "../lib/game-types";

interface BankCodeDisplayProps {
  bankCode: BankCode;
  showAll?: boolean;
}

export default function BankCodeDisplay({
  bankCode,
  showAll = false,
}: BankCodeDisplayProps) {
  const positions = Array.from(bankCode.digits.keys()).sort((a, b) => a - b);

  return (
    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 shadow-2xl">
      <h3 className="text-center text-white font-bold text-2xl mb-4">
        🏦 Код банка
      </h3>
      <div className="flex gap-2 justify-center flex-wrap">
        {positions.map((position) => {
          const digit = bankCode.digits.get(position);
          const isRevealed = bankCode.revealed.has(position) || showAll;

          return (
            <div key={position} className="flex flex-col items-center">
              <div
                className={`
                w-16 h-20 rounded-lg flex flex-col items-center justify-center
                font-bold shadow-lg
                ${
                  isRevealed
                    ? "bg-white text-gray-900"
                    : "bg-gray-800 text-gray-800"
                }
              `}
              >
                <div className="text-3xl">{isRevealed ? digit : "?"}</div>
              </div>
              <div className="text-white text-sm mt-1 font-semibold">
                {toRoman(position)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-white/90 text-sm mt-4">
        Раскрыто: {bankCode.revealed.size} из {bankCode.digits.size}
      </div>
    </div>
  );
}
