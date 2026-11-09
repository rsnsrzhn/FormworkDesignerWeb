import { Link } from '../components/Link';
import { Icon } from '../components/Icon';
import { CTA } from '../components/Layout';
export function Purchase() {
  return (
    <>
      <section className="container page-hero purchase-hero">
        <h1>
          FormworkDesigner
          <br />
          для вашей работы.
        </h1>
        <div>
          <p>
            Приобретите программу для расчёта опалубки и подготовки чертежей.
            Если вашему процессу нужны изменения — обсудим их отдельно.
          </p>
          <Link className="button" href="/contact">
            Обсудить приобретение <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <section className="purchase-band">
        <div className="container purchase-offer">
          <div className="purchase-description">
            <h2>
              Приобретение
              <br />
              программы
            </h2>
            <p>
              FormworkDesigner для работы с контурами, раскладкой щитов,
              ведомостями и документами. Вы приобретаете программу для
              использования в своей работе.
            </p>
            <p>
              Условия использования и стоимость согласуем перед приобретением.
            </p>
            <Link className="text-link" href="/contact">
              Узнать условия <Icon name="arrow" size={18} />
            </Link>
          </div>
          <figure>
            <a href="/media/02-razbivka.jpg" target="_blank" rel="noopener">
              <img
                src="/media/02-razbivka.jpg"
                width="1920"
                height="1080"
                alt="Раскладка щитов и ведомость в FormworkDesigner"
              />
            </a>
            <figcaption>
              Настоящий интерфейс программы. Откройте изображение, чтобы
              рассмотреть детали.
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="container purchase-tailoring">
        <h2>
          Нужны изменения
          <br />
          под ваш процесс?
        </h2>
        <div>
          <p>
            Оформление документов, состав ведомостей или особый порядок работы —
            расскажите, чего не хватает вашей команде.
          </p>
          <p>
            Проверим возможность реализации и согласуем объём доработок,
            стоимость и состав поддержки отдельно от приобретения программы.
          </p>
          <Link className="text-link" href="/contact">
            Рассказать о задачах <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <section className="container purchase-start">
        <h2>
          Сначала — знакомство
          <br />с программой.
        </h2>
        <div>
          <p>
            Запросите демоверсию и попробуйте рабочий сценарий. В демоверсии
            недоступны сохранение и экспорт файлов.
          </p>
          <p>
            После знакомства обсудим приобретение и ответим на вопросы об
            использовании.
          </p>
          <Link className="text-link" href="/contact">
            Запросить демоверсию <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <CTA />
    </>
  );
}
