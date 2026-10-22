const s=`<div class="hc-page">
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
      <span class="eyebrow">Часть 2 · Агент в вашем проекте · Урок 2</span>
      <h1>Агент — это цикл: инструменты, правила, скилы и субагенты</h1>
      <p class="lead">Модель умеет только писать текст. Читать файлы, запускать тесты и не трогать прод её учит среда вокруг. Разберём, из чего эта среда состоит и как её настроить.</p>
      <div class="facts">
        <span class="fact">~50 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">12 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>объяснить цикл агента: кто думает, а кто выполняет;</li>
          <li>написать короткий и полезный файл правил проекта (CLAUDE.md или AGENTS.md);</li>
          <li>отличить мягкое правило от жёсткого запрета и настроить разрешения;</li>
          <li>понять, когда нужен скил, а когда субагент, и как они экономят контекст.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Сильный новичок в команде</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>К вам пришёл очень умный новичок. Он знает все языки, но не знает ваш проект. Чтобы он приносил пользу, ему дают онбординг, доступы, рабочие инструменты, инструкции и помощников.</p>
      </div>
      <div class="stand" id="onb">
        <div class="stand-head"><h3>Что нужно новичку, чтобы работать</h3><span class="badge">анимация</span></div>
        <div class="flow" id="onb-flow">
          <div class="node"><b>Умный новичок</b><small>модель</small></div>
          <span class="arrow">+</span>
          <div class="node"><b>Онбординг-док</b><small>CLAUDE.md, AGENTS.md</small></div>
          <span class="arrow">+</span>
          <div class="node"><b>Доступы</b><small>permissions</small></div>
          <span class="arrow">+</span>
          <div class="node"><b>Инструменты</b><small>tools</small></div>
          <span class="arrow">+</span>
          <div class="node"><b>Инструкции</b><small>skills</small></div>
          <span class="arrow">+</span>
          <div class="node"><b>Помощники</b><small>subagents</small></div>
        </div>
        <p class="task" id="onb-text" aria-live="polite">Нажмите «Дальше», чтобы собрать рабочее место по шагам.</p>
        <div class="row">
          <button class="btn quiet small" type="button" id="onb-prev">← Назад</button>
          <button class="btn small" type="button" id="onb-next">Дальше →</button>
          <button class="btn secondary small" type="button" id="onb-play">▶ Авто</button>
          <button class="btn quiet small" type="button" id="onb-reset">Сначала</button>
          <span class="pill" id="onb-label">Шаг 0 из 6</span>
        </div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Онбординг-документ</b><span>= файл правил проекта: команды, структура, запреты</span></div>
        <div><b>Доступы и пропуск</b><span>= разрешения: что можно без спроса, что нельзя никогда</span></div>
        <div><b>Рабочие инструменты</b><span>= tools: читать файл, запустить тесты, поиск</span></div>
        <div><b>Инструкция «как делаем релиз»</b><span>= skill: подробности, которые читают только когда нужно</span></div>
        <div><b>Помощник-стажёр</b><span>= subagent: делает часть работы и приносит короткий отчёт</span></div>
      </div>
      <p>Всё это вместе — <strong>harness</strong> («упряжь»). Одна и та же модель в хорошем и плохом harness работает как два разных инженера.</p>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Агент — это модель в цикле с инструментами</h3>
        <p>Модель ничего не запускает сама. Она только пишет запрос: «вызови инструмент <code>run_tests</code>». Такой запрос называют <span class="term" data-tip="Блок в ответе модели: имя инструмента и аргументы в JSON. Модель просит, а выполняет программа вокруг неё.">tool_use</span>. Программа вокруг модели (harness) выполняет его, дописывает результат в историю и снова зовёт модель. Цикл идёт, пока модель не скажет «я закончила».</p>
        <div class="code-tabs">
<pre data-lang="js">messages = [задача]
while (true) {
  ответ = model(messages, tools)          // модель думает
  if (ответ.stop_reason === "end_turn") break
  результат = выполнить(ответ.tool_use)   // harness делает
  messages.push(ответ, результат)         // история растёт
}</pre>
<pre data-lang="php">&lt;?php
$messages = [$task];
while (true) {
    $answer = model($messages, $tools);               // модель думает
    if ($answer['stop_reason'] === 'end_turn') break;
    $result = execute($answer['tool_use']);           // harness делает
    array_push($messages, $answer, $result);          // история растёт
}</pre>
<pre data-lang="py">messages = [task]
while True:
    answer = model(messages, tools)            # модель думает
    if answer["stop_reason"] == "end_turn":
        break
    result = execute(answer["tool_use"])       # harness делает
    messages += [answer, result]               # история растёт</pre>
        </div>
        <div class="tip"><b>Главное</b>Модель решает, что сделать. Harness решает, можно ли это делать, и делает. Вся безопасность и качество живут во втором.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Из чего состоит harness</h3>
        <p>Возьмём Claude Code (агент Anthropic для терминала). У Codex, Cursor и других агентов те же части, только файлы называются иначе.</p>
        <ul>
          <li><strong>Системный промпт</strong> — базовые инструкции агента. Его пишет разработчик инструмента, вы его обычно не трогаете.</li>
          <li><strong>Файл правил проекта</strong> — <code>CLAUDE.md</code> или <code>AGENTS.md</code> в корне репозитория. Агент читает его в начале каждой сессии. Там команды сборки и тестов, структура, договорённости, запреты.</li>
          <li><strong>Инструменты</strong> (tools) — чтение и правка файлов, поиск, запуск команд. Каждый описан именем, описанием и схемой аргументов.</li>
          <li><strong>Разрешения</strong> (permissions) — в <code>.claude/settings.json</code>. Список <code>allow</code>: можно без вопросов. Список <code>deny</code>: нельзя никогда. Остальное агент спрашивает у вас.</li>
          <li><strong>Скилы</strong> (skills) — папка <code>.claude/skills/&lt;имя&gt;/</code> с файлом <code>SKILL.md</code>. Это инструкция под типовую задачу: «как выпустить релиз», «как писать миграцию».</li>
          <li><strong>Субагенты</strong> (subagents) — файлы <code>.claude/agents/&lt;имя&gt;.md</code>. Отдельный агент со своим окном контекста и своим набором инструментов.</li>
          <li><strong>Управление контекстом</strong> — сжатие старой истории, кэш, вынос тяжёлой работы в субагентов.</li>
        </ul>
        <div class="note"><b>Мягкое и жёсткое правило</b>Строка в CLAUDE.md «не читай .env» — это просьба к модели. Обычно её выполняют, но гарантии нет. Правило <code>deny</code> в settings.json или хук (урок 4) — это код. Его выполняет harness, и модель не может его обойти. Важное — делайте жёстким.</div>
        <details class="more">
          <summary>Пример CLAUDE.md, settings.json, скила и субагента <span class="hint">— файлы целиком</span></summary>
          <div class="more-body">
            <p><strong>CLAUDE.md</strong> — коротко и по делу. Модель читает его каждый раз, лишние строки стоят токенов и размывают внимание.</p>
<pre data-lang="md"># Проект: сервис заказов (Symfony 7, PHP 8.3, Postgres)

## Команды
- Тесты: \`make test\` (один файл: \`make test F=tests/Unit/PriceTest.php\`)
- Статанализ: \`make phpstan\`
- Не запускай \`composer update\` без просьбы.

## Структура
- src/Domain — бизнес-логика без Symfony
- src/Infrastructure — Doctrine, HTTP-клиенты
- tests/Unit, tests/Functional

## Правила
- Деньги — только через Money, никаких float.
- Миграции не редактируем, только новые.
- После правки кода запускай тесты и phpstan.</pre>
            <p><strong>.claude/settings.json</strong> — жёсткие разрешения. Шаблон <code>:*</code> означает «команда, начинающаяся с этого».</p>
<pre data-lang="json">{
  "permissions": {
    "allow": [
      "Bash(make test:*)",
      "Bash(make phpstan)",
      "Bash(git status)",
      "Bash(git diff:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Bash(git push:*)",
      "Bash(rm -rf:*)"
    ]
  }
}</pre>
            <p><strong>.claude/skills/new-migration/SKILL.md</strong> — в контекст сразу попадают только <code>name</code> и <code>description</code>. Тело агент читает, когда задача подходит под описание.</p>
<pre data-lang="md">---
name: new-migration
description: Как создать миграцию базы данных Doctrine в этом проекте. Используй, когда задача требует новой таблицы, колонки или индекса.
---

1. Сгенерируй файл: \`make migration\`.
2. Проверь SQL в up() и down(): down() обязан откатывать up().
3. Индексы на больших таблицах — только CONCURRENTLY.
4. Прогони: \`make migrate && make test\`.</pre>
            <p><strong>.claude/agents/reviewer.md</strong> — субагент-ревьюер. У него свой контекст и только инструменты чтения.</p>
<pre data-lang="md">---
name: reviewer
description: Проверяет изменения в ветке на ошибки и нарушения правил проекта. Ничего не правит.
tools: Read, Grep, Glob
---

Ты ревьюер. Прочитай diff ветки и правила из CLAUDE.md.
Верни список находок: файл, строка, проблема, почему это важно.
Не больше 10 пунктов. Если проблем нет — так и скажи.</pre>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Контекст — главный бюджет harness</h3>
        <p>Всё, что вы добавляете в harness, конкурирует за одно окно контекста (урок 1). Поэтому хороший harness устроен по принципу <span class="term" data-tip="Progressive disclosure — сначала показываем короткое описание, подробности подгружаем только по необходимости.">прогрессивного раскрытия</span>: в окне лежит минимум, подробности подгружаются по требованию.</p>
        <ul>
          <li><strong>Скил</strong> стоит в контексте ~30–100 токенов (имя и описание), пока не нужен. Если бы все инструкции лежали в CLAUDE.md, каждая сессия платила бы за все сразу.</li>
          <li><strong>Субагент</strong> читает 30 файлов в своём окне, а в основное возвращает отчёт на полстраницы. Основной агент остаётся «свежим».</li>
          <li><strong>Описание</strong> скила или субагента — это то, по чему агент решает, звать ли его. Плохое описание — скил никогда не сработает.</li>
        </ul>
        <p><strong>Типичные ошибки конфигурации:</strong></p>
        <ul>
          <li>CLAUDE.md на 1000 строк: важное тонет, токены горят на каждой сессии.</li>
          <li>Правила противоречат друг другу: «всегда пиши тесты» и «не трогай папку tests».</li>
          <li>Слишком широкие права: <code>Bash(*)</code> в allow — агент может удалить что угодно без вопроса.</li>
          <li>Важные запреты только словами в CLAUDE.md вместо deny-правил и хуков.</li>
          <li>Субагенту дали право писать файлы, хотя ему нужно только читать.</li>
        </ul>
        <details class="more">
          <summary>Цикл tool use в коде <span class="hint">— JS, TS, PHP, Python, сырой HTTP</span></summary>
          <div class="more-body">
            <p>Один инструмент <code>run_tests</code> и цикл. Все результаты инструментов одного шага возвращаем одним сообщением <code>user</code>. Команду запускаем без shell (<code>execFile</code>, массив аргументов): модель не должна уметь дописать <code>; rm -rf</code>.</p>
            <div class="code-tabs">
<pre data-lang="js">import { execFileSync } from "node:child_process";

const tools = [{
  name: "run_tests",
  description: "Запускает PHPUnit и возвращает вывод. Вызывай после каждой правки кода.",
  input_schema: {
    type: "object",
    properties: { path: { type: "string", description: "Файл или папка с тестами, по умолчанию tests" } },
  },
}];

const handlers = {
  run_tests: ({ path = "tests" }) => {
    if (!/^tests[\\w\\/.-]*$/.test(path)) throw new Error("path должен быть внутри tests/");
    try { return execFileSync("vendor/bin/phpunit", [path], { encoding: "utf8" }); }
    catch (e) { return e.stdout + e.stderr; } // упавшие тесты — тоже полезный результат
  },
};

async function callModel(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-opus-5-5", max_tokens: 4096, tools, messages }),
  });
  return res.json();
}

const messages = [{ role: "user", content: "Тест PriceTest падает. Найди причину и почини." }];
for (let step = 0; step < 20; step++) {             // лимит шагов — защита от петли
  const res = await callModel(messages);
  messages.push({ role: "assistant", content: res.content });
  if (res.stop_reason !== "tool_use") {
    console.log(res.content.filter(b => b.type === "text").map(b => b.text).join("\\n"));
    break;
  }
  const results = [];
  for (const block of res.content.filter(b => b.type === "tool_use")) {
    try {
      results.push({ type: "tool_result", tool_use_id: block.id, content: await handlers[block.name](block.input) });
    } catch (e) {
      results.push({ type: "tool_result", tool_use_id: block.id, content: String(e.message), is_error: true });
    }
  }
  messages.push({ role: "user", content: results });  // все результаты шага — одним сообщением
}</pre>
<pre data-lang="ts">import { execFileSync } from "node:child_process";

type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record&lt;string, unknown&gt; };
interface ModelResponse { stop_reason: "end_turn" | "tool_use" | "max_tokens"; content: Block[] }
type Handler = (input: Record&lt;string, unknown&gt;) =&gt; string;

const handlers: Record&lt;string, Handler&gt; = {
  run_tests: (input) =&gt; {
    const path = typeof input.path === "string" ? input.path : "tests";
    if (!path.startsWith("tests")) throw new Error("path должен быть внутри tests/");
    return execFileSync("vendor/bin/phpunit", [path], { encoding: "utf8" });
  },
};

async function runAgent(task: string, call: (m: unknown[]) =&gt; Promise&lt;ModelResponse&gt;): Promise&lt;string&gt; {
  const messages: unknown[] = [{ role: "user", content: task }];
  for (let step = 0; step &lt; 20; step++) {
    const res = await call(messages);
    messages.push({ role: "assistant", content: res.content });
    if (res.stop_reason !== "tool_use") {
      return res.content.flatMap(b =&gt; (b.type === "text" ? [b.text] : [])).join("\\n");
    }
    const results = res.content.flatMap(b =&gt; {
      if (b.type !== "tool_use") return [];
      const handler = handlers[b.name];
      try {
        if (!handler) throw new Error(\`Неизвестный инструмент \${b.name}\`);
        return [{ type: "tool_result", tool_use_id: b.id, content: handler(b.input) }];
      } catch (e) {
        return [{ type: "tool_result", tool_use_id: b.id, content: String(e), is_error: true }];
      }
    });
    messages.push({ role: "user", content: results });
  }
  return "Остановлено: лимит шагов";
}</pre>
<pre data-lang="php">&lt;?php
$tools = [[
    'name' => 'run_tests',
    'description' => 'Запускает PHPUnit и возвращает вывод. Вызывай после каждой правки кода.',
    'input_schema' => [
        'type' => 'object',
        'properties' => ['path' => ['type' => 'string', 'description' => 'Файл или папка с тестами']],
    ],
]];

$handlers = [
    'run_tests' => function (array $input): string {
        $path = $input['path'] ?? 'tests';
        if (!preg_match('~^tests[\\w/.-]*$~', $path)) {
            throw new InvalidArgumentException('path должен быть внутри tests/');
        }
        // escapeshellarg: модель не допишет в команду ничего своего
        return (string) shell_exec('vendor/bin/phpunit ' . escapeshellarg($path) . ' 2>&1');
    },
];

function callModel(array $messages, array $tools): array {
    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['content-type: application/json', 'x-api-key: ' . getenv('ANTHROPIC_API_KEY'), 'anthropic-version: 2023-06-01'],
        CURLOPT_POSTFIELDS => json_encode(['model' => 'claude-opus-5-5', 'max_tokens' => 4096, 'tools' => $tools, 'messages' => $messages]),
    ]);
    return json_decode(curl_exec($ch), true, flags: JSON_THROW_ON_ERROR);
}

$messages = [['role' => 'user', 'content' => 'Тест PriceTest падает. Найди причину и почини.']];
for ($step = 0; $step < 20; $step++) {
    $res = callModel($messages, $tools);
    $messages[] = ['role' => 'assistant', 'content' => $res['content']];
    if ($res['stop_reason'] !== 'tool_use') {
        break;
    }
    $results = [];
    foreach ($res['content'] as $block) {
        if ($block['type'] !== 'tool_use') continue;
        try {
            $out = ($handlers[$block['name']] ?? throw new RuntimeException('Неизвестный инструмент'))($block['input']);
            $results[] = ['type' => 'tool_result', 'tool_use_id' => $block['id'], 'content' => $out];
        } catch (Throwable $e) {
            $results[] = ['type' => 'tool_result', 'tool_use_id' => $block['id'], 'content' => $e->getMessage(), 'is_error' => true];
        }
    }
    $messages[] = ['role' => 'user', 'content' => $results];
}</pre>
<pre data-lang="py">import os
import re
import subprocess
import requests

TOOLS = [{
    "name": "run_tests",
    "description": "Запускает pytest и возвращает вывод. Вызывай после каждой правки кода.",
    "input_schema": {
        "type": "object",
        "properties": {"path": {"type": "string", "description": "Файл или папка с тестами"}},
    },
}]

def run_tests(path: str = "tests") -> str:
    if not re.fullmatch(r"tests[\\w/.-]*", path):
        raise ValueError("path должен быть внутри tests/")
    # список аргументов, без shell=True
    proc = subprocess.run(["pytest", path, "-q"], capture_output=True, text=True)
    return proc.stdout + proc.stderr

HANDLERS = {"run_tests": run_tests}

def call_model(messages):
    res = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={"content-type": "application/json", "x-api-key": os.environ["ANTHROPIC_API_KEY"], "anthropic-version": "2023-06-01"},
        json={"model": "claude-opus-5-5", "max_tokens": 4096, "tools": TOOLS, "messages": messages},
        timeout=120,
    )
    res.raise_for_status()
    return res.json()

messages = [{"role": "user", "content": "Тест test_price падает. Найди причину и почини."}]
for step in range(20):
    res = call_model(messages)
    messages.append({"role": "assistant", "content": res["content"]})
    if res["stop_reason"] != "tool_use":
        break
    results = []
    for block in res["content"]:
        if block["type"] != "tool_use":
            continue
        try:
            out = HANDLERS[block["name"]](**block["input"])
            results.append({"type": "tool_result", "tool_use_id": block["id"], "content": out})
        except Exception as e:
            results.append({"type": "tool_result", "tool_use_id": block["id"], "content": str(e), "is_error": True})
    messages.append({"role": "user", "content": results})</pre>
            </div>
            <p class="footer-note">В рабочих проектах цикл часто берут готовым: в официальных SDK есть помощники, которые крутят его сами. Писать вручную полезно один раз, чтобы понять механику.</p>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Посмотрите на harness изнутри</h2>
        <p>Сценарии учебные, но устроены как в настоящих агентах.</p>
      </div>

      <!-- 3.1 Цикл агента -->
      <div class="stand" id="loop">
        <div class="stand-head"><h3>Цикл агента: «почини падающий тест»</h3><span class="badge">интерактив 1 из 4</span></div>
        <div class="flow" id="loop-flow">
          <div class="node" data-actor="user"><b>Вы</b><small>ставите задачу</small></div>
          <span class="arrow">→</span>
          <div class="node" data-actor="model"><b>Модель</b><small>решает, что делать</small></div>
          <span class="arrow">⇄</span>
          <div class="node" data-actor="harness"><b>Harness</b><small>проверяет права и выполняет</small></div>
          <span class="arrow">⇄</span>
          <div class="node" data-actor="tool"><b>Инструмент</b><small>файлы, тесты, git</small></div>
        </div>
        <p class="task" id="loop-text" aria-live="polite">Нажмите «Дальше». Следите, кто действует на каждом шаге и как растёт история.</p>
        <div class="row">
          <button class="btn quiet small" type="button" id="loop-prev">← Назад</button>
          <button class="btn small" type="button" id="loop-next">Дальше →</button>
          <button class="btn secondary small" type="button" id="loop-play">▶ Авто</button>
          <button class="btn quiet small" type="button" id="loop-reset">Сначала</button>
          <span class="pill" id="loop-label">Шаг 0 из 10</span>
        </div>
        <div class="ctxline">
          <small id="loop-ctx">История: 0 токенов · вызовов модели: 0</small>
          <div class="track"><i id="loop-bar"></i></div>
        </div>
        <ul class="msgs" id="loop-msgs" aria-live="polite"></ul>
      </div>

      <!-- 3.2 Конструктор конфигурации -->
      <div class="stand" id="cfg">
        <div class="stand-head"><h3>Конструктор конфигурации</h3><span class="badge">интерактив 2 из 4</span></div>
        <p class="task">Включайте правила и смотрите, что агент сделает с пятью просьбами. Обратите внимание, где спасает строчка в CLAUDE.md, а где только жёсткий запрет.</p>
        <div class="cfg">
          <fieldset>
            <legend>CLAUDE.md (просьбы)</legend>
            <label><input type="checkbox" id="cfg-md-tests" checked> «Тесты — через <code>make test</code>»</label>
            <label><input type="checkbox" id="cfg-md-env"> «Не читай .env»</label>
            <label><input type="checkbox" id="cfg-md-mig"> «Старые миграции не редактируем»</label>
          </fieldset>
          <fieldset>
            <legend>allow (без вопросов)</legend>
            <label><input type="checkbox" id="cfg-allow-test" checked> <code>Bash(make test:*)</code></label>
            <label><input type="checkbox" id="cfg-allow-all"> <code>Bash(*)</code> — всё подряд</label>
            <legend style="margin-top:0.5rem">deny (никогда)</legend>
            <label><input type="checkbox" id="cfg-deny-rm"> <code>Bash(rm -rf:*)</code></label>
            <label><input type="checkbox" id="cfg-deny-push"> <code>Bash(git push:*)</code></label>
            <label><input type="checkbox" id="cfg-deny-env"> <code>Read(./.env)</code></label>
          </fieldset>
          <fieldset>
            <legend>Режим для остального</legend>
            <label><input type="radio" name="cfg-mode" id="cfg-mode-ask" checked> Спрашивать меня</label>
            <label><input type="radio" name="cfg-mode" id="cfg-mode-auto"> Выполнять без вопросов</label>
            <p class="task">Режим без вопросов удобен, но всё, что не запрещено явно, агент сделает сам.</p>
          </fieldset>
        </div>
        <div class="verdicts" id="cfg-out" aria-live="polite"></div>
        <p class="result-line" id="cfg-score"></p>
      </div>

      <!-- 3.3 Какой скил загрузится -->
      <div class="stand" id="sk">
        <div class="stand-head"><h3>Какой скил загрузится</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">Агент видит только описания скилов. Напишите задачу, и посмотрите, чьё описание совпало. Это упрощённый поиск по словам, настоящая модель понимает смысл, но принцип тот же: плохое описание — скил не найдут.</p>
        <div class="row" role="group" aria-label="Примеры задач">
          <button class="chip-btn" type="button" data-task="Добавь колонку discount в таблицу заказов">Колонка в таблицу</button>
          <button class="chip-btn" type="button" data-task="Подготовь релиз версии 2.4 и обнови changelog">Релиз</button>
          <button class="chip-btn" type="button" data-task="Почини медленный запрос списка заказов">Медленный запрос</button>
          <button class="chip-btn" type="button" data-task="Покрасить кнопку в синий цвет">Кнопка</button>
        </div>
        <div class="field">
          <label for="sk-task">Задача для агента</label>
          <input type="text" id="sk-task" value="Добавь колонку discount в таблицу заказов">
        </div>
        <div class="skills" id="sk-list"></div>
        <div class="budget-rows" id="sk-budget"></div>
      </div>

      <!-- 3.4 Субагент -->
      <div class="stand" id="sub">
        <div class="stand-head"><h3>Бюджет контекста: с субагентом и без</h3><span class="badge">интерактив 4 из 4</span></div>
        <p class="task">Задача: «найди, где в проекте отправляются письма». Нужно прочитать 14 файлов по ~3 000 токенов. Красная линия — порог, после которого модель начинает хуже держать детали.</p>
        <div class="row">
          <label class="row" style="gap:0.4rem; font-weight:500"><input type="checkbox" id="sub-on"> Отдать поиск субагенту</label>
          <button class="btn" type="button" id="sub-run">▶ Запустить</button>
        </div>
        <div class="sub-wrap">
          <div class="win" id="sub-main">
            <h4>Основной агент</h4>
            <div class="fill"><i id="sub-main-fill"></i><div class="limit" style="bottom:66%"><span>порог</span></div></div>
            <small id="sub-main-num">0 токенов</small>
          </div>
          <div class="win off" id="sub-sub">
            <h4>Субагент (своё окно)</h4>
            <div class="fill"><i id="sub-sub-fill"></i><div class="limit" style="bottom:66%"><span>порог</span></div></div>
            <small id="sub-sub-num">не используется</small>
          </div>
        </div>
        <p class="task" id="sub-text" aria-live="polite"></p>
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
        <div class="q" data-q="l2-who">
          <p>Агент «запустил тесты». Кто на самом деле выполнил команду?</p>
          <div class="options">
            <button>Модель на серверах провайдера</button>
            <button data-right>Harness на вашей машине: модель только попросила вызвать инструмент</button>
            <button>Тесты запустились сами, когда модель написала команду в ответе</button>
          </div>
          <p class="why">Модель выдаёт tool_use — запрос с именем инструмента и аргументами. Выполняет его программа вокруг модели. Поэтому именно там проверяют права и пишут логи.</p>
        </div>
        <div class="q" data-q="l2-where">
          <p>Куда записать «тесты запускаем через <code>make test</code>, а не через phpunit напрямую»?</p>
          <div class="options">
            <button data-right>В файл правил проекта: CLAUDE.md или AGENTS.md</button>
            <button>В каждое сообщение агенту</button>
            <button>В deny-список settings.json</button>
          </div>
          <p class="why">Это знание о проекте, оно нужно в каждой сессии. Файл правил читается в начале каждой сессии автоматически.</p>
        </div>
        <div class="q" data-q="l2-env">
          <p>Как надёжно запретить агенту читать <code>.env</code> с секретами?</p>
          <div class="options">
            <button>Написать в CLAUDE.md крупными буквами «НИКОГДА не читай .env»</button>
            <button data-right>Добавить deny-правило в settings.json или хук, который блокирует чтение</button>
            <button>Попросить в чате в начале каждой сессии</button>
          </div>
          <p class="why">Текстовое правило — просьба к модели, её можно нарушить. Deny-правило и хук выполняет harness, модель не может их обойти.</p>
        </div>
        <div class="q" data-q="l2-sub">
          <p>Зачем отдавать поиск по 30 файлам субагенту?</p>
          <div class="options">
            <button>Субагент работает на более умной модели</button>
            <button>Токены субагента бесплатные</button>
            <button data-right>Файлы читаются в отдельном окне контекста, а основному агенту приходит короткий вывод</button>
          </div>
          <p class="why">Токены субагента тоже стоят денег. Выигрыш в другом: основной контекст не забивается сырыми файлами, и модель лучше держит главную задачу.</p>
        </div>
        <div class="q" data-q="l2-tool-use" data-multi>
          <p>Модель вернула ответ tool_use. Что в нём есть?</p>
          <div class="options">
            <button data-right>Имя инструмента, например <code>run_tests</code></button>
            <button data-right>Аргументы вызова, например путь к файлу</button>
            <button>Готовый вывод тестов</button>
          </div>
          <p class="why">tool_use — это просьба, а не результат. Модель пишет, что вызвать и с какими аргументами. Вывод тестов появится, только когда harness выполнит вызов и допишет ответ в историю.</p>
        </div>
        <div class="q" data-q="l2-loop-parts" data-multi>
          <p>Вы пишете свой цикл агента. Что в нём нужно, чтобы он не сломался на ровном месте?</p>
          <div class="options">
            <button data-right>Лимит шагов: если модель зациклилась, harness остановит цикл</button>
            <button data-right>Неизвестный инструмент не роняет программу: модель получает текст ошибки</button>
            <button data-right>Результат каждого инструмента дописывается в историю</button>
            <button>Модель сама запускает команды, чтобы не ждать harness</button>
          </div>
          <p class="why">Модель может просить одно и то же бесконечно — без лимита цикл не кончится. Может позвать инструмент, которого нет, например <code>deploy_to_prod</code>, — тогда ей надо вернуть ошибку текстом, и она выберет другое. Без записи в историю модель не узнает, что произошло. А запускать команды модель не умеет вовсе.</p>
        </div>
        <div class="q" data-q="l2-perm-order" data-multi>
          <p>В settings.json: allow — <code>Bash(git:*)</code>, deny — <code>Bash(git push:*)</code>. Что верно?</p>
          <div class="options">
            <button data-right><code>git log -5</code> выполнится без вопроса</button>
            <button data-right><code>git push origin main</code> будет запрещён</button>
            <button><code>git push</code> пройдёт: allow записан раньше deny</button>
            <button data-right>Для <code>composer update</code> агент спросит вас: правила к нему не подходят</button>
          </div>
          <p class="why">deny сильнее allow, порядок записи не важен. Широкое allow пропускает остальные команды git. Команда, к которой не подошло ни одно правило, не запрещена и не разрешена — агент спрашивает человека.</p>
        </div>
        <div class="q" data-q="l2-exact-rule">
          <p>Правило <code>Bash(npm test)</code> записано без <code>:*</code>. Что будет с командой <code>npm test -- --watch</code>?</p>
          <div class="options">
            <button>Выполнится без вопроса: начало совпадает</button>
            <button data-right>Агент спросит вас: точное правило не пропускает команду с хвостом</button>
            <button>Будет запрещена навсегда</button>
          </div>
          <p class="why">Без <code>:*</code> правило требует точного совпадения. Чтобы разрешить команду с любыми аргументами, пишут <code>Bash(npm test:*)</code>. Запрета тоже нет — он бывает только в deny.</p>
        </div>
        <div class="q" data-q="l2-skill-cost">
          <p>Почему скил почти ничего не стоит, пока он не нужен?</p>
          <div class="options">
            <button data-right>В контексте лежат только его имя и описание, а тело агент читает, когда задача подходит</button>
            <button>Скилы хранятся у провайдера и не считаются в токенах</button>
            <button>Скил выполняется без модели, как обычный скрипт</button>
          </div>
          <p class="why">Это прогрессивное раскрытие: 30–100 токенов на описание вместо всей инструкции в каждой сессии. Когда скил загрузился, его текст тоже стоит токенов, как и всё в окне.</p>
        </div>
        <div class="q" data-q="l2-skill-desc" data-multi>
          <p>Агент не находит ваш скил «новая миграция». Что стоит проверить?</p>
          <div class="options">
            <button data-right>В описании нет слов, которыми вы ставите задачу: «миграция», «таблица», «колонка»</button>
            <button data-right>Описание слишком общее, например «полезные советы по проекту»</button>
            <button>Скил короткий: агент берёт только инструкции длиннее 200 строк</button>
            <button data-right>Скил лежит не в <code>.claude/skills/&lt;имя&gt;/SKILL.md</code></button>
          </div>
          <p class="why">Агент выбирает скил по описанию, сравнивая его с задачей. Нет нужных слов или описание обо всём сразу — скил не сработает. Не там лежит — агент о нём не знает. Длина тела на выбор не влияет: короткий точный скил лучше длинного.</p>
        </div>
        <div class="q" data-q="l2-bad-config" data-multi>
          <p>Что из этого — ошибки в настройке агента?</p>
          <div class="options">
            <button data-right>CLAUDE.md на 1000 строк</button>
            <button data-right><code>Bash(*)</code> в списке allow</button>
            <button data-right>Субагенту-ревьюеру дали право писать файлы</button>
            <button>Команды сборки и тестов записаны в AGENTS.md</button>
          </div>
          <p class="why">Длинный файл правил прячет важное и стоит токенов в каждой сессии. <code>Bash(*)</code> разрешает любую команду без вопроса, даже удаление. Ревьюеру нужно только читать. А команды сборки и тестов — как раз то, что должно лежать в файле правил.</p>
        </div>
        <div class="q" data-q="l2-reviewer-tools">
          <p>Какие инструменты дать субагенту-ревьюеру?</p>
          <div class="options">
            <button>Все, что есть у основного агента, — так надёжнее</button>
            <button data-right>Только чтение и поиск: он смотрит код, а не меняет его</button>
            <button>Только запуск команд в терминале</button>
          </div>
          <p class="why">Минимум прав — меньше риск. Ревьюер, который может писать, однажды «поправит» код сам, и это никто не проверит. Если ему нужны тесты, дайте одну точную команду, а не весь терминал.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 30 минут</span></summary>
        <div class="more-body">
          <ol>
            <li>Создайте в рабочем репозитории CLAUDE.md или AGENTS.md на 20–40 строк: команды сборки и тестов, структура папок, 3–5 правил. Без воды.</li>
            <li>Добавьте в <code>.claude/settings.json</code> deny-правила для <code>.env</code>, <code>git push</code> и <code>rm -rf</code>. Попросите агента прочитать .env и убедитесь, что его остановили.</li>
            <li>Найдите задачу, которую вы делаете чаще раза в неделю (новая миграция, новый эндпоинт). Опишите её как скил. Проверьте, что агент находит скил по своей формулировке задачи.</li>
            <li>Опишите субагента-ревьюера только с инструментами чтения. Попросите его проверить вашу последнюю ветку.</li>
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
        <li>Могу нарисовать цикл агента: модель просит, harness выполняет, результат возвращается в историю.</li>
        <li>Знаю, что лежит в CLAUDE.md или AGENTS.md и почему он должен быть коротким.</li>
        <li>Отличаю мягкое правило (текст для модели) от жёсткого (deny, хук).</li>
        <li>Понимаю, как работают allow, deny и «спросить человека».</li>
        <li>Понимаю прогрессивное раскрытие: у скила в контексте только описание.</li>
        <li>Знаю, когда звать субагента и какие права ему давать.</li>
        <li>Ответил на вопросы урока: цикл агента, разрешения, скилы и субагенты.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Теперь у агента есть рабочее место. Дальше дадим ему память о проекте: что знать заранее и как это хранить.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://code.claude.com/docs/ru/features-overview" target="_blank" rel="noopener">Расширение Claude Code</a><span>официальный обзор: CLAUDE.md, skills, subagents, hooks, MCP — что когда грузится в контекст и сколько стоит. <span class="pill ok">рус., офиц.</span></span></li><li><a href="https://platform.claude.com/docs/ru/agents-and-tools/tool-use/overview" target="_blank" rel="noopener">Использование инструментов с Claude</a><span>как устроен tool use (вызов функций): описание инструмента, JSON-схема, цикл «запрос → вызов → результат». <span class="pill ok">рус., офиц.</span></span></li><li><a href="https://habr.com/ru/articles/1070296/" target="_blank" rel="noopener">Что такое Harness и с какими моделями его едят?</a><span>что такое обвязка (harness) вокруг модели и почему она важна не меньше самой модели. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/972308/" target="_blank" rel="noopener">Как написать хороший CLAUDE.md, чтобы не было мучительно больно</a><span>почему агент игнорирует правила и как писать короткий рабочий CLAUDE.md. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/946748/" target="_blank" rel="noopener">Claude Code: субагенты</a><span>вводный разбор субагентов: зачем отдельный контекст и как их настраивать. <span class="pill ok">рус.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://www.jsonschemavalidator.net/" target="_blank" rel="noopener">JSON Schema Validator</a><span>описать параметры инструмента JSON-схемой и проверить, пройдут ли аргументы, которые «придумала» модель.</span></li><li><a href="https://tiktokenizer.vercel.app/" target="_blank" rel="noopener">Tiktokenizer</a><span>вставить свой CLAUDE.md и посмотреть, сколько токенов он съедает в каждой сессии.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .msgs { list-style: none; padding: 0; display: grid; gap: 0.4rem; max-height: 22rem; overflow: auto; }
.hc .msgs li { margin: 0; display: grid; grid-template-columns: 7.5rem minmax(0, 1fr); gap: 0.6rem; align-items: start; background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.45rem 0.6rem; font-size: var(--hc-fs-sm); animation: hc-pop 0.25s ease-out; }
.hc .msgs .who { font: 600 var(--hc-fs-xs) var(--hc-f-mono); text-transform: uppercase; letter-spacing: 0.04em; padding-top: 0.1rem; }
.hc .msgs .who.user { color: var(--hc-accent); }
.hc .msgs .who.assistant { color: var(--hc-warm); }
.hc .msgs .who.tool { color: var(--hc-ok); }
.hc .msgs code { font-size: 0.8rem; }
.hc .msgs .body { min-width: 0; overflow-wrap: anywhere; }
.hc .ctxline { display: grid; gap: 0.3rem; }
.hc .ctxline .track { height: 0.9rem; background: var(--hc-surface-2); border-radius: 99px; overflow: hidden; }
.hc .ctxline .track i { display: block; height: 100%; width: 0; background: var(--hc-accent); transition: width 0.4s; }
.hc .ctxline .track i.hot { background: var(--hc-warm); }
.hc .ctxline small { color: var(--hc-muted); font: 500 var(--hc-fs-xs) var(--hc-f-mono); font-variant-numeric: tabular-nums; }
.hc .cfg { display: grid; gap: 0.9rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 860px) {
.hc .cfg { grid-template-columns: minmax(0, 1fr); }
}
.hc .cfg fieldset { border: 1px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; margin: 0; display: grid; gap: 0.35rem; min-width: 0; }
.hc .cfg legend { font: 600 var(--hc-fs-xs) var(--hc-f-mono); text-transform: uppercase; letter-spacing: 0.05em; color: var(--hc-muted); padding: 0 0.3rem; }
.hc .cfg label { font-weight: 400; display: flex; gap: 0.5rem; align-items: flex-start; }
.hc .cfg label input { margin-top: 0.2rem; flex: none; }
.hc .cfg code { font-size: 0.78rem; }
.hc .verdicts { display: grid; gap: 0.4rem; }
.hc .verdict-row { display: grid; grid-template-columns: minmax(0, 15rem) 9.5rem minmax(0, 1fr); gap: 0.6rem; align-items: start; font-size: var(--hc-fs-sm); padding: 0.45rem 0.6rem; border-radius: var(--hc-r-sm); background: var(--hc-bg); }
@media (max-width: 700px) {
.hc .verdict-row { grid-template-columns: minmax(0, 1fr); }
}
.hc .verdict-row code { overflow-wrap: anywhere; }
.hc .skills { display: grid; gap: 0.4rem; }
.hc .skill { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.5rem; padding: 0.5rem 0.7rem; border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); background: var(--hc-bg); font-size: var(--hc-fs-sm); transition: border-color 0.25s, background 0.25s; }
.hc .skill b { font-family: var(--hc-f-mono); font-size: 0.82rem; }
.hc .skill p { color: var(--hc-muted); }
.hc .skill.hit { border-color: var(--hc-ok); background: var(--hc-ok-soft); }
.hc .skill mark { background: color-mix(in srgb, var(--hc-warm) 30%, transparent); color: inherit; border-radius: 2px; }
.hc .budget-rows { display: grid; gap: 0.5rem; }
.hc .budget-row { display: grid; grid-template-columns: 11rem minmax(0, 1fr) 6rem; gap: 0.6rem; align-items: center; font-size: var(--hc-fs-sm); }
@media (max-width: 600px) {
.hc .budget-row { grid-template-columns: minmax(0, 1fr) 5rem; }
.hc .budget-row .track { grid-column: 1 / -1; }
}
.hc .budget-row .track { height: 1rem; background: var(--hc-surface-2); border-radius: 4px; overflow: hidden; }
.hc .budget-row .track i { display: block; height: 100%; background: var(--hc-accent); transition: width 0.6s; }
.hc .budget-row .track i.warm { background: var(--hc-warm); }
.hc .budget-row .num { text-align: right; font: 500 var(--hc-fs-xs) var(--hc-f-mono); font-variant-numeric: tabular-nums; }
.hc .sub-wrap { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
@media (max-width: 700px) {
.hc .sub-wrap { grid-template-columns: minmax(0, 1fr); }
}
.hc .win { border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.7rem; display: grid; gap: 0.5rem; background: var(--hc-bg); }
.hc .win.off { opacity: 0.45; }
.hc .win h4 { font-size: var(--hc-fs-sm); }
.hc .win .fill { height: 8rem; border-radius: 6px; background: var(--hc-surface-2); position: relative; overflow: hidden; }
.hc .win .fill i { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: var(--hc-accent); transition: height 0.25s; }
.hc .win .fill i.over { background: var(--hc-bad); }
.hc .win .fill .limit { position: absolute; left: 0; right: 0; border-top: 2px dashed var(--hc-bad); }
.hc .win .fill .limit span { position: absolute; right: 4px; top: -1.2rem; font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-bad); }
.hc .win small { font: 500 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); }
</style>
`;export{s as default};
