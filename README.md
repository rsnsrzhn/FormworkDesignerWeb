# FormworkDesigner

Сайт приложения для расчёта и чертежей опалубки. React, TypeScript, Vite, Node.js 24, npm. Страницы генерируются в HTML; внутренние переходы работают без перезагрузки. Заявки отправляются сервером через Resend.

## Разработка

```bash
npm ci
npm run dev
```

http://localhost:5173. Остановка — Ctrl+C. Локальные переменные — в `.env`, образец — `.env.example`. `.env` не коммитится.

## Проверка сборки

```bash
npm run build
npm run preview
```

http://localhost:4173. Preview использует тот же API заявок. После изменения `.env` перезапустите сервер. Для ручного теста письма заполните форму на `/contact`.

```bash
npm test
npm run test:browser
npm run format:check
npm run deploy:check
```

## Публикация

[Пошаговая инструкция Vercel и почты](DEPLOY.md). Vercel: Node 24, `npm ci`, `npm run build`, output `dist`. Переменные задаются в настройках проекта. Приём писем требует Resend API key, отправителя и получателя; данные оператора публикуются на правовых страницах. Hobby предназначен для личного некоммерческого использования.

Продуктовые сведения — [PRODUCT.md](PRODUCT.md), визуальная система — [DESIGN.md](DESIGN.md). История проверок — `docs/redesign-verification.md`.
