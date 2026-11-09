import { useEffect, useRef, useState } from 'react';
import { calculateDemo } from '../demo/model';
import { Icon } from './Icon';
const steps = ['Задайте контур', 'Соберите раскладку', 'Посмотрите результат'];
const hints = [
  'Потяните ползунки — контур сразу изменится. В приложении можно нарисовать собственную геометрию.',
  'Выберите высоту и нажмите «Построить раскладку». На схеме появятся условные щиты: контур становится основой комплекта.',
  'В полной программе к схеме добавляются ведомость крепежа, расходники, раскрой трубок ПВХ и рабочие документы.',
];
const number = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(value);
export function Demo() {
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(6);
  const [length, setLength] = useState(8);
  const [height, setHeight] = useState(1.2);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const model = calculateDemo({ width, length, height });
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  function move(value: number) {
    setStep(value);
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  function restart() {
    setOpen(false);
    setWidth(6);
    setLength(8);
    setHeight(1.2);
    move(0);
  }
  const scale = Math.min(480 / width, 300 / length),
    x = (680 - width * scale) / 2,
    y = (440 - length * scale) / 2;
  return (
    <section className="demo-section" id="demo" aria-labelledby="demo-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Попробуйте сами · около минуты</span>
            <h2 id="demo-title">
              Первый контур.
              <br />
              <span>Вашими руками.</span>
            </h2>
          </div>
          <p>
            Почувствуйте логику работы: задайте размеры, соберите раскладку и
            посмотрите, что получится.
          </p>
        </div>
        <div className="demo-shell">
          <ol className="demo-progress" aria-label="Шаги демонстрации">
            {steps.map((label, i) => (
              <li
                key={label}
                aria-current={i === step ? 'step' : undefined}
                className={i <= step ? 'active' : ''}
              >
                <span>
                  {i < step ? <Icon name="check" size={15} /> : `0${i + 1}`}
                </span>
                {label}
              </li>
            ))}
          </ol>
          <div className="demo-workspace">
            <div className="demo-controls">
              <span className="eyebrow">Шаг {step + 1} из 3</span>
              <h3 ref={heading} tabIndex={-1}>
                {steps[step]}
              </h3>
              <p className="demo-tip">{hints[step]}</p>
              {step === 0 ? (
                <div className="demo-fields">
                  {[
                    {
                      id: 'demo-width',
                      label: 'Ширина',
                      value: width,
                      set: setWidth,
                      max: 12,
                    },
                    {
                      id: 'demo-length',
                      label: 'Длина',
                      value: length,
                      set: setLength,
                      max: 16,
                    },
                  ].map((field) => (
                    <div className="range-field" key={field.id}>
                      <div>
                        <label htmlFor={field.id}>{field.label}</label>
                        <output htmlFor={field.id}>
                          {number(field.value)} <span>м</span>
                        </output>
                      </div>
                      <input
                        id={field.id}
                        type="range"
                        min="2"
                        max={field.max}
                        step="0.5"
                        value={field.value}
                        onChange={(event) =>
                          field.set(Number(event.target.value))
                        }
                      />
                      <div className="range-ends">
                        <span>2 м</span>
                        <span>{field.max} м</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : step === 1 ? (
                <fieldset className="height-field">
                  <legend>Высота опалубки</legend>
                  <div className="height-options">
                    {[0.6, 1.2, 1.8, 2.4].map((value) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="demo-height"
                          checked={height === value}
                          onChange={() => setHeight(value)}
                        />
                        <span>{number(value)} м</span>
                      </label>
                    ))}
                  </div>
                  <p>Высота влияет на набор щитов и количество крепежа.</p>
                </fieldset>
              ) : (
                <dl className="demo-results">
                  <div>
                    <dt>Контур</dt>
                    <dd>
                      {number(width)} × {number(length)} м
                    </dd>
                  </div>
                  <div>
                    <dt>Высота</dt>
                    <dd>{number(height)} м</dd>
                  </div>
                  <div>
                    <dt>Периметр</dt>
                    <dd>{number(model.perimeter)} м</dd>
                  </div>
                  <div>
                    <dt>Поверхность с двух сторон</dt>
                    <dd>{number(model.area)} м²</dd>
                  </div>
                </dl>
              )}
              <div className="demo-actions">
                <button
                  ref={next}
                  className="button"
                  onClick={() => (step < 2 ? move(step + 1) : setOpen(true))}
                >
                  {step === 0
                    ? 'Перейти к раскладке'
                    : step === 1
                      ? 'Построить раскладку'
                      : 'Что дальше?'}
                  <Icon name="arrow" size={18} />
                </button>
                {step > 0 && (
                  <button
                    className="quiet-button"
                    onClick={() => move(step - 1)}
                  >
                    ← Назад
                  </button>
                )}
              </div>
            </div>
            <div className="demo-canvas">
              <div className="canvas-toolbar">
                <span>
                  <span className="status-dot" />
                  {step === 2 ? 'Раскладка построена' : 'Учебный проект'}
                </span>
                <button
                  className="quiet-button"
                  onClick={restart}
                  aria-label="Начать демонстрацию заново"
                >
                  ↻ Сбросить
                </button>
              </div>
              <svg
                viewBox="0 0 680 440"
                role="img"
                aria-label={`Контур ${number(width)} на ${number(length)} метров${step === 2 ? ' с условной раскладкой щитов' : ''}`}
              >
                <defs>
                  <pattern
                    id="demo-grid"
                    width="22"
                    height="22"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M22 0H0V22"
                      fill="none"
                      stroke="#d9e5f1"
                      strokeWidth=".6"
                    />
                  </pattern>
                </defs>
                <rect width="680" height="440" fill="url(#demo-grid)" />
                <rect
                  x={x}
                  y={y}
                  width={width * scale}
                  height={length * scale}
                  fill="#e5edf7"
                  stroke="#2465d0"
                  strokeWidth="2"
                />
                <rect
                  x={x + 12}
                  y={y + 12}
                  width={width * scale - 24}
                  height={length * scale - 24}
                  fill="#ffffffdd"
                  stroke="#adc5df"
                />
                {step === 2 &&
                  model.segments.map((segment, i) => (
                    <line
                      key={i}
                      x1={x + segment.start[0] * scale}
                      y1={y + segment.start[1] * scale}
                      x2={x + segment.end[0] * scale}
                      y2={y + segment.end[1] * scale}
                      stroke={segment.length < 1.19 ? '#d8a04b' : '#2465d0'}
                      strokeWidth="10"
                      strokeDasharray={`${Math.max(segment.length * scale - 3, 1)} 3`}
                    />
                  ))}
                <g stroke="#839ab2" strokeWidth="1">
                  <path
                    d={`M${x} ${y - 12}V${y - 35}M${x + width * scale} ${y - 12}V${y - 35}M${x} ${y - 26}H${x + width * scale}`}
                  />
                  <path
                    d={`M${x - 12} ${y}H${x - 35}M${x - 12} ${y + length * scale}H${x - 35}M${x - 26} ${y}V${y + length * scale}`}
                  />
                </g>
                <g fill="#4c6783" fontSize="13" fontFamily="inherit">
                  <text x="340" y={y - 35} textAnchor="middle">
                    {number(width)} м
                  </text>
                  <text
                    x={x - 39}
                    y="220"
                    textAnchor="middle"
                    transform={`rotate(-90 ${x - 39} 220)`}
                  >
                    {number(length)} м
                  </text>
                </g>
                <text
                  x="340"
                  y="213"
                  textAnchor="middle"
                  fill="#193854"
                  fontSize="22"
                  fontWeight="600"
                >
                  {number(width)} × {number(length)} м
                </text>
                <text
                  x="340"
                  y="240"
                  textAnchor="middle"
                  fill="#6a7e92"
                  fontSize="12"
                >
                  {step === 2
                    ? `Высота ${number(height)} м · условная схема`
                    : 'Меняйте размеры — контур обновится'}
                </text>
                {[
                  [x, y],
                  [x + width * scale, y],
                  [x + width * scale, y + length * scale],
                  [x, y + length * scale],
                ].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#fff"
                    stroke="#2465d0"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              <div className="canvas-caption" aria-live="polite">
                <span className="canvas-legend">
                  <i />
                  {step === 2 ? 'Условные щиты' : 'Контур здания'}
                </span>
                <span>
                  {step === 2
                    ? 'Схема → комплект → рабочий лист'
                    : 'Все размеры в метрах'}
                </span>
              </div>
            </div>
          </div>
          <p className="demo-disclaimer">
            Учебная схема для знакомства с процессом. Подбор типоразмеров, углы,
            крепёж и рабочая ведомость рассчитываются в приложении.
          </p>
        </div>
        <dialog
          ref={dialog}
          className="completion-dialog"
          onCancel={() => setOpen(false)}
          onClose={() => {
            setOpen(false);
            next.current?.focus();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          aria-labelledby="completion-title"
          aria-describedby="completion-description"
        >
          <div className="dialog-inner">
            <button
              className="dialog-close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть приглашение"
            >
              <Icon name="close" />
            </button>
            <span className="completion-icon">
              <Icon name="check" size={28} />
            </span>
            <span className="eyebrow">Первый шаг сделан</span>
            <h2 id="completion-title">
              Теперь —<br />
              ваш настоящий проект.
            </h2>
            <p id="completion-description">
              Вы попробовали путь от контура до раскладки. Заполните заявку на
              сотрудничество — обсудим ваши задачи и покажем возможности
              FormworkDesigner на вашем примере.
            </p>
            <a className="button" href="/contact?source=demo">
              Заполнить заявку <Icon name="arrow" />
            </a>
            <button className="quiet-button" onClick={() => setOpen(false)}>
              Вернуться к схеме
            </button>
          </div>
        </dialog>
      </div>
    </section>
  );
}
