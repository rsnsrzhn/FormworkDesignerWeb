# Запуск и деплой

## Проверить письмо на своём компьютере

1. Создайте аккаунт на https://resend.com с адресом, на который хотите получить тестовое письмо.
2. В Resend → API Keys создайте ключ с разрешением отправки.
3. Заполните локальный `.env`:

```dotenv
ACCEPT_INQUIRIES=true
RESEND_API_KEY=ваш_ключ
INQUIRY_FROM=onboarding@resend.dev
INQUIRY_TO=адрес_аккаунта_Resend
```

Тестовый отправитель `onboarding@resend.dev` отправляет только на email вашего аккаунта Resend. Для другого получателя подтвердите собственный домен в Resend и используйте отправителя с него: https://resend.com/docs/knowledge-base/403-error-resend-dev-domain . Адрес сайта *.vercel.app не является вашим доменом отправки.

4. Выполните:

```bash
npm run build
npm run preview
```

5. Откройте http://localhost:4173/contact, заполните своими контактами, отметьте согласие, нажмите «Отправить заявку». Проверьте Входящие/Спам и Resend → Emails. После изменения .env перезапустите preview. Остановка — Ctrl+C.

Схема: браузер → `/api/inquiries` → сервер → Resend → `INQUIRY_TO`. Пароль от ящика не нужен. Успех формы означает подтверждение приёма письма Resend, а не прочтение письма получателем. Статус delivered/bounced виден в Resend. Контакт клиента указан в Reply-To.

## Переменные

| Имя | Значение |
|---|---|
| ACCEPT_INQUIRIES | true для отправки, false для выключения |
| RESEND_API_KEY | Секретный ключ отправки Resend |
| INQUIRY_FROM | Отправитель: тестовый Resend или адрес вашего подтверждённого домена |
| INQUIRY_TO | Ваш получатель заявок |
| SITE_URL | Основной HTTPS адрес сайта без пути; можно задать после первого Deploy |
| OPERATOR_NAME | Имя/наименование оператора данных |
| OPERATOR_ADDRESS | Адрес оператора |
| PRIVACY_EMAIL | Контакт по персональным данным |
| DATA_RETENTION_PERIOD | Установленный вами срок обработки заявок и начало его исчисления |
| DATA_PROCESSORS | Фактические уполномоченные лица |
| DATA_TRANSFER_DETAILS | Фактические страны, условия и основание передачи |
| POLICY_VERSION | Версия условий согласия, например дата утверждения |
| PUBLIC_ORIGIN | Обычно оставить пустым |

Данные оператора и условия обработки публичны. Ключ Resend и адрес получателя остаются серверными. Не используйте VITE_ для секретов. Эти поля подставляют фактические сведения в правовые страницы; обработчик почты от них не зависит. Пустые поля не заменяются вымышленными данными.

## Vercel с адресом *.vercel.app

Hobby разрешён только для личного некоммерческого использования. Для коммерческого лендинга выберите подходящий тариф: https://vercel.com/docs/plans/hobby . Бесплатный адрес *.vercel.app выдаётся проекту независимо от наличия собственного домена.

1. Отправьте коммиты в свой репозиторий: `git push -u origin HEAD` (origin должен указывать на ваш репозиторий).
2. Vercel → Add New → Project → Import Git Repository → выберите репозиторий.
3. Root Directory — корень проекта. Framework — Vite. Node — 24.x. Install — `npm ci`. Build — `npm run build`. Output — `dist`. Конфигурация уже в vercel.json.
4. Откройте Environment Variables в форме импорта либо после импорта Settings → Environment Variables. Добавьте переменные из таблицы для **Production**. Вводите значения без обрамляющих кавычек. `.env` с компьютера через Git не переносится. Не присылайте ключ в чат.
5. Для Preview оставьте приём выключенным и не добавляйте почтовый production ключ. Нажмите Deploy.
6. После статуса Ready откройте production адрес проекта *.vercel.app. Задайте этот адрес с https:// в Production SITE_URL и выполните Deployments → Redeploy. Изменённые env применяются к новому deployment: https://vercel.com/docs/environment-variables .
7. Проверьте доступ без входа в Vercel, страницы /purchase и /contact, видео и одну заявку со своими контактами. Для ошибок доставки смотрите Functions/Runtime Logs в Vercel и Emails в Resend.
8. В Vercel Firewall настройте rate limit для POST /api/inquiries по IP, например 5 за 60 секунд, с учётом возможностей тарифа. Локальный лимит кода действует на отдельный процесс.

Загружать dist вручную, держать свой сервер, настраивать Docker, SMTP или БД не требуется. API создаётся из каталога api автоматически. Отдельная интеграция Resend из Marketplace необязательна — достаточно API key.

## Купленный домен

Settings → Domains → Add Domain. В активной DNS-зоне внесите точные A/CNAME/TXT, показанные Vercel. Сохраните MX/SPF/DKIM почты. Дождитесь подтверждения домена и HTTPS, выберите основной адрес и редирект www. Обновите SITE_URL и сделайте Redeploy. https://vercel.com/docs/domains/working-with-domains/add-a-domain .

## Обновления

Push в production-ветку запускает Git-деплой. При изменении env выполните Redeploy. В Usage проверяйте расход трафика и функций; лимиты Resend учитываются отдельно. Полезные проверки: `npm test`, `npm run build`, `npm run test:browser`, `npm run deploy:check`.
