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
            Расчёт и чертежи
            <br />
            опалубки.
          </h1>
          <div>
            <p>
              Контур, раскладка щитов и ведомость элементов. Для проектировщиков
              и прорабов, которые готовят опалубку к работе.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Запросить демоверсию
              </Link>
              <a className="text-link" href="#in-action">
                Посмотреть приложение <span aria-hidden="true">↓</span>
              </a>
            </div>
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
      <section className="container workflow-section">
        <div className="workflow-intro">
          <h2>
            От контура
            <br />к раскладке щитов.
          </h2>
        </div>
        <div
          className="product-tabs"
          id="in-action"
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
            autoPlay
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
              Документы
              <br />
              для работы на объекте.
            </h2>
            <p>
              Рабочий лист с чертежом и ведомостью, памятка по монтажу и схема
              раскроя трубок ПВХ.
            </p>
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
          <p>Проверьте рабочий процесс в демоверсии.</p>
          <Link className="button" href="/contact">
            Запросить демоверсию
          </Link>
          <Link className="text-link" href="/purchase">
            Приобретение и доработки →
          </Link>
        </div>
      </section>
    </>
  );
}
