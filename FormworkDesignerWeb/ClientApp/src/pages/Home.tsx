import { Link } from "../components/Link";
import { Icon } from "../components/Icon";
import { Media } from "../components/Media";
import { CTA } from "../components/Layout";

export function Home() {
  return (
    <>
      <section className="container hero">
        <div className="hero-heading">
          <p className="product-name">FormworkDesigner</p>
          <h1>
            От контура
            <br />
            <span>до чертежа.</span>
          </h1>
        </div>
        <div className="hero-copy">
          <p>
            Раскладка щитов, ведомость элементов и рабочий лист. Всё, что вы
            обычно собираете вручную, — в одном приложении.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Обсудить проект <Icon name="arrow" size={20} />
            </Link>
            <a className="text-link" href="#in-action">
              Посмотреть в работе <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="platform-note">Доступно на десктопе и Android</p>
        </div>
      </section>

      <section
        className="product-stage"
        id="in-action"
        aria-label="Демонстрация FormworkDesigner"
      >
        <div className="container">
          <Media name="01-primery" title="Примеры проектов" eager />
          <div className="stage-caption">
            <p>Ваш проект. Его геометрия. Все элементы на виду.</p>
            <span>Демонстрация настольной версии</span>
          </div>
        </div>
      </section>

      <section className="container drawing-section">
        <div className="section-heading">
          <h2>
            Начните
            <br />с вашего плана.
          </h2>
          <p>
            Рисуйте контуры, задавайте размеры и редактируйте геометрию прямо на
            схеме. FormworkDesigner помогает пройти от первого отрезка до
            проекта опалубки.
          </p>
        </div>
        <div className="drawing-layout">
          <div className="drawing-notes">
            <h3>Сначала геометрия.</h3>
            <p>
              Линии, измерения и размеры находятся в одном рабочем пространстве.
            </p>
            <h3>Затем раскладка.</h3>
            <p>
              Готовый контур становится основой для расстановки щитов и расчёта
              ведомости.
            </p>
          </div>
          <div className="feature-media">
            <Media name="05-risovanie" title="Создание комнаты с нуля" />
          </div>
        </div>
      </section>

      <section className="layout-showcase">
        <div className="container">
          <div className="showcase-heading">
            <h2>
              Щиты, уголки, крепёж.
              <br />
              <span>Программа считает.</span>
            </h2>
            <p>
              Запускайте разбивку по контуру и получайте раскладку вместе с
              ведомостью. Типоразмеры и количество элементов — рядом со схемой,
              которую вы проверяете.
            </p>
          </div>
          <div className="feature-media">
            <Media name="02-razbivka" title="Разбивка контура на щиты" />
          </div>
          <div className="showcase-bottom">
            <p>
              Схема раскладки и состав комплекта
              <br />
              вместо отдельных ручных подсчётов.
            </p>
            <Link className="text-link" href="/contact">
              Обсудить ваши задачи <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container results-section">
        <div className="section-heading">
          <h2>
            Изменили проект?
            <br />
            Продолжайте работу.
          </h2>
          <p>
            Правки не должны превращаться в новый круг ручного подсчёта и
            оформления.
          </p>
        </div>
        <div className="results-grid">
          <article>
            <div className="feature-media">
              <Media name="03-vysota" title="Изменение высоты опалубки" />
            </div>
            <h3>
              Другая высота.
              <br />
              Обновлённая ведомость.
            </h3>
            <p>
              Меняйте высоту опалубки и сразу смотрите пересчитанный состав
              элементов. Удобно сравнивать варианты и вносить изменения.
            </p>
          </article>
          <article>
            <div className="feature-media">
              <Media
                name="04-list"
                title="Схема проекта и памятка по монтажу"
              />
            </div>
            <h3>
              Готовый лист.
              <br />
              Понятный результат.
            </h3>
            <p>
              Схема проекта, памятка по монтажу и нарезка трубок ПВХ помогают
              подготовить рабочие документы в одном месте.
            </p>
          </article>
        </div>
      </section>

      <section className="container time-section">
        <div className="time-number">
          <span>до</span>
          <strong>
            90<span>%</span>
          </strong>
        </div>
        <div className="time-copy">
          <h2>
            Меньше времени
            <br />
            на ручную работу.
          </h2>
          <p>
            Автоматическая раскладка и пересчёт ведомости освобождают время для
            самого проекта.
          </p>
          <p className="estimate">
            Предварительная оценка разработчика относительно ручной работы, без
            контрольных замеров. Результат зависит от проекта и опыта
            специалиста.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="container platform-layout">
          <div>
            <h2>
              На компьютере.
              <br />
              <span>На Android.</span>
            </h2>
            <p>
              FormworkDesigner доступен на десктопе и Android. Обсудим, какой
              вариант подходит вашей команде и какие возможности нужны в работе.
            </p>
            <Link href="/contact" className="text-link">
              Уточнить возможности версий <Icon name="arrow" />
            </Link>
          </div>
          <div className="platform-list">
            <article>
              <svg viewBox="0 0 80 64" aria-hidden="true">
                <rect x="5" y="5" width="70" height="43" rx="3" />
                <path d="M28 59h24M40 48v11" />
                <path className="device-line" d="M18 35V18h18v9h23v8H18Z" />
              </svg>
              <h3>Десктоп</h3>
            </article>
            <article>
              <svg viewBox="0 0 50 64" aria-hidden="true">
                <rect x="9" y="3" width="32" height="58" rx="5" />
                <path d="M20 9h10M22 55h6" />
                <path className="device-line" d="M17 41V23h11v10h6v8H17Z" />
              </svg>
              <h3>Android</h3>
            </article>
          </div>
        </div>
      </section>

      <section className="container custom-section">
        <div>
          <h2>
            Ваши процессы.
            <br />
            Ваша версия программы.
          </h2>
        </div>
        <div className="custom-copy">
          <p>
            Приобретение FormworkDesigner — начало сотрудничества. Обсудим
            поддержку и функционал, который нужен именно вашей компании.
          </p>
          <p>
            Оформление документов, состав ведомостей, дополнительные рабочие
            сценарии — определим нужные изменения и согласуем их реализацию.
          </p>
          <Link href="/purchase" className="text-link">
            Покупка, поддержка и доработки <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <CTA />
    </>
  );
}
