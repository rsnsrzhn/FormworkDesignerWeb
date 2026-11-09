import { useState } from 'react';
import { Link } from '../components/Link';
import { Media } from '../components/Media';
import { CTA } from '../components/Layout';
const demonstrations = [
  {
    name: '05-risovanie',
    title: 'Контур',
    description:
      'Построение контура, размеры и редактирование геометрии в одном рабочем пространстве.',
  },
  {
    name: '02-razbivka',
    title: 'Раскладка',
    description:
      'Расстановка щитов по контуру и ведомость элементов рядом с чертежом.',
  },
  {
    name: '03-vysota',
    title: 'Высота',
    description: 'Изменение высоты опалубки и пересчёт состава комплекта.',
  },
  {
    name: '04-list',
    title: 'Документы',
    description: 'Рабочий лист, памятка по монтажу и план раскроя трубок ПВХ.',
  },
  {
    name: '01-primery',
    title: 'Примеры',
    description:
      'Встроенный пример дома: внешний контур и внутренние помещения.',
  },
];
export function Home() {
  const [selected, setSelected] = useState(1);
  return (
    <>
      <section className="hero">
        <div className="hero-drawing" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">FormworkDesigner</p>
            <h1>
              Меньше рутины.
              <br />
              <span>Больше проекта.</span>
            </h1>
            <p className="hero-description">
              Приложение для проектирования опалубки. Начертите контур, получите
              раскладку щитов и подготовьте комплект документов.
            </p>
            <div className="hero-actions">
              <a className="button" href="#in-action">
                Посмотреть приложение
              </a>
              <Link className="button button-outline" href="/contact">
                Обсудить сотрудничество
              </Link>
            </div>
            <p className="hero-platforms">На компьютере и Android</p>
          </div>
          <p className="drawing-caption">
            Контур встроенного примера «Дом» · 12 × 9 м
          </p>
        </div>
      </section>
      <section className="container product-intro" data-reveal>
        <h2>
          От геометрии
          <br />
          <span>к составу комплекта.</span>
        </h2>
        <div>
          <p>
            Чертёж и ведомость не должны жить отдельно. FormworkDesigner
            связывает контур, раскладку и перечень элементов в одном проекте.
          </p>
          <p>
            Работайте с геометрией, меняйте высоту, проверяйте количество щитов
            и крепежа. Затем подготовьте документы для дальнейшей работы.
          </p>
        </div>
      </section>
      <section
        className="container product-section"
        id="in-action"
        aria-labelledby="product-title"
        data-reveal
      >
        <div className="section-heading">
          <h2 id="product-title">
            Посмотрите,
            <br />
            <span>как это работает.</span>
          </h2>
          <p>
            Реальные записи настольной версии.
            <br />
            От первого контура до рабочего листа.
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
            eager
          />
          <figcaption className="preview-description" aria-live="polite">
            {demonstrations[selected].description}
          </figcaption>
        </figure>
      </section>
      <section
        className="time-saving"
        aria-labelledby="time-saving-title"
        data-reveal
      >
        <div className="container time-saving-inner">
          <h2 id="time-saving-title">
            До <strong>90%</strong>
            <span>сэкономленного времени</span>
          </h2>
          <div>
            <p>
              Пусть программа считает.
              <br />А вы занимаетесь проектом.
            </p>
            <p className="time-saving-note">
              Предварительная оценка разработчика относительно ручной работы,
              без контрольных замеров. Результат зависит от проекта и опыта
              специалиста.
            </p>
          </div>
        </div>
      </section>
      <section
        className="container capabilities"
        aria-labelledby="capabilities-title"
        data-reveal
      >
        <div className="section-heading">
          <h2 id="capabilities-title">
            Всё, что связано
            <br />
            <span>с вашим чертежом.</span>
          </h2>
          <p>
            Отдельные рабочие задачи.
            <br />
            Один последовательный процесс.
          </p>
        </div>
        <div className="capabilities-grid">
          <article>
            <p className="feature-label">Геометрия</p>
            <h3>
              Проект начинается
              <br />с вашего контура.
            </h3>
            <p>
              Линии, размеры, измерения и привязки. Редактируйте геометрию и
              возвращайтесь к предыдущим действиям через историю изменений.
            </p>
            <dl>
              <div>
                <dt>Контуры</dt>
                <dd>Внешние и внутренние</dd>
              </div>
              <div>
                <dt>Проект</dt>
                <dd>Сохранение в .fwd</dd>
              </div>
            </dl>
          </article>
          <article>
            <p className="feature-label">Комплектование</p>
            <h3>
              Элементы —<br />
              рядом со схемой.
            </h3>
            <p>
              Щиты, вставки, доски, внутренние и наружные уголки. Ведомость
              показывает типоразмеры и количество элементов, стяжек и крепежа.
            </p>
            <dl>
              <div>
                <dt>Высота</dt>
                <dd>Пересчёт ведомости</dd>
              </div>
              <div>
                <dt>Расходники</dt>
                <dd>ПВХ, конусы, масло</dd>
              </div>
            </dl>
          </article>
          <article>
            <p className="feature-label">Документация</p>
            <h3>
              Результат, который
              <br />
              можно передать.
            </h3>
            <p>
              Рабочий лист с чертежом и ведомостью, памятка по монтажу и план
              раскроя трубок ПВХ. Подготовьте документы для команды и заказчика.
            </p>
            <dl>
              <div>
                <dt>Рабочие листы</dt>
                <dd>PDF</dd>
              </div>
              <div>
                <dt>Чертёж</dt>
                <dd>HTML-просмотрщик</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
      <section className="container company-section" data-reveal>
        <h2>
          Ваши процессы.
          <br />
          <span>Ваш инструмент.</span>
        </h2>
        <div>
          <p>
            У каждой компании свои задачи: состав ведомостей, оформление
            документов, привычный порядок работы.
          </p>
          <p>
            Обсудим приобретение FormworkDesigner и необходимые доработки.
            Возможность реализации, состав поддержки и условия согласуем лично.
          </p>
          <Link className="text-link" href="/purchase">
            О сотрудничестве <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <CTA />
    </>
  );
}
