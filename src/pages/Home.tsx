import { useState } from 'react';
import { Link } from '../components/Link';
import { Icon } from '../components/Icon';
import { Media } from '../components/Media';
import { CTA } from '../components/Layout';
import { FormworkScene } from '../components/FormworkScene';
import { Demo } from '../components/Demo';
const demos = [
  {
    name: '05-risovanie',
    title: 'Нарисуйте контур',
    description:
      'Создавайте геометрию, задавайте размеры и редактируйте план в одном рабочем пространстве.',
  },
  {
    name: '02-razbivka',
    title: 'Разложите щиты',
    description:
      'Получайте схему раскладки вместе с ведомостью щитов, вставок, уголков и крепежа.',
  },
  {
    name: '03-vysota',
    title: 'Измените высоту',
    description:
      'Меняйте высоту опалубки и проверяйте обновлённый состав комплекта без отдельного ручного подсчёта.',
  },
  {
    name: '04-list',
    title: 'Подготовьте лист',
    description:
      'Схема, ведомость, памятка и нарезка трубок ПВХ помогают передать результат дальше.',
  },
  {
    name: '01-primery',
    title: 'Изучите примеры',
    description:
      'Посмотрите, как реальные контуры и элементы выглядят в настольном приложении.',
  },
];
export function Home() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> Приложение для проектирования
            опалубки
          </span>
          <h1>
            Опалубка.
            <br />
            <span>Всё сходится.</span>
          </h1>
          <p>
            От первого контура до раскладки щитов и рабочего листа. Меньше
            ручного подсчёта — больше внимания вашему проекту.
          </p>
          <div className="hero-actions">
            <a className="button" href="#demo">
              Попробовать в деле <Icon name="arrow" size={18} />
            </a>
            <a className="text-link" href="#in-action">
              Посмотреть приложение <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-platforms">
            <span>Десктоп</span>
            <span>Android</span>
            <span>Ваш рабочий процесс</span>
          </div>
        </div>
        <figure className="hero-visual">
          <div className="scene-topline">
            <span>FORMWORK / DESIGN STUDY</span>
            <span>01 — 03</span>
          </div>
          <FormworkScene />
          <div className="scene-card">
            <span className="scene-check">
              <Icon name="check" size={16} />
            </span>
            <div>
              <strong>Каждому элементу — своё место.</strong>
              <span>Геометрия. Раскладка. Комплект.</span>
            </div>
          </div>
          <figcaption>
            Объёмная иллюстрация опалубки · приложение работает с 2D-чертежами
          </figcaption>
        </figure>
      </section>
      <section className="container workflow" aria-label="Рабочий процесс">
        {[
          ['01', 'Контур', 'Нарисуйте геометрию проекта.'],
          ['02', 'Раскладка', 'Подберите элементы по контуру.'],
          ['03', 'Документы', 'Подготовьте комплект и рабочий лист.'],
        ].map(([n, title, text]) => (
          <div key={n}>
            <span className="workflow-number">{n}</span>
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <span className="workflow-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
        ))}
      </section>
      <Demo />
      <section className="container product-section" id="in-action">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Настоящее приложение</span>
            <h2>
              Один проект.
              <br />
              <span>Связанные результаты.</span>
            </h2>
          </div>
          <p>
            Посмотрите, как устроена работа в FormworkDesigner: от геометрии до
            документов, которые можно передать команде.
          </p>
        </div>
        <div className="product-showcase">
          <div className="product-tabs" aria-label="Демонстрации возможностей">
            {demos.map((demo, i) => (
              <button
                key={demo.name}
                aria-pressed={i === selected}
                aria-controls="product-preview"
                onClick={() => setSelected(i)}
              >
                <span>0{i + 1}</span>
                {demo.title}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="product-preview" id="product-preview">
            <div className="product-windowbar">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>FormworkDesigner / настольная версия</span>
              <Icon name="grid" size={15} />
            </div>
            <Media
              key={demos[selected].name}
              name={demos[selected].name}
              title={demos[selected].title}
            />
            <p className="preview-description" aria-live="polite">
              {demos[selected].description}
            </p>
          </div>
        </div>
      </section>
      <section className="outcomes-section">
        <div className="container outcomes-layout">
          <div className="outcomes-intro">
            <span className="eyebrow">От схемы — к работе</span>
            <h2>
              Важен не только
              <br />
              чертёж.
              <br />
              <span>Важен весь комплект.</span>
            </h2>
            <p>
              Когда геометрия, элементы и документы связаны, проще проверить
              результат и продолжить работу после изменений.
            </p>
            <Link href="/purchase" className="text-link">
              Обсудить задачи команды <Icon name="arrow" />
            </Link>
          </div>
          <div className="outcomes-list">
            {[
              [
                'layers',
                'Состав комплекта на виду',
                'Щиты, вставки, уголки, стяжки и крепёж сгруппированы в ведомости по типоразмерам и количеству.',
              ],
              [
                'ruler',
                'Расходники тоже учтены',
                'Трубки ПВХ с планом раскроя, конусы и масло дополняют список основных элементов.',
              ],
              [
                'sheet',
                'Результат можно передать',
                'PDF рабочего листа и памятки, SVG и HTML-просмотрщик помогают делиться результатом.',
              ],
              [
                'grid',
                'Изменения остаются в проекте',
                'Редактируйте контур, меняйте высоту и проверяйте обновлённую раскладку и ведомость.',
              ],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <span className="outcome-icon">
                  <Icon name={icon as 'layers' | 'ruler' | 'sheet' | 'grid'} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container company-section">
        <span className="eyebrow">Под ваш способ работы</span>
        <h2>
          Хороший инструмент
          <br />
          понимает <span>ваши задачи.</span>
        </h2>
        <div>
          <p>
            Обсудим, как FormworkDesigner впишется в процессы вашей команды: от
            оформления рабочих листов до индивидуальных доработок.
          </p>
          <p>
            Программа доступна на десктопе и Android. Подходящую версию,
            возможности и условия сотрудничества подберём при знакомстве.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
