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
      <span class="eyebrow">Часть 5 · Большие проекты · Урок 10</span>
      <h1>Много сервисов, один конвейер: контракты, порядок выкладки и фабрика агентов</h1>
      <p class="lead">Одна фича часто задевает несколько сервисов и репозиториев. Разберём, как разделить работу между агентами, не сломать соседей и как выглядит почти полностью автоматический конвейер разработки.</p>
      <div class="facts">
        <span class="fact">~55 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">11 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>найти все сервисы, которые затронет изменение контракта;</li>
          <li>менять API без простоя по схеме expand/contract;</li>
          <li>объяснить паттерн «оркестратор и исполнители» и зачем каждому исполнителю своя копия кода;</li>
          <li>понять, что такое Dark Factory и где в ней обязательно нужен человек.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Прораб и бригады на стройке</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Строят дом. Прораб не кладёт кирпичи сам. Он делит работу между бригадами: электрики, сантехники, отделочники. Каждая работает на своём участке по общему чертежу. В конце — приёмка.</p>
      </div>
      <div class="stand" id="site">
        <div class="site">
          <div class="boss">Прораб: «Добавить промокоды»</div>
          <div class="crews">
            <div class="crew"><b>orders</b><span>расчёт скидки</span><div class="pb"><i id="site-p0"></i></div></div>
            <div class="crew"><b>billing</b><span>сумма к оплате</span><div class="pb"><i id="site-p1"></i></div></div>
            <div class="crew"><b>frontend</b><span>поле ввода</span><div class="pb"><i id="site-p2"></i></div></div>
            <div class="crew"><b>notifications</b><span>текст письма</span><div class="pb"><i id="site-p3"></i></div></div>
          </div>
          <div class="check" id="site-check">Приёмка: ожидание</div>
          <button class="btn small" type="button" id="site-play">▶ Запустить стройку</button>
        </div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Прораб</b><span>= агент-оркестратор: делит задачу и собирает результат</span></div>
        <div><b>Бригада на своём участке</b><span>= агент-исполнитель в своём репозитории</span></div>
        <div><b>Общий чертёж</b><span>= контракты: OpenAPI, схемы событий</span></div>
        <div><b>Приёмка</b><span>= контрактные и сквозные тесты</span></div>
        <div><b>Цех, где ночью работают одни роботы</b><span>= Dark Factory: конвейер без человека в цикле</span></div>
      </div>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Одна фича — несколько репозиториев</h3>
        <p>В микросервисах фича «промокоды» задевает заказы, оплату, сайт и письма. Это четыре репозитория, четыре набора правил и тестов. Один агент в одном контексте всё это не удержит: окно переполнится, а правки в одном сервисе сломают другой.</p>
        <p>Поэтому работу делят. Один агент-<strong>оркестратор</strong> планирует и проверяет. Несколько агентов-<strong>исполнителей</strong> работают каждый в своём репозитории. Связывает их <strong>контракт</strong> — договорённость, какие данные один сервис отдаёт другому.</p>
        <div class="tip"><b>Пример</b>Контракт: «orders отдаёт поле <code>discount_minor</code> — скидку в копейках». Исполнитель в orders его добавляет. Исполнитель в billing его читает. Им не нужно знать код друг друга, только контракт.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Карта сервисов, expand/contract и изоляция</h3>
        <p><strong>Общий контекст.</strong> Оркестратору нужна карта: какие сервисы есть, кто чей потребитель, где лежат контракты, кто владелец. Это обычный файл в отдельном репозитории или в корне рабочего пространства.</p>
        <p><strong>Expand/contract</strong> (<span class="term" data-tip="Расширить и сузить: сначала добавляем новое рядом со старым, переводим всех потребителей, и только потом удаляем старое.">расширить, потом сузить</span>). Сервисы выкатываются в разное время. Если переименовать поле за один шаг, потребители упадут. Поэтому так:</p>
        <ol>
          <li><strong>Expand:</strong> отдаём и старое поле, и новое.</li>
          <li><strong>Migrate:</strong> потребители по одному переходят на новое.</li>
          <li><strong>Contract:</strong> когда старое никто не читает — удаляем его.</li>
        </ol>
        <p><strong>Оркестратор и исполнители.</strong> Оркестратор делит задачу на подзадачи, раздаёт параллельно (это называют <span class="term" data-tip="Fan-out — раздать работу нескольким исполнителям одновременно.">fan-out</span>), ждёт всех и собирает результат (<span class="term" data-tip="Fan-in — собрать результаты исполнителей в одно целое.">fan-in</span>). Потом запускает проверки и, если что-то упало, возвращает подзадачу исполнителю с текстом ошибки.</p>
        <p><strong>Изоляция.</strong> Каждому исполнителю — своя копия кода: отдельный <span class="term" data-tip="git worktree — дополнительная рабочая папка того же репозитория на своей ветке. Исполнители не мешают друг другу.">git worktree</span> или песочница. Иначе два агента правят один файл и затирают работу друг друга.</p>
        <p><strong>Контрактные тесты.</strong> Проверяют, что ответ сервиса совпадает с тем, чего ждут потребители. Они ловят несовместимость до выкладки, а не на проде.</p>
        <details class="more">
          <summary>Оркестратор с параллельными исполнителями <span class="hint">— TS, Python, PHP</span></summary>
          <div class="more-body">
            <p><code>runWorker</code> — ваш агент-исполнитель: запуск CLI агента в нужной папке или вызов API с инструментами. Здесь важна схема: план, параллельный запуск, проверка, повтор.</p>
            <div class="code-tabs">
<pre data-lang="ts">interface Subtask { repo: string; goal: string; contract: string }
interface Result { repo: string; ok: boolean; log: string }

async function orchestrate(feature: string): Promise&lt;Result[]> {
  const plan: Subtask[] = await planSubtasks(feature);       // оркестратор делит задачу

  // fan-out: все исполнители работают параллельно, каждый в своём worktree
  let results = await Promise.all(plan.map(t => runWorker(t)));

  // проверка контрактов и повтор с текстом ошибки, не больше 2 раз
  for (let attempt = 0; attempt < 2; attempt++) {
    const failed = await contractTests(results);
    if (failed.length === 0) break;
    const retried = await Promise.all(
      failed.map(f => runWorker({ ...plan.find(p => p.repo === f.repo)!, goal: \`Исправь: \${f.log}\` })),
    );
    results = results.map(r => retried.find(x => x.repo === r.repo) ?? r);
  }
  return results;                                             // fan-in: связанные PR
}</pre>
<pre data-lang="py">import asyncio

async def orchestrate(feature: str) -> list[dict]:
    plan = await plan_subtasks(feature)            # [{"repo": "orders", "goal": ...}, ...]

    # fan-out: исполнители работают одновременно
    results = await asyncio.gather(*(run_worker(t) for t in plan))

    for _ in range(2):                             # не больше двух повторов
        failed = await contract_tests(results)
        if not failed:
            break
        retried = await asyncio.gather(*(
            run_worker({**t, "goal": f"Исправь: {f['log']}"})
            for f in failed for t in plan if t["repo"] == f["repo"]
        ))
        by_repo = {r["repo"]: r for r in retried}
        results = [by_repo.get(r["repo"], r) for r in results]

    return results                                 # fan-in</pre>
<pre data-lang="php">&lt;?php
// Идея на Symfony Messenger (псевдокод): каждая подзадача — сообщение в очередь,
// отдельный воркер на репозиторий. Оркестратор ждёт все ответы и запускает проверки.

final class Orchestrator
{
    public function __construct(private MessageBusInterface $bus) {}

    public function start(Feature $feature): void
    {
        foreach ($this->planner->split($feature) as $subtask) {
            // fan-out: воркеры разбирают очередь параллельно
            $this->bus->dispatch(new RunWorker($feature->id, $subtask->repo, $subtask->goal));
        }
    }

    // вызывается, когда пришёл результат последнего исполнителя (fan-in)
    public function onAllDone(string $featureId): void
    {
        $failed = $this->contracts->check($featureId);
        foreach ($failed as $f) {
            $this->bus->dispatch(new RunWorker($featureId, $f->repo, 'Исправь: ' . $f->log));
        }
    }
}</pre>
            </div>
<pre data-lang="sh"># Изоляция: у каждого исполнителя своя рабочая папка и ветка
git -C orders worktree add ../wt/orders-promo -b feat/promo
git -C billing worktree add ../wt/billing-promo -b feat/promo</pre>
          </div>
        </details>
        <details class="more">
          <summary>Контракт события в JSON Schema <span class="hint">— пример</span></summary>
          <div class="more-body">
            <p>Контракт лежит в общем репозитории. Его читают и исполнители, и контрактные тесты. Новое поле добавлено как необязательное — это шаг expand.</p>
<pre data-lang="json">{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "OrderPaid",
  "type": "object",
  "required": ["order_id", "amount_minor", "currency", "paid_at"],
  "properties": {
    "order_id": { "type": "string" },
    "amount_minor": { "type": "integer", "description": "Сумма в копейках" },
    "currency": { "type": "string", "enum": ["BYN", "RUB", "USD"] },
    "paid_at": { "type": "string", "format": "date-time" },
    "promo_code": { "type": ["string", "null"], "description": "Новое поле, пока необязательное" }
  },
  "additionalProperties": false
}</pre>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Dark Factory: конвейер без человека в цикле</h3>
        <p><strong>Dark Factory</strong> (<span class="term" data-tip="«Тёмная фабрика» — завод, где работают одни роботы, поэтому свет не нужен. В разработке — конвейер, который сам проходит путь от задачи до готового PR.">тёмная фабрика</span>) — максимально автоматический конвейер. Задача, спека, реализация, проверки и готовый к поставке PR — без человека на каждом шаге.</p>
        <p>Людям остаётся три вещи:</p>
        <ul>
          <li><strong>Постановка.</strong> Что делать и зачем. Хорошая задача и спека — половина результата.</li>
          <li><strong>Ворота высокого риска.</strong> Деньги, персональные данные, безопасность, необратимые миграции. Здесь решение принимает человек.</li>
          <li><strong>Разбор отказов.</strong> Каждая ошибка, которая прошла конвейер, превращается в новый тест, правило или задачу в eval-набор.</li>
        </ul>
        <p>Чем меньше людей в цикле, тем сильнее должны быть автоматические проверки. Dark Factory опирается на всё, что было в курсе: правила и контекст (уроки 2, 3), спецификации (урок 5), генераторы (урок 6), контроль ошибок (урок 7) и eval-наборы (урок 8). Без них это не фабрика, а генератор незаметных поломок.</p>
        <div class="warn"><b>Граница автоматизации</b>Даже в самой автоматической фабрике агент не выкатывает на прод изменения денег и данных сам. И у него нет доступа к боевым секретам. Автоматизация готовит результат, ответственность остаётся у человека.</div>
        <details class="more">
          <summary>Как понять, что фабрика работает <span class="hint">— метрики</span></summary>
          <div class="more-body">
            <ul>
              <li><strong>Пропускная способность:</strong> сколько задач в сутки проходит конвейер до готового PR.</li>
              <li><strong>Сбежавшие дефекты:</strong> сколько ошибок нашли уже после выкладки. Главная метрика качества.</li>
              <li><strong>Доля переделок:</strong> сколько задач ворота вернули на доработку. Высокая доля — плохие спеки или слабые исполнители.</li>
              <li><strong>Часы людей:</strong> сколько времени уходит на ворота и разбор отказов.</li>
              <li><strong>Стоимость задачи:</strong> токены и время машин.</li>
            </ul>
            <p>Всё это можно покрутить в конструкторе фабрики ниже.</p>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Сервисы, исполнители и фабрика</h2>
      </div>

      <!-- 3.1 Граф сервисов -->
      <div class="stand" id="gr">
        <div class="stand-head"><h3>Кого затронет изменение контракта</h3><span class="badge">интерактив 1 из 4</span></div>
        <p class="task">Стрелка идёт от потребителя к поставщику: «frontend → api-gateway» значит «frontend вызывает api-gateway». Выберите изменение.</p>
        <div class="field">
          <label for="gr-change">Изменение</label>
          <select id="gr-change">
            <option value="">Выберите…</option>
            <option value="rename">orders API: переименовать поле amount → amount_minor</option>
            <option value="phone">users API: сделать phone обязательным при создании</option>
            <option value="event">событие OrderPaid: total становится объектом money</option>
          </select>
        </div>
        <div class="graph-wrap">
          <svg class="graph" id="gr-svg" viewBox="0 0 660 290" role="img" aria-label="Граф зависимостей сервисов">
            <defs><marker id="gr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"></path></marker></defs>
            <g id="gr-edges"></g>
            <g id="gr-nodes"></g>
          </svg>
        </div>
        <div class="legend"><span style="--c: var(--hc-warm)">меняем</span><span style="--c: var(--hc-bad)">прямой потребитель</span><span style="--c: var(--hc-warn)">через цепочку</span></div>
        <div id="gr-plan" aria-live="polite"><p class="task">Здесь появится план изменения.</p></div>
      </div>

      <!-- 3.2 Оркестратор -->
      <div class="stand" id="or">
        <div class="stand-head"><h3>Оркестратор и исполнители: «добавить промокоды»</h3><span class="badge">интерактив 2 из 4</span></div>
        <div class="orch">
          <div class="lead-node" id="or-lead">Оркестратор</div>
          <div class="workers">
            <div class="worker" id="or-w0"><b>orders</b><span id="or-s0">ждёт</span><div class="pb"><i id="or-p0"></i></div></div>
            <div class="worker" id="or-w1"><b>billing</b><span id="or-s1">ждёт</span><div class="pb"><i id="or-p1"></i></div></div>
            <div class="worker" id="or-w2"><b>frontend</b><span id="or-s2">ждёт</span><div class="pb"><i id="or-p2"></i></div></div>
            <div class="worker" id="or-w3"><b>notifications</b><span id="or-s3">ждёт</span><div class="pb"><i id="or-p3"></i></div></div>
          </div>
          <div class="orch-log" id="or-log" aria-live="polite">Нажмите «Дальше» или «Авто».</div>
        </div>
        <div class="row">
          <button class="btn quiet" type="button" id="or-prev">← Назад</button>
          <button class="btn" type="button" id="or-next">Дальше →</button>
          <button class="btn secondary" type="button" id="or-play">▶ Авто</button>
          <button class="btn quiet" type="button" id="or-reset">Сначала</button>
          <span class="task" id="or-label"></span>
        </div>
      </div>

      <!-- 3.3 Конструктор фабрики -->
      <div class="stand" id="df">
        <div class="stand-head"><h3>Конструктор Dark Factory</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">Включите ворота проверки и запустите 200 задач. Модель упрощённая: у каждых ворот своя доля пойманных ошибок и своя цена во времени. Цифры иллюстративные.</p>
        <div class="gates" id="df-gates"></div>
        <div class="grid-2">
          <div class="field"><label for="df-err">Задач с ошибкой после исполнителя: <span class="mono" id="df-err-val">30%</span></label><input type="range" id="df-err" min="5" max="60" step="5" value="30"></div>
          <div class="field"><label for="df-risk">Рискованных задач (деньги, данные): <span class="mono" id="df-risk-val">20%</span></label><input type="range" id="df-risk" min="0" max="50" step="5" value="20"></div>
        </div>
        <div class="row"><button class="btn" type="button" id="df-run">▶ Запустить 200 задач</button></div>
        <div class="factory" id="df-grid" aria-hidden="true"></div>
        <div class="legend"><span style="--c: var(--hc-ok)">чисто</span><span style="--c: var(--hc-warn)">поймано и переделано</span><span style="--c: var(--hc-bad)">ошибка ушла в релиз</span></div>
        <div class="stats">
          <div><b id="df-esc">—</b>сбежало ошибок</div>
          <div><b id="df-esc-risk">—</b>из них в деньгах и данных</div>
          <div><b id="df-thr">—</b>задач в сутки</div>
          <div><b id="df-human">—</b>часов людей</div>
        </div>
        <p class="task" id="df-text" aria-live="polite"></p>
      </div>

      <!-- 3.4 Порядок выкладки -->
      <div class="stand" id="dp">
        <div class="stand-head"><h3>Порядок релизов при переименовании поля</h3><span class="badge">интерактив 4 из 4</span></div>
        <p class="task">Сервисы выкатываются по очереди. Расставьте релизы так, чтобы ни в какой момент никто не упал. Потом нажмите «Проверить».</p>
        <ol class="order-list" id="dp-list"></ol>
        <div class="row"><button class="btn" type="button" id="dp-check">Проверить</button><button class="btn quiet" type="button" id="dp-shuffle">Перемешать</button></div>
        <div id="dp-result" aria-live="polite"></div>
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
        <div class="q" data-q="l10-expand">
          <p>Нужно переименовать поле в API, которым пользуются три сервиса. Какой порядок правильный?</p>
          <div class="options">
            <button>Переименовать поле и одновременно выкатить все четыре сервиса</button>
            <button data-right>Отдавать оба поля, перевести потребителей по одному, потом удалить старое</button>
            <button>Сначала обновить потребителей, потом поставщика</button>
          </div>
          <p class="why">Сервисы выкатываются в разное время. Expand/contract гарантирует, что в каждый момент любая версия потребителя найдёт нужное поле.</p>
        </div>
        <div class="q" data-q="l10-worktree">
          <p>Зачем каждому агенту-исполнителю своя рабочая копия (worktree или песочница)?</p>
          <div class="options">
            <button>Так быстрее устанавливаются зависимости</button>
            <button data-right>Исполнители работают параллельно и не затирают правки друг друга</button>
            <button>Иначе оркестратор не увидит результат</button>
          </div>
          <p class="why">Два агента в одной папке правят одни и те же файлы и ломают сборку друг другу. Изоляция делает параллельную работу безопасной.</p>
        </div>
        <div class="q" data-q="l10-contract">
          <p>Что ловят контрактные тесты?</p>
          <div class="options">
            <button data-right>Несовместимость между сервисами до выкладки: поставщик отдаёт не то, чего ждёт потребитель</button>
            <button>Медленные SQL-запросы</button>
            <button>Опечатки в интерфейсе</button>
          </div>
          <p class="why">Каждый сервис по отдельности может быть зелёным, а вместе — не работать. Контрактные тесты проверяют именно стык.</p>
        </div>
        <div class="q" data-q="l10-dark">
          <p>Что остаётся людям в Dark Factory?</p>
          <div class="options">
            <button>Ничего, всё делают агенты</button>
            <button>Ревью каждой строки кода</button>
            <button data-right>Постановка задач, решения на воротах высокого риска и разбор отказов</button>
          </div>
          <p class="why">Конвейер делает рутину. Люди решают, что делать, отвечают за рискованные изменения и превращают каждую ошибку в новую проверку.</p>
        </div>
        <div class="q" data-q="l10-affected" data-multi>
          <p>billing и notifications читают данные из orders, а frontend — из billing. Меняется контракт orders. Кого надо проверить?</p>
          <div class="options">
            <button data-right>billing</button>
            <button data-right>notifications</button>
            <button data-right>frontend — через billing</button>
            <button>Никого, если тесты самого orders зелёные</button>
          </div>
          <p class="why">Изменение идёт по цепочке: billing может поменять свой ответ вслед за orders, и это заденет сайт. Зелёные тесты orders проверяют только orders — стык с соседями они не видят. Обход карты должен помнить, где уже был: в графе бывают циклы.</p>
        </div>
        <div class="q" data-q="l10-deploy-order">
          <p>billing читает новое поле из orders, frontend — из billing. В каком порядке выкатывать?</p>
          <div class="options">
            <button>frontend, billing, orders — сначала то, что видит пользователь</button>
            <button data-right>orders, billing, frontend — поставщик раньше потребителя</button>
            <button>Все три одновременно, чтобы не было расхождений</button>
          </div>
          <p class="why">Если потребитель выйдет раньше, он будет читать поле, которого ещё нет. Одновременной выкладки не бывает: сервисы обновляются в разное время. Цикл в зависимостях — ошибка плана, его надо разорвать.</p>
        </div>
        <div class="q" data-q="l10-orchestrator" data-multi>
          <p>Что делает агент-оркестратор?</p>
          <div class="options">
            <button data-right>Делит фичу на подзадачи и раздаёт их параллельно</button>
            <button data-right>Ждёт всех исполнителей и запускает проверки</button>
            <button data-right>Возвращает упавшую подзадачу исполнителю с текстом ошибки</button>
            <button>Сам пишет код во всех четырёх репозиториях</button>
          </div>
          <p class="why">Оркестратор — прораб: планирует, раздаёт и принимает работу. Писать код во всех репозиториях сам он не должен — тогда его окно переполнится, ради чего работу и делили.</p>
        </div>
        <div class="q" data-q="l10-service-map" data-multi>
          <p>Что должно быть в карте сервисов для оркестратора?</p>
          <div class="options">
            <button data-right>Какие сервисы есть и кто чей потребитель</button>
            <button data-right>Где лежат контракты</button>
            <button data-right>Кто владелец каждого сервиса</button>
            <button>Полный исходный код всех сервисов</button>
          </div>
          <p class="why">Карта — короткий файл: сервисы, связи, контракты, владельцы. По ней оркестратор понимает, кого задевает задача. Исходный код читают исполнители, каждый в своём репозитории.</p>
        </div>
        <div class="q" data-q="l10-human-gates" data-multi>
          <p>Где даже в Dark Factory решение принимает человек?</p>
          <div class="options">
            <button data-right>Изменения, которые трогают деньги</button>
            <button data-right>Персональные данные и безопасность</button>
            <button data-right>Необратимые миграции базы</button>
            <button>Переименование переменной внутри одной функции</button>
          </div>
          <p class="why">Это ворота высокого риска: ошибку там дорого или нельзя откатить. Мелкий рефакторинг внутри функции проверяют тесты, человек там не нужен.</p>
        </div>
        <div class="q" data-q="l10-factory-metrics" data-multi>
          <p>Какие сигналы покажут, что фабрика агентов работает плохо?</p>
          <div class="options">
            <button data-right>Растёт число сбежавших дефектов — ошибок, найденных после выкладки</button>
            <button data-right>Ворота возвращают на доработку большую долю задач</button>
            <button>Агенты пишут меньше строк кода, чем месяц назад</button>
            <button>Задачи проходят конвейер быстрее</button>
          </div>
          <p class="why">Сбежавшие дефекты — главная метрика качества. Много переделок значит плохие спеки или слабых исполнителей. Число строк ничего не говорит о качестве, а рост скорости — хороший знак, если дефектов не прибавилось.</p>
        </div>
        <div class="q" data-q="l10-one-agent">
          <p>Почему фичу на четыре сервиса не отдают одному агенту в одном контексте?</p>
          <div class="options">
            <button>Один агент печатает код слишком медленно</button>
            <button data-right>Окно переполнится, а правка в одном сервисе может незаметно сломать другой</button>
            <button>Агенты не умеют открывать больше одного репозитория</button>
          </div>
          <p class="why">Четыре репозитория — это четыре набора правил и тестов. В одном контексте агент теряет детали и не видит, где сломал соседа. Деление по контрактам даёт каждому исполнителю маленькую понятную задачу.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 1 час</span></summary>
        <div class="more-body">
          <ol>
            <li>Нарисуйте карту своих сервисов или модулей в формате «потребитель → поставщики». Хватит обычного списка или таблицы.</li>
            <li>Возьмите последнюю фичу, которая задела несколько сервисов. Пройдите по карте от изменённого сервиса ко всем его потребителям, в том числе через цепочку. Совпало с тем, что было на самом деле?</li>
            <li>Распишите для неё план expand/contract и порядок релизов.</li>
            <li>Отметьте шаги, где вы поставили бы человека, если бы весь путь делал конвейер агентов.</li>
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
        <li>Понимаю, зачем делить фичу на подзадачи по репозиториям.</li>
        <li>Могу объяснить роли оркестратора и исполнителей, fan-out и fan-in.</li>
        <li>Знаю, зачем исполнителям отдельные worktree или песочницы.</li>
        <li>Могу расписать expand/contract для переименования поля.</li>
        <li>Понимаю, что проверяют контрактные тесты.</li>
        <li>Могу объяснить Dark Factory и что в ней остаётся людям.</li>
        <li>Ответил на вопросы урока про граф зависимостей и порядок выкладки.</li>
      </ul>
      <div class="tip done-banner"><b>Курс пройден</b>Вы прошли путь от устройства модели до конвейера агентов. Вернитесь на карту курса: там итоговый проект, где всё собирается вместе.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://habr.com/ru/companies/oleg-bunin/articles/452960/" target="_blank" rel="noopener">За всё ответишь! Consumer Driven Contracts глазами разработчика</a><span>какие проблемы решают контракты между сервисами, пример на Pact, ограничения. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/312970/" target="_blank" rel="noopener">Эволюционный дизайн баз данных</a><span>перевод Фаулера и Садаладжа: миграции и «фаза перехода», на которой держится expand/contract. <span class="pill ok">рус., перевод</span></span></li><li><a href="https://martinfowler.com/bliki/ParallelChange.html" target="_blank" rel="noopener">Parallel Change</a><span>короткая заметка про expand → migrate → contract. <span class="pill">англ.</span></span></li><li><a href="https://www.anthropic.com/engineering/multi-agent-research-system" target="_blank" rel="noopener">How we built our multi-agent research system</a><span>Anthropic о схеме оркестратор-исполнители в реальной системе. <span class="pill">англ.</span></span></li><li><a href="https://habr.com/ru/articles/1034840/" target="_blank" rel="noopener">Что такое Dark Factory AI Agent?</a><span>«тёмная фабрика»: конвейер от спецификации до кода почти без человека, где уместен. <span class="pill ok">рус., перевод</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a><span>на PostgreSQL руками пройти expand/contract: добавить колонку, перенести данные, удалить старую.</span></li><li><a href="https://studio.asyncapi.com/" target="_blank" rel="noopener">AsyncAPI Studio</a><span>описать контракт событий между сервисами (очереди, топики).</span></li><li><a href="https://mermaid.live/" target="_blank" rel="noopener">Mermaid Live Editor</a><span>нарисовать диаграмму последовательности «оркестратор → исполнители → проверка».</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .site { display: grid; gap: 0.5rem; justify-items: center; }
.hc .site .boss { background: var(--hc-accent); color: var(--hc-accent-ink); border-radius: var(--hc-r-sm); padding: 0.4rem 0.9rem; font-weight: 600; font-size: var(--hc-fs-sm); }
.hc .site .crews { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.4rem; width: 100%; }
.hc .site .crew { background: var(--hc-surface); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.45rem 0.55rem; font-size: var(--hc-fs-xs); display: grid; gap: 0.3rem; }
.hc .site .crew .pb { height: 6px; background: var(--hc-surface-2); border-radius: 3px; overflow: hidden; }
.hc .site .crew .pb i { display: block; height: 100%; width: 0; background: var(--hc-ok); transition: width 0.6s; }
.hc .site .check { font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); }
@media (max-width: 560px) {
.hc .site .crews { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.hc .graph-wrap { overflow-x: auto; }
.hc .graph { width: 100%; max-width: 44rem; height: auto; display: block; }
.hc .graph .edge { stroke: var(--hc-muted); stroke-width: 1.5; fill: none; }
.hc .graph .edge.hot { stroke: var(--hc-bad); stroke-width: 2.5; }
.hc .graph .arrowhead { fill: var(--hc-muted); }
.hc .graph .svc rect { fill: var(--hc-surface-2); stroke: var(--hc-line); stroke-width: 1.5; transition: fill 0.3s, stroke 0.3s; }
.hc .graph .svc text { fill: var(--hc-ink); font: 600 13px var(--hc-f-mono); }
.hc .graph .svc.changed rect { fill: var(--hc-warm-soft); stroke: var(--hc-warm); stroke-width: 2.5; }
.hc .graph .svc.direct rect { fill: var(--hc-bad-soft); stroke: var(--hc-bad); stroke-width: 2.5; }
.hc .graph .svc.trans rect { fill: var(--hc-warn-soft); stroke: var(--hc-warn); stroke-width: 2; stroke-dasharray: 5 3; }
.hc .legend { display: flex; flex-wrap: wrap; gap: 0.9rem; font-size: var(--hc-fs-xs); color: var(--hc-muted); }
.hc .legend span::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 0.35rem; vertical-align: -1px; background: var(--c); }
.hc .steps-list { display: grid; gap: 0.35rem; padding-left: 1.4rem; font-size: var(--hc-fs-sm); }
.hc .orch { display: grid; gap: 0.6rem; }
.hc .orch .lead-node { justify-self: center; border: 1.5px solid var(--hc-accent); background: var(--hc-accent-soft); border-radius: var(--hc-r-sm); padding: 0.45rem 0.9rem; font-size: var(--hc-fs-sm); font-weight: 600; text-align: center; }
.hc .workers { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.5rem; }
.hc .worker { border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.5rem 0.6rem; font-size: var(--hc-fs-xs); display: grid; gap: 0.3rem; background: var(--hc-surface); transition: border-color 0.3s, background 0.3s; }
.hc .worker b { font: 600 var(--hc-fs-xs) var(--hc-f-mono); }
.hc .worker .pb { height: 6px; background: var(--hc-surface-2); border-radius: 3px; overflow: hidden; }
.hc .worker .pb i { display: block; height: 100%; width: 0; background: var(--hc-accent); transition: width 0.8s; }
.hc .worker.ok { border-color: var(--hc-ok); }
.hc .worker.ok .pb i { background: var(--hc-ok); }
.hc .worker.bad { border-color: var(--hc-bad); background: var(--hc-bad-soft); }
.hc .worker.bad .pb i { background: var(--hc-bad); }
@media (max-width: 640px) {
.hc .workers { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.hc .orch-log { background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.7rem 0.9rem; font-size: var(--hc-fs-sm); min-height: 4.5rem; }
.hc .gates { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr)); gap: 0.4rem; }
.hc .gates label { display: flex; gap: 0.5rem; align-items: flex-start; font-weight: 400; background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.45rem 0.6rem; }
.hc .gates label small { display: block; color: var(--hc-muted); font-size: var(--hc-fs-xs); }
.hc .gates input { margin-top: 0.2rem; flex: none; }
.hc .factory { display: grid; grid-template-columns: repeat(20, minmax(0, 1fr)); gap: 3px; max-width: 30rem; }
.hc .factory i { aspect-ratio: 1; border-radius: 2px; background: var(--hc-surface-2); }
.hc .factory i.y { background: var(--hc-ok); }
.hc .factory i.w { background: var(--hc-warn); }
.hc .factory i.n { background: var(--hc-bad); }
.hc .factory i.nn { background: var(--hc-bad); outline: 2px solid var(--hc-ink); outline-offset: -2px; }
.hc .stats { display: flex; flex-wrap: wrap; gap: 1.2rem; font-size: var(--hc-fs-sm); }
.hc .stats b { font: 600 var(--hc-fs-lg) var(--hc-f-mono); display: block; font-variant-numeric: tabular-nums; }
.hc .order-list { list-style: none; padding: 0; display: grid; gap: 0.35rem; counter-reset: rel; }
.hc .order-list li { margin: 0; display: grid; grid-template-columns: 1.6rem minmax(0, 1fr) auto; gap: 0.5rem; align-items: center; background: var(--hc-bg); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.4rem 0.55rem; font-size: var(--hc-fs-sm); }
.hc .order-list li::before { counter-increment: rel; content: counter(rel); font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); }
.hc .order-list li.bad { border-color: var(--hc-bad); }
.hc .order-list li .mv { display: flex; gap: 0.25rem; }
</style>
`;export{n as default};
