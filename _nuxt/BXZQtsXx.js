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
      <span class="eyebrow">Часть 3 · Работа по плану · Урок 5</span>
      <h1>Сначала спецификация, потом код: требования, сценарии и жизненный цикл изменения</h1>
      <p class="lead">Если не записать решения заранее, агент придумывает их на каждом шаге. И каждый раз немного по-другому. Спецификация фиксирует, что должно получиться, до первой строки кода, и превращается в тесты.</p>
      <div class="facts">
        <span class="fact">~50 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">11 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>объяснить, чем разработка по спецификации отличается от «просто попросить агента»;</li>
          <li>писать требования со словами SHALL/MUST и сценарии WHEN/THEN;</li>
          <li>провести изменение по циклу: предложение, дельта спецификации, дизайн, задачи, архив;</li>
          <li>превращать сценарии в каркасы тестов на своём языке;</li>
          <li>находить размытые требования до того, как их прочитает агент.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Стройка по чертежу и без него</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Прорабу говорят: «Построй хороший дом». Каждая бригада решает сама, где окна и сколько этажей. С чертежом все строят одно и то же, а приёмка сверяет дом с чертежом по пунктам.</p>
      </div>
      <div class="stand build" id="build">
        <div class="stand-head"><h3>Пять бригад, один дом</h3><span class="badge">анимация</span></div>
        <div class="build-row" id="build-vibe"><span>Без чертежа</span></div>
        <div class="build-row" id="build-spec"><span>По чертежу</span></div>
        <div class="row">
          <button class="btn small" type="button" id="build-play">▶ Строить</button>
          <button class="btn small quiet" type="button" id="build-reset">Сначала</button>
          <span class="task" id="build-note" aria-live="polite"></span>
        </div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Чертёж</b><span>= спецификация (spec.md)</span></div>
        <div><b>Акт приёмки по пунктам</b><span>= сценарии, из которых делают тесты</span></div>
        <div><b>План работ</b><span>= список задач (tasks.md)</span></div>
        <div><b>Новая бригада каждое утро</b><span>= новая сессия агента без памяти</span></div>
        <div><b>Журнал изменений проекта</b><span>= папка изменения и её архив</span></div>
      </div>
      <p>Главная мысль: спецификация — это <strong>договор, который переживает сессии</strong>. Агент может забыть разговор. Файл со спецификацией он прочитает заново, а тесты из сценариев не дадут отступить от него.</p>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Сначала договориться, потом писать код</h3>
        <p>Попросите агента: «Сделай ограничение попыток входа». Ему придётся решить за вас: сколько попыток, на какой срок блокировать, считать по IP или по логину, что ответить пользователю. Он решит. Завтра в новой сессии он решит ещё раз, и, возможно, иначе. Такой подход называют <span class="term" data-tip="Vibe coding — разработка «по ощущениям»: просим агента, принимаем то, что выглядит рабочим, без зафиксированных требований.">вайб-кодингом</span>.</p>
        <p><strong>Spec-Driven Development</strong> (разработка от спецификации) меняет порядок. Сначала вы записываете решения в файл. Потом агент реализует ровно их. Минимальная единица — требование и сценарий его проверки:</p>
        <pre data-lang="md">### Requirement: Ограничение попыток входа
Система SHALL блокировать вход по логину на 15 минут
после 5 неудачных попыток подряд.

#### Scenario: Шестая попытка заблокирована
- **WHEN** пользователь 5 раз подряд ввёл неверный пароль
- **THEN** шестая попытка получает ответ 429
- **AND** вход по этому логину снова доступен через 15 минут</pre>
        <div class="tip"><b>Что важно</b>Требование говорит, что система обязана делать. Сценарий говорит, как это проверить. Требование без сценария — пожелание.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Как устроена спецификация и цикл изменения</h3>
        <p><strong>Слова SHALL и MUST.</strong> Это слова обязательности из стандарта <span class="term" data-tip="RFC 2119 — короткий стандарт IETF, который фиксирует смысл слов MUST, SHALL, SHOULD, MAY в спецификациях.">RFC 2119</span>. MUST и SHALL значат «обязательно». SHOULD — «желательно». Слова «желательно, по возможности, быстро» агент прочитает как разрешение сделать как угодно.</p>
        <p><strong>Сценарии.</strong> Формат пришёл из <span class="term" data-tip="Behavior-Driven Development — подход, где поведение описывают сценариями «дано, когда, тогда», понятными и людям, и тестам.">BDD</span>: GIVEN (дано, исходное состояние), WHEN (когда, действие), THEN (тогда, ожидаемый результат), AND (и ещё). Каждый сценарий — готовый тест.</p>
        <p><strong>Нефункциональные требования.</strong> Скорость, безопасность, ограничения. Тоже с числами: «ответ SHALL приходить быстрее 300 мс для 95% запросов», а не «должно работать быстро».</p>
        <p><strong>Цикл изменения.</strong> Возьмём инструмент <span class="term" data-tip="OpenSpec — открытый инструмент для разработки по спецификациям: хранит спецификации и изменения в папке openspec/ репозитория.">OpenSpec</span>. Текущая правда о системе лежит в <code>openspec/specs/</code>. Каждое изменение — отдельная папка в <code>openspec/changes/&lt;имя&gt;/</code>:</p>
        <ol>
          <li><code>proposal.md</code> — зачем меняем и что именно.</li>
          <li><code>specs/&lt;возможность&gt;/spec.md</code> — дельта: какие требования добавлены (ADDED), изменены (MODIFIED), удалены (REMOVED).</li>
          <li><code>design.md</code> — как будем делать технически, если это не очевидно.</li>
          <li><code>tasks.md</code> — шаги-чекбоксы для реализации.</li>
          <li>Реализация и проверка: агент идёт по задачам, тесты из сценариев зелёные.</li>
          <li>Архив: дельта вливается в <code>openspec/specs/</code>, папка изменения уходит в архив.</li>
        </ol>
        <p>Похожий путь у GitHub Spec Kit: команды <code>/specify</code>, <code>/plan</code>, <code>/tasks</code> ведут от спецификации к плану и задачам. Инструменты разные, идея одна.</p>
        <details class="more">
          <summary>Пример файлов изменения целиком <span class="hint">— proposal, дельта, tasks</span></summary>
          <div class="more-body">
<pre data-lang="md"># openspec/changes/add-login-rate-limit/proposal.md
## Why
Ботами перебирают пароли. За неделю 12 000 неудачных входов с 40 логинов.

## What Changes
- Блокировка входа по логину после 5 неудачных попыток на 15 минут.
- Ответ 429 с понятным текстом и временем до разблокировки.

## Impact
- Затронуто: auth (вход), redis (счётчики).</pre>
<pre data-lang="md"># openspec/changes/add-login-rate-limit/specs/auth/spec.md
## ADDED Requirements
### Requirement: Ограничение попыток входа
Система SHALL блокировать вход по логину на 15 минут после 5 неудачных попыток подряд.

#### Scenario: Шестая попытка заблокирована
- **WHEN** пользователь 5 раз подряд ввёл неверный пароль
- **THEN** шестая попытка получает ответ 429

#### Scenario: Успешный вход сбрасывает счётчик
- **GIVEN** у логина 4 неудачные попытки
- **WHEN** пользователь ввёл верный пароль
- **THEN** счётчик неудачных попыток равен 0</pre>
<pre data-lang="md"># openspec/changes/add-login-rate-limit/tasks.md
## 1. Реализация
- [ ] 1.1 Счётчик неудачных попыток в redis с TTL 15 минут
- [ ] 1.2 Проверка лимита перед проверкой пароля, ответ 429
- [ ] 1.3 Сброс счётчика при успешном входе
## 2. Проверка
- [ ] 2.1 Тест на каждый сценарий из spec.md
- [ ] 2.2 Ручная проверка на стенде</pre>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Исполняемая спецификация и связь с harness</h3>
        <p><strong>Спецификация как часть процесса.</strong> Она не лежит мёртвым документом. Harness встраивает её в работу агента:</p>
        <ul>
          <li>скил «реализуй изменение» читает <code>tasks.md</code> и берёт первую незакрытую задачу;</li>
          <li>после каждой задачи агент отмечает чекбокс, так прогресс переживает новую сессию;</li>
          <li>из каждого сценария получается тест, и тест падает, пока поведение не совпало с договором;</li>
          <li>проверяющий агент или скрипт сверяет: у каждого требования есть сценарий, у каждого сценария есть тест;</li>
          <li>несколько агентов (урок 10) делят задачи из одного <code>tasks.md</code> и не спорят о целях.</li>
        </ul>
        <p><strong>Три ловушки.</strong></p>
        <ul>
          <li><strong>Размытые слова.</strong> «Быстро», «удобно», «корректно», «по возможности». Агент трактует их как хочет. Замените числом или сценарием.</li>
          <li><strong>Требование без сценария.</strong> Нельзя проверить — значит, нельзя доказать, что сделано.</li>
          <li><strong>Спецификация разошлась с кодом.</strong> Код поменяли руками, а спецификацию нет. Через месяц агент «починит» код обратно по старой спецификации. Лечится архивом изменений и правилом: поведение меняем только через изменение спецификации.</li>
        </ul>
        <div class="note"><b>Когда спецификация лишняя</b>Опечатка, правка константы, однострочный багфикс. Спецификация окупается там, где есть решения: новая функция, изменение поведения, спорная архитектура, работа сразу в нескольких сервисах.</div>
        <details class="more">
          <summary>Тест по сценарию на четырёх языках <span class="hint">— «Шестая попытка заблокирована»</span></summary>
          <div class="more-body">
            <div class="code-tabs">
<pre data-lang="php">&lt;?php
// tests/Auth/LoginRateLimitTest.php — PHPUnit
final class LoginRateLimitTest extends WebTestCase
{
    /** Scenario: Шестая попытка заблокирована */
    public function testSixthAttemptIsBlocked(): void
    {
        $client = static::createClient();
        // WHEN пользователь 5 раз подряд ввёл неверный пароль
        for ($i = 0; $i &lt; 5; $i++) {
            $client->jsonRequest('POST', '/api/login', ['login' => 'anna', 'password' => 'wrong']);
            self::assertResponseStatusCodeSame(401);
        }
        // THEN шестая попытка получает ответ 429
        $client->jsonRequest('POST', '/api/login', ['login' => 'anna', 'password' => 'wrong']);
        self::assertResponseStatusCodeSame(429);
    }
}</pre>
<pre data-lang="py"># tests/test_login_rate_limit.py — pytest
def test_sixth_attempt_is_blocked(client):
    """Scenario: Шестая попытка заблокирована"""
    # WHEN пользователь 5 раз подряд ввёл неверный пароль
    for _ in range(5):
        r = client.post("/api/login", json={"login": "anna", "password": "wrong"})
        assert r.status_code == 401
    # THEN шестая попытка получает ответ 429
    r = client.post("/api/login", json={"login": "anna", "password": "wrong"})
    assert r.status_code == 429</pre>
<pre data-lang="js">// test/login-rate-limit.test.js — node:test
import { test } from "node:test";
import assert from "node:assert/strict";
import { login } from "./helpers.js";

test("Scenario: Шестая попытка заблокирована", async () => {
  // WHEN пользователь 5 раз подряд ввёл неверный пароль
  for (let i = 0; i &lt; 5; i++) {
    assert.equal((await login("anna", "wrong")).status, 401);
  }
  // THEN шестая попытка получает ответ 429
  assert.equal((await login("anna", "wrong")).status, 429);
});</pre>
<pre data-lang="ts">// test/login-rate-limit.test.ts — node:test + TypeScript
import { test } from "node:test";
import assert from "node:assert/strict";
import { login } from "./helpers";

test("Scenario: Шестая попытка заблокирована", async () => {
  // WHEN пользователь 5 раз подряд ввёл неверный пароль
  for (let i = 0; i &lt; 5; i++) {
    const res: Response = await login("anna", "wrong");
    assert.equal(res.status, 401);
  }
  // THEN шестая попытка получает ответ 429
  assert.equal((await login("anna", "wrong")).status, 429);
});</pre>
            </div>
            <p class="footer-note">Имя теста повторяет имя сценария. Так по упавшему тесту сразу видно, какой пункт договора нарушен.</p>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Проведите изменение от идеи до архива</h2>
        <p>Сквозной пример: ограничение попыток входа. Пять неудачных попыток — блокировка на 15 минут.</p>
      </div>

      <!-- 3.1 Жизненный цикл -->
      <div class="stand" id="lc">
        <div class="stand-head"><h3>Жизненный цикл изменения</h3><span class="badge">интерактив 1 из 4</span></div>
        <div class="flow" id="lc-flow">
          <div class="node"><b>Предложение</b><small>proposal.md</small></div>
          <div class="node"><b>Дельта</b><small>spec.md</small></div>
          <div class="node"><b>Дизайн</b><small>design.md</small></div>
          <div class="node"><b>Задачи</b><small>tasks.md</small></div>
          <div class="node"><b>Код</b><small>реализация</small></div>
          <div class="node"><b>Проверка</b><small>тесты</small></div>
          <div class="node"><b>Архив</b><small>в specs/</small></div>
        </div>
        <div class="lc-files">
          <ul class="tree" id="lc-tree" aria-label="Файлы в репозитории"></ul>
          <div class="lc-view">
            <span class="fname" id="lc-fname">Нажмите «Дальше»</span>
            <pre class="no-copy" id="lc-text">Изменение начинается с вопроса «зачем».</pre>
          </div>
        </div>
        <p class="task" id="lc-say" aria-live="polite"></p>
        <div class="row">
          <button class="btn quiet" type="button" id="lc-prev">← Назад</button>
          <button class="btn" type="button" id="lc-next">Дальше →</button>
          <button class="btn secondary" type="button" id="lc-play">▶ Авто</button>
          <button class="btn quiet" type="button" id="lc-reset">Сначала</button>
          <span class="task" id="lc-label">Шаг 0</span>
        </div>
      </div>

      <!-- 3.2 Линтер -->
      <div class="stand" id="lint">
        <div class="stand-head"><h3>Линтер требований</h3><span class="badge">интерактив 2 из 4</span></div>
        <p class="task">Напишите требование или выберите пример. Линтер ищет то, что агент прочитает двусмысленно. Такую проверку можно поставить в CI или хук, чтобы размытое требование не дошло до агента.</p>
        <div class="row" role="group" aria-label="Примеры требований">
          <button class="chip-btn" type="button" data-lint="bad">Плохое</button>
          <button class="chip-btn" type="button" data-lint="mid">Среднее</button>
          <button class="chip-btn" type="button" data-lint="good">Хорошее</button>
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="lint-input">Требование в формате markdown</label>
            <textarea id="lint-input" class="mono" rows="10"></textarea>
          </div>
          <div class="field">
            <span class="field" style="font-weight:600; font-size: var(--hc-fs-sm)">Как его увидит агент</span>
            <div class="lint-preview" id="lint-preview"></div>
          </div>
        </div>
        <div class="gauge"><span id="lint-score">Качество: —</span><div class="meter"><i id="lint-meter"></i></div></div>
        <ul class="lint-out" id="lint-out" aria-live="polite"></ul>
      </div>

      <!-- 3.3 Сценарий → тест -->
      <div class="stand" id="s2t">
        <div class="stand-head"><h3>От сценария к тесту</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">Выберите сценарий и язык. Каркас теста собирается по шаблону: имя из названия сценария, шаги — комментарии, проверки — из строк THEN.</p>
        <div class="row" role="group" aria-label="Сценарий" id="s2t-scen"></div>
        <div class="row" role="group" aria-label="Язык" id="s2t-lang"></div>
        <div class="grid-2">
          <pre class="no-copy" id="s2t-src"></pre>
          <pre id="s2t-out"></pre>
        </div>
      </div>

      <!-- 3.4 Вайб vs спека -->
      <div class="stand" id="race">
        <div class="stand-head"><h3>Две команды, пять сессий</h3><span class="badge">интерактив 4 из 4</span></div>
        <p class="task">Одна и та же задача, пять сессий агента подряд. Между сессиями память чата пропадает. Слева есть только переписка, справа — спецификация в репозитории.</p>
        <div class="race">
          <div class="lane" id="race-vibe"><h4>Только чат</h4><ol id="race-vibe-list"></ol><span class="final" id="race-vibe-final"></span></div>
          <div class="lane" id="race-spec"><h4>Спецификация в репозитории</h4><ol id="race-spec-list"></ol><span class="final" id="race-spec-final"></span></div>
        </div>
        <div class="row">
          <button class="btn" type="button" id="race-next">Следующая сессия</button>
          <button class="btn quiet" type="button" id="race-reset">Сначала</button>
          <span class="task" id="race-label">Сессия 0 из 5</span>
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
        <div class="q" data-q="l6-req">
          <p>Чем требование отличается от сценария?</p>
          <div class="options">
            <button>Ничем, это синонимы</button>
            <button data-right>Требование говорит, что система обязана делать. Сценарий — конкретный пример, как это проверить</button>
            <button>Требование пишет программист, сценарий — тестировщик</button>
          </div>
          <p class="why">Требование — правило. Сценарий — его проверяемый случай. Из сценария получается тест.</p>
        </div>
        <div class="q" data-q="l6-best">
          <p>Какое требование агент поймёт однозначно?</p>
          <div class="options">
            <button>«Вход должен быть защищён от перебора паролей»</button>
            <button>«Система должна быстро и корректно блокировать подозрительные входы»</button>
            <button data-right>«Система SHALL блокировать вход по логину на 15 минут после 5 неудачных попыток» плюс сценарий с ответом 429</button>
          </div>
          <p class="why">Числа, ключ блокировки, срок и проверяемый результат. В первых двух агенту придётся решать за вас.</p>
        </div>
        <div class="q" data-q="l6-archive">
          <p>Что происходит при архивации изменения?</p>
          <div class="options">
            <button data-right>Дельта требований вливается в основные спецификации, папка изменения уходит в архив</button>
            <button>Изменение удаляется вместе с тестами</button>
            <button>Код откатывается до состояния до изменения</button>
          </div>
          <p class="why">После архива <code>openspec/specs/</code> снова описывает систему как она есть. Следующее изменение начнётся от актуальной правды.</p>
        </div>
        <div class="q" data-q="l6-drift">
          <p>В новой сессии агент поставил лимит 10 попыток вместо договорённых 5. Как исправить надёжно?</p>
          <div class="options">
            <button>Написать в чат «мы же договорились на 5»</button>
            <button data-right>Записать лимит в спецификацию и сделать тест из сценария: тест упадёт при любом отступлении</button>
            <button>Перезапустить агента с другой моделью</button>
          </div>
          <p class="why">Чат пропадёт вместе с сессией. Файл в репозитории и красный тест — нет.</p>
        </div>
        <div class="q" data-q="l5-spec-vague" data-multi>
          <p>Какие слова в требовании агент прочитает как разрешение сделать как угодно?</p>
          <div class="options">
            <button data-right>«быстро»</button>
            <button data-right>«по возможности»</button>
            <button>«SHALL»</button>
            <button data-right>«корректно»</button>
          </div>
          <p class="why">Это размытые слова: у каждого своё «быстро» и своё «корректно». Линтер из интерактива 2 помечает их. SHALL — наоборот, слово обязательности: оно убирает двусмысленность. Размытое слово заменяют числом или сценарием: «быстрее 300 мс для 95% запросов».</p>
        </div>
        <div class="q" data-q="l5-spec-lint" data-multi>
          <p>Что линтер требований должен найти в строке «Вход должен работать быстро.»?</p>
          <div class="options">
            <button data-right>Нет слова SHALL или MUST</button>
            <button data-right>Есть размытое слово «быстро»</button>
            <button data-right>Нет сценария, который можно проверить</button>
            <button>Нет номера задачи из tasks.md</button>
          </div>
          <p class="why">Три проблемы сразу: нет обязательности, есть размытое слово, нет сценария — значит, нечем доказать, что сделано. Номер задачи требованию не нужен: задачи живут в tasks.md, а требование описывает поведение системы.</p>
        </div>
        <div class="q" data-q="l5-spec-scenario" data-multi>
          <p>Сценарий «Успешный вход сбрасывает счётчик» превращают в тест. Что верно?</p>
          <div class="options">
            <button data-right>GIVEN задаёт исходное состояние: у логина 4 неудачные попытки</button>
            <button data-right>Строки THEN становятся проверками результата</button>
            <button>AND после GIVEN добавляет ещё одну проверку результата</button>
            <button>Тест лучше назвать по номеру задачи, а не по сценарию</button>
          </div>
          <p class="why">GIVEN — подготовка, WHEN — действие, THEN — проверки. AND продолжает последний раздел: после GIVEN это ещё одно условие, после THEN — ещё одна проверка. Имя теста повторяет имя сценария: по красному тесту сразу видно, какой пункт договора нарушен.</p>
        </div>
        <div class="q" data-q="l5-spec-files" data-multi>
          <p>Что лежит в папке изменения <code>openspec/changes/&lt;имя&gt;/</code>?</p>
          <div class="options">
            <button data-right><code>proposal.md</code> — зачем меняем и что именно</button>
            <button data-right><code>tasks.md</code> — шаги-чекбоксы реализации</button>
            <button data-right><code>specs/…/spec.md</code> — дельта требований: что добавлено, изменено, удалено</button>
            <button>Журнал выкладок с датами и версиями</button>
          </div>
          <p class="why">Предложение, дельта, задачи и при необходимости <code>design.md</code>. Журнал выкладок к изменению не относится: изменение описывает поведение, а не то, когда его выкатили.</p>
        </div>
        <div class="q" data-q="l5-spec-skip" data-multi>
          <p>В каких задачах спецификация лишняя?</p>
          <div class="options">
            <button data-right>Исправить опечатку в тексте кнопки</button>
            <button data-right>Поменять таймаут с 30 на 60 секунд</button>
            <button>Добавить блокировку входа после неудачных попыток</button>
            <button>Поменять формат ответа API, который читают два сервиса</button>
          </div>
          <p class="why">Спецификация окупается там, где есть решения: новая функция, изменение поведения, контракт между сервисами. Опечатка и константа решений не требуют — их правят сразу.</p>
        </div>
        <div class="q" data-q="l5-spec-speed">
          <p>Как записать требование к скорости, чтобы его можно было проверить?</p>
          <div class="options">
            <button>«API должно работать быстро»</button>
            <button data-right>«Ответ SHALL приходить быстрее 300 мс для 95% запросов»</button>
            <button>«API SHOULD быть оптимальным по скорости»</button>
          </div>
          <p class="why">Число и доля запросов проверяются нагрузочным тестом. «Быстро» и «оптимально» — размытые слова. SHOULD значит «желательно», то есть агент вправе не сделать.</p>
        </div>
        <div class="q" data-q="l5-spec-sessions">
          <p>Почему спецификация в репозитории надёжнее договорённости в чате?</p>
          <div class="options">
            <button>В чат помещается меньше текста</button>
            <button data-right>Новая сессия агента не помнит прошлый чат, а файл в репозитории читает заново</button>
            <button>Агент не умеет читать историю чата</button>
          </div>
          <p class="why">Между сессиями память чата пропадает. В интерактиве «Две команды, пять сессий» команда с чатом каждый раз решает заново, а команда со спецификацией строит одно и то же. Тесты из сценариев не дают отступить от файла.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 40 минут</span></summary>
        <div class="more-body">
          <ol>
            <li>Возьмите задачу из своего трекера, где есть хоть одно решение: число, срок, правило.</li>
            <li>Напишите <code>proposal.md</code> в три строки: зачем, что меняем, что затронуто.</li>
            <li>Напишите одно требование с SHALL и два сценария: обычный и граничный случай.</li>
            <li>Прогоните требование через линтер из интерактива 2. Уберите размытые слова.</li>
            <li>Разбейте работу на 4–6 задач в <code>tasks.md</code>. Дайте агенту задачу «реализуй по tasks.md, начни с тестов по сценариям». Сравните с тем, как он делал это без спецификации.</li>
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
        <li>Понимаю, почему без спецификации агент каждый раз решает по-новому.</li>
        <li>Пишу требования со словами SHALL или MUST и с числами.</li>
        <li>Пишу сценарии WHEN/THEN и знаю, что каждый сценарий — будущий тест.</li>
        <li>Знаю цикл изменения: предложение, дельта, дизайн, задачи, реализация, проверка, архив.</li>
        <li>Понимаю, где лежит текущая правда (specs) и где изменения (changes).</li>
        <li>Узнаю ловушки: размытые слова, требования без сценариев, спецификация разошлась с кодом.</li>
        <li>Ответил на вопросы урока: размытые слова, части сценария, файлы изменения.</li>
        <li>Знаю, когда спецификация лишняя: опечатки, константы, однострочные фиксы.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Агент теперь строит по чертежу. Следующий шаг: часть кода по чертежу можно строить вообще без модели, генератором.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://habr.com/ru/companies/haulmont/articles/1085536/" target="_blank" rel="noopener">Что такое OpenSpec? Полный гайд по Spec-Driven Development</a><span>теория SDD и устройство изменения в OpenSpec. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/982620/" target="_blank" rel="noopener">Внутри Spec-Driven Development: на что способен Spec Kit</a><span>рабочий процесс GitHub Spec Kit по этапам и реалистичные ожидания. <span class="pill ok">рус., перевод</span></span></li><li><a href="https://habr.com/ru/companies/X5Tech/articles/995466/" target="_blank" rel="noopener">От vibe coding к Spec-Driven Development</a><span>пример от X5: specification.md → plan.md → tasks.md для магазина на FastAPI. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/companies/auriga/articles/808527/" target="_blank" rel="noopener">Введение в BDD</a><span>от TDD к BDD, сценарии Given/When/Then с примерами на python-behave. <span class="pill ok">рус.</span></span></li><li><a href="https://martinfowler.com/bliki/GivenWhenThen.html" target="_blank" rel="noopener">Given When Then</a><span>короткая заметка Фаулера о формате сценариев. <span class="pill">англ.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python прямо в браузере: записать сценарий Given/When/Then как тест-функцию и прогнать.</span></li><li><a href="https://mermaid.live/" target="_blank" rel="noopener">Mermaid Live Editor</a><span>нарисовать диаграмму состояний к спецификации до написания кода.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .build { display: grid; gap: 0.5rem; }
.hc .build-row { display: grid; grid-template-columns: 8.5rem repeat(5, minmax(0, 1fr)); gap: 0.35rem; align-items: stretch; }
.hc .build-row > span:first-child { font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); align-self: center; text-transform: uppercase; letter-spacing: 0.04em; }
.hc .brick { border: 1.5px dashed var(--hc-line); border-radius: 6px; min-height: 3.1rem; padding: 0.3rem 0.4rem; font-size: var(--hc-fs-xs); line-height: 1.3; display: grid; place-items: center; text-align: center; color: var(--hc-muted); transition: background 0.3s, border-color 0.3s; }
.hc .brick.ok { border-style: solid; border-color: var(--hc-ok); background: var(--hc-ok-soft); color: var(--hc-ink); }
.hc .brick.bad { border-style: solid; border-color: var(--hc-bad); background: var(--hc-bad-soft); color: var(--hc-ink); }
@media (max-width: 640px) {
.hc .build-row { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.hc .build-row > span:first-child { grid-column: 1 / -1; }
.hc .brick { font-size: 0.68rem; }
}
.hc .lc-files { display: grid; grid-template-columns: minmax(0, 15rem) minmax(0, 1fr); gap: 0.75rem; }
@media (max-width: 760px) {
.hc .lc-files { grid-template-columns: minmax(0, 1fr); }
}
.hc .tree { list-style: none; padding: 0; margin: 0; font: 400 0.8rem/1.7 var(--hc-f-mono); background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; min-width: 0; overflow-x: auto; }
.hc .tree li { margin: 0; white-space: pre; color: var(--hc-muted); }
.hc .tree li.new { color: var(--hc-ok); font-weight: 600; }
.hc .tree li.cur { color: var(--hc-accent); font-weight: 600; }
.hc .tree li.gone { text-decoration: line-through; }
.hc .lc-view { display: grid; gap: 0.4rem; min-width: 0; }
.hc .lc-view .fname { font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); }
.hc .lc-view pre { min-height: 12rem; font-size: 0.78rem; }
.hc .lint-out { list-style: none; padding: 0; display: grid; gap: 0.35rem; }
.hc .lint-out li { margin: 0; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 0.6rem; align-items: start; background: var(--hc-bg); border-radius: 6px; padding: 0.45rem 0.6rem; font-size: var(--hc-fs-sm); }
.hc .lint-out code { white-space: nowrap; }
.hc .lint-mark { background: color-mix(in srgb, var(--hc-bad) 25%, transparent); border-radius: 2px; }
.hc .lint-preview { background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; font: 400 0.82rem/1.55 var(--hc-f-mono); white-space: pre-wrap; overflow-wrap: anywhere; }
.hc .gauge { display: flex; gap: 0.75rem; align-items: center; font-size: var(--hc-fs-sm); }
.hc .gauge .meter { flex: 1; height: 8px; margin: 0; }
.hc .race { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
@media (max-width: 760px) {
.hc .race { grid-template-columns: minmax(0, 1fr); }
}
.hc .lane { background: var(--hc-bg); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; display: grid; gap: 0.4rem; align-content: start; min-width: 0; }
.hc .lane h4 { font: 600 var(--hc-fs-xs) var(--hc-f-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--hc-muted); }
.hc .lane ol { margin: 0; padding-left: 1.2rem; display: grid; gap: 0.3rem; font-size: var(--hc-fs-sm); }
.hc .lane li { margin: 0; }
.hc .lane li.dev { color: var(--hc-bad); }
.hc .lane li.keep { color: var(--hc-ok); }
.hc .lane .final { font-weight: 600; font-size: var(--hc-fs-sm); }
</style>
`;export{n as default};
