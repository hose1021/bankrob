# 🚀 Деплой на GitHub Pages

## Автоматический деплой

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Шаги для настройки:

1. **Пуш кода в GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **Настройка GitHub Pages:**
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите "GitHub Actions"
   - Workflow автоматически запустится при пуше в `main`

3. **Проверка деплоя:**
   - Перейдите во вкладку "Actions" в репозитории
   - Дождитесь завершения workflow
   - Ваш сайт будет доступен по адресу:
     ```
     https://<username>.github.io/<repository-name>/
     ```

## Ручной деплой

Если нужно собрать и задеплоить вручную:

```bash
# 1. Установить зависимости
npm install

# 2. Собрать проект
NEXT_PUBLIC_BASE_PATH=/bankrob npm run build

# 3. Папка out/ готова к деплою
```

## Локальное тестирование продакшен сборки

```bash
# Собрать проект
npm run build

# Установить serve (если еще не установлен)
npm install -g serve

# Запустить статический сервер
serve out
```

## Переменные окружения

- `NEXT_PUBLIC_BASE_PATH` - базовый путь для GitHub Pages (автоматически устанавливается в `/<repo-name>`)

## Требования

- Node.js 18+
- npm или yarn
- GitHub репозиторий с включенными GitHub Pages

## Структура деплоя

```
repository/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── out/                     # Собранные статические файлы (создается при сборке)
├── public/
│   └── .nojekyll           # Отключает обработку Jekyll в GitHub Pages
└── next.config.ts          # Конфигурация для статического экспорта
```

## Troubleshooting

### Проблема: 404 при переходе по ссылкам

**Решение:** GitHub Pages не поддерживает динамическую маршрутизацию. Используйте хеш-маршрутизацию или настройте SPA fallback.

### Проблема: Ресурсы не загружаются

**Решение:** Убедитесь, что `basePath` правильно настроен в `next.config.ts`

### Проблема: Workflow падает с ошибкой

**Решение:** Проверьте:
1. Permissions в Settings → Actions → General
2. Включены ли GitHub Pages в Settings → Pages
3. Логи в разделе Actions

## Дополнительная информация

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)

