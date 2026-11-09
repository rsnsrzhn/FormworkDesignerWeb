> Исторический документ. Описывает состояние до миграции 2026-11-09; актуальные запуск и архитектура — в README.md.

# FormworkDesigner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Создать русскоязычный сайт продукта с демонстрациями и сохранением заявок.

**Architecture:** React + TypeScript, ASP.NET Core API, SQLite. Один origin, локальные медиа, Docker и Nginx.

**Tech Stack:** .NET 10, React, TypeScript, SQLite, Playwright.

**Spec:** docs/superpowers/specs/2026-11-03-formworkdesigner-design.md

## Global Constraints

- Без регистрации, оплаты, скачивания EXE и публичного доступа к заявкам.
- Фото, видео, база и секреты не включаются в Git.
- До заполнения реквизитов оператора production-приём отключён.
- 90% обозначается как предварительная оценка разработчика.

## Review Focus

- Телефоны РФ и Беларуси с пробелами и скобками нормализуются; неверные номера отклоняются.
- Отказ API и повторный клик не должны терять введённые данные.
- Прямой переход на внутреннюю страницу должен работать после публикации.
- База и установщик недоступны по HTTP, логи не содержат заявок.
- Отсутствие медиа и reduced motion не мешают чтению и навигации.

### Task 1: API и хранение

**Files:** FormworkDesignerWeb/Program.cs, FormworkDesignerWeb/Features/Inquiries/*, FormworkDesignerWeb/Configuration/*; tests/ValidationTests/*, tests/api/*.

**Interfaces:** POST /api/inquiries принимает fullName, email, phone, consent, policyVersion, website; GET /api/site-config возвращает публичные настройки оператора и доступность формы.

- [ ] Написать тесты валидации и интеграционных сценариев: корректная заявка, отсутствие согласия, неверные номера, повтор, honeypot, закрытый приём, отсутствие API чтения.
- [ ] Запустить тесты до реализации и зафиксировать результат.
- [ ] Реализовать API, SQLite, ограничение частоты, настройки и CLI backup/export/purge/delete.
- [ ] Запустить сборку и тесты; ожидается успешное сохранение и отказы для неверных данных.

### Task 2: Интерфейс

**Files:** FormworkDesignerWeb/ClientApp/src/{App,components,pages,styles}, FormworkDesignerWeb/ClientApp/scripts, FormworkDesignerWeb/ClientApp/tests.

**Interfaces:** Использует API Task 1; маршруты /, /purchase, /contact, /faq, /privacy, /consent.

- [ ] Реализовать страницы с локальными шрифтами, медиа, адаптивностью и доступной навигацией.
- [ ] Написать браузерные проверки формы, маршрутов и ошибок; запускать на реальном API при возможности.
- [ ] Проверить типы, production-сборку и мобильный экран; проверить reduced motion и ссылки.

### Task 3: Развёртывание и передача

**Files:** compose.yaml, FormworkDesignerWeb/Dockerfile, deploy/*, scripts/*, .env.example, README.md, .github/workflows/ci.yml.

**Interfaces:** Docker монтирует media только для чтения и data для SQLite; Nginx раздаёт фронтенд и проксирует API.

- [ ] Подготовить Docker, HTTPS-инструкцию, перенос медиа, резервирование и восстановление.
- [ ] Проверить исключения Git и отсутствие секретов, собрать финальные артефакты.
- [ ] Выполнить независимое ревью, исправить существенные замечания, повторить необходимые проверки.
- [ ] Сохранить код коммитами без медиа и установщика; описать ограничения проверки и запуска.
