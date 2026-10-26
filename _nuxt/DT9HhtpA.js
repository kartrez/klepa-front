const n=`<div class="hc-page">
  <nav class="rail" aria-label="Шаги урока">
    <ol>
      <li><a href="#analogy">Аналогия</a></li>
      <li><a href="#explain">Объяснение</a></li>
      <li><a href="#interactive">Интерактив</a></li>
      <li><a href="#practice">Тесты</a></li>
      <li><a href="#checklist">Чек-лист</a></li>
      <li><a href="#links">Ссылки</a></li>
    </ol>
    <div class="rail-progress"><span data-meter-label>Пройдено: 0%</span><div class="meter"><i data-meter></i></div></div>
  </nav>

  <main class="content">
    <header class="lesson-hero">
      <span class="eyebrow">Часть 5 · Большие проекты · Урок 9</span>
      <h1>Агент в старом проекте: как подготовить legacy и внедрять постепенно</h1>
      <p class="lead">AI-First — это не «подключить чат к IDE». Это сделать проект понятным и проверяемым, чтобы агент мог в нём работать. Разберём паттерны для старых проектов и порядок внедрения.</p>
      <div class="facts">
        <span class="fact">~50 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">3D-фильм и 11 вопросов</span>
        <span class="fact">Примеры: JS · PHP · Python · Markdown</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>оценить, насколько ваш проект готов к работе с агентами;</li>
          <li>назвать семь паттернов, которые делают legacy понятным для агента;</li>
          <li>составить план внедрения: какие задачи давать агенту первыми, а какие позже;</li>
          <li>заменить старый модуль по частям, не останавливая систему.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Склад переходит на роботов</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Старый склад: коробки где попало, схема только в голове кладовщика. Если запустить туда робота, он будет ездить кругами и ронять полки. Сначала размечают полки, потом ставят датчики, потом пускают робота на простой участок.</p>
      </div>
      <div class="stand" id="wh">
        <div class="wh" id="wh-steps">
          <div id="wh-0"><b>Разметка полок</b><small>карта проекта, правила</small></div>
          <div id="wh-1"><b>Датчики</b><small>тесты, линтер, CI</small></div>
          <div id="wh-2"><b>Робот на простом участке</b><small>безопасные задачи</small></div>
          <div id="wh-3"><b>Расширение</b><small>больше задач и агентов</small></div>
        </div>
        <div class="row"><button class="btn small" type="button" id="wh-play">▶ Показать порядок</button><span class="task" id="wh-text" aria-live="polite">Порядок важен: каждый шаг опирается на предыдущий.</span></div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Разметка и схема склада</b><span>= AGENTS.md, README модулей, карта сервисов</span></div>
        <div><b>Датчики на полках</b><span>= тесты, типы, линтер — агент видит, что сломал</span></div>
        <div><b>Простой участок</b><span>= тесты, документация, мелкие баги</span></div>
        <div><b>Хаотичный склад</b><span>= legacy без тестов, где всё связано со всем</span></div>
      </div>
      <p>Агент работает так же хорошо, как хорошо устроена среда вокруг него. В понятном проекте с быстрыми проверками он полезен. В хаосе — опасен.</p>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <p>Сначала короткий фильм — 43 секунды: старый проект как город, где здания — файлы. Остановите в любой момент, перемотайте, поверните город мышью и кликните по зданиям.</p>
      <figure class="stage3d" data-stage="gorod-koda">
        <div class="stage3d-view"></div>
        <figcaption class="stage3d-alt">3D-фильм «Город кода». Старый проект — серый город, где все файлы связаны со всеми, а агент без карты кружит над крышами. Карта проекта — AGENTS.md и README — делит город на кварталы-модули: заказы, отчёты, доставка, биллинг. Тесты красят здания: зелёные покрыты, жёлтые частично, красные без тестов — опасная зона. Агент идёт по лестнице задач: объяснить код, написать тесты, починить мелкий баг с тестом, сделать фичу по спеке, а красные кварталы огорожены до поры. Характеризационный тест накрывает старый расчёт доставки стеклом и фиксирует его поведение. Старый биллинг заменяют по частям: перед ним ставят фасад, новый модуль растёт по одной функции, трафик переходит, и старое здание пустеет.</figcaption>
      </figure>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Агенту нужны карта и обратная связь</h3>
        <p>Новый разработчик в команде первые недели спрашивает: где что лежит, как запустить, как проверить. У агента та же проблема, только спросить ему некого, а памяти между сессиями нет. Поэтому ответы должны лежать в проекте.</p>
        <p>Две вещи решают почти всё:</p>
        <ul>
          <li><strong>Карта.</strong> Где модули, какие правила, что нельзя трогать. Это файл правил для агента и короткие README.</li>
          <li><strong>Обратная связь.</strong> Одна команда, которая за минуты говорит: «всё хорошо» или «сломано вот тут». Тесты, линтер, проверка типов.</li>
        </ul>
        <div class="tip"><b>Пример</b>Задача: «почини расчёт скидки». В проекте без тестов агент поправит формулу и скажет «готово». Проверить нечем. В проекте с тестами он запустит их, увидит красный тест про скидку для оптовиков и исправит до того, как вы откроете PR.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Семь паттернов AI-First</h3>
        <ol>
          <li><strong>Карта проекта и правила.</strong> <code>AGENTS.md</code> (или <code>CLAUDE.md</code>) в корне: как запустить, как проверить, правила кода, запреты. Короткие README в ключевых модулях.</li>
          <li><strong>Быстрая обратная связь.</strong> Одна команда <code>make check</code> или <code>composer check</code>: тесты, линтер, статический анализ. Чем быстрее, тем чаще агент её запускает.</li>
          <li><strong>Характеризационные тесты.</strong> Перед правкой старого кода фиксируем, как он работает сейчас, даже если странно. Агент правит — тест показывает, что поведение не уехало.</li>
          <li><strong>Границы модулей и контракты.</strong> Чем меньше модуль связан с остальными, тем меньше контекста нужно агенту и тем меньше он сломает.</li>
          <li><strong>Генераторы для шаблонного.</strong> CRUD, DTO, клиенты API делает генератор, а не агент (урок 6). Быстрее, дешевле, одинаково.</li>
          <li><strong>Спецификации для изменений.</strong> Новая функциональность начинается со спеки, а не с «сделай фичу» (урок 5).</li>
          <li><strong>Постепенное внедрение.</strong> Сначала безопасные задачи, потом средние, потом сложные. На каждом шаге — метрики.</li>
        </ol>
        <details class="more">
          <summary>Пример AGENTS.md для legacy-проекта <span class="hint">— шаблон</span></summary>
          <div class="more-body">
            <p>Коротко и по делу. Агент читает этот файл в начале каждой сессии, поэтому каждая строка стоит токенов.</p>
<pre data-lang="md"># Магазин — правила для агента

## Запуск и проверка
- Поднять: \`docker compose up -d\`
- Проверить всё: \`make check\` (тесты + PHPStan + php-cs-fixer, ~3 мин)
- Один тест: \`vendor/bin/phpunit --filter ИмяТеста\`

## Карта
- \`src/Order/\` — заказы и расчёт цены. Владелец: команда Checkout.
- \`src/Billing/\` — платежи. Любая правка — только с тестом.
- \`legacy/\` — старый код. Не рефакторить без характеризационных тестов.

## Правила
- Деньги — только в копейках (int), никаких float.
- Миграции БД не писать без отдельной задачи.
- Не трогать \`config/secrets/\` и \`.env\`.

## Готово, если
- \`make check\` зелёный;
- на новое поведение есть тест;
- в описании PR — что и зачем изменено.</pre>
          </div>
        </details>
        <details class="more">
          <summary>Одна команда «проверь всё» <span class="hint">— PHP, JS, Python</span></summary>
          <div class="more-body">
            <div class="code-tabs">
<pre data-lang="json" data-label="PHP · composer.json">{
  "scripts": {
    "test": "phpunit",
    "stan": "phpstan analyse --no-progress",
    "cs": "php-cs-fixer fix --dry-run --diff",
    "check": ["@cs", "@stan", "@test"]
  }
}</pre>
<pre data-lang="json" data-label="JS · package.json">{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "npm run lint && npm run typecheck && npm test"
  }
}</pre>
<pre data-lang="sh" data-label="Python · Makefile">.PHONY: check
check:
	ruff check .
	mypy src
	pytest -q</pre>
            </div>
            <p>Сделайте вывод коротким: агенту нужны имена упавших тестов и строки ошибок, а не тысяча строк лога.</p>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Как внедрять, не ломая систему и команду</h3>
        <p><strong>Лестница задач.</strong> Сначала агент только читает и объясняет код. Потом пишет тесты и документацию. Потом чинит мелкие баги, где есть тест. Потом делает средние фичи по спеке. Сложные изменения с деньгами и миграциями — последними и с человеком на ключевых шагах.</p>
        <p><strong>Удушающее дерево</strong> (<span class="term" data-tip="Strangler fig — паттерн, при котором новый код постепенно «обрастает» вокруг старого и забирает его функции по одной, пока старый не станет не нужен.">strangler fig</span>). Старый модуль не переписывают целиком. Ставят перед ним фасад и по одной функции переносят в новый код. Новый код агент пишет по спеке и с тестами, старый тем временем продолжает работать.</p>
        <p><strong>Метрики внедрения.</strong> Сколько задач решено с агентом, время от задачи до PR, доля откатов и регрессий, стоимость на задачу. Если откатов стало больше — притормозите и усильте проверки.</p>
        <p><strong>Люди и процесс.</strong> За код агента отвечает человек, который открыл PR. Ревью остаётся. Команде нужно обучение: как ставить задачи, как читать сессию агента, когда остановить его.</p>
        <div class="warn"><b>Анти-паттерны</b>Агенту дали доступ к проду. «Большой взрыв»: переписать всё за месяц агентами. Внедрение без тестов: агент быстро производит код, который никто не может проверить.</div>
        <details class="more">
          <summary>Характеризационный тест <span class="hint">— PHP, Python, JS</span></summary>
          <div class="more-body">
            <p>Мы не знаем, правильно ли старый код считает доставку. Но знаем, что сейчас клиенты платят именно так. Фиксируем текущие ответы на реальных входах. Потом агент рефакторит — тест следит, чтобы ничего не уехало.</p>
            <div class="code-tabs">
<pre data-lang="php">&lt;?php
use PHPUnit\\Framework\\Attributes\\DataProvider;
use PHPUnit\\Framework\\TestCase;

final class LegacyShippingCharacterizationTest extends TestCase
{
    // Значения сняты с текущего прода. Странное (бесплатно при 0 кг) — тоже фиксируем.
    public static function cases(): iterable
    {
        yield 'лёгкая посылка' => [0.5, 'MINSK', 350];
        yield 'тяжёлая посылка' => [12.0, 'MINSK', 1890];
        yield 'регион' => [2.0, 'BREST', 790];
        yield 'вес 0 — так сейчас' => [0.0, 'MINSK', 0];
    }

    #[DataProvider('cases')]
    public function testKeepsCurrentBehaviour(float $kg, string $city, int $expectedKopecks): void
    {
        self::assertSame($expectedKopecks, legacy_calc_shipping($kg, $city));
    }
}</pre>
<pre data-lang="py">import pytest
from legacy.shipping import calc_shipping

# Значения сняты с текущего поведения. Не «как должно быть», а «как есть».
@pytest.mark.parametrize("kg, city, expected", [
    (0.5, "MINSK", 350),
    (12.0, "MINSK", 1890),
    (2.0, "BREST", 790),
    (0.0, "MINSK", 0),   # странно, но так сейчас работает прод
])
def test_keeps_current_behaviour(kg, city, expected):
    assert calc_shipping(kg, city) == expected</pre>
<pre data-lang="js">import { test } from "node:test";
import assert from "node:assert/strict";
import { calcShipping } from "../legacy/shipping.js";

const cases = [
  [0.5, "MINSK", 350],
  [12.0, "MINSK", 1890],
  [2.0, "BREST", 790],
  [0.0, "MINSK", 0], // фиксируем как есть
];

for (const [kg, city, expected] of cases) {
  test(\`доставка \${kg} кг в \${city}\`, () => {
    assert.equal(calcShipping(kg, city), expected);
  });
}</pre>
            </div>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Оцените свой проект и спланируйте внедрение</h2>
      </div>

      <!-- 3.1 Самооценка -->
      <div class="stand" id="rd">
        <div class="stand-head"><h3>Насколько проект готов к агентам</h3><span class="badge">интерактив 1 из 4</span></div>
        <p class="task">Ответы заполнены примером «типичный legacy-проект». Поменяйте их под свой проект и нажмите «Оценить».</p>
        <div class="rd-grid" id="rd-form"></div>
        <div class="row"><button class="btn" type="button" id="rd-go">Оценить</button><button class="btn quiet" type="button" id="rd-example">Вернуть пример</button><span class="result-line" id="rd-total" aria-live="polite"></span></div>
        <div class="grid-2">
          <div class="bars" id="rd-bars" aria-label="Оценка по областям"></div>
          <div class="roadmap" id="rd-plan" aria-live="polite"></div>
        </div>
      </div>

      <!-- 3.2 Лестница -->
      <div class="stand" id="ld">
        <div class="stand-head"><h3>Лестница внедрения: какие задачи и когда</h3><span class="badge">интерактив 2 из 4</span></div>
        <div class="flow">
          <div class="node" id="ld-n0"><b>1. Чтение</b><small>объяснить, найти</small></div><span class="arrow">→</span>
          <div class="node" id="ld-n1"><b>2. Безопасные правки</b><small>тесты, доки, мелкие баги</small></div><span class="arrow">→</span>
          <div class="node" id="ld-n2"><b>3. Фичи по спеке</b><small>средние задачи</small></div><span class="arrow">→</span>
          <div class="node" id="ld-n3"><b>4. Сложное</b><small>деньги, миграции</small></div>
        </div>
        <div class="ladder-info" id="ld-info" aria-live="polite">Нажмите «Дальше», чтобы подняться на ступень.</div>
        <div class="row">
          <button class="btn quiet" type="button" id="ld-prev">← Назад</button>
          <button class="btn" type="button" id="ld-next">Дальше →</button>
          <button class="btn secondary" type="button" id="ld-play">▶ Авто</button>
          <button class="btn quiet" type="button" id="ld-reset">Сначала</button>
          <span class="task" id="ld-label"></span>
        </div>
      </div>

      <!-- 3.3 Симулятор legacy -->
      <div class="stand" id="lg">
        <div class="stand-head"><h3>Что дают вложения в проект</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">Двигайте ползунки и давайте агенту 50 задач. Модель — иллюстрация: коэффициенты подобраны, чтобы показать направление, а не точные цифры.</p>
        <div class="grid-3">
          <div class="field"><label for="lg-cov">Покрытие тестами: <span class="mono" id="lg-cov-val">10%</span></label><input type="range" id="lg-cov" min="0" max="90" step="5" value="10"></div>
          <div class="field"><label for="lg-doc">Документация для агента: <span class="mono" id="lg-doc-val">0%</span></label><input type="range" id="lg-doc" min="0" max="100" step="10" value="0"></div>
          <div class="field"><label for="lg-cpl">Связность кода: <span class="mono" id="lg-cpl-val">80%</span> <small>всё связано со всем = 100%</small></label><input type="range" id="lg-cpl" min="0" max="100" step="10" value="80"></div>
        </div>
        <div class="row"><button class="btn" type="button" id="lg-run">▶ Дать агенту 50 задач</button></div>
        <div class="dots" id="lg-dots" aria-hidden="true"></div>
        <div class="legend"><span style="--c: var(--hc-ok)">решено</span><span style="--c: var(--hc-warn)">не решено, видно сразу</span><span style="--c: var(--hc-bad)">«решено», но сломано незаметно</span></div>
        <div class="stats">
          <div><b id="lg-ok">—</b>решено</div>
          <div><b id="lg-fail">—</b>не решено</div>
          <div><b id="lg-esc">—</b>скрытых регрессий</div>
        </div>
        <p class="task" id="lg-text" aria-live="polite"></p>
      </div>

      <!-- 3.4 Strangler fig -->
      <div class="stand" id="sf">
        <div class="stand-head"><h3>Strangler fig: заменяем модуль скидок по частям</h3><span class="badge">интерактив 4 из 4</span></div>
        <div class="sf">
          <div class="sf-facade" id="sf-facade">Фасад (роутер)</div>
          <div class="sf-boxes">
            <div class="old" id="sf-old"><b>Старый монолит</b><br><small>скидки внутри OrderService, 2 000 строк</small></div>
            <div class="new" id="sf-new"><b>Новый модуль скидок</b><br><small>по спеке, с тестами</small></div>
          </div>
          <div class="sf-traffic" aria-label="Распределение трафика"><div class="t-old" id="sf-t-old">старый 100%</div><div class="t-new" id="sf-t-new"></div></div>
          <div class="ladder-info" id="sf-info" aria-live="polite">Нажмите «Дальше».</div>
        </div>
        <div class="row">
          <button class="btn quiet" type="button" id="sf-prev">← Назад</button>
          <button class="btn" type="button" id="sf-next">Дальше →</button>
          <button class="btn secondary" type="button" id="sf-play">▶ Авто</button>
          <button class="btn quiet" type="button" id="sf-reset">Сначала</button>
          <span class="task" id="sf-label"></span>
        </div>
      </div>
    </section>

    <!-- ============ 4. ПРАКТИКА ============ -->
    <section class="step" id="practice">
      <div class="step-head">
        <span class="step-tag"><b>4</b> Тесты</span>
        <h2>Проверьте себя</h2>
        <p>Код писать не нужно. Где верный ответ один, он засчитывается по клику. Где написано «Отметьте все верные ответы», выберите все подходящие и нажмите «Проверить»: зачёт только при точном совпадении. Ответы сохраняются в браузере.</p>
      </div>

      <div class="quiz">
        <h3>Вопросы по уроку</h3>
        <div class="q" data-q="l9-first">
          <p>Команда решила внедрять агентов в старый проект. С чего начать?</p>
          <div class="options">
            <button>Дать агенту большую фичу, чтобы сразу увидеть пользу</button>
            <button data-right>Описать проект для агента и сделать одну быструю команду проверки</button>
            <button>Купить всем подписку и подождать</button>
          </div>
          <p class="why">Без карты агент блуждает, без проверок — ломает незаметно. Это фундамент, на котором работают все следующие шаги.</p>
        </div>
        <div class="q" data-q="l9-char">
          <p>Что такое характеризационный тест?</p>
          <div class="options">
            <button>Тест, который проверяет, что код соответствует ТЗ</button>
            <button data-right>Тест, который фиксирует текущее поведение старого кода, даже странное, перед правками</button>
            <button>Тест производительности под нагрузкой</button>
          </div>
          <p class="why">Мы не всегда знаем, как «правильно». Но знаем, как работает сейчас. Тест не даст агенту случайно это поменять.</p>
        </div>
        <div class="q" data-q="l9-strangler">
          <p>Как работает паттерн strangler fig?</p>
          <div class="options">
            <button>Старый модуль удаляют и пишут новый с нуля за один релиз</button>
            <button data-right>Перед старым кодом ставят фасад и переносят функции в новый код по одной, переключая трафик частями</button>
            <button>Старый и новый код всегда работают параллельно</button>
          </div>
          <p class="why">Замена идёт маленькими шагами. Каждый шаг можно проверить и откатить. Когда старый код больше не получает трафик, его удаляют.</p>
        </div>
        <div class="q" data-q="l9-metric">
          <p>Какая метрика первой покажет, что внедрение агентов вредит?</p>
          <div class="options">
            <button>Число строк кода, которые написал агент</button>
            <button>Число сессий агента в день</button>
            <button data-right>Рост доли откатов и регрессий после релизов</button>
          </div>
          <p class="why">Объём кода и активность ничего не говорят о качестве. Откаты и регрессии — прямой сигнал, что проверки слабее, чем скорость.</p>
        </div>
        <div class="q" data-q="l9-map-feedback" data-multi>
          <p>Что агенту нужно в старом проекте в первую очередь?</p>
          <div class="options">
            <button data-right>Карта: <code>AGENTS.md</code> и короткие README в ключевых модулях</button>
            <button data-right>Одна быстрая команда проверки: тесты, линтер, типы</button>
            <button>Доступ к боевой базе, чтобы видеть настоящие данные</button>
            <button>Модель с огромным окном, чтобы загрузить весь репозиторий разом</button>
          </div>
          <p class="why">Карта говорит, где что лежит и что трогать нельзя. Быстрая проверка показывает, что сломано. Доступ к проду — анти-паттерн. Огромное окно не заменяет карту: агент утонет в коде и всё равно не сможет проверить правку.</p>
        </div>
        <div class="q" data-q="l9-first-wave" data-multi>
          <p>Какие задачи дать агенту в первой волне внедрения?</p>
          <div class="options">
            <button data-right>Объяснить, как работает модуль</button>
            <button data-right>Написать тесты и документацию</button>
            <button>Миграция таблицы с платежами</button>
            <button data-right>Мелкий баг, на который уже есть тест</button>
          </div>
          <p class="why">Первая волна — задачи с низким риском: ошибку легко заметить и откатить. Миграция платежей трогает деньги и базу — это последняя волна, со спекой и человеком на ключевых шагах.</p>
        </div>
        <div class="q" data-q="l9-risk" data-multi>
          <p>Что повышает риск задачи для агента?</p>
          <div class="options">
            <button data-right>Задача трогает деньги</button>
            <button data-right>Нужна миграция базы данных</button>
            <button data-right>На этот код нет тестов</button>
            <button>Задача маленькая и описана в спеке</button>
          </div>
          <p class="why">Деньги и миграции дорого ошибаются и плохо откатываются, а без тестов ошибку никто не заметит. Маленький размер и спека риск, наоборот, снижают: правку легко проверить.</p>
        </div>
        <div class="q" data-q="l9-check-output">
          <p>Команда <code>make check</code> упала. Что лучше показать агенту?</p>
          <div class="options">
            <button>Полный лог на тысячу строк, чтобы ничего не упустить</button>
            <button data-right>Имена упавших тестов и строки с ошибками</button>
            <button>Только код выхода 1</button>
          </div>
          <p class="why">Каждая строка лога занимает окно и стоит токенов. Агенту нужно ровно то, что поможет починить: какой тест упал и где. Один код выхода говорит «сломано», но не говорит что.</p>
        </div>
        <div class="q" data-q="l9-antipatterns" data-multi>
          <p>Какие подходы урок называет анти-паттернами?</p>
          <div class="options">
            <button data-right>Дать агенту доступ к продакшену</button>
            <button data-right>«Большой взрыв»: переписать всё агентами за месяц</button>
            <button>Начать с одной задачи из безопасной волны</button>
            <button data-right>Внедрять агентов в код без тестов</button>
          </div>
          <p class="why">Доступ к проду превращает ошибку агента в аварию. Большой взрыв нельзя проверить по частям. Без тестов агент быстро производит код, который никто не может проверить. Одна безопасная задача — как раз правильный старт.</p>
        </div>
        <div class="q" data-q="l9-readiness" data-multi>
          <p>Самооценка показала: тестов мало, файла правил нет. Какие шаги поднимут готовность проекта?</p>
          <div class="options">
            <button data-right>Завести <code>AGENTS.md</code>: как запустить, как проверить, что нельзя трогать</button>
            <button data-right>Собрать проверки в одну команду <code>check</code></button>
            <button>Перейти на самую дорогую модель</button>
            <button data-right>Написать характеризационные тесты на ключевые расчёты</button>
          </div>
          <p class="why">Готовность — это среда вокруг агента: карта, быстрая обратная связь и тесты, которые держат старое поведение. Дорогая модель в хаосе ошибается так же, только дороже.</p>
        </div>
        <div class="q" data-q="l9-owner">
          <p>Код написал агент, PR прошёл ревью, после релиза нашли баг. Кто за него отвечает?</p>
          <div class="options">
            <button>Агент — он написал код</button>
            <button>Провайдер модели</button>
            <button data-right>Человек, который открыл PR</button>
          </div>
          <p class="why">Агент — инструмент. За его код отвечает тот, кто открыл PR, поэтому ревью остаётся. Команде нужно уметь читать сессию агента и вовремя его остановить.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 1 час</span></summary>
        <div class="more-body">
          <ol>
            <li>Пройдите самооценку выше честно. Запишите три самые слабые области.</li>
            <li>Напишите первую версию <code>AGENTS.md</code> по шаблону из урока. Не больше 40 строк.</li>
            <li>Сделайте команду <code>check</code>. Засеките, сколько она идёт.</li>
            <li>Возьмите 10 задач из бэклога и разложите на волны по риску: деньги, миграции, размер, есть ли тесты. Первую задачу из волны 1 отдайте агенту.</li>
          </ol>
        </div>
      </details>
    </section>

    <!-- ============ 5. ЧЕК-ЛИСТ ============ -->
    <section class="step" id="checklist">
      <div class="step-head">
        <span class="step-tag"><b>5</b> Чек-лист</span>
        <h2>Отметьте, что усвоили</h2>
      </div>
      <ul class="checklist" data-id="main">
        <li>Понимаю: AI-First — это понятный и проверяемый проект, а не чат в IDE.</li>
        <li>Знаю, что писать в AGENTS.md и почему он должен быть коротким.</li>
        <li>У меня есть или я знаю, как сделать одну команду «проверь всё».</li>
        <li>Могу объяснить, зачем характеризационные тесты перед правкой legacy.</li>
        <li>Знаю порядок внедрения: чтение, безопасные правки, фичи по спеке, сложное.</li>
        <li>Могу объяснить strangler fig на примере.</li>
        <li>Знаю анти-паттерны: прод-доступ агенту, «большой взрыв», внедрение без тестов.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Проект готов к агентам. Остался последний шаг — много агентов и много репозиториев сразу.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://habr.com/ru/companies/oleg-bunin/articles/546316/" target="_blank" rel="noopener">Ты приходишь в проект, а там легаси…</a><span>пошагово: smoke-тесты как страховка, удаление мёртвого кода, статический анализ. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/562498/" target="_blank" rel="noopener">Чему можно научиться у фикуса-душителя? Паттерн Strangler</a><span>strangler fig на примере сервиса доставки, смена хранения в три этапа. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/companies/otus/articles/943266/" target="_blank" rel="noopener">Как ИИ помогает разгрести легаси и ускорить модернизацию</a><span>ИИ как инструмент понять старую систему, а не только писать код. <span class="pill ok">рус.</span></span></li><li><a href="https://code.claude.com/docs/ru/best-practices" target="_blank" rel="noopener">Лучшие практики для Claude Code</a><span>официально: как дать агенту способ проверить себя и как вести его по большому проекту. <span class="pill ok">рус., офиц.</span></span></li><li><a href="https://agents.md/" target="_blank" rel="noopener">AGENTS.md</a><span>открытый формат «README для агентов»: что положить в репозиторий, чтобы агент понимал проект. <span class="pill">англ.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://getrector.com/demo" target="_blank" rel="noopener">Rector Demo</a><span>автоматический детерминированный рефакторинг старого PHP-кода: вставить код и посмотреть дифф.</span></li><li><a href="https://phpstan.org/try" target="_blank" rel="noopener">PHPStan Playground</a><span>поднимать уровень строгости шаг за шагом, как при постепенном внедрении на легаси.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>прогнать один фрагмент на разных версиях PHP и зафиксировать текущее поведение перед правкой.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .wh { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.4rem; }
.hc .wh > div { background: var(--hc-surface); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.55rem 0.65rem; font-size: var(--hc-fs-sm); display: grid; gap: 0.2rem; transition: border-color 0.3s, background 0.3s; }
.hc .wh > div small { color: var(--hc-muted); }
.hc .wh > div.on { border-color: var(--hc-warm); background: var(--hc-warm-soft); }
@media (max-width: 640px) {
.hc .wh { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.hc .rd-area { display: grid; gap: 0.45rem; padding: 0.75rem 0.85rem; border: 1px solid var(--hc-line); border-radius: var(--hc-r-sm); background: var(--hc-bg); }
.hc .rd-area h4 { font-size: var(--hc-fs-sm); }
.hc .rd-q { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.6rem; align-items: center; font-size: var(--hc-fs-sm); }
.hc .rd-q label { font-weight: 400; }
.hc .rd-q select { width: auto; }
.hc .rd-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); gap: 0.6rem; }
.hc .bars { display: grid; gap: 0.4rem; }
.hc .bars .b { display: grid; grid-template-columns: 8.5rem minmax(0, 1fr) 3rem; gap: 0.6rem; align-items: center; font-size: var(--hc-fs-sm); }
.hc .bars .track { height: 0.8rem; background: var(--hc-surface-2); border-radius: 4px; overflow: hidden; }
.hc .bars .track i { display: block; height: 100%; transition: width 0.4s; }
.hc .bars .v { font: 600 var(--hc-fs-xs) var(--hc-f-mono); text-align: right; font-variant-numeric: tabular-nums; }
.hc .roadmap { display: grid; gap: 0.5rem; }
.hc .roadmap > div { background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.6rem 0.8rem; font-size: var(--hc-fs-sm); display: grid; gap: 0.25rem; }
.hc .roadmap b { font-size: var(--hc-fs-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--hc-accent); }
.hc .ladder-info { background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.75rem 0.9rem; font-size: var(--hc-fs-sm); display: grid; gap: 0.35rem; min-height: 6rem; }
.hc .dots { display: flex; flex-wrap: wrap; gap: 4px; }
.hc .dots i { width: 12px; height: 12px; border-radius: 3px; background: var(--hc-surface-2); }
.hc .dots i.y { background: var(--hc-ok); animation: hc-pop 0.2s ease-out; }
.hc .dots i.w { background: var(--hc-warn); animation: hc-pop 0.2s ease-out; }
.hc .dots i.n { background: var(--hc-bad); animation: hc-pop 0.2s ease-out; }
.hc .legend { display: flex; flex-wrap: wrap; gap: 0.9rem; font-size: var(--hc-fs-xs); color: var(--hc-muted); }
.hc .legend span::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 0.35rem; vertical-align: -1px; background: var(--c); }
.hc .stats { display: flex; flex-wrap: wrap; gap: 1.2rem; font-size: var(--hc-fs-sm); }
.hc .stats b { font: 600 var(--hc-fs-lg) var(--hc-f-mono); display: block; font-variant-numeric: tabular-nums; }
.hc .sf { display: grid; gap: 0.6rem; }
.hc .sf-boxes { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.6rem; }
.hc .sf-boxes > div { border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; font-size: var(--hc-fs-sm); transition: opacity 0.4s, border-color 0.3s; }
.hc .sf-boxes .old { background: var(--hc-surface-2); }
.hc .sf-boxes .new { background: var(--hc-ok-soft); }
.hc .sf-boxes .dim { opacity: 0.35; }
.hc .sf-boxes .gone { opacity: 0.25; text-decoration: line-through; }
.hc .sf-facade { text-align: center; font: 600 var(--hc-fs-xs) var(--hc-f-mono); border: 1.5px dashed var(--hc-accent); border-radius: var(--hc-r-sm); padding: 0.35rem; color: var(--hc-accent); transition: opacity 0.3s; }
.hc .sf-traffic { display: flex; height: 1.6rem; border-radius: var(--hc-r-sm); overflow: hidden; border: 1px solid var(--hc-line); font: 600 0.7rem var(--hc-f-mono); }
.hc .sf-traffic div { display: grid; place-items: center; transition: flex-basis 0.5s; overflow: hidden; white-space: nowrap; }
.hc .sf-traffic .t-old { background: color-mix(in srgb, var(--hc-ink) 16%, transparent); }
.hc .sf-traffic .t-new { background: color-mix(in srgb, var(--hc-ok) 40%, transparent); }
</style>
`;export{n as default};
