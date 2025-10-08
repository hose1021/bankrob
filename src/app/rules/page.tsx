"use client";

import Link from "next/link";
import Button from "../components/Button";
import Card from "../components/Card";
import GameCard from "../components/GameCard";

export default function RulesPage() {
  // Примеры карт
  const robberCard = {
    id: "example-robber",
    type: "main" as const,
    isRobber: true,
  };

  const clientCard = {
    id: "example-client",
    type: "main" as const,
    value: 5,
    position: 2,
    isRobber: false,
  };

  const additionalCard = {
    id: "example-additional",
    type: "additional" as const,
    value: 7,
    isRobber: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-gray-700">
        <Link href="/">
          <h1 className="text-3xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
            💰 Ограбление Банка
          </h1>
        </Link>
        <Link href="/">
          <Button variant="secondary" size="sm">
            На главную
          </Button>
        </Link>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            📖 Правила игры
          </h2>
          <p className="text-xl text-gray-300">
            Полное руководство по игре "Ограбление Банка"
          </p>
        </div>

        <div className="space-y-8">
          {/* Основная информация */}
          <Card>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 Цель игры
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                  🦹 Грабители
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Взломать код банка, подобрав все цифры и их позиции до того,
                  как будут найдены клиентами банка.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  🏦 Клиенты банка
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Найти всех грабителей через голосование и защитить свою цифру
                  кода от раскрытия.
                </p>
              </div>
            </div>
          </Card>

          {/* Количество игроков */}
          <Card>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              👥 Количество игроков
            </h3>
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 font-bold">Всего игроков</th>
                  <th className="p-3 font-bold">Грабители 🦹</th>
                  <th className="p-3 font-bold">Клиенты 🏦</th>
                  <th className="p-3 font-bold">Длина кода</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b dark:border-gray-700">
                  <td className="p-3">5</td>
                  <td className="p-3">2 (40%)</td>
                  <td className="p-3">3 (60%)</td>
                  <td className="p-3">3 цифры</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="p-3">7</td>
                  <td className="p-3">3 (43%)</td>
                  <td className="p-3">4 (57%)</td>
                  <td className="p-3">4 цифры</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="p-3">9</td>
                  <td className="p-3">4 (44%)</td>
                  <td className="p-3">5 (56%)</td>
                  <td className="p-3">5 цифр</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="p-3">11</td>
                  <td className="p-3">5 (45%)</td>
                  <td className="p-3">6 (55%)</td>
                  <td className="p-3">6 цифр</td>
                </tr>
                <tr>
                  <td className="p-3">13</td>
                  <td className="p-3">6 (46%)</td>
                  <td className="p-3">7 (54%)</td>
                  <td className="p-3">7 цифр</td>
                </tr>
              </tbody>
            </table>
          </Card>

          {/* Карты */}
          <Card>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🃏 Система карт
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Каждый игрок получает <strong>3 карты</strong>: 1 основную и 2
              дополнительные
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-center mb-3 text-gray-900 dark:text-white">
                  Карта грабителя
                </h4>
                <div className="flex justify-center mb-3">
                  <GameCard card={robberCard} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Основная карта. Определяет роль "Грабитель"
                </p>
              </div>

              <div>
                <h4 className="font-bold text-center mb-3 text-gray-900 dark:text-white">
                  Карта клиента
                </h4>
                <div className="flex justify-center mb-3">
                  <GameCard card={clientCard} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Основная карта. Цифра 5 на позиции II (вторая)
                </p>
              </div>

              <div>
                <h4 className="font-bold text-center mb-3 text-gray-900 dark:text-white">
                  Дополнительная
                </h4>
                <div className="flex justify-center mb-3">
                  <GameCard card={additionalCard} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Только цифра. Для обмена и сброса
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-gray-900 dark:text-white">
                💡 Важно о дополнительных картах:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Часть карт содержат цифры из кода банка</li>
                <li>Грабители стараются запомнить их при обмене</li>
                <li>Клиенты ищут карту со своей цифрой для защиты</li>
              </ul>
            </div>
          </Card>

          {/* Фазы игры */}
          <Card>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎮 Фазы игры
            </h3>

            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  1️⃣ Обмен картами (только 1-й раунд)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Игроки могут обмениваться{" "}
                  <strong>только дополнительными</strong> картами.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    <strong>Грабители:</strong> запоминают карты, ищут цифры
                    кода
                  </li>
                  <li>
                    <strong>Клиенты:</strong> ищут карту со своей цифрой
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  2️⃣ Сброс карты
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Каждый игрок сбрасывает 1 дополнительную карту.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                  ⚠️ Если цифра совпадает с кодом — она раскрывается для всех!
                </p>
              </div>

              <div className="bg-gray-800 text-white p-4 rounded-lg">
                <h4 className="text-xl font-bold mb-2">3️⃣ Ночь 🌙</h4>
                <p className="mb-2">
                  <strong>Грабители</strong> подбирают код:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Выбирают цифру (0-9)</li>
                  <li>Выбирают позицию (I, II, III, ...)</li>
                  <li>Если угадали → позиция раскрывается</li>
                  <li>Если ошиблись → попытка потрачена</li>
                </ul>
                <p className="mt-2 text-sm text-gray-300">
                  <strong>Клиенты</strong> ждут и не видят процесс взлома
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h4 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  4️⃣ День ☀️
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Обсуждение и поиск подозреваемых:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Анализ поведения игроков</li>
                  <li>Обсуждение сброшенных карт</li>
                  <li>Поиск противоречий в словах</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                  5️⃣ Голосование 🗳️
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Каждый игрок голосует за одного подозреваемого.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Игрок с наибольшим количеством голосов исключается, его роль
                  раскрывается.
                </p>
              </div>
            </div>
          </Card>

          {/* Победа */}
          <Card>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🏆 Условия победы
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-lg border-4 border-red-500">
                <h4 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3 text-center">
                  🦹 Грабители побеждают
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Взломали весь код (все позиции раскрыты)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Один из игроков днем набрал полный код</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-lg border-4 border-blue-500">
                <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3 text-center">
                  🏦 Клиенты побеждают
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Все грабители исключены голосованием</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Грабитель при проверке назвал неверный код</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Стратегии */}
          <Card>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              💡 Советы по стратегии
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3">
                  🦹 Для грабителей:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ Запоминайте карты при обмене</li>
                  <li>✓ Анализируйте сброшенные карты</li>
                  <li>✓ Действуйте скоординированно ночью</li>
                  <li>✓ Маскируйтесь под клиентов днем</li>
                  <li>✓ Не раскрывайте знание кода рано</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                  🏦 Для клиентов:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ Защищайте свою цифру кода</li>
                  <li>✓ Ищите при обмене карту со своей цифрой</li>
                  <li>✓ Анализируйте поведение игроков</li>
                  <li>✓ Координируйтесь при голосовании</li>
                  <li>✓ Следите за ночными попытками</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Пример кода */}
          <Card>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📊 Пример кода банка
            </h3>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 mb-4">
              <div className="flex gap-4 justify-center mb-4">
                {[
                  { pos: "I", digit: "3" },
                  { pos: "II", digit: "5" },
                  { pos: "III", digit: "6" },
                  { pos: "IV", digit: "7" },
                ].map(({ pos, digit }) => (
                  <div key={pos} className="text-center">
                    <div className="bg-white rounded-lg w-16 h-20 flex items-center justify-center text-4xl font-bold text-gray-900 shadow-lg">
                      {digit}
                    </div>
                    <div className="text-white font-bold mt-2">{pos}</div>
                  </div>
                ))}
              </div>
              <p className="text-center text-white text-lg font-semibold">
                Код: 3567
              </p>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2">Позиция</th>
                  <th className="p-2">Цифра</th>
                  <th className="p-2">Игрок (клиент)</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b dark:border-gray-700">
                  <td className="p-2 text-center">I</td>
                  <td className="p-2 text-center">3</td>
                  <td className="p-2 text-center">Клиент 1</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="p-2 text-center">II</td>
                  <td className="p-2 text-center">5</td>
                  <td className="p-2 text-center">Клиент 2</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="p-2 text-center">III</td>
                  <td className="p-2 text-center">6</td>
                  <td className="p-2 text-center">Клиент 3</td>
                </tr>
                <tr>
                  <td className="p-2 text-center">IV</td>
                  <td className="p-2 text-center">7</td>
                  <td className="p-2 text-center">Клиент 4</td>
                </tr>
              </tbody>
            </table>
          </Card>

          {/* CTA */}
          <div className="text-center py-8">
            <h3 className="text-3xl font-bold text-white mb-6">
              Готовы играть?
            </h3>
            <div className="flex gap-4 justify-center">
              <Link href="/game/1">
                <Button size="lg">🎮 Попробовать игру</Button>
              </Link>
              <Link href="/lobby">
                <Button size="lg" variant="secondary">
                  📋 К списку комнат
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
