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
      <span class="eyebrow">Часть 4 · Доверяй, но проверяй · Урок 7</span>
      <h1>Ловим ошибки агента автоматически: слои проверок, бюджеты, петли и выдуманные методы</h1>
      <p class="lead">Агент ошибается не так, как человек: быстро, уверенно и иногда с отчётом «всё готово». Разберём, какие ошибки бывают и как встроить в harness проверки, которые ловят их без вас.</p>
      <div class="facts">
        <span class="fact">~50 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">3D-фильм и 11 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>узнавать семь типовых ошибок агента в логе его работы;</li>
          <li>собрать слои защиты: проверки кодом, бюджеты, трейсы и человек на воротах;</li>
          <li>узнавать петлю и выдуманные методы и ставить на них автоматические проверки;</li>
          <li>подключить линтер и тесты к агенту через хуки.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Конвейер с ОТК</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Завод выпускает детали очень быстро. Никто не смотрит на каждую руками. Вместо этого на ленте стоят датчики, и брак снимают до упаковки. Агент — такая же быстрая линия. Ему нужен свой ОТК (отдел технического контроля).</p>
      </div>
      <div class="stand" id="belt">
        <div class="stand-head"><h3>Лента: зелёные — годные, красные — брак</h3><span class="badge">анимация</span></div>
        <div class="belt" id="belt-track" aria-hidden="true">
          <div class="station" style="left:30%"><span>линтер</span></div>
          <div class="station" style="left:55%"><span>тесты</span></div>
          <div class="station" style="left:80%"><span>ревью</span></div>
        </div>
        <div class="row">
          <button class="btn small" type="button" id="belt-run">▶ Запустить ленту</button>
          <label class="row" style="gap:0.4rem; font-weight:500"><input type="checkbox" id="belt-on" checked> Контроль включён</label>
        </div>
        <div class="belt-stats">
          <div><b id="belt-made">0</b>деталей</div>
          <div><b id="belt-caught">0</b>брака снято</div>
          <div><b id="belt-escaped">0</b>брака дошло до клиента</div>
        </div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Датчик размера</b><span>= линтер и типы: ловят выдуманные методы</span></div>
        <div><b>Проверка на стенде</b><span>= тесты: ловят неверную логику</span></div>
        <div><b>Пломба на станке</b><span>= защищённые файлы: агент не ослабит тест</span></div>
        <div><b>Счётчик с автоматом</b><span>= бюджет токенов и шагов: стоп-кран для петли</span></div>
        <div><b>Журнал смены</b><span>= трейс: что агент делал на каждом шаге</span></div>
        <div><b>Мастер смены</b><span>= человек на ключевых воротах</span></div>
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
        <h3>Каждый шаг проверяет код, у каждой задачи есть бюджет</h3>
        <p>Человек ошибается медленно и обычно сомневается. Агент делает десятки правок в минуту и звучит одинаково уверенно, когда прав и когда нет (урок 1). Читать всё руками невозможно. Поэтому правило простое:</p>
        <ul>
          <li>после каждого действия агента его результат проверяет <strong>код</strong>: линтер, типы, тесты;</li>
          <li>у каждой задачи есть <strong>лимиты</strong>: шаги, токены, время;</li>
          <li>каждый шаг <strong>записывается</strong>, чтобы потом разобраться.</li>
        </ul>
        <div class="tip"><b>Главное</b>Не верьте отчёту агента «всё готово». Верьте результатам проверок, которые агент не может подделать.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Семь типовых ошибок и чем их ловить</h3>
        <div class="errs">
          <div class="err"><b>Выдуманный API</b><span>Вызов метода или импорт, которого нет: <code>Money::fromFloatSafe()</code>.</span><span>Ловят: статанализ (phpstan, tsc, mypy), тесты.</span></div>
          <div class="err"><b>Неверная логика</b><span>Код работает, но считает не то: скидка не применяется.</span><span>Ловят: тесты, особенно написанные до правки.</span></div>
          <div class="err"><b>Правки вне задачи</b><span>«Заодно поправил» конфиг безопасности или соседний модуль.</span><span>Ловят: проверка diff — какие файлы можно трогать.</span></div>
          <div class="err"><b>Ослабленный тест</b><span>Тест красный, и агент поменял ожидание в тесте, а не код.</span><span>Ловят: запрет правки tests/ без явного разрешения, ревью.</span></div>
          <div class="err"><b>Петля</b><span>Одна и та же команда раз за разом, с тем же результатом.</span><span>Ловят: детектор повторов, лимит шагов.</span></div>
          <div class="err"><b>Перерасход</b><span>Задача на 50 тысяч токенов съела 2 миллиона.</span><span>Ловят: бюджет токенов и денег на задачу.</span></div>
          <div class="err"><b>Ложный отчёт</b><span>«Готово, тесты проходят», а тесты не запускались.</span><span>Ловят: Stop-хук, который сам запускает тесты.</span></div>
        </div>
        <h3>Слои защиты</h3>
        <div class="flow">
          <div class="node"><b>Проверки кодом</b><small>линтер, типы, тесты</small></div><span class="arrow">→</span>
          <div class="node"><b>Проверки артефактов</b><small>схема JSON, границы diff</small></div><span class="arrow">→</span>
          <div class="node"><b>Лимиты</b><small>шаги, токены, время</small></div><span class="arrow">→</span>
          <div class="node"><b>Наблюдаемость</b><small>трейсы, логи шагов</small></div><span class="arrow">→</span>
          <div class="node"><b>Человек</b><small>на ключевых воротах</small></div>
        </div>
        <p>Слои ставят от дешёвых к дорогим. Линтер стоит секунды и ловит много. Человек стоит дорого, поэтому он смотрит только то, что прошло все автоматические слои, и только в важных точках: слияние в main, миграция, выкладка.</p>
        <p>Как слои работают вместе, видно в фильме — 50 секунд. Остановите его, перемотайте, поверните сцену и посмотрите вдоль пути ошибки.</p>
        <figure class="stage3d" data-stage="shvejcarskij-syr">
          <div class="stage3d-view"></div>
          <figcaption class="stage3d-alt">3D-фильм «Швейцарский сыр». Агент быстро сыплет правками, часть из них с ошибками. Пять слоёв защиты стоят от дешёвых к дорогим: линтер и типы, тесты, границы diff, бюджет и петли, ревью человеком. Каждый слой — решётка с дырами. Выдуманный метод застревает в линтере, неверная логика — в тестах, правка вне задачи — в diff, петля — в бюджете. У ошибки «логика без теста» дыры четырёх слоёв совпали, её ловит только человек. Если убрать ревью, она доходит до прода. Новый слой — Stop-хук с тестами — закрывает эту дыру.</figcaption>
        </figure>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Как встроить контроль в harness</h3>
        <ul>
          <li><strong>PostToolUse-хук</strong> после каждой правки файла запускает линтер для этого файла. Ошибки уходят модели сразу (код выхода 2 и текст в stderr), и она исправляет их на следующем шаге, а не через час в CI.</li>
          <li><strong>Stop-хук</strong> не даёт агенту закончить, пока тесты красные. Ложный отчёт «всё готово» становится невозможным.</li>
          <li><strong>PreToolUse-хук</strong> запрещает правку защищённых файлов: тестов, конфигов линтера, CI. Иначе агент «починит» проверку, а не код.</li>
          <li><strong>Оркестратор</strong> (урок 4) держит бюджет: максимум шагов, токенов и времени. Превысил — остановка с отчётом, а не тихий счёт на сотни долларов.</li>
          <li><strong>Трейс</strong>: каждый шаг пишется в JSON-лог: номер, инструмент, аргументы, токены, время, результат. По нему находят петли, дорогие шаги и причины аварий.</li>
        </ul>
        <p><strong>Метрики процесса</strong>, которые стоит считать: стоимость решённой задачи, доля задач с вмешательством человека, сколько брака дошло до ревью и до прода, сколько раз сработал каждый слой. Если слой не сработал ни разу за месяц — проверьте, работает ли он вообще.</p>
        <div class="warn"><b>Ловушка</b>Не делайте единственным контролем «вторую модель, которая проверит первую». Это полезный слой (урок 8), но у проверяющей модели те же слабости. Основа — детерминированные проверки, которые дают один и тот же ответ на один и тот же код.</div>
        <details class="more">
          <summary>Хуки контроля в коде <span class="hint">— линтер после правки, тесты перед финишем</span></summary>
          <div class="more-body">
<pre data-lang="json">{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "node .claude/hooks/lint-after-edit.js" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "python3 .claude/hooks/tests-before-stop.py" }] }
    ]
  }
}</pre>
            <div class="code-tabs">
<pre data-lang="js">// .claude/hooks/lint-after-edit.js — PostToolUse: ESLint для правленого файла
import { execFileSync } from "node:child_process";

let raw = "";
process.stdin.on("data", (c) =&gt; (raw += c));
process.stdin.on("end", () =&gt; {
  const file = JSON.parse(raw).tool_input?.file_path ?? "";
  if (!/\\.(ts|js)$/.test(file)) process.exit(0);
  try {
    execFileSync("npx", ["eslint", "--max-warnings=0", file], { encoding: "utf8" });
    process.exit(0);
  } catch (e) {
    // код 2: ошибки уйдут модели, она исправит их на следующем шаге
    process.stderr.write(\`ESLint нашёл проблемы в \${file}:\\n\${e.stdout}\`);
    process.exit(2);
  }
});</pre>
<pre data-lang="php">#!/usr/bin/env php
&lt;?php
// .claude/hooks/lint-after-edit.php — PostToolUse: phpstan для правленого файла
$event = json_decode(stream_get_contents(STDIN), true, flags: JSON_THROW_ON_ERROR);
$file = $event['tool_input']['file_path'] ?? '';
if (!str_ends_with($file, '.php')) {
    exit(0);
}
exec('vendor/bin/phpstan analyse --no-progress --error-format=raw ' . escapeshellarg($file) . ' 2>&1', $out, $code);
if ($code !== 0) {
    fwrite(STDERR, "phpstan нашёл ошибки в $file:\\n" . implode("\\n", $out));
    exit(2);
}
exit(0);</pre>
<pre data-lang="py">#!/usr/bin/env python3
# .claude/hooks/tests-before-stop.py — Stop: не отпускать агента с красными тестами
import json
import subprocess
import sys

event = json.load(sys.stdin)
# Если агент уже продолжает работу из-за этого хука, не держим его вечно
if event.get("stop_hook_active"):
    sys.exit(0)

proc = subprocess.run(["pytest", "-q", "-x"], capture_output=True, text=True)
if proc.returncode != 0:
    tail = (proc.stdout + proc.stderr)[-3000:]
    print("Тесты красные, задачу нельзя считать готовой:\\n" + tail, file=sys.stderr)
    sys.exit(2)
sys.exit(0)</pre>
<pre data-lang="ts">// trace.ts — простой трейс шагов агента в JSON Lines
import { appendFileSync } from "node:fs";

interface TraceStep {
  task: string;
  step: number;
  tool: string;
  input: unknown;
  inputTokens: number;
  outputTokens: number;
  ms: number;
  ok: boolean;
}

export function trace(s: TraceStep): void {
  // одна строка — один шаг: легко грепать, считать и грузить в Grafana/Loki
  appendFileSync("var/agent-trace.jsonl", JSON.stringify({ at: new Date().toISOString(), ...s }) + "\\n");
}

// В цикле агента после каждого шага:
// trace({ task: "fix-price", step, tool: block.name, input: block.input,
//         inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens, ms, ok: !isError });</pre>
            </div>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Ловим ошибки руками и кодом</h2>
      </div>

      <!-- 3.1 Лента агента -->
      <div class="stand" id="feed">
        <div class="stand-head"><h3>Найдите ошибки в логе агента</h3><span class="badge">интерактив 1 из 4</span></div>
        <p class="task">Задача агента: «скидка 10% для заказов от 100 BYN не применяется, почини». Для каждого шага выберите, что это. Потом нажмите «Проверить».</p>
        <div class="log" id="feed-log"></div>
        <div class="row"><button class="btn" type="button" id="feed-check">Проверить</button><button class="btn quiet" type="button" id="feed-reset">Сбросить</button><span class="result-line" id="feed-score"></span></div>
      </div>

      <!-- 3.2 Слои защиты -->
      <div class="stand" id="sim">
        <div class="stand-head"><h3>Соберите слои защиты</h3><span class="badge">интерактив 2 из 4</span></div>
        <p class="task">Агент решает 100 задач. В части задач он ошибается: 15% выдуманный API, 20% логика, 10% правки вне задачи, 6% ослабленный тест, 5% петля. Включайте слои и смотрите, сколько брака дойдёт до прода и сколько это стоит.</p>
        <div class="layers">
          <label><input type="checkbox" id="sim-lint"> <span>Линтер и типы<small>+0,5 мин на задачу</small></span></label>
          <label><input type="checkbox" id="sim-tests"> <span>Тесты<small>+2 мин на задачу</small></span></label>
          <label><input type="checkbox" id="sim-scope"> <span>Границы diff и защита tests/<small>секунды</small></span></label>
          <label><input type="checkbox" id="sim-budget"> <span>Бюджет и детектор петли<small>бесплатно</small></span></label>
          <label><input type="checkbox" id="sim-human"> <span>Ревью человеком<small>+12 мин человека на задачу</small></span></label>
        </div>
        <div class="row"><button class="btn" type="button" id="sim-run">▶ Прогнать 100 задач</button><span class="task">Случайность фиксирована: один и тот же набор задач для честного сравнения.</span></div>
        <div class="kpis">
          <div class="kpi" id="kpi-made"><b id="sim-made">—</b>ошибок сделано</div>
          <div class="kpi ok"><b id="sim-caught">—</b>поймано слоями</div>
          <div class="kpi bad"><b id="sim-escaped">—</b>дошло до прода</div>
          <div class="kpi"><b id="sim-human-min">—</b>минут человека</div>
          <div class="kpi"><b id="sim-tokens">—</b>млн токенов</div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Тип ошибки</th><th class="num">Сделано</th><th class="num">Поймано</th><th class="num">До прода</th><th>Кто поймал больше всех</th></tr></thead>
            <tbody id="sim-table"></tbody>
          </table>
        </div>
      </div>

      <!-- 3.3 Бюджет -->
      <div class="stand" id="bud">
        <div class="stand-head"><h3>Монитор бюджета: стоп-кран</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">График — сколько входных токенов агент потратил к каждому шагу. С 11-го шага агент застрял: гоняет одну и ту же команду. Поставьте лимит и включите детектор петли.</p>
        <div class="grid-2">
          <div class="field"><label for="bud-limit">Лимит токенов на задачу: <span class="mono" id="bud-limit-val">800 тыс.</span></label><input type="range" id="bud-limit" min="200000" max="1600000" step="100000" value="800000"></div>
          <div class="row">
            <label class="row" style="gap:0.4rem; font-weight:500"><input type="checkbox" id="bud-loop"> Детектор петли</label>
            <button class="btn" type="button" id="bud-run">▶ Запустить агента</button>
          </div>
        </div>
        <svg class="chart" id="bud-chart" viewBox="0 0 600 250" role="img" aria-label="Накопленные токены по шагам"></svg>
        <p class="task" id="bud-text" aria-live="polite">Нажмите «Запустить агента».</p>
      </div>

      <!-- 3.4 Индекс символов -->
      <div class="stand" id="sym">
        <div class="stand-head"><h3>Ловим выдуманный метод по индексу проекта</h3><span class="badge">интерактив 4 из 4</span></div>
        <p class="task">Агент прислал правку. Проверим каждый вызов по индексу символов проекта — списку настоящих классов и методов. Такой индекс строят статанализатор или IDE. Поправьте код и проверьте снова.</p>
        <details class="more">
          <summary>Индекс символов проекта <span class="hint">— что на самом деле есть в коде</span></summary>
          <div class="more-body"><pre data-lang="json" id="sym-index" class="no-copy"></pre></div>
        </details>
        <div class="field">
          <label for="sym-code">Правка агента (PHP)</label>
          <textarea id="sym-code" class="code" rows="9" style="min-height:11rem">$total = Money::fromFloat($order->getTotal());
if ($total-&gt;greaterThan(Money::fromFloat(100))) {
    $discount = $total-&gt;percent(10);
    $total = $total-&gt;minus($discount);
    $this-&gt;logger-&gt;info('discount applied');
}
$order-&gt;applyDiscountMagic($discount);
return Money::fromFloatSafe($total-&gt;toCents() / 100);</textarea>
        </div>
        <div class="row"><button class="btn" type="button" id="sym-check">Проверить по индексу</button></div>
        <ul class="diff-out" id="sym-out" aria-live="polite"></ul>
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
        <div class="q" data-q="l4-weak">
          <p>Агент поменял ожидаемое значение в тесте с 90 на 100, и тест позеленел. Как ловить такое автоматически?</p>
          <div class="options">
            <button>Попросить агента в CLAUDE.md не трогать тесты</button>
            <button data-right>Хук или проверка diff, которые запрещают правку tests/ без явного разрешения</button>
            <button>Запускать тесты два раза</button>
          </div>
          <p class="why">Просьба — мягкое правило. Защищённые файлы — жёсткое: агент получит отказ и будет вынужден чинить код, а не проверку.</p>
        </div>
        <div class="q" data-q="l4-halluc">
          <p>Что быстрее и дешевле всего ловит вызов несуществующего метода?</p>
          <div class="options">
            <button data-right>Статанализ и типы сразу после правки файла</button>
            <button>Ревью человеком перед слиянием</button>
            <button>Вторая модель, которая читает код</button>
          </div>
          <p class="why">Phpstan, tsc или mypy находят такие ошибки за секунды и всегда одинаково. Через PostToolUse-хук агент узнаёт об ошибке на следующем же шаге.</p>
        </div>
        <div class="q" data-q="l4-loop">
          <p>Агент сорок раз подряд запускает одну и ту же команду. Что должно сработать?</p>
          <div class="options">
            <button>Ничего, рано или поздно он догадается</button>
            <button>Человек заметит в конце дня по счёту</button>
            <button data-right>Детектор петли и лимит шагов или токенов: остановка с отчётом</button>
          </div>
          <p class="why">Каждый повтор отправляет модели всю историю заново, поэтому петля дорожает быстрее, чем линейно (урок 1). Стоп-кран должен быть кодом.</p>
        </div>
        <div class="q" data-q="l4-report">
          <p>Почему нельзя верить итоговому сообщению агента «всё готово, тесты проходят»?</p>
          <div class="options">
            <button>Агенты специально обманывают</button>
            <button data-right>Сообщение — тоже генерация текста. Верить нужно результатам проверок, которые запустил harness</button>
            <button>Можно, если модель самая новая</button>
          </div>
          <p class="why">Модель пишет правдоподобный отчёт, даже если тесты не запускались. Stop-хук, который сам запускает тесты, превращает отчёт в факт.</p>
        </div>
        <div class="q" data-q="l7-guard-loop" data-multi>
          <p>Какие шаги агента похожи на петлю?</p>
          <div class="options">
            <button data-right>Один и тот же вызов три раза подряд с тем же результатом</button>
            <button data-right>Пара вызовов, повторённая три раза: A, B, A, B, A, B</button>
            <button>Чтение файла, правка, запуск тестов</button>
            <button data-right>Три раза те же аргументы, только ключи в другом порядке: <code>{a:1, b:2}</code> и <code>{b:2, a:1}</code></button>
          </div>
          <p class="why">Детектор петли ищет повторы одного вызова и пары вызовов. Аргументы сравнивают после сортировки ключей, иначе петля спрячется за другим порядком. Чтение, правка и тесты — нормальный рабочий цикл, а не петля.</p>
        </div>
        <div class="q" data-q="l7-guard-index" data-multi>
          <p>В индексе проекта у класса Money есть методы fromFloat, greaterThan, percent, minus, toCents. Какие вызовы в правке агента выдуманы?</p>
          <div class="options">
            <button data-right><code>Money::fromFloatSafe(…)</code></button>
            <button data-right><code>$order-&gt;applyDiscountMagic(…)</code></button>
            <button><code>Money::fromFloat(100)</code></button>
            <button><code>$total-&gt;percent(10)</code></button>
          </div>
          <p class="why">Как в интерактиве 4: каждый вызов сверяют с индексом символов. fromFloatSafe и applyDiscountMagic в индексе нет — это выдумка модели. Статанализ находит такое за секунды, ещё до тестов.</p>
        </div>
        <div class="q" data-q="l7-guard-hooks" data-multi>
          <p>Что верно про хуки контроля?</p>
          <div class="options">
            <button data-right>PostToolUse после правки файла запускает линтер, ошибки сразу уходят модели</button>
            <button data-right>Stop не даёт агенту закончить, пока тесты красные</button>
            <button>PreToolUse запускает все тесты после каждого шага</button>
            <button data-right>PreToolUse запрещает правку тестов и конфигов линтера</button>
          </div>
          <p class="why">PreToolUse срабатывает до действия, поэтому им запрещают опасное: правку tests/, CI, конфигов проверок. Тесты после каждого шага гонять дорого — их запускает Stop перед финишем, а после правки хватает быстрого линтера.</p>
        </div>
        <div class="q" data-q="l7-guard-order" data-multi>
          <p>Почему слои защиты ставят от дешёвых к дорогим?</p>
          <div class="options">
            <button data-right>Линтер за секунды отсеивает много ошибок, и до дорогих слоёв доходит меньше</button>
            <button data-right>Человек дорогой, поэтому смотрит только то, что прошло автоматику, и только в ключевых точках</button>
            <button>Дорогие слои ловят всё, поэтому дешёвые можно не ставить</button>
          </div>
          <p class="why">У каждого слоя есть дыры, как в фильме про сыр. Дешёвые слои снимают массовый брак, дорогие ловят редкое. Без дешёвых слоёв человек утонет в ошибках, которые нашёл бы линтер.</p>
        </div>
        <div class="q" data-q="l7-guard-trace" data-multi>
          <p>Что стоит записывать в трейс каждого шага агента?</p>
          <div class="options">
            <button data-right>Инструмент и его аргументы</button>
            <button data-right>Сколько токенов и времени ушло на шаг</button>
            <button>Только итоговое сообщение агента</button>
            <button data-right>Результат шага</button>
          </div>
          <p class="why">По трейсу находят петли, самые дорогие шаги и причины аварий. Итоговое сообщение — тоже генерация текста: по нему не видно, что агент делал на самом деле.</p>
        </div>
        <div class="q" data-q="l7-guard-holes">
          <p>В фильме ошибка «логика без теста» прошла четыре слоя подряд. Что это значит?</p>
          <div class="options">
            <button>Эти слои сломаны, их надо убрать</button>
            <button data-right>На её пути совпали дыры четырёх слоёв: нужен слой, который закрывает эту дыру, например тест на этот случай или Stop-хук</button>
            <button>Ошибка летела слишком быстро</button>
          </div>
          <p class="why">Каждый слой ловит своё и пропускает остальное. Опасно, когда дыры совпадают. Лечится не удалением слоёв, а ещё одним слоем там, где у прошлых дыра.</p>
        </div>
        <div class="q" data-q="l7-guard-judge">
          <p>Можно ли сделать единственным контролем вторую модель, которая проверяет первую?</p>
          <div class="options">
            <button>Да, если вторая модель сильнее первой</button>
            <button data-right>Нет: у проверяющей модели те же слабости. Основа — детерминированные проверки, вторая модель — дополнительный слой</button>
            <button>Да, если запустить её два раза</button>
          </div>
          <p class="why">Проверяющая модель тоже может уверенно ошибиться. Линтер, типы и тесты дают один и тот же ответ на один и тот же код — на них и держится защита. Модель-судья полезна сверху (урок 8).</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 40 минут</span></summary>
        <div class="more-body">
          <ol>
            <li>Подключите PostToolUse-хук с линтером или статанализатором вашего языка. Попросите агента написать код с заведомо несуществующим методом и посмотрите, как он исправится сам.</li>
            <li>Поставьте Stop-хук с тестами. Убедитесь, что агент не может закончить с красным тестом.</li>
            <li>Добавьте PreToolUse-хук, который запрещает правку <code>tests/</code> и конфигов линтера. Сломайте тест и попросите агента «сделать тесты зелёными». Что он сделал?</li>
            <li>Запишите трейс одной задачи в JSON Lines. Посчитайте: сколько шагов, сколько токенов, какой шаг самый дорогой.</li>
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
        <li>Знаю семь типовых ошибок агента и могу узнать их в логе.</li>
        <li>Понимаю слои защиты и почему их ставят от дешёвых к дорогим.</li>
        <li>Знаю, как подключить линтер через PostToolUse и тесты через Stop.</li>
        <li>Понимаю, зачем защищать тесты и конфиги проверок от правок агента.</li>
        <li>Умею задать бюджет задачи и понимаю, почему петля дорожает быстро.</li>
        <li>Знаю, что писать в трейс шага и какие метрики процесса считать.</li>
        <li>Ответил на вопросы урока: признаки петли, выдуманные методы, хуки и порядок слоёв.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Теперь брак агента снимается с ленты автоматически. Дальше — как доказать цифрами, что агент и скилы стали работать лучше, а не хуже.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://habr.com/ru/companies/globalsign/articles/946872/" target="_blank" rel="noopener">Фантазии LLM воплощаются в реальности — фальшивые опенсорсные библиотеки</a><span>slopsquatting: модель выдумывает пакет, а злоумышленник его публикует. <span class="pill ok">рус.</span></span></li><li><a href="https://code.claude.com/docs/ru/costs" target="_blank" rel="noopener">Эффективное управление затратами</a><span>откуда берётся расход токенов в Claude Code и как его снизить. <span class="pill ok">рус., офиц.</span></span></li><li><a href="https://habr.com/ru/companies/pgkdigital/articles/1013700/" target="_blank" rel="noopener">Как не дать проекту деградировать при работе с Claude Code: правила, хуки и автоматизация</a><span>правила в инфраструктуру, а не в промпт: хуки и автопроверки. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/936156/" target="_blank" rel="noopener">ИИ под контролем: Guardrails как щит от рисков в агентных системах</a><span>что такое guardrails (ограничители), на каких этапах и какими бывают. <span class="pill ok">рус., перевод</span></span></li><li><a href="https://habr.com/ru/articles/972480/" target="_blank" rel="noopener">LLM Observability &amp; AI Agent Tracing: большой гайд</a><span>что отслеживать у агента и обзор open-source трассировки (Langfuse, Phoenix и др.). <span class="pill ok">рус.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://phpstan.org/try" target="_blank" rel="noopener">PHPStan Playground</a><span>вставить код с выдуманным методом и увидеть, как статический анализ ловит «галлюцинацию» до запуска.</span></li><li><a href="https://regex101.com/" target="_blank" rel="noopener">regex101</a><span>написать регулярку-фильтр на секреты (ключи, токены) для guardrail или hook.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .belt { position: relative; height: 5.5rem; background: var(--hc-surface-2); border-radius: var(--hc-r-sm); overflow: hidden; }
.hc .belt::after { content: ""; position: absolute; left: 0; right: 0; bottom: 1rem; border-top: 2px dashed var(--hc-line); }
.hc .belt .station { position: absolute; top: 0.3rem; bottom: 0.3rem; width: 2px; background: var(--hc-accent); }
.hc .belt .station span { position: absolute; top: 0; left: 6px; font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-accent); white-space: nowrap; }
.hc .belt .item { position: absolute; bottom: 1.15rem; left: 0; width: 1.3rem; height: 1.3rem; margin-left: -0.65rem; border-radius: 4px; background: var(--hc-ok); transition: left 0.9s linear, transform 0.4s, opacity 0.4s; }
.hc .belt .item.defect { background: var(--hc-bad); }
.hc .belt .item.caught { transform: translateY(2.2rem) rotate(25deg); opacity: 0; }
.hc .belt-stats { display: flex; flex-wrap: wrap; gap: 1.2rem; font-size: var(--hc-fs-sm); }
.hc .belt-stats b { font: 600 var(--hc-fs-lg) var(--hc-f-mono); display: block; font-variant-numeric: tabular-nums; }
.hc .errs { display: grid; gap: 0.5rem; grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr)); }
.hc .err { background: var(--hc-surface); border: 1px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; display: grid; gap: 0.25rem; font-size: var(--hc-fs-sm); }
.hc .err b { font-size: var(--hc-fs-sm); }
.hc .err span { color: var(--hc-muted); }
.hc .log { display: grid; gap: 0.4rem; }
.hc .log-row { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 11rem; gap: 0.6rem; align-items: start; padding: 0.5rem 0.6rem; border-radius: var(--hc-r-sm); background: var(--hc-bg); font-size: var(--hc-fs-sm); border-left: 4px solid var(--hc-line); }
@media (max-width: 640px) {
.hc .log-row { grid-template-columns: 2rem minmax(0, 1fr); }
.hc .log-row select { grid-column: 2; }
}
.hc .log-row .n { font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); padding-top: 0.15rem; }
.hc .log-row code { overflow-wrap: anywhere; }
.hc .log-row.right { border-left-color: var(--hc-ok); }
.hc .log-row.wrong { border-left-color: var(--hc-bad); }
.hc .log-row .why { display: block; margin-top: 0.25rem; color: var(--hc-muted); }
.hc .layers { display: grid; gap: 0.4rem; grid-template-columns: repeat(auto-fit, minmax(min(13rem, 100%), 1fr)); }
.hc .layers label { font-weight: 400; display: flex; gap: 0.5rem; align-items: flex-start; background: var(--hc-bg); border: 1px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.5rem 0.6rem; }
.hc .layers label input { margin-top: 0.2rem; flex: none; }
.hc .layers small { display: block; color: var(--hc-muted); }
.hc .kpis { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr)); }
.hc .kpi { background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; display: grid; gap: 0.1rem; font-size: var(--hc-fs-xs); color: var(--hc-muted); }
.hc .kpi b { font: 600 var(--hc-fs-xl) var(--hc-f-mono); color: var(--hc-ink); font-variant-numeric: tabular-nums; }
.hc .kpi.bad b { color: var(--hc-bad); }
.hc .kpi.ok b { color: var(--hc-ok); }
.hc .chart { width: 100%; height: auto; display: block; }
.hc .chart .grid { stroke: var(--hc-line); stroke-width: 1; }
.hc .chart .axis { fill: var(--hc-muted); font: 500 10px var(--hc-f-mono); }
.hc .chart .line { fill: none; stroke: var(--hc-accent); stroke-width: 2.5; }
.hc .chart .area { fill: color-mix(in srgb, var(--hc-accent) 14%, transparent); stroke: none; }
.hc .chart .limit { stroke: var(--hc-bad); stroke-width: 1.5; stroke-dasharray: 6 4; }
.hc .chart .limit-label { fill: var(--hc-bad); font: 600 10px var(--hc-f-mono); }
.hc .chart .dot { fill: var(--hc-accent); }
.hc .chart .dot.loop { fill: var(--hc-bad); }
.hc .chart .stop { fill: var(--hc-bad); }
.hc .diff-out { list-style: none; padding: 0; display: grid; gap: 0.3rem; font-size: var(--hc-fs-sm); }
.hc .diff-out li { margin: 0; display: flex; gap: 0.5rem; align-items: baseline; flex-wrap: wrap; }
</style>
`;export{n as default};
