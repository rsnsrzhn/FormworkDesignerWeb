import { Link } from "../components/Link";
import { Icon } from "../components/Icon";
import { CTA } from "../components/Layout";
export function Purchase() {
  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">Покупка и доработка</span>
        <h1>
          Программа под задачи
          <br />
          <span>вашей компании.</span>
        </h1>
        <p>
          FormworkDesigner для десктопа и Android.
          <br />
          Поддержка и развитие решения для вашей команды.
        </p>
      </section>
      <section className="container purchase-grid">
        <article className="purchase-card">
          <h2>Копия программы</h2>
          <p>
            Инструмент для построения контуров, раскладки опалубки, расчёта
            ведомостей и подготовки чертежей.
          </p>
          <ul className="feature-points">
            <li>Возможности, представленные на сайте</li>
            <li>Условия приобретения обсуждаются лично</li>
          </ul>
          <Link href="/contact" className="text-link">
            Обсудить приобретение <Icon name="arrow" size={18} />
          </Link>
        </article>
        <article className="purchase-card accent-card">
          <span className="eyebrow">Индивидуально</span>
          <h2>Поддержка и доработки</h2>
          <p>
            После приобретения программа может развиваться вместе с вашей
            компанией. Обсудим сопровождение, новые инструменты и изменения под
            ваши рабочие процессы — от ведомостей до оформления документов.
          </p>
          <ul className="feature-points">
            <li>Функционал под процессы вашей компании</li>
            <li>Состав поддержки и доработок по согласованию</li>
          </ul>
          <Link href="/contact" className="text-link">
            Рассказать о задачах <Icon name="arrow" size={18} />
          </Link>
        </article>
      </section>
      <section className="container process">
        <span className="eyebrow">Как начнём работу</span>
        <h2>
          От знакомства
          <br />
          до понятного предложения.
        </h2>
        <div className="process-grid">
          {[
            [
              "01",
              "Заявка",
              "Оставьте контакты. Мы свяжемся с вами и уточним задачи.",
            ],
            [
              "02",
              "Обсуждение",
              "Разберём процессы компании и необходимые возможности.",
            ],
            [
              "03",
              "Предложение",
              "Согласуем состав решения, стоимость и условия сотрудничества.",
            ],
          ].map(([n, title, text]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="purchase-note">
          Стоимость зависит от сложности доработок и требований компании.
          Приобретение, состав поддержки и индивидуальные изменения обсуждаем
          лично.
        </p>
      </section>
      <CTA />
    </>
  );
}
