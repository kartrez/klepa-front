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
      <span class="eyebrow">Часть 3 · Работа по плану · Урок 6</span>
      <h1>Генератор или агент: что выгоднее генерировать по правилам</h1>
      <p class="lead">Часть кода пишется по правилам: DTO, миграции, клиенты API, типы. Агент сделает это каждый раз немного по-разному и за токены. Генератор сделает одинаково, бесплатно и мгновенно. Разберём, где граница.</p>
      <div class="facts">
        <span class="fact">~45 минут</span>
        <span class="fact">3 интерактива</span>
        <span class="fact">11 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>объяснить, что такое детерминированный генератор и почему это важно;</li>
          <li>объяснить формулу «спецификация плюс шаблон равно код» и собрать по ней простой генератор;</li>
          <li>решать, что отдать генератору, что агенту, а что делать вместе;</li>
          <li>защитить сгенерированный код от ручных правок и проверить генерацию в CI.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Формочка для печенья и лепка руками</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Сто одинаковых печений проще выдавить формочкой, чем лепить руками. Руками лепят торт на заказ: он один, и он особенный.</p>
      </div>
      <div class="cookies" aria-live="polite">
        <div class="tray"><h4>Формочка (генератор)</h4><div class="row" id="tray-mold"></div></div>
        <div class="tray"><h4>Руками (агент)</h4><div class="row" id="tray-hand"></div></div>
      </div>
      <div class="row"><button class="btn small" type="button" id="bake">Испечь ещё партию</button><span class="task" id="bake-note">Партия 1: слева все одинаковые, справа каждая своя.</span></div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Формочка</b><span>= шаблон генератора</span></div>
        <div><b>Тесто</b><span>= спецификация: JSON, OpenAPI, схема</span></div>
        <div><b>Печенье</b><span>= сгенерированный код</span></div>
        <div><b>Кондитер с тортом на заказ</b><span>= агент на нестандартной логике</span></div>
        <div><b>«Все печенья одинаковые?»</b><span>= проверка в CI: генерация не даёт диффа</span></div>
      </div>
      <p>Главная мысль: <strong>то, что делается по правилам, делайте правилами</strong>. Агента оставьте там, где нужны понимание и решения.</p>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Шаблон плюс данные равно код</h3>
        <p><strong>Детерминированный</strong> (<span class="term" data-tip="Детерминированность: одинаковый вход всегда даёт одинаковый выход, без случайности.">предсказуемый</span>) значит: тот же вход даёт тот же выход, байт в байт. Модель из урока 1 так не умеет: выбор токенов случайный. Обычная функция умеет.</p>
        <p>Генератор кода — это функция. На вход — описание (спецификация). Внутри — шаблон. На выход — текст программы.</p>
        <div class="code-tabs">
<pre data-lang="js">const entity = { name: "Order", fields: [{ name: "id", type: "number" }, { name: "email", type: "string" }] };

const ts = \`export interface \${entity.name} {
\${entity.fields.map(f => \`  \${f.name}: \${f.type};\`).join("\\n")}
}\`;
// export interface Order {
//   id: number;
//   email: string;
// }</pre>
<pre data-lang="php">&lt;?php
$entity = ['name' => 'Order', 'fields' => [['name' => 'id', 'type' => 'number'], ['name' => 'email', 'type' => 'string']]];

$lines = array_map(fn ($f) => "  {$f['name']}: {$f['type']};", $entity['fields']);
$ts = "export interface {$entity['name']} {\\n" . implode("\\n", $lines) . "\\n}";
// export interface Order {
//   id: number;
//   email: string;
// }</pre>
<pre data-lang="py">entity = {"name": "Order", "fields": [{"name": "id", "type": "number"}, {"name": "email", "type": "string"}]}

lines = "\\n".join(f"  {f['name']}: {f['type']};" for f in entity["fields"])
ts = f"export interface {entity['name']} {{\\n{lines}\\n}}"
# export interface Order {
#   id: number;
#   email: string;
# }</pre>
        </div>
        <div class="tip"><b>Что важно</b>Запустите эту функцию сто раз — получите сто одинаковых файлов. Попросите агента сто раз — получите сто немного разных.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Где живут генераторы и где граница с агентом</h3>
        <p>Вы почти наверняка уже пользовались генераторами:</p>
        <ul>
          <li><strong>OpenAPI</strong> (<span class="term" data-tip="OpenAPI — стандартный формат описания HTTP API в YAML или JSON: пути, параметры, схемы ответов.">описание API</span>) превращается в клиентов, DTO и заготовки контроллеров;</li>
          <li><strong>JSON Schema</strong> превращается в типы TypeScript, Python, PHP;</li>
          <li><strong>описание сущности</strong> превращается в Entity, миграцию, репозиторий (в Symfony это <code>make:entity</code> и <code>doctrine:migrations:diff</code>);</li>
          <li><strong>protobuf</strong> превращается в клиентов и серверы gRPC.</li>
        </ul>
        <p><strong>Генератору отдавайте:</strong> CRUD, DTO, контракты API, маппинги, типы, миграции. Всё, что повторяется и следует правилу.</p>
        <p><strong>Агенту оставляйте:</strong> нестандартную бизнес-логику, рефакторинг, разбор багов, склейку систем. Всё, где нужно понять смысл.</p>
        <p><strong>Гибрид работает лучше всего.</strong> Агент пишет или правит спецификацию (это короткий понятный файл). Генератор делает из неё код. Агент дописывает бизнес-логику в оставленные для неё места.</p>
        <details class="more">
          <summary>Мини-генератор SQL на четырёх языках <span class="hint">— шаблонные строки</span></summary>
          <div class="more-body">
            <p>Один и тот же генератор: JSON с описанием сущности на входе, <code>CREATE TABLE</code> на выходе.</p>
            <div class="code-tabs">
<pre data-lang="js">import { readFileSync, writeFileSync } from "node:fs";

const SQL = { int: "INTEGER", string: "VARCHAR", text: "TEXT", bool: "BOOLEAN", decimal: "NUMERIC(12, 2)", datetime: "TIMESTAMP" };
const snake = s => s.replace(/[A-Z]/g, c => "_" + c.toLowerCase());

function column(f) {
  let type = SQL[f.type];
  if (f.type === "string") type += \`(\${f.length ?? 255})\`;
  const parts = [snake(f.name), type];
  if (f.primary) parts.push("PRIMARY KEY");
  else if (!f.nullable) parts.push("NOT NULL");
  if (f.unique) parts.push("UNIQUE");
  return "  " + parts.join(" ");
}

const e = JSON.parse(readFileSync("entities/order.json", "utf8"));
const sql = \`-- GENERATED from entities/order.json. Do not edit.\\nCREATE TABLE \${e.table} (\\n\${e.fields.map(column).join(",\\n")}\\n);\\n\`;
writeFileSync(\`migrations/\${e.table}.sql\`, sql);</pre>
<pre data-lang="ts">import { readFileSync, writeFileSync } from "node:fs";

type FieldType = "int" | "string" | "text" | "bool" | "decimal" | "datetime";
interface Field { name: string; type: FieldType; length?: number; nullable?: boolean; unique?: boolean; primary?: boolean }
interface Entity { name: string; table: string; fields: Field[] }

const SQL: Record&lt;FieldType, string&gt; = { int: "INTEGER", string: "VARCHAR", text: "TEXT", bool: "BOOLEAN", decimal: "NUMERIC(12, 2)", datetime: "TIMESTAMP" };
const snake = (s: string): string => s.replace(/[A-Z]/g, c => "_" + c.toLowerCase());

function column(f: Field): string {
  const type = f.type === "string" ? \`VARCHAR(\${f.length ?? 255})\` : SQL[f.type];
  const parts = [snake(f.name), type];
  if (f.primary) parts.push("PRIMARY KEY");
  else if (!f.nullable) parts.push("NOT NULL");
  if (f.unique) parts.push("UNIQUE");
  return "  " + parts.join(" ");
}

const e: Entity = JSON.parse(readFileSync("entities/order.json", "utf8"));
writeFileSync(\`migrations/\${e.table}.sql\`, \`CREATE TABLE \${e.table} (\\n\${e.fields.map(column).join(",\\n")}\\n);\\n\`);</pre>
<pre data-lang="php">&lt;?php
// bin/generate-sql.php entities/order.json
$sqlTypes = ['int' => 'INTEGER', 'text' => 'TEXT', 'bool' => 'BOOLEAN', 'decimal' => 'NUMERIC(12, 2)', 'datetime' => 'TIMESTAMP'];
$snake = fn (string $s): string => strtolower(preg_replace('/[A-Z]/', '_$0', $s));

$e = json_decode(file_get_contents($argv[1]), true, flags: JSON_THROW_ON_ERROR);
$columns = [];
foreach ($e['fields'] as $f) {
    $type = $f['type'] === 'string' ? sprintf('VARCHAR(%d)', $f['length'] ?? 255) : $sqlTypes[$f['type']];
    $parts = [$snake($f['name']), $type];
    if ($f['primary'] ?? false) {
        $parts[] = 'PRIMARY KEY';
    } elseif (!($f['nullable'] ?? false)) {
        $parts[] = 'NOT NULL';
    }
    if ($f['unique'] ?? false) {
        $parts[] = 'UNIQUE';
    }
    $columns[] = '  ' . implode(' ', $parts);
}
file_put_contents("migrations/{$e['table']}.sql", "CREATE TABLE {$e['table']} (\\n" . implode(",\\n", $columns) . "\\n);\\n");</pre>
<pre data-lang="py">import json
import re
import sys
from pathlib import Path

SQL = {"int": "INTEGER", "text": "TEXT", "bool": "BOOLEAN", "decimal": "NUMERIC(12, 2)", "datetime": "TIMESTAMP"}

def snake(s: str) -> str:
    return re.sub(r"[A-Z]", lambda m: "_" + m.group().lower(), s)

def column(f: dict) -> str:
    t = f"VARCHAR({f.get('length', 255)})" if f["type"] == "string" else SQL[f["type"]]
    parts = [snake(f["name"]), t]
    if f.get("primary"):
        parts.append("PRIMARY KEY")
    elif not f.get("nullable"):
        parts.append("NOT NULL")
    if f.get("unique"):
        parts.append("UNIQUE")
    return "  " + " ".join(parts)

e = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
body = ",\\n".join(column(f) for f in e["fields"])
Path(f"migrations/{e['table']}.sql").write_text(f"CREATE TABLE {e['table']} (\\n{body}\\n);\\n", encoding="utf-8")</pre>
            </div>
          </div>
        </details>
        <details class="more">
          <summary>Готовый генератор по OpenAPI <span class="hint">— пример команды</span></summary>
          <div class="more-body">
            <p>Писать свой генератор нужно не всегда. Для OpenAPI есть готовый openapi-generator с шаблонами под десятки языков. Ниже пример: фрагмент спецификации и команда генерации клиента.</p>
<pre data-lang="yaml">openapi: 3.0.3
info: { title: Shopik API, version: 1.0.0 }
paths:
  /orders/{id}:
    get:
      operationId: getOrder
      parameters:
        - { name: id, in: path, required: true, schema: { type: integer } }
      responses:
        "200":
          description: Заказ
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Order" }
components:
  schemas:
    Order:
      type: object
      required: [id, email, totalKopecks]
      properties:
        id: { type: integer }
        email: { type: string, format: email }
        totalKopecks: { type: integer }
        comment: { type: string, nullable: true }</pre>
<pre data-lang="sh"># пример: TypeScript-клиент для фронтенда
npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o src/api

# пример: PHP-клиент для другого сервиса
npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g php -o generated/shopik-client</pre>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Защита сгенерированного кода и экономика</h3>
        <p><strong>Сгенерированный код не правят руками.</strong> Следующая генерация перезапишет правку, и она тихо пропадёт. Правят спецификацию или шаблон. Как это закрепить:</p>
        <ul>
          <li>в начале файла метка <code>GENERATED</code> и откуда он получен;</li>
          <li>сгенерированные файлы лежат в отдельной папке (например, <code>generated/</code>);</li>
          <li>в правилах агента: «файлы с меткой GENERATED не правь, правь спецификацию и запусти генератор»;</li>
          <li><span class="term" data-tip="Хук — скрипт, который harness запускает до или после действия агента. Может запретить действие.">хук</span> (урок 4) запрещает агенту запись в такие файлы;</li>
          <li>CI запускает генерацию и проверяет, что дифф пустой: <code>make generate &amp;&amp; git diff --exit-code</code>.</li>
        </ul>
        <p><strong>Где детерминированность ломается.</strong> Дата генерации в шапке файла, случайные id, порядок ключей словаря, разные версии генератора у разных разработчиков. Каждое из этого даёт дифф без изменений спецификации, и CI-проверка становится бесполезной. Версию генератора фиксируйте, дату не пишите, поля сортируйте стабильно.</p>
        <div class="note"><b>Экономика</b>40 DTO по спецификации партнёра. Агент: десятки тысяч токенов, полчаса ревью, и при обновлении спецификации всё заново, с новыми мелкими отличиями. Генератор: день на настройку один раз, потом секунды и ноль ревью шаблонного кода. Чем чаще повторяется задача, тем выгоднее генератор.</div>
        <details class="more">
          <summary>Проверка генерации в CI <span class="hint">— Makefile и GitHub Actions</span></summary>
          <div class="more-body">
<pre data-lang="sh"># Makefile
generate:
	node bin/generate-sql.mjs entities/*.json
	npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o src/api

check-generated: generate
	git diff --exit-code -- migrations/ src/api/ || (echo "Сгенерированный код устарел: запустите make generate" &amp;&amp; exit 1)</pre>
<pre data-lang="yaml"># .github/workflows/ci.yml (фрагмент)
- name: Сгенерированный код совпадает со спецификацией
  run: make check-generated</pre>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Генератор в деле</h2>
      </div>

      <!-- 3.1 Живой генератор -->
      <div class="stand" id="gen">
        <div class="stand-head"><h3>Живой генератор: одна спецификация, четыре языка</h3><span class="badge">интерактив 1 из 3</span></div>
        <p class="task">Меняйте JSON слева. Код справа пересобирается сразу. Типы: <code>int</code>, <code>string</code>, <code>text</code>, <code>bool</code>, <code>decimal</code>, <code>datetime</code>. Флаги: <code>primary</code>, <code>nullable</code>, <code>unique</code>, <code>length</code>. Попробуйте добавить поле, сломать JSON или указать неизвестный тип.</p>
        <div class="gen-io">
          <div class="field">
            <label for="gen-spec">entities/order.json</label>
            <textarea class="code" id="gen-spec" spellcheck="false"></textarea>
            <div class="row"><button class="btn small quiet" type="button" id="gen-sample">Вернуть пример</button><button class="btn small quiet" type="button" id="gen-add">+ поле deliveryDate</button></div>
          </div>
          <div class="gen-out">
            <div class="row" role="group" aria-label="Язык результата" id="gen-langs"></div>
            <ul class="gen-errs" id="gen-errs" aria-live="polite"></ul>
            <pre id="gen-out"></pre>
          </div>
        </div>
      </div>

      <!-- 3.2 Генератор или агент -->
      <div class="stand" id="who">
        <div class="stand-head"><h3>Генератор, агент или вместе?</h3><span class="badge">интерактив 2 из 3</span></div>
        <p class="task">Для каждой задачи выберите исполнителя. После выбора появится объяснение.</p>
        <div class="cards" id="who-cards"></div>
        <p class="result-line" id="who-score" aria-live="polite"></p>
        <details class="more">
          <summary>Калькулятор: оцените свою задачу <span class="hint">— четыре ползунка</span></summary>
          <div class="more-body">
            <div class="sliders">
              <div class="field"><label for="calc-repeat">Сколько раз задача повторится: <span class="mono" id="calc-repeat-v">10</span></label><input type="range" id="calc-repeat" min="1" max="50" value="10"></div>
              <div class="field"><label for="calc-var">Насколько разная логика в каждом случае: <span class="mono" id="calc-var-v">2</span> из 10</label><input type="range" id="calc-var" min="0" max="10" value="2"></div>
              <div class="field"><label for="calc-cost">Цена ошибки: <span class="mono" id="calc-cost-v">6</span> из 10</label><input type="range" id="calc-cost" min="0" max="10" value="6"></div>
              <div class="field"><label for="calc-vol">Объём кода за раз: <span class="mono" id="calc-vol-v">200</span> строк</label><input type="range" id="calc-vol" min="10" max="2000" step="10" value="200"></div>
            </div>
            <div class="verdict" id="calc-verdict" aria-live="polite"></div>
          </div>
        </details>
      </div>

      <!-- 3.3 Два прогона -->
      <div class="stand" id="twice">
        <div class="stand-head"><h3>Два прогона: агент и генератор</h3><span class="badge">интерактив 3 из 3</span></div>
        <p class="task">Одна и та же спецификация, два запуска подряд. Смотрим, совпадёт ли результат байт в байт.</p>
        <div class="runs2">
          <div class="run-pane"><h4 id="twice-h1">Прогон 1</h4><div class="code-lines" id="twice-a"></div></div>
          <div class="run-pane"><h4 id="twice-h2">Прогон 2</h4><div class="code-lines" id="twice-b"></div></div>
        </div>
        <p class="task" id="twice-say" aria-live="polite"></p>
        <div class="row">
          <button class="btn quiet" type="button" id="twice-prev">← Назад</button>
          <button class="btn" type="button" id="twice-next">Дальше →</button>
          <button class="btn secondary" type="button" id="twice-play">▶ Авто</button>
          <button class="btn quiet" type="button" id="twice-reset">Сначала</button>
          <span class="task" id="twice-label">Шаг 0</span>
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
        <div class="q" data-q="l7-det">
          <p>Что значит «детерминированный генератор»?</p>
          <div class="options">
            <button>Генератор, который написал опытный разработчик</button>
            <button data-right>Одинаковая спецификация на входе всегда даёт одинаковый код на выходе, байт в байт</button>
            <button>Генератор, который проверяет код тестами</button>
          </div>
          <p class="why">Поэтому результат можно проверять в CI сравнением: если дифф не пустой, значит спецификация и код разошлись.</p>
        </div>
        <div class="q" data-q="l7-who">
          <p>Какую задачу выгоднее отдать генератору, а не агенту?</p>
          <div class="options">
            <button>Разобраться, почему тест падает раз в неделю</button>
            <button data-right>Сделать 40 DTO по OpenAPI-спецификации партнёра и обновлять их при каждой её смене</button>
            <button>Переписать запутанный расчёт скидок</button>
          </div>
          <p class="why">Повторяемо, по правилу, обновляется регулярно. Остальные две задачи требуют понимания: это работа агента.</p>
        </div>
        <div class="q" data-q="l7-edit">
          <p>Агент поправил руками файл с меткой GENERATED. Что произойдёт?</p>
          <div class="options">
            <button data-right>Следующая генерация затрёт правку, а CI-проверка покажет дифф. Править надо спецификацию или шаблон</button>
            <button>Генератор сам перенесёт правку в шаблон</button>
            <button>Ничего, ручные правки в сгенерированном коде — норма</button>
          </div>
          <p class="why">Поэтому в правилах агента пишут «не правь GENERATED», а хук может запретить такую запись.</p>
        </div>
        <div class="q" data-q="l7-date">
          <p>Почему не стоит писать дату генерации в шапку файла?</p>
          <div class="options">
            <button>Дата занимает лишние байты</button>
            <button>Генератор не умеет работать с датами</button>
            <button data-right>Каждый запуск даёт новый текст: дифф без изменений спецификации, и проверка «генерация без диффа» ломается</button>
          </div>
          <p class="why">Это ловит проверка детерминированности: прогнать генератор несколько раз и сравнить результаты. То же со случайными id и нестабильным порядком полей.</p>
        </div>
        <div class="q" data-q="l6-gen-fit" data-multi>
          <p>Что выгодно отдать генератору?</p>
          <div class="options">
            <button data-right>Типы TypeScript по JSON Schema</button>
            <button data-right>Клиент API по OpenAPI-описанию</button>
            <button>Разбор бага, который воспроизводится раз в неделю</button>
            <button data-right>Миграцию по описанию сущности</button>
          </div>
          <p class="why">Генератору — всё, что повторяется и следует правилу: типы, клиенты, миграции, DTO. Разбор редкого бага требует понимания и гипотез — это работа агента.</p>
        </div>
        <div class="q" data-q="l6-gen-nondet" data-multi>
          <p>Что ломает детерминированность генератора?</p>
          <div class="options">
            <button data-right>Дата генерации в шапке файла</button>
            <button data-right>Случайные id в коде</button>
            <button data-right>Разные версии генератора у разных разработчиков</button>
            <button>Метка GENERATED в начале файла</button>
          </div>
          <p class="why">Каждое из первых трёх даёт дифф без изменений спецификации, и проверка в CI становится бесполезной. Метка GENERATED одинакова в каждом прогоне: она не мешает, а защищает файл от ручных правок.</p>
        </div>
        <div class="q" data-q="l6-gen-guard" data-multi>
          <p>Как защитить сгенерированный код от ручных правок агента?</p>
          <div class="options">
            <button data-right>Метка GENERATED и правило агента «такие файлы не правь, правь спецификацию»</button>
            <button data-right>Хук, который запрещает агенту запись в папку <code>generated/</code></button>
            <button data-right>Шаг CI: генерация и <code>git diff --exit-code</code></button>
            <button>Попросить агента в чате быть аккуратнее</button>
          </div>
          <p class="why">Метка и правило объясняют агенту, хук не даёт записать, CI ловит то, что всё же проскочило. Просьба в чате пропадёт вместе с сессией и ничего не гарантирует.</p>
        </div>
        <div class="q" data-q="l6-gen-types" data-multi>
          <p>Генератор переводит типы спецификации в TypeScript. Какие правила разумны?</p>
          <div class="options">
            <button data-right><code>decimal</code> → <code>string</code>: деньги не хранят во float</button>
            <button data-right>Поле с флагом nullable получает <code>| null</code></button>
            <button><code>int</code> → <code>string</code>, чтобы не терять точность</button>
            <button><code>datetime</code> → дата в часовом поясе машины, на которой запущен генератор</button>
          </div>
          <p class="why">Деньги во float теряют копейки, поэтому decimal передают строкой. Nullable должен быть виден в типе. Целые числа в JS точны до 2⁵³ — строка тут не нужна. Часовой пояс машины делает вывод разным у разных людей: это ломает детерминированность.</p>
        </div>
        <div class="q" data-q="l6-gen-sql" data-multi>
          <p>Генератор делает CREATE TABLE по сущности Order. Что верно?</p>
          <div class="options">
            <button data-right>Имя колонки в snake_case: <code>totalKopecks</code> → <code>total_kopecks</code></button>
            <button data-right>Поле с флагом primary получает <code>PRIMARY KEY</code></button>
            <button>Колонки лучше выводить в случайном порядке, чтобы не было конфликтов</button>
          </div>
          <p class="why">Правила простые и всегда одинаковые — поэтому их и отдают генератору. Случайный порядок дал бы новый дифф на каждом прогоне.</p>
        </div>
        <div class="q" data-q="l6-gen-hybrid">
          <p>Как лучше всего работать в паре генератор и агент?</p>
          <div class="options">
            <button>Агент пишет весь код, генератор не нужен</button>
            <button data-right>Агент правит короткую спецификацию, генератор делает код, агент дописывает бизнес-логику в оставленные места</button>
            <button>Генератор пишет бизнес-логику, агент — DTO</button>
          </div>
          <p class="why">Пара работает так: спецификацию агенту править легко, шаблонный код генератор делает без токенов, а нестандартную логику пишет агент — там нужно понимание.</p>
        </div>
        <div class="q" data-q="l6-gen-ci">
          <p>CI выполнил <code>make generate &amp;&amp; git diff --exit-code</code> и упал. Что это значит?</p>
          <div class="options">
            <button>Генератор сломан, его пора удалить</button>
            <button data-right>Код в репозитории не совпадает с тем, что даёт спецификация: его правили руками или забыли перегенерировать</button>
            <button>Не прошли тесты бизнес-логики</button>
          </div>
          <p class="why">Проверка сравнивает свежую генерацию с тем, что лежит в репозитории. Дифф значит расхождение. Чинят так: правку переносят в спецификацию или шаблон и генерируют заново.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 45 минут</span></summary>
        <div class="more-body">
          <ol>
            <li>Найдите в проекте код, который повторяется по шаблону хотя бы 5 раз: DTO, маппинги, типы ответов API, однотипные контроллеры.</li>
            <li>Опишите один такой случай как JSON или YAML: только данные, без логики.</li>
            <li>Напишите генератор на своём языке по образцу из объяснения. Проверьте, что он воспроизводит существующий файл байт в байт или с понятными отличиями.</li>
            <li>Добавьте в шапку метку GENERATED, а в правила агента строку «такие файлы не правь, правь спецификацию».</li>
            <li>Добавьте в CI шаг «генерация и <code>git diff --exit-code</code>».</li>
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
        <li>Могу объяснить, что такое детерминированность и почему модель ею не обладает.</li>
        <li>Понимаю формулу «спецификация плюс шаблон равно код».</li>
        <li>Знаю готовые генераторы: OpenAPI, JSON Schema, make:entity, миграции.</li>
        <li>Различаю задачи для генератора, для агента и для гибрида.</li>
        <li>Знаю, как защитить сгенерированный код: метка, папка, правило агента, хук, CI.</li>
        <li>Знаю, что ломает детерминированность: даты, случайные id, порядок полей, версии.</li>
        <li>Ответил на вопросы урока: что отдать генератору, что ломает детерминированность, как защитить сгенерированный код.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Часть работы теперь делает генератор без единого токена. Дальше — как ловить ошибки агента автоматически, ещё до ревью.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://habr.com/ru/articles/541592/" target="_blank" rel="noopener">Swagger (OpenAPI 3.0)</a><span>подходы code-first и design-first, инструменты Swagger, включая Codegen. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/companies/otus/articles/851512/" target="_blank" rel="noopener">База, которую нужно знать про JSON Schema</a><span>от простой схемы до anyOf/allOf/oneOf и валидации. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/companies/yandex/articles/598125/" target="_blank" rel="noopener">Кодогенерация DTO: зачем она нужна и как её настроить</a><span>опыт Яндекс Go: DTO из схемы вместо ручного кода. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/450100/" target="_blank" rel="noopener">Генерация кода для бекенда. Что генерировать, как и зачем?</a><span>что выгодно генерировать на бэкенде и как устроить проект с генерацией. <span class="pill ok">рус.</span></span></li><li><a href="https://openapi-generator.tech/" target="_blank" rel="noopener">OpenAPI Generator</a><span>официальный генератор клиентов и серверов по OpenAPI, список генераторов (в т.ч. PHP). <span class="pill">англ.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://editor.swagger.io/" target="_blank" rel="noopener">Swagger Editor</a><span>написать OpenAPI-описание и сразу увидеть документацию; оттуда же можно сгенерировать код.</span></li><li><a href="https://app.quicktype.io/" target="_blank" rel="noopener">quicktype</a><span>вставить JSON или JSON Schema и получить классы на PHP, TypeScript и др. — один вход, всегда один выход.</span></li><li><a href="https://www.jsonschemavalidator.net/" target="_blank" rel="noopener">JSON Schema Validator</a><span>проверить схему и данные до запуска генератора.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .cookies { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
@media (max-width: 560px) {
.hc .cookies { grid-template-columns: minmax(0, 1fr); }
}
.hc .tray { background: var(--hc-surface); border-radius: var(--hc-r-md); padding: 0.75rem; display: grid; gap: 0.5rem; }
.hc .tray h4 { font: 600 var(--hc-fs-xs) var(--hc-f-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--hc-muted); }
.hc .tray .row { gap: 0.8rem; min-height: 4.2rem; }
.hc .cookie { width: 3.2rem; height: 3.2rem; background: color-mix(in srgb, var(--hc-warm) 55%, var(--hc-surface)); border: 2px solid var(--hc-warm); transition: border-radius 0.4s, transform 0.4s; }
.hc .cookie.mold { border-radius: 30% 30% 50% 50%; }
.hc .gen-io { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 0.9rem; }
@media (max-width: 860px) {
.hc .gen-io { grid-template-columns: minmax(0, 1fr); }
}
.hc .gen-io textarea.code { min-height: 22rem; }
.hc .gen-out { display: grid; gap: 0.5rem; min-width: 0; align-content: start; }
.hc .gen-out pre { min-height: 18rem; max-height: 28rem; }
.hc .gen-errs { list-style: none; padding: 0; display: grid; gap: 0.3rem; font-size: var(--hc-fs-sm); }
.hc .gen-errs li { margin: 0; padding: 0.35rem 0.6rem; border-radius: 6px; }
.hc .gen-errs li.err { background: var(--hc-bad-soft); }
.hc .gen-errs li.wrn { background: var(--hc-warn-soft); }
.hc .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: 0.6rem; }
.hc .card { background: var(--hc-bg); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.65rem 0.75rem; display: grid; gap: 0.5rem; align-content: start; font-size: var(--hc-fs-sm); transition: border-color 0.25s; }
.hc .card.right { border-color: var(--hc-ok); }
.hc .card.wrong { border-color: var(--hc-bad); }
.hc .card .choices { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.hc .card .choices button { font: 500 var(--hc-fs-xs) var(--hc-f-body); border: 1px solid var(--hc-line); background: var(--hc-surface); color: var(--hc-ink); border-radius: 99px; padding: 0.2rem 0.6rem; cursor: pointer; }
.hc .card .choices button[aria-pressed="true"] { background: var(--hc-ink); color: var(--hc-bg); border-color: var(--hc-ink); }
.hc .card .expl { color: var(--hc-muted); font-size: var(--hc-fs-xs); }
.hc .sliders { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem 1.2rem; }
@media (max-width: 640px) {
.hc .sliders { grid-template-columns: minmax(0, 1fr); }
}
.hc .verdict { border-radius: var(--hc-r-sm); padding: 0.7rem 0.9rem; display: grid; gap: 0.3rem; font-size: var(--hc-fs-sm); background: var(--hc-accent-soft); }
.hc .verdict b { font-size: var(--hc-fs-md); }
.hc .runs2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; }
@media (max-width: 760px) {
.hc .runs2 { grid-template-columns: minmax(0, 1fr); }
}
.hc .run-pane { display: grid; gap: 0.3rem; min-width: 0; }
.hc .run-pane h4 { font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); }
.hc .code-lines { background: var(--hc-code-bg); color: var(--hc-code-ink); border-radius: var(--hc-r-sm); padding: 0.5rem 0; font: 400 0.76rem/1.6 var(--hc-f-mono); overflow-x: auto; min-height: 15rem; }
.hc .code-lines div { padding: 0 0.75rem; white-space: pre; }
.hc .code-lines div.del { background: var(--hc-bad-soft); }
.hc .code-lines div.add { background: var(--hc-ok-soft); }
.hc .code-lines .empty { color: var(--hc-muted); padding: 0.5rem 0.75rem; white-space: normal; font-family: var(--hc-f-body); }
</style>
`;export{n as default};
