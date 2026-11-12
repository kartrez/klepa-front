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
      <span class="eyebrow">Часть 4 · Доверяй, но проверяй · Урок 8</span>
      <h1>Измеряем качество: eval-наборы, сравнение версий и регрессии</h1>
      <p class="lead">Вы поменяли скил, промпт или модель. Стало лучше или просто повезло? Разберём, как проверять агента не на глаз, а цифрами — и не обмануться шумом.</p>
      <div class="facts">
        <span class="fact">~50 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">12 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>собрать простой eval: набор задач, грейдер, прогон, отчёт;</li>
          <li>выбрать грейдер под задачу: точное совпадение, структура, тесты или LLM-судья;</li>
          <li>понять, когда разница между версиями — настоящая, а когда шум;</li>
          <li>находить регрессии: где новая версия стала хуже старой.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Дегустация, а не один глоток</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Повар поменял рецепт супа. Один глоток ничего не скажет: могла попасться удачная ложка. Нужна серия проб и понятная шкала оценки. Eval — это такая дегустация для агента.</p>
      </div>
      <div class="stand" id="sip">
        <div class="stand-head"><h3>Рецепт удаётся в 70% случаев. Что покажут пробы?</h3></div>
        <div class="sip-row">
          <div class="row"><button class="btn small" type="button" id="sip-1">1 проба</button><button class="btn small secondary" type="button" id="sip-5">5 проб</button><button class="btn small secondary" type="button" id="sip-50">50 проб</button></div>
          <div class="dots" id="sip-dots" aria-hidden="true"></div>
          <p class="task" id="sip-text" aria-live="polite">Нажмите кнопку. Зелёная точка — суп удался, красная — нет.</p>
        </div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Рецепт</b><span>= промпт, скил, модель, настройки агента</span></div>
        <div><b>Одна проба</b><span>= один прогон агента на одной задаче</span></div>
        <div><b>Шкала дегустатора</b><span>= грейдер: правило «прошло / не прошло»</span></div>
        <div><b>Серия проб</b><span>= eval-набор: десятки и сотни задач</span></div>
      </div>
      <p>Главная мысль: агент отвечает каждый раз по-разному. Поэтому один удачный запуск ничего не доказывает. Доказывает доля успехов на большом наборе задач.</p>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Eval — это юнит-тесты для недетерминированного кода</h3>
        <p>Eval (<span class="term" data-tip="Evaluation — оценка. Набор задач и правил, по которым автоматически меряют качество модели или агента.">оценка</span>) состоит из четырёх частей:</p>
        <ol>
          <li><strong>Набор задач</strong> — вход для агента. Например, 50 реальных багов.</li>
          <li><strong>Грейдер</strong> — функция, которая решает: задача решена или нет.</li>
          <li><strong>Прогон</strong> — запускаем агента на каждой задаче, иногда по несколько раз.</li>
          <li><strong>Сравнение</strong> — считаем долю успехов и сравниваем со старой версией.</li>
        </ol>
        <div class="code-tabs">
<pre data-lang="js">const results = [];
for (const task of tasks) {
  const output = await runAgent(task.input);   // агент отвечает по-разному
  results.push({ id: task.id, pass: grade(output, task) });
}
const passRate = results.filter(r => r.pass).length / results.length;
console.log(\`Решено: \${Math.round(passRate * 100)}%\`);</pre>
<pre data-lang="php">&lt;?php
$results = [];
foreach ($tasks as $task) {
    $output = runAgent($task['input']);            // агент отвечает по-разному
    $results[] = ['id' => $task['id'], 'pass' => grade($output, $task)];
}
$passRate = count(array_filter($results, fn ($r) => $r['pass'])) / count($results);
echo 'Решено: ', round($passRate * 100), "%\\n";</pre>
<pre data-lang="py">results = []
for task in tasks:
    output = run_agent(task["input"])   # агент отвечает по-разному
    results.append({"id": task["id"], "pass": grade(output, task)})
pass_rate = sum(r["pass"] for r in results) / len(results)
print(f"Решено: {round(pass_rate * 100)}%")</pre>
        </div>
        <div class="tip"><b>Отличие от юнит-тестов</b>Юнит-тест либо зелёный, либо красный. Eval даёт долю: «решено 72%». И эта доля немного гуляет от запуска к запуску.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Грейдеры, метрики и откуда брать задачи</h3>
        <p><strong>Виды грейдеров</strong> — от самых надёжных к самым гибким:</p>
        <ul>
          <li><strong>Точное совпадение.</strong> Ответ равен эталону. Подходит для классификации: «billing», «bug», «question».</li>
          <li><strong>Структура или шаблон.</strong> Ответ — валидный JSON с нужными полями, номер заказа подходит под регулярное выражение.</li>
          <li><strong>Запуск кода и тестов.</strong> Агент исправил баг — запускаем тесты. Для кода это лучший грейдер: проверяет результат, а не слова.</li>
          <li><strong>LLM-судья</strong> (<span class="term" data-tip="LLM-as-judge: другая модель оценивает ответ по заранее заданной рубрике.">LLM-as-judge</span>). Другая модель оценивает ответ по рубрике — списку критериев. Нужен там, где нет одного правильного ответа: письмо клиенту, объяснение, ревью.</li>
        </ul>
        <p><strong>Метрики.</strong> Главная — <em>доля успехов</em> (pass rate). Ещё две полезны для агентов:</p>
        <ul>
          <li><strong>pass@k</strong> — хотя бы одна из k попыток успешна. Важно, если можно сделать несколько попыток и выбрать лучшую.</li>
          <li><strong>pass^k</strong> — все k попыток успешны. Важно для надёжности: агент в проде должен справляться каждый раз, а не иногда.</li>
        </ul>
        <p>И не забывайте про <strong>цену и время на задачу</strong>. Версия на 2% лучше, но вдвое дороже — не всегда победа.</p>
        <p><strong>Откуда брать задачи.</strong> Лучшие задачи — настоящие: закрытые баги с тестом, частые тикеты, сессии, где агент ошибся. Каждая ошибка агента в работе — кандидат в eval-набор, чтобы она не повторилась.</p>
        <details class="more">
          <summary>Простой eval-раннер в коде <span class="hint">— Python и TypeScript</span></summary>
          <div class="more-body">
            <p>Раннер читает задачи из файла, гоняет агента по несколько раз и пишет отчёт. Функция <code>run_agent</code> — ваш агент: вызов API, CLI или скрипт.</p>
            <div class="code-tabs">
<pre data-lang="py">import json
import statistics

def grade_exact(output: str, case: dict) -> bool:
    return output.strip().lower() == case["expected"].lower()

def run_eval(cases: list[dict], run_agent, grader, repeats: int = 3) -> dict:
    per_case = {}
    for case in cases:
        passes = [grader(run_agent(case["input"]), case) for _ in range(repeats)]
        per_case[case["id"]] = sum(passes) / repeats   # доля успехов на одной задаче
    return {
        "pass_rate": statistics.mean(per_case.values()),
        "per_case": per_case,                         # пригодится для поиска регрессий
    }

with open("evals/tickets.jsonl", encoding="utf-8") as f:
    cases = [json.loads(line) for line in f]

report = run_eval(cases, run_agent=my_agent, grader=grade_exact)
print(f"Решено: {report['pass_rate']:.0%}")</pre>
<pre data-lang="ts">interface EvalCase { id: string; input: string; expected: string }
type Grader = (output: string, c: EvalCase) => boolean;

async function runEval(
  cases: EvalCase[],
  runAgent: (input: string) => Promise&lt;string>,
  grader: Grader,
  repeats = 3,
) {
  const perCase: Record&lt;string, number> = {};
  for (const c of cases) {
    let ok = 0;
    for (let i = 0; i < repeats; i++) {
      if (grader(await runAgent(c.input), c)) ok++;
    }
    perCase[c.id] = ok / repeats;
  }
  const values = Object.values(perCase);
  return { passRate: values.reduce((s, x) => s + x, 0) / values.length, perCase };
}

const exact: Grader = (out, c) => out.trim().toLowerCase() === c.expected.toLowerCase();</pre>
<pre data-lang="php">&lt;?php
function gradeExact(string $output, array $case): bool
{
    return mb_strtolower(trim($output)) === mb_strtolower($case['expected']);
}

function runEval(array $cases, callable $runAgent, callable $grader, int $repeats = 3): array
{
    $perCase = [];
    foreach ($cases as $case) {
        $ok = 0;
        for ($i = 0; $i < $repeats; $i++) {
            if ($grader($runAgent($case['input']), $case)) { $ok++; }
        }
        $perCase[$case['id']] = $ok / $repeats;   // доля успехов на одной задаче
    }
    return ['passRate' => array_sum($perCase) / count($perCase), 'perCase' => $perCase];
}

$lines = file('evals/tickets.jsonl', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$cases = array_map(fn ($line) => json_decode($line, true), $lines);
$report = runEval($cases, 'myAgent', 'gradeExact');
echo 'Решено: ', round($report['passRate'] * 100), "%\\n";</pre>
            </div>
          </div>
        </details>
        <details class="more">
          <summary>Грейдер «запусти тесты» <span class="hint">— PHP и JS</span></summary>
          <div class="more-body">
            <p>Агент поправил код во временной копии репозитория. Грейдер запускает тесты именно этой задачи и смотрит код выхода: 0 — успех.</p>
            <div class="code-tabs">
<pre data-lang="php">&lt;?php
// Грейдер: прошли ли тесты после правки агента
function gradeByTests(string $workdir, string $testFilter): bool
{
    $cmd = sprintf(
        'cd %s && vendor/bin/phpunit --filter %s 2>&1',
        escapeshellarg($workdir),
        escapeshellarg($testFilter),
    );
    exec($cmd, $output, $exitCode);
    file_put_contents($workdir . '/eval-log.txt', implode("\\n", $output));
    return $exitCode === 0;
}

$pass = gradeByTests('/tmp/eval/case-42', 'VatCalculatorTest');
echo $pass ? "PASS\\n" : "FAIL\\n";</pre>
<pre data-lang="js">import { spawnSync } from "node:child_process";

// Грейдер: запускаем тесты в копии репозитория, где работал агент
export function gradeByTests(workdir, testPattern) {
  const r = spawnSync("npx", ["vitest", "run", testPattern], {
    cwd: workdir,
    encoding: "utf8",
    timeout: 120_000,       // зависший тест — тоже провал
  });
  return { pass: r.status === 0, log: (r.stdout || "") + (r.stderr || "") };
}</pre>
<pre data-lang="py">import subprocess
from pathlib import Path

# Грейдер: прошли ли тесты после правки агента
def grade_by_tests(workdir: str, test_filter: str) -> bool:
    try:
        r = subprocess.run(
            ["python", "-m", "pytest", "-k", test_filter],
            cwd=workdir, capture_output=True, text=True, timeout=120,
        )
    except subprocess.TimeoutExpired:
        return False                 # зависший тест — тоже провал
    Path(workdir, "eval-log.txt").write_text(r.stdout + r.stderr)
    return r.returncode == 0

passed = grade_by_tests("/tmp/eval/case-42", "test_vat_calculator")
print("PASS" if passed else "FAIL")</pre>
            </div>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Шум, регрессии и честное сравнение</h3>
        <p><strong>Шум.</strong> Допустим, старая версия решила 14 задач из 20 (70%), новая — 16 из 20 (80%). Кажется, стало лучше. Но при 20 задачах разброс огромный: у той же самой версии в другой день вполне может выйти и 60%, и 85%. Простое правило: погрешность доли примерно равна <code>2 · √(p·(1−p)/n)</code>. Для p = 0,7 и n = 20 это ±20%. Для n = 200 — уже ±6,5%. Чем больше задач, тем меньше шум.</p>
        <p><strong>Регрессии.</strong> Новая версия может поднять общий процент и при этом сломать важный сценарий. Например, стала лучше писать отчёты, но перестала отказываться от опасной операции. Поэтому смотрят не только на общий процент, но и на каждую задачу отдельно.</p>
        <p><strong>A/B-сравнение.</strong> Меняйте одну вещь за раз: скил, промпт или модель. Прогоняйте обе версии на одном и том же наборе. Иначе непонятно, что дало эффект.</p>
        <p><strong>Риски LLM-судьи.</strong> Судья — тоже модель, и у него есть перекосы. Он любит длинные ответы, предпочитает первый вариант при сравнении двух и бывает мягок к текстам своей же модели. Что помогает: конкретная рубрика вместо «оцени качество», перестановка вариантов местами, сверка судьи с оценками людей на 20–30 примерах.</p>
        <div class="note"><b>Eval в CI</b>Небольшой быстрый набор (10–30 задач) запускают на каждое изменение скилов и промптов, как обычные тесты. Большой набор — по расписанию или перед сменой модели. Так регрессию видно до того, как её заметят пользователи.</div>
        <details class="more">
          <summary>Пример промпта LLM-судьи с рубрикой <span class="hint">— шаблон</span></summary>
          <div class="more-body">
            <p>Судья отвечает строгим JSON. Рубрика — конкретные проверяемые пункты, а не «оцени по шкале от 1 до 10».</p>
<pre data-lang="text">Ты проверяешь ответ службы поддержки. Оцени ответ по рубрике.
Для каждого пункта ответь true или false и коротко объясни.

Рубрика:
1. tone: тон вежливый, без упрёков клиенту.
2. answer: в ответе есть прямой ответ на вопрос клиента.
3. no_promises: нет обещаний, которых нет в правилах (возврат, скидка, сроки).
4. next_step: клиенту понятно, что делать дальше.

Вопрос клиента:
&lt;question&gt;{{question}}&lt;/question&gt;

Ответ, который проверяем:
&lt;answer&gt;{{answer}}&lt;/answer&gt;

Верни только JSON:
{"tone": {"pass": true, "why": "..."}, "answer": {...}, "no_promises": {...}, "next_step": {...}}</pre>
            <p>Ответ засчитывается, если все пункты <code>pass: true</code>. Так оценка прозрачна: видно, какой именно пункт провален.</p>
          </div>
        </details>
        <details class="more">
          <summary>Формула pass@k <span class="hint">— для любопытных</span></summary>
          <div class="more-body">
            <p>Пусть агент сделал n попыток на задаче, из них c успешных. Какова вероятность, что среди k случайно выбранных попыток будет хотя бы одна успешная?</p>
<pre data-lang="text">pass@k = 1 − C(n − c, k) / C(n, k)

C(a, b) — число сочетаний «из a по b».
C(n − c, k) / C(n, k) — шанс вытащить k попыток, и все неудачные.</pre>
            <p>Например, n = 10, c = 3, k = 1: pass@1 = 0,3 — обычная доля успехов. При k = 3 шанс найти хоть одну удачную попытку уже ≈ 0,71.</p>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Почувствуйте шум и регрессии</h2>
        <p>Агентов здесь нет: успехи выпадают случайно с заданной вероятностью. Так и ведёт себя настоящий агент, если смотреть на долю успехов.</p>
      </div>

      <!-- 3.1 Симулятор шума -->
      <div class="stand" id="ns">
        <div class="stand-head"><h3>Две версии скила: кто лучше?</h3><span class="badge">интерактив 1 из 4</span></div>
        <p class="task">По-настоящему версия Б лучше: 75% против 70%. Прогоните eval на разном числе задач и посмотрите, как часто наблюдаемый результат врёт.</p>
        <div class="grid-3">
          <div class="field">
            <label for="ns-pa">Истинная успешность А: <span class="mono" id="ns-pa-val">70%</span></label>
            <input type="range" id="ns-pa" min="0.4" max="0.95" step="0.01" value="0.7">
          </div>
          <div class="field">
            <label for="ns-pb">Истинная успешность Б: <span class="mono" id="ns-pb-val">75%</span></label>
            <input type="range" id="ns-pb" min="0.4" max="0.95" step="0.01" value="0.75">
          </div>
          <div class="field">
            <label for="ns-n">Задач в наборе</label>
            <select id="ns-n">
              <option value="5">5</option>
              <option value="20" selected>20</option>
              <option value="50">50</option>
              <option value="200">200</option>
            </select>
          </div>
        </div>
        <div class="row">
          <button class="btn" type="button" id="ns-run">▶ Прогнать eval</button>
          <button class="btn secondary" type="button" id="ns-many">Повторить 1000 раз</button>
        </div>
        <div class="ns-line"><b>Версия А</b><div class="dots" id="ns-dots-a" aria-hidden="true"></div><span class="rate" id="ns-rate-a">—</span></div>
        <div class="ns-line"><b>Версия Б</b><div class="dots" id="ns-dots-b" aria-hidden="true"></div><span class="rate" id="ns-rate-b">—</span></div>
        <div class="note" id="ns-result" aria-live="polite"><b>Итог</b>Нажмите «Прогнать eval».</div>
      </div>

      <!-- 3.2 Выбор грейдера -->
      <div class="stand" id="gc">
        <div class="stand-head"><h3>Подберите грейдер под задачу</h3><span class="badge">интерактив 2 из 4</span></div>
        <p class="task">Для каждой задачи выберите способ проверки. Потом нажмите «Проверить выбор».</p>
        <div class="table-wrap">
          <table class="gc-table">
            <thead><tr><th>Задача агента</th><th>Грейдер</th></tr></thead>
            <tbody id="gc-body"></tbody>
          </table>
        </div>
        <div class="row"><button class="btn" type="button" id="gc-check">Проверить выбор</button><span class="result-line" id="gc-score" aria-live="polite"></span></div>
      </div>

      <!-- 3.3 Матрица регрессий -->
      <div class="stand" id="rm">
        <div class="stand-head"><h3>Где новая версия стала хуже</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">Доля успехов по сценариям для трёх версий агента поддержки. Выберите версию: она сравнится с предыдущей. Разница меньше 5 пунктов — считаем шумом.</p>
        <div class="row" role="group" aria-label="Версия для сравнения">
          <button class="chip-btn" type="button" data-ver="1" aria-pressed="false">v2 против v1</button>
          <button class="chip-btn" type="button" data-ver="2" aria-pressed="false">v3 против v2</button>
        </div>
        <div class="table-wrap">
          <table class="matrix">
            <thead><tr><th>Сценарий</th><th class="num" data-col="0">v1</th><th class="num" data-col="1">v2</th><th class="num" data-col="2">v3</th></tr></thead>
            <tbody id="rm-body"></tbody>
            <tfoot><tr id="rm-avg"></tr></tfoot>
          </table>
        </div>
        <div class="note" id="rm-result" aria-live="polite"><b>Вывод</b>Выберите версию.</div>
      </div>

      <!-- 3.4 Конвейер -->
      <div class="stand" id="ep">
        <div class="stand-head"><h3>Как eval проходит от набора задач до решения</h3><span class="badge">интерактив 4 из 4</span></div>
        <div class="flow">
          <div class="node" id="ep-n0"><b>Набор задач</b><small>40 тикетов</small></div><span class="arrow">→</span>
          <div class="node" id="ep-n1"><b>Прогон агента</b><small>× 3 повтора</small></div><span class="arrow">→</span>
          <div class="node" id="ep-n2"><b>Грейдер</b><small>тесты + судья</small></div><span class="arrow">→</span>
          <div class="node" id="ep-n3"><b>Отчёт</b><small>доля, регрессии</small></div><span class="arrow">→</span>
          <div class="node" id="ep-n4"><b>Решение</b><small>принять / откатить</small></div>
        </div>
        <div class="ep-log" id="ep-log" aria-live="polite">Нажмите «Дальше» или «Авто».</div>
        <div class="row">
          <button class="btn quiet" type="button" id="ep-prev">← Назад</button>
          <button class="btn" type="button" id="ep-next">Дальше →</button>
          <button class="btn secondary" type="button" id="ep-play">▶ Авто</button>
          <button class="btn quiet" type="button" id="ep-reset">Сначала</button>
          <span class="task" id="ep-label"></span>
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
        <div class="q" data-q="l8-one-run">
          <p>Вы поменяли скил и один раз запустили агента. Задача решена. Что это доказывает?</p>
          <div class="options">
            <button>Что новый скил лучше старого</button>
            <button data-right>Почти ничего: агент недетерминирован, нужна доля успехов на наборе задач</button>
            <button>Что скил работает во всех случаях</button>
          </div>
          <p class="why">Один прогон — один глоток супа. Старый скил тоже мог решить эту задачу. Выводы делают по серии задач и повторов.</p>
        </div>
        <div class="q" data-q="l8-grader">
          <p>Какой грейдер лучше всего подходит для задачи «исправь баг в расчёте НДС»?</p>
          <div class="options">
            <button>LLM-судья, который прочитает diff</button>
            <button>Точное совпадение diff с эталонным</button>
            <button data-right>Запуск тестов на расчёт НДС после правки</button>
          </div>
          <p class="why">Тесты проверяют результат, а не слова. Правильный фикс можно написать многими способами, поэтому сравнение с эталонным diff не годится.</p>
        </div>
        <div class="q" data-q="l8-noise">
          <p>Старая версия решила 74% задач, новая — 78%. В наборе 20 задач. Какой вывод честный?</p>
          <div class="options">
            <button>Новая версия лучше на 4%, можно выкатывать</button>
            <button data-right>Разница в пределах шума. Нужно больше задач или повторов, плюс проверить регрессии</button>
            <button>Новая версия хуже, раз рост такой маленький</button>
          </div>
          <p class="why">На 20 задачах погрешность около ±20%. Разница в 4 пункта ничего не доказывает ни в одну сторону.</p>
        </div>
        <div class="q" data-q="l8-judge">
          <p>LLM-судья стабильно ставит высокие оценки длинным ответам. Что делать?</p>
          <div class="options">
            <button data-right>Дать конкретную рубрику и сверить судью с оценками людей на примерах</button>
            <button>Попросить судью «быть объективным»</button>
            <button>Обрезать все ответы до одинаковой длины</button>
          </div>
          <p class="why">Конкретные пункты рубрики не зависят от длины. Сверка с людьми показывает, где судья ошибается, — а значит, можно ли ему верить.</p>
        </div>
        <div class="q" data-q="l8-eval-parts" data-multi>
          <p>Из чего состоит eval?</p>
          <div class="options">
            <button data-right>Набор задач — вход для агента</button>
            <button data-right>Грейдер — правило «решено или не решено»</button>
            <button>Ревью каждого ответа агента человеком</button>
            <button data-right>Сравнение доли успехов со старой версией</button>
          </div>
          <p class="why">Четыре части: набор задач, грейдер, прогон и сравнение. Люди в eval нужны точечно — например, чтобы сверить LLM-судью на 20–30 примерах. Проверять руками каждый ответ — это уже не eval, а ручное тестирование.</p>
        </div>
        <div class="q" data-q="l8-grader-fit" data-multi>
          <p>Для каких задач хватит простого грейдера — точного совпадения или проверки структуры?</p>
          <div class="options">
            <button data-right>Отнести обращение к классу billing, bug или question</button>
            <button data-right>Вернуть JSON с полями <code>order_id</code> и <code>status</code></button>
            <button>Написать вежливое письмо клиенту про задержку заказа</button>
            <button data-right>Найти в тексте номер заказа по шаблону</button>
          </div>
          <p class="why">У этих задач один верный ответ или чёткая форма, поэтому проверка простая и надёжная. Хорошее письмо можно написать сотней способов: тут нужен LLM-судья с конкретной рубрикой.</p>
        </div>
        <div class="q" data-q="l8-before-release" data-multi>
          <p>Новая версия решила 80% задач, старая — 75%. Что ещё проверить перед выкаткой?</p>
          <div class="options">
            <button data-right>Какие задачи старая версия решала, а новая — нет</button>
            <button data-right>Цену и время на одну задачу</button>
            <button data-right>Не укладывается ли разница в шум при вашем размере набора</button>
            <button>Ничего: общий процент вырос, значит, версия лучше</button>
          </div>
          <p class="why">Например, версия Б лучше в среднем, но сломала задачу 7. Версия на пару процентов лучше, но вдвое дороже, — не всегда победа. А 5 пунктов на небольшом наборе легко оказываются шумом.</p>
        </div>
        <div class="q" data-q="l8-passk" data-multi>
          <p>Агент решил задачу 3 раза из 10 попыток. Что верно?</p>
          <div class="options">
            <button data-right>pass@1 — 30%, обычная доля успехов</button>
            <button data-right>pass@3 выше: среди трёх попыток хоть одна удачная примерно в 71% случаев</button>
            <button>pass^3 тоже около 71%</button>
            <button data-right>Для агента в проде важнее pass^k: он должен справляться каждый раз</button>
          </div>
          <p class="why">pass@k — хотя бы одна удача из k попыток, с ростом k он растёт. pass^k — удачны все k, при 3 из 10 это меньше 1%. В работе у агента обычно нет второй попытки, поэтому надёжность меряют по pass^k.</p>
        </div>
        <div class="q" data-q="l8-shrink-noise">
          <p>Как уменьшить шум, чтобы честно сравнить две версии?</p>
          <div class="options">
            <button>Сравнивать лучший прогон каждой версии</button>
            <button data-right>Взять больше задач и повторов: погрешность падает с ростом их числа</button>
            <button>Запускать eval ночью, когда API меньше загружен</button>
          </div>
          <p class="why">Погрешность — примерно 2 · √(p·(1−p)/n). При p = 0,7 и 20 задачах это ±20%, при 200 — ±6,5%. Лучший прогон — та же удачная ложка супа. Загрузка API на разброс ответов почти не влияет.</p>
        </div>
        <div class="q" data-q="l8-one-change">
          <p>Вы поменяли и промпт, и модель. Eval показал +8 пунктов. Что не так?</p>
          <div class="options">
            <button>Ничего: рост большой, можно выкатывать</button>
            <button data-right>Непонятно, что дало эффект. Меняйте одну вещь за раз и гоняйте обе версии на одном наборе</button>
            <button>Надо было заодно поменять и скилы, чтобы рост был ещё больше</button>
          </div>
          <p class="why">Может, новая модель дала +12, а новый промпт отнял 4. Это A/B-сравнение: одно изменение, один и тот же набор задач. Тогда понятно, что оставить, а что откатить.</p>
        </div>
        <div class="q" data-q="l8-task-source" data-multi>
          <p>Откуда брать задачи для eval-набора?</p>
          <div class="options">
            <button data-right>Из закрытых багов, к которым есть тест</button>
            <button data-right>Из сессий, где агент ошибся в работе</button>
            <button>Попросить модель придумать 500 задач и взять их без проверки</button>
            <button data-right>Из частых тикетов пользователей</button>
          </div>
          <p class="why">Лучшие задачи — настоящие. Каждая ошибка агента в работе — кандидат в набор, чтобы она не повторилась. Задачи, выдуманные моделью без проверки, часто проще реальных, а их эталоны бывают неверными.</p>
        </div>
        <div class="q" data-q="l8-judge-bias" data-multi>
          <p>Какие перекосы бывают у LLM-судьи?</p>
          <div class="options">
            <button data-right>Ставит выше длинные ответы</button>
            <button data-right>При сравнении двух ответов чаще выбирает первый</button>
            <button>Всегда занижает оценки, поэтому ему нельзя давать рубрику</button>
            <button data-right>Мягче оценивает тексты своей же модели</button>
          </div>
          <p class="why">Судья — тоже модель со своими перекосами. Помогают конкретная рубрика, перестановка вариантов местами и сверка с людьми. Рубрика, наоборот, делает оценку прозрачной: видно, какой пункт провален.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 30 минут</span></summary>
        <div class="more-body">
          <ol>
            <li>Выберите одну повторяющуюся задачу, которую вы даёте агенту. Например, «напиши тест к сервису» или «объясни ошибку из лога».</li>
            <li>Соберите 10 настоящих примеров в файл <code>evals/&lt;задача&gt;.jsonl</code>: вход и что считается успехом.</li>
            <li>Выберите грейдер: тесты, структура, точное совпадение или рубрика для судьи.</li>
            <li>Прогоните агента по 3 раза на каждом примере. Запишите долю успехов. Это ваша точка отсчёта.</li>
            <li>Поменяйте одну вещь в инструкциях и прогоните снова. Сравните долю успехов и отдельно найдите задачи, которые стали хуже.</li>
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
        <li>Могу назвать четыре части eval: набор задач, грейдер, прогон, сравнение.</li>
        <li>Знаю четыре вида грейдеров и когда какой брать.</li>
        <li>Понимаю разницу между pass@k и pass^k.</li>
        <li>Понимаю, почему 20 задач мало для вывода о разнице в несколько процентов.</li>
        <li>Смотрю не только на общий процент, но и на регрессии по задачам.</li>
        <li>Знаю риски LLM-судьи и как их снижать.</li>
        <li>Ответил на вопросы урока про грейдеры, шум и сравнение версий.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Теперь изменения в агенте можно доказывать цифрами. Дальше — как перевести на такой подход целый проект.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://habr.com/ru/articles/905728/" target="_blank" rel="noopener">LLM-судья: как LLM отсекает правду от лжи?</a><span>LLM-as-judge: типы судей, промпты для оценки, плюсы и минусы. <span class="pill ok">рус., перевод</span></span></li><li><a href="https://habr.com/ru/articles/1050736/" target="_blank" rel="noopener">Evals: что должен знать каждый AI-инженер в 2026</a><span>зачем evals, оценка по результату, а не по словам агента, типичные ошибки. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/1042924/" target="_blank" rel="noopener">Evals для чайников</a><span>минимальный набор evals, чтобы понять, где именно ломается агент. <span class="pill ok">рус.</span></span></li><li><a href="https://platform.claude.com/docs/ru/test-and-evaluate/develop-tests" target="_blank" rel="noopener">Определение критериев успеха и создание оценок</a><span>официально: как задать критерии и собрать тестовый набор, включая оценку моделью. <span class="pill ok">рус., офиц.</span></span></li><li><a href="https://www.promptfoo.dev/docs/getting-started/" target="_blank" rel="noopener">Getting started — Promptfoo</a><span>первый конфиг: промпты, тест-кейсы, проверки, сравнение вариантов. <span class="pill">англ.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://www.promptfoo.dev/docs/usage/web-ui/" target="_blank" rel="noopener">Promptfoo</a><span>локально через \`npx promptfoo@latest init\`, затем \`promptfoo view\`: таблица сравнения двух промптов. <span class="pill warn">локально, npx</span></span></li><li><a href="https://abtestguide.com/calc/" target="_blank" rel="noopener">A/B-Test Calculator</a><span>проверить, значима ли разница между двумя версиями промпта или скилла.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>посчитать долю прошедших кейсов и сравнить прогоны в Python без установки.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .dots { display: flex; flex-wrap: wrap; gap: 4px; min-height: 1.2rem; }
.hc .dots i { width: 12px; height: 12px; border-radius: 50%; background: var(--hc-surface-2); border: 1px solid var(--hc-line); }
.hc .dots i.y { background: var(--hc-ok); border-color: var(--hc-ok); animation: hc-pop 0.2s ease-out; }
.hc .dots i.n { background: var(--hc-bad); border-color: var(--hc-bad); animation: hc-pop 0.2s ease-out; }
.hc .dots.small i { width: 8px; height: 8px; }
.hc .sip-row { display: grid; gap: 0.4rem; }
.hc .sip-row .row b { font-family: var(--hc-f-mono); }
.hc .ns-line { display: grid; grid-template-columns: 5.5rem minmax(0, 1fr) 9rem; gap: 0.75rem; align-items: center; }
.hc .ns-line .rate { font: 600 var(--hc-fs-sm) var(--hc-f-mono); text-align: right; font-variant-numeric: tabular-nums; }
@media (max-width: 560px) {
.hc .ns-line { grid-template-columns: minmax(0, 1fr); }
.hc .ns-line .rate { text-align: left; }
}
.hc .gc-table select { min-width: 11rem; }
.hc .gc-fb { font-size: var(--hc-fs-xs); color: var(--hc-muted); }
.hc .gc-fb.ok { color: var(--hc-ok); }
.hc .gc-fb.bad { color: var(--hc-bad); }
.hc .matrix td.num { font-family: var(--hc-f-mono); }
.hc .matrix td.up { background: var(--hc-ok-soft); color: var(--hc-ok); font-weight: 600; }
.hc .matrix td.down { background: var(--hc-bad-soft); color: var(--hc-bad); font-weight: 600; }
.hc .matrix th.cur, .hc .matrix td.cur { outline: 2px solid var(--hc-accent); outline-offset: -2px; }
.hc .ep-log { font-size: var(--hc-fs-sm); background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.7rem 0.9rem; min-height: 4.5rem; }
</style>
`;export{n as default};
