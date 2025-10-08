"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "./components/Button";
import Card from "./components/Card";
import Input from "./components/Input";
import Modal from "./components/Modal";

export default function Home() {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">💰 Ограбление Банка</h1>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLoginModal(true)}
          >
            Войти
          </Button>
          <Button size="sm" onClick={() => setRegisterModal(true)}>
            Регистрация
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-6">
            Онлайн-игра в реальном времени
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Интерактивная игра с подключением к комнатам, взаимодействием через
            чат и голосовую связь. Ведите статистику, распределяйте роли и
            контролируйте фазы игры.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/game/1">
              <Button size="lg">🎮 Играть сейчас</Button>
            </Link>
            <Link href="/rules">
              <Button variant="secondary" size="lg">
                📖 Правила
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Игровой процесс
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Создавайте комнаты, приглашайте друзей и играйте в захватывающую
                игру по ограблению банка
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Чат и голос
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Общайтесь с игроками через текстовый чат и голосовую связь в
                реальном времени
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Статистика
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Отслеживайте свою статистику побед, поражений и других
                достижений
              </p>
            </div>
          </Card>
        </div>

        {/* Game Rules */}
        <div className="mt-16">
          <Card>
            <h3 className="text-2xl font-bold mb-4 dark:text-white">
              📖 Правила игры
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-bold mb-2">Роли:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Гость - просмотр сайта</li>
                  <li>Игрок - участие в игре</li>
                  <li>Ведущий - управление игрой</li>
                  <li>Администратор - полный контроль</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">Возможности:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Создание и подключение к комнатам</li>
                  <li>Настройка параметров игры</li>
                  <li>Чат и голосовая связь</li>
                  <li>Распределение ролей и таймеров</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Login Modal */}
      <Modal
        isOpen={loginModal}
        onClose={() => setLoginModal(false)}
        title="Вход в систему"
      >
        <form className="space-y-4">
          <Input label="Email" type="email" placeholder="example@mail.com" />
          <Input label="Пароль" type="password" placeholder="••••••••" />
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Запомнить меня
              </span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Забыли пароль?
            </a>
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Нет аккаунта?{" "}
            <button
              type="button"
              onClick={() => {
                setLoginModal(false);
                setRegisterModal(true);
              }}
              className="text-blue-600 hover:underline"
            >
              Зарегистрироваться
            </button>
          </p>
        </form>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={registerModal}
        onClose={() => setRegisterModal(false)}
        title="Регистрация"
      >
        <form className="space-y-4">
          <Input label="Имя пользователя" type="text" placeholder="Username" />
          <Input label="Email" type="email" placeholder="example@mail.com" />
          <Input label="Пароль" type="password" placeholder="••••••••" />
          <Input
            label="Подтверждение пароля"
            type="password"
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              onClick={() => {
                setRegisterModal(false);
                setLoginModal(true);
              }}
              className="text-blue-600 hover:underline"
            >
              Войти
            </button>
          </p>
        </form>
      </Modal>
    </div>
  );
}
