import { useState } from 'react';
import { Link } from '../components/Link';
import { Media } from '../components/Media';
const demonstrations = [
  {
    name: '05-risovanie',
    title: 'Контур',
    description:
      'Постройте геометрию проекта. Задавайте размеры и редактируйте линии в рабочем поле.',
  },
  {
    name: '02-razbivka',
    title: 'Раскладка',
    description:
      'Расположите щиты по контуру. Проверяйте состав и количество элементов в ведомости рядом с чертежом.',
  },
  {
    name: '03-vysota',
    title: 'Высота',
    description:
      'Измените высоту опалубки и проследите, как меняется состав комплекта.',
  },
  {
    name: '04-list',
    title: 'Документы',
    description:
      'Подготовьте рабочий лист с чертежом и ведомостью, памятку и схему раскроя трубок ПВХ.',
  },
  {
    name: '01-primery',
    title: 'Примеры',
    description:
      'Изучите встроенный пример дома с внешним контуром и внутренними помещениями.',
  },
];
export function Home() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <section className="engineering-hero container">
        <div className="engineering-heading">
          <h1>
            Расчёт опалубки.
            <br />
            Чертёж. Комплект.
          </h1>
          <div>
            <p>
              От контура до ведомости элементов — в одном проекте. Рабочий
              инструмент для проектировщиков, прорабов и строительных компаний.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Запросить демоверсию
              </Link>
              <a className="text-link" href="#in-action">
                Посмотреть приложение <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="demo-note">
              В демоверсии недоступны сохранение и экспорт файлов.
            </p>
          </div>
        </div>
        <figure className="hero-product">
          <Media
            name="02-razbivka"
            title="Раскладка опалубки и ведомость в FormworkDesigner"
            eager
          />
          <figcaption>
            <span>FormworkDesigner · настольная версия</span>
            <a href="/media/02-razbivka.jpg" target="_blank" rel="noopener">
              Рассмотреть интерфейс ↗
            </a>
          </figcaption>
        </figure>
      </section>
      <section className="container workflow-section" id="in-action">
        <div className="workflow-intro">
          <h2>
            Один проект.
            <br />
            Связанные задачи.
          </h2>
          <p>
            Начните с геометрии. Перейдите к раскладке, проверьте ведомость и
            подготовьте документы для дальнейшей работы.
          </p>
        </div>
        <div
          className="product-tabs"
          role="group"
          aria-label="Демонстрации возможностей"
        >
          {demonstrations.map((item, index) => (
            <button
              key={item.name}
              aria-pressed={selected === index}
              aria-controls="product-preview"
              onClick={() => setSelected(index)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <figure className="product-preview" id="product-preview">
          <Media
            key={demonstrations[selected].name}
            name={demonstrations[selected].name}
            title={demonstrations[selected].title}
          />
          <figcaption className="preview-description" aria-live="polite">
            {demonstrations[selected].description}{' '}
            <a
              href={`/media/${demonstrations[selected].name}.jpg`}
              target="_blank"
              rel="noopener"
            >
              Открыть изображение ↗
            </a>
          </figcaption>
        </figure>
      </section>
      <section className="result-band">
        <div className="container result-grid">
          <div>
            <h2>
              Чертёж и ведомость.
              <br />
              На одном листе.
            </h2>
            <p>
              Схема раскладки остаётся рядом с перечнем элементов. Сопоставляйте
              геометрию и состав комплекта перед передачей результата команде.
            </p>
            <dl className="result-list">
              <div>
                <dt>Раскладка</dt>
                <dd>Щиты, вставки и уголки</dd>
              </div>
              <div>
                <dt>Ведомость</dt>
                <dd>Типоразмеры и количество</dd>
              </div>
              <div>
                <dt>Рабочий лист</dt>
                <dd>Чертёж и ведомость в PDF</dd>
              </div>
            </dl>
          </div>
          <figure>
            <a href="/media/04-list.jpg" target="_blank" rel="noopener">
              <img
                src="/media/04-list.jpg"
                alt="Памятка и схема раскроя ПВХ в настоящем интерфейсе FormworkDesigner"
                width="1920"
                height="1080"
                loading="lazy"
              />
            </a>
            <figcaption>
              Памятка и схема раскроя ПВХ из приложения. Нажмите, чтобы
              рассмотреть.
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="container demo-section">
        <h2>
          Сначала попробуйте
          <br />
          на своей задаче.
        </h2>
        <div>
          <p>
            Запросите демоверсию, чтобы познакомиться с рабочим процессом до
            обсуждения приобретения.
          </p>
          <p>
            В демоверсии недоступны сохранение проекта и экспорт файлов. Условия
            приобретения и возможные доработки обсуждаем лично.
          </p>
          <Link className="button" href="/contact">
            Запросить демоверсию
          </Link>
          <Link className="text-link" href="/purchase">
            Приобретение и доработки →
          </Link>
        </div>
      </section>
      <section className="container landing-questions">
        <h2>Перед началом работы</h2>
        {[
          [
            'Можно ли сохранить результат в демоверсии?',
            'Нет. Сохранение проекта и экспорт файлов в демоверсии заблокированы.',
          ],
          [
            'Где посмотреть программу в работе?',
            'На этой странице доступны реальные записи настольной версии: контур, раскладка, изменение высоты и подготовка документов.',
          ],
          [
            'Как обсудить задачи компании?',
            'Оставьте контакты через форму заявки. Обсудим приобретение и необходимые изменения под ваш процесс.',
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
        <Link className="text-link" href="/contact">
          Перейти к форме заявки →
        </Link>
      </section>
    </>
  );
}
