const t=`<div class="hc-page">
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
      <span class="eyebrow">Часть 1 · Что внутри модели · Урок 1</span>
      <h1>Как модель пишет код: токены, внимание, окно контекста и галлюцинации</h1>
      <p class="lead">Почему модель иногда пишет отличный код, а иногда уверенно выдумывает функцию, которой нет. Разберём механику без формул, а потом — с ними.</p>
      <div class="facts">
        <span class="fact">~45 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">3D-фильм и 11 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>объяснить, что LLM делает «под капотом», одной фразой;</li>
          <li>посчитать токены и прикинуть, сколько стоит задача агента;</li>
          <li>понять, почему модель «забывает» и почему ответы каждый раз разные;</li>
          <li>назвать причины галлюцинаций и три способа их снизить.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Автодополнение, которое прочитало весь интернет</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Клавиатура в телефоне подсказывает следующее слово. LLM делает то же самое. Только она прочитала миллиарды страниц и подсказывает очень хорошо.</p>
      </div>
      <div class="phone" aria-live="polite">
        <div class="typed"><span id="phone-text">Сервер вернул</span><span class="hc-caret"></span></div>
        <div class="suggest" id="phone-suggest">
          <span>ошибку<b>62%</b></span><span>ответ<b>21%</b></span><span>500<b>9%</b></span>
        </div>
        <div class="row"><button class="btn small" type="button" id="phone-play">▶ Дописать фразу</button><button class="btn small quiet" type="button" id="phone-reset">Сначала</button></div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Подсказка слова</b><span>= предсказание следующего токена</span></div>
        <div><b>Сколько текста видит клавиатура</b><span>= окно контекста</span></div>
        <div><b>Уверенно подставила не то слово</b><span>= галлюцинация</span></div>
        <div><b>Каждый раз немного разные подсказки</b><span>= случайный выбор (temperature)</span></div>
      </div>
      <p>Запомните главное: модель не «ищет ответ». Она каждый раз выбирает продолжение, которое <strong>звучит правдоподобно</strong>. Правдоподобно и правильно — не одно и то же. Весь курс — про то, как построить вокруг модели среду, которая превращает правдоподобное в проверенное.</p>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <p>Сначала короткий фильм — 40 секунд. Он показывает один шаг модели целиком. Остановите в любой момент, перемотайте, поверните сцену мышью и кликните по деталям.</p>
      <figure class="stage3d" data-stage="put-tokena">
        <div class="stage3d-view"></div>
        <figcaption class="stage3d-alt">3D-фильм «Путь токена». Фраза «Код 404 значит, что» режется на токены. Каждый токен становится точкой в пространстве смыслов, рядом с похожими: 404 — возле других HTTP-кодов. Механизм внимания связывает последний токен с прошлыми, сильнее всего с «404». Модель выдаёт вероятности кандидатов: «страница» 48%, «ресурс» 22%, «котик» 1%. Выбранный токен дописывается к тексту, и круг повторяется. Окно контекста держит только последние токены: первый выпадает, и модель его больше не видит.</figcaption>
      </figure>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Модель — это функция «текст → следующий кусочек»</h3>
        <p>Для бэкендера проще всего думать так. LLM (<span class="term" data-tip="Large Language Model — большая языковая модель. Нейросеть, обученная продолжать текст.">большая языковая модель</span>) — это чистая функция. На вход — текст. На выход — вероятности для следующего кусочка текста. Такой кусочек называют <span class="term" data-tip="Кусочек текста, с которым работает модель: слово, часть слова, знак препинания или пробел со словом.">токеном</span>.</p>
        <p>Чтобы написать длинный ответ, программа вокруг модели крутит цикл: спросила модель, выбрала токен, дописала его в конец, спросила снова.</p>
        <div class="code-tabs">
<pre data-lang="js">let text = "Код 404 означает, что";
while (!text.endsWith(".")) {
  const probs = model(text);      // { " ресурс": 0.61, " страница": 0.27, ... }
  const token = pick(probs);      // выбрать один токен
  text += token;                  // дописать и повторить
}</pre>
<pre data-lang="php">&lt;?php
$text = 'Код 404 означает, что';
while (!str_ends_with($text, '.')) {
    $probs = model($text);        // [' ресурс' => 0.61, ' страница' => 0.27, ...]
    $token = pick($probs);        // выбрать один токен
    $text .= $token;              // дописать и повторить
}</pre>
<pre data-lang="py">text = "Код 404 означает, что"
while not text.endswith("."):
    probs = model(text)      # {" ресурс": 0.61, " страница": 0.27, ...}
    token = pick(probs)      # выбрать один токен
    text += token            # дописать и повторить</pre>
        </div>
        <div class="tip"><b>Что важно</b>Модель не хранит состояние между запросами. Она не «помнит» прошлый разговор. Каждый раз ей заново отправляют весь нужный текст.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Токены, окно контекста и внимание</h3>
        <p><strong>Токены.</strong> Модель режет текст не на буквы и не на слова, а на частые кусочки. Частое английское слово — обычно один токен. Русское слово часто режется на два-три. Поэтому одинаковый по смыслу текст на русском обычно стоит дороже. За токены платят: и за входные, и за выходные.</p>
        <p><strong>Окно контекста.</strong> Это весь текст, который модель видит за один вызов: системные правила, история диалога, файлы, результаты инструментов и сам ответ. У окна есть предел в токенах. Всё, что не влезло, для модели не существует.</p>
        <p><strong>Внимание</strong> (<span class="term" data-tip="Attention — механизм, с помощью которого каждый токен «смотрит» на другие токены и решает, какие из них важны для понимания.">attention</span>). Каждый токен «оглядывается» на остальные и решает, кто ему важен. В фразе «сервер вернул ошибку, потому что <em>он</em> перегружен» слово «он» больше всего смотрит на «сервер». Это и даёт модели понимание связей в тексте. Попробуете ниже в интерактиве.</p>
        <details class="more">
          <summary>Как выглядит запрос к модели в коде <span class="hint">— JS, TS, PHP, Python</span></summary>
          <div class="more-body">
            <p>Обратите внимание: в <code>messages</code> мы сами передаём всю историю. Модель её не хранит. Ключ берётся из переменной окружения, в код его не пишем.</p>
            <div class="code-tabs">
<pre data-lang="js">// Node 18+: fetch встроен
const history = [
  { role: "user", content: "Меня зовут Аня. Что значит HTTP 404?" },
  { role: "assistant", content: "Ресурс не найден на сервере." },
  { role: "user", content: "А как меня зовут?" }, // модель узнает имя только из истории выше
];

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({ model: "claude-opus-5-5", max_tokens: 1024, messages: history }),
});
const data = await res.json();
console.log(data.content[0].text);           // ответ
console.log(data.usage);                     // { input_tokens, output_tokens } — за это платим</pre>
<pre data-lang="ts">type Role = "user" | "assistant";
interface Message { role: Role; content: string }

async function ask(history: Message[]): Promise&lt;string&gt; {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-opus-5-5", max_tokens: 1024, messages: history }),
  });
  if (!res.ok) throw new Error(\`API \${res.status}: \${await res.text()}\`);
  const data = await res.json();
  return data.content.find((b: { type: string }) => b.type === "text")?.text ?? "";
}

const history: Message[] = [{ role: "user", content: "Что значит HTTP 404?" }];
history.push({ role: "assistant", content: await ask(history) });
history.push({ role: "user", content: "А 410?" }); // каждый вызов — вся история заново
console.log(await ask(history));</pre>
<pre data-lang="php">&lt;?php
// Чистый PHP + curl. В Symfony то же самое делает HttpClient.
$history = [
    ['role' => 'user', 'content' => 'Меня зовут Аня. Что значит HTTP 404?'],
    ['role' => 'assistant', 'content' => 'Ресурс не найден на сервере.'],
    ['role' => 'user', 'content' => 'А как меня зовут?'],
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'content-type: application/json',
        'x-api-key: ' . getenv('ANTHROPIC_API_KEY'),
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'model' => 'claude-opus-5-5',
        'max_tokens' => 1024,
        'messages' => $history,
    ], JSON_UNESCAPED_UNICODE),
]);
$data = json_decode(curl_exec($ch), true, flags: JSON_THROW_ON_ERROR);
echo $data['content'][0]['text'], PHP_EOL;
echo 'Токенов на входе: ', $data['usage']['input_tokens'], PHP_EOL;</pre>
<pre data-lang="py">import os
import requests

history = [
    {"role": "user", "content": "Меня зовут Аня. Что значит HTTP 404?"},
    {"role": "assistant", "content": "Ресурс не найден на сервере."},
    {"role": "user", "content": "А как меня зовут?"},
]

res = requests.post(
    "https://api.anthropic.com/v1/messages",
    headers={
        "content-type": "application/json",
        "x-api-key": os.environ["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
    },
    json={"model": "claude-opus-5-5", "max_tokens": 1024, "messages": history},
    timeout=60,
)
res.raise_for_status()
data = res.json()
print(data["content"][0]["text"])
print("Токенов на входе:", data["usage"]["input_tokens"])</pre>
            </div>
            <p class="footer-note">В рабочем проекте лучше взять официальный SDK своего языка: он сам повторяет запрос при сбоях и даёт типы. Здесь сырой HTTP, чтобы было видно, что внутри.</p>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Откуда берутся галлюцинации и нестабильность</h3>
        <p><strong>Галлюцинация</strong> — уверенный, но неверный ответ. Причина в самой задаче модели: её учили продолжать текст правдоподобно, а не говорить правду. Если модель не знает API вашей библиотеки, правдоподобное продолжение — выдумать похожую функцию. Ответ «не знаю» в обучающих текстах встречается редко, поэтому модель его почти не выбирает.</p>
        <p><strong>Потеря контекста.</strong> Если важный факт выпал из окна, модели неоткуда его взять. Даже внутри окна факт в середине длинного текста модель замечает хуже, чем в начале или в конце. Это называют эффектом «потерянной середины» (<span class="term" data-tip="Lost in the middle — модели хуже используют информацию из середины длинного контекста.">lost in the middle</span>).</p>
        <p><strong>Нестабильность.</strong> Следующий токен выбирается случайно, с учётом вероятностей. Поэтому один и тот же запрос даёт разные ответы. Степень случайности задаёт <span class="term" data-tip="Параметр выборки: чем выше, тем чаще модель выбирает маловероятные токены.">temperature</span>. В новых моделях Claude этот параметр убран из API: стабильность достигают чётким форматом ответа, структурированным выводом и проверками.</p>
        <div class="note"><b>Мост к следующим урокам</b>Ни одну из этих проблем не решить «правильной фразой» в запросе. Их решают инженерно: дают модели нужный контекст (уроки 2 и 3), инструменты для проверки (урок 4), автоматический контроль (урок 7) и тесты-эталоны (урок 8). Всё это вместе и называется harness — «упряжь» для модели.</div>
        <details class="more">
          <summary>Формула внимания и softmax без страха <span class="hint">— для любопытных</span></summary>
          <div class="more-body">
            <p>Каждый токен превращается в вектор — список чисел. Из него получают три вектора:</p>
            <ul>
              <li><strong>Query</strong> (запрос) — «что я ищу»;</li>
              <li><strong>Key</strong> (ключ) — «что я могу предложить»;</li>
              <li><strong>Value</strong> (значение) — «что я отдам, если меня выберут».</li>
            </ul>
            <p>Похоже на поиск в хеш-таблице, только нечёткий. Токен сравнивает свой Query со всеми Key (скалярное произведение), получает оценки, превращает их в веса через softmax и берёт взвешенную сумму Value.</p>
            <pre data-lang="text">Attention(Q, K, V) = softmax(Q · Kᵀ / √d) · V

softmax(x)ᵢ = exp(xᵢ / T) / Σ exp(xⱼ / T)     ← T — та самая temperature</pre>
            <p>Отсюда два практических вывода:</p>
            <ul>
              <li>Каждый токен смотрит на каждый. Значит, стоимость вычислений растёт примерно как квадрат длины текста. Длинный контекст — медленно и дорого.</li>
              <li>Softmax никогда не даёт ровно ноль. У любого, даже бредового продолжения есть шанс. Чем выше temperature, тем этот шанс больше.</li>
            </ul>
            <p>Как температура меняет ответ, проверите в вопросах в конце урока.</p>
          </div>
        </details>
        <details class="more">
          <summary>Почему агент дорогой: история растёт на каждом шаге <span class="hint">— важно для бюджета</span></summary>
          <div class="more-body">
            <p>Агент работает циклом: модель просит инструмент, программа его выполняет, результат дописывается в историю, и вся история снова уходит модели. Шаг 1 отправляет 5 тысяч токенов, шаг 10 — уже 25 тысяч, шаг 20 — 45 тысяч. Сумма растёт почти как квадрат числа шагов.</p>
            <p>Помогают три вещи. <strong>Кэш промпта</strong>: одинаковое начало запроса (правила, описание инструментов) провайдер берёт из кэша в разы дешевле. <strong>Сжатие истории</strong>: старые шаги заменяют короткой сводкой. <strong>Субагенты</strong>: тяжёлое чтение уходит в отдельный контекст, а в основной возвращается только вывод (урок 2).</p>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Потрогайте механику руками</h2>
        <p>Модель здесь игрушечная: вероятности заданы вручную. Но цикл, выборка и температура работают ровно как у настоящей.</p>
      </div>

      <!-- 3.1 Генератор -->
      <div class="stand" id="gen">
        <div class="stand-head"><h3>Генерация по одному токену</h3><span class="badge">интерактив 1 из 4</span></div>
        <div class="row" role="group" aria-label="Начало фразы">
          <button class="chip-btn" type="button" data-prompt="http" aria-pressed="true">Код 404</button>
          <button class="chip-btn" type="button" data-prompt="php" aria-pressed="false">array_flatten() в PHP</button>
          <button class="chip-btn" type="button" data-prompt="sql" aria-pressed="false">SQL-запрос</button>
        </div>
        <div class="gen-text" id="gen-text" aria-live="polite"></div>
        <div class="grid-2">
          <div class="field">
            <label for="gen-temp">Температура: <span id="gen-temp-val" class="mono">1.0</span> <small>0 — всегда самый вероятный, 2 — почти случайно</small></label>
            <input type="range" id="gen-temp" min="0" max="2" step="0.1" value="1">
          </div>
          <div class="row">
            <button class="btn" type="button" id="gen-step">Следующий токен</button>
            <button class="btn secondary" type="button" id="gen-all">До конца</button>
            <button class="btn quiet" type="button" id="gen-reset">Сначала</button>
          </div>
        </div>
        <div>
          <p class="task" id="gen-hint">Кандидаты на следующий токен и их вероятности:</p>
          <div class="cands" id="gen-cands"></div>
        </div>
        <div class="row"><button class="btn secondary" type="button" id="gen-many">Сгенерировать 5 раз подряд</button><span class="task">Посмотрите, насколько разные ответы при одной и той же температуре.</span></div>
        <ol class="runs" id="gen-runs"></ol>
        <div class="warn" id="gen-php-note" hidden><b>Это и есть галлюцинация</b>Функции <code>array_flatten()</code> в PHP нет. Но самое вероятное продолжение — уверенно описать, что она делает. Модель выбирает правдоподобное, а не истинное. Лечится не уговорами, а проверкой: дать агенту поиск по документации или запустить код.</div>
      </div>

      <!-- 3.2 Токены -->
      <div class="stand" id="tok">
        <div class="stand-head"><h3>Как текст режется на токены</h3><span class="badge">интерактив 2 из 4</span></div>
        <p class="task">Напишите что угодно: русский текст, английский, код. Разбиение учебное и приблизительное. Точный счёт для своей модели проверьте в настоящем токенайзере (ссылки в конце урока).</p>
        <div class="field">
          <label for="tok-input">Текст</label>
          <textarea id="tok-input" rows="4">Сервер вернул ошибку 500. The server returned error 500. $user = $repo->find($id);</textarea>
        </div>
        <div class="tokens" id="tok-out" aria-label="Токены"></div>
        <div class="stats">
          <div><b id="tok-chars">0</b>символов</div>
          <div><b id="tok-count">0</b>токенов (примерно)</div>
          <div><b id="tok-ratio">0</b>символов на токен</div>
        </div>
        <details class="more">
          <summary>Почему русский текст «дороже» <span class="hint">— коротко</span></summary>
          <div class="more-body">
            <p>Словарь токенайзера собирают по частоте кусочков в обучающих текстах. Английского там больше, поэтому английские слова чаще попадают в словарь целиком. Русские слова чаще собираются из двух-трёх кусочков. На практике один и тот же смысл по-русски занимает заметно больше токенов. Точное соотношение зависит от модели.</p>
          </div>
        </details>
      </div>

      <!-- 3.3 Внимание -->
      <div class="stand" id="attn">
        <div class="stand-head"><h3>Внимание: на кого смотрит слово</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">Нажмите на выделенное слово. Синяя полоска под другими словами показывает, насколько сильно модель «смотрит» на них, чтобы понять выбранное. Веса учебные, но картина типичная.</p>
        <div class="attn-words" id="attn-words"></div>
        <p class="task" id="attn-explain" aria-live="polite">Выберите «он», «ошибку» или «перегружен».</p>
      </div>

      <!-- 3.4 Окно контекста -->
      <div class="stand" id="ctx">
        <div class="stand-head"><h3>Окно контекста: что модель видит прямо сейчас</h3><span class="badge">интерактив 4 из 4</span></div>
        <p class="task">Окно здесь — 4 000 токенов. В первом сообщении пользователь назвал имя. Добавляйте реплики и файлы, а потом спросите имя. Затем включите сжатие и повторите.</p>
        <div class="ctx-bar" id="ctx-bar" aria-hidden="true"></div>
        <div class="row" style="justify-content: space-between">
          <span class="task" id="ctx-used">Занято: 0 из 4 000</span>
          <label class="row" style="gap:0.4rem; font-weight:500"><input type="checkbox" id="ctx-compact"> Сжимать старое в сводку (compaction)</label>
        </div>
        <div class="row">
          <button class="btn secondary" type="button" id="ctx-msg">+ Реплика (300)</button>
          <button class="btn secondary" type="button" id="ctx-file">+ Прочитать файл (1 200)</button>
          <button class="btn" type="button" id="ctx-ask">Спросить: «Как меня зовут?»</button>
          <button class="btn quiet" type="button" id="ctx-reset">Сначала</button>
        </div>
        <div id="ctx-answer" aria-live="polite"></div>
        <ul class="ctx-log" id="ctx-log"></ul>
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
        <div class="q" data-q="l1-what">
          <p>Что на самом деле делает LLM, когда «отвечает» на вопрос?</p>
          <div class="options">
            <button>Ищет готовый ответ в своей базе данных</button>
            <button data-right>Раз за разом предсказывает следующий токен и дописывает его</button>
            <button>Запускает код и проверяет результат</button>
          </div>
          <p class="why">Модель — функция «текст → вероятности следующего токена». Длинный ответ получается циклом. Ни поиска, ни запуска кода внутри модели нет: это добавляет harness через инструменты.</p>
        </div>
        <div class="q" data-q="l1-memory">
          <p>Вы задали модели два вопроса подряд. Откуда во втором запросе она знает про первый?</p>
          <div class="options">
            <button>Модель запоминает пользователя между запросами</button>
            <button>Провайдер хранит сессию на своём сервере и подмешивает её</button>
            <button data-right>Программа-клиент отправила историю диалога заново вместе со вторым вопросом</button>
          </div>
          <p class="why">Модель не хранит состояние. Историю каждый раз шлёт клиент. Поэтому длинный диалог дорожает с каждым сообщением.</p>
        </div>
        <div class="q" data-q="l1-halluc">
          <p>Агент уверенно вызвал в коде метод, которого нет в вашей библиотеке. Что поможет надёжнее всего?</p>
          <div class="options">
            <button>Дописать в запрос «никогда не выдумывай методы»</button>
            <button data-right>Дать агенту поиск по коду и документации и прогнать тесты после правки</button>
            <button>Поднять температуру, чтобы модель «подумала шире»</button>
          </div>
          <p class="why">Просьба снижает частоту, но не гарантирует результат. Проверяемость даёт среда: инструмент поиска даёт факты, тесты ловят ошибку автоматически.</p>
        </div>
        <div class="q" data-q="l1-window">
          <p>Что случится с фактом, который выпал за пределы окна контекста?</p>
          <div class="options">
            <button data-right>Для модели его больше нет. Если спросить про него, она может выдумать ответ</button>
            <button>Модель подгрузит его из долговременной памяти</button>
            <button>Запрос упадёт с ошибкой</button>
          </div>
          <p class="why">Окно — всё, что модель видит. Чтобы факты не терялись, harness сжимает историю в сводку или хранит их во внешней памяти и подставляет по запросу (урок 3).</p>
        </div>
        <div class="q" data-q="l1-token-facts" data-multi>
          <p>Что верно про токены?</p>
          <div class="options">
            <button data-right>Одно слово может состоять из нескольких токенов</button>
            <button data-right>Русский текст обычно занимает больше токенов, чем тот же текст по-английски</button>
            <button>Токен — это всегда одна буква</button>
            <button data-right>Окно контекста и цена запроса считаются в токенах</button>
          </div>
          <p class="why">Токенизатор режет текст на частые куски. Частое английское слово — один токен, русское чаще бьётся на два-три. Лимиты и счёт идут в токенах, поэтому длинный русский текст быстрее заполняет окно и стоит дороже.</p>
        </div>
        <div class="q" data-q="l1-temperature" data-multi>
          <p>Вы поставили температуру 0 вместо 1. Что изменится?</p>
          <div class="options">
            <button data-right>Модель будет почти всегда брать самый вероятный токен</button>
            <button data-right>Ответы на один и тот же запрос станут похожи друг на друга</button>
            <button>Модель начнёт знать больше фактов</button>
            <button>Галлюцинации исчезнут</button>
          </div>
          <p class="why">Температура меняет только выбор среди кандидатов. Знаний она не добавляет. Если самый вероятный вариант — выдумка, при температуре 0 модель будет повторять эту выдумку каждый раз.</p>
        </div>
        <div class="q" data-q="l1-cost" data-multi>
          <p>Агент сделал 40 шагов вместо 20, а входных токенов стало почти вчетверо больше. Почему?</p>
          <div class="options">
            <button data-right>На каждом шаге модели заново уходит вся история</button>
            <button data-right>История растёт после каждого шага: прошлые ответы и вывод инструментов</button>
            <button>Провайдер берёт доплату за длинные сессии</button>
            <button>На поздних шагах модель думает дольше и поэтому дороже</button>
          </div>
          <p class="why">Модель ничего не помнит, поэтому каждый шаг отправляет ей всё заново. Шаг 1 несёт правила и задачу, шаг 20 — ещё и 19 прошлых шагов. Сумма растёт как квадрат числа шагов. Поэтому хороший harness сжимает историю и кэширует неизменное начало.</p>
        </div>
        <div class="q" data-q="l1-attention">
          <p>Что делает механизм внимания?</p>
          <div class="options">
            <button>Запоминает разговоры между сессиями</button>
            <button data-right>Для каждого токена решает, на какие прошлые токены смотреть сильнее</button>
            <button>Проверяет готовый ответ на ошибки перед отправкой</button>
          </div>
          <p class="why">Внимание раздаёт веса прошлым токенам. В фильме выше после «что» сильнее всего весит «404»: именно он решает, о чём будет продолжение. Памяти между запросами внимание не даёт.</p>
        </div>
        <div class="q" data-q="l1-window-help" data-multi>
          <p>Важное правило проекта рискует выпасть из окна контекста. Что поможет?</p>
          <div class="options">
            <button data-right>Положить правило в файл, который harness добавляет в каждый запрос, например <code>AGENTS.md</code></button>
            <button data-right>Сжимать старую историю в короткое резюме</button>
            <button>Повторить правило капслоком в начале диалога</button>
            <button data-right>Отдать тяжёлое чтение субагенту и взять в основной диалог только вывод</button>
          </div>
          <p class="why">Окно ограничено, поэтому важное надо держать там постоянно, а лишнее — убирать. Файл правил подкладывается в каждый запрос, резюме экономит место, субагент читает большие файлы в своём окне. Капслок слово не закрепляет: в начале длинного диалога оно выпадет первым.</p>
        </div>
        <div class="q" data-q="l1-same-prompt">
          <p>Один и тот же запрос дал два разных ответа. Что это значит?</p>
          <div class="options">
            <button>Сломался сервер провайдера</button>
            <button data-right>Это нормально: при температуре выше нуля выбор токена случайный</button>
            <button>Модель дообучилась между двумя запросами</button>
          </div>
          <p class="why">На каждом шаге модель тянет токен из распределения. Первый же другой токен уводит ответ по другой дорожке. Для повторяемого результата нужны низкая температура, точная постановка и проверка тестами.</p>
        </div>
        <div class="q" data-q="l1-halluc-signs" data-multi>
          <p>Агент написал код. Какие признаки выдумки модели стоит проверить в первую очередь?</p>
          <div class="options">
            <button data-right>Вызов метода, которого нет в вашей версии библиотеки</button>
            <button data-right>Импорт пакета, которого нет в зависимостях проекта</button>
            <button>Отступы и форматирование по стандарту проекта</button>
            <button data-right>Ссылка на параметр конфига, которого в проекте нет</button>
          </div>
          <p class="why">Модель пишет правдоподобное, а не проверенное. Чаще всего она выдумывает имена: методы, пакеты, ключи конфига. Это ловит запуск: тесты, сборка, линтер. Форматирование тут ни при чём.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 15 минут, без кода</span></summary>
        <div class="more-body">
          <ol>
            <li>Откройте любой чат с LLM. Спросите, что делает функция из вашего рабочего проекта. Код не показывайте. Запишите ответ.</li>
            <li>Теперь вставьте код этой функции и задайте тот же вопрос. Сравните. Сколько в первом ответе было выдумано?</li>
            <li>Вставьте самый большой файл проекта в токенайзер. Сколько в нём токенов? Сколько будет стоить прочитать его на каждом из 20 шагов агента, если файл каждый раз уходит на вход заново?</li>
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
        <li>Могу одной фразой объяснить, что делает LLM: предсказывает следующий токен.</li>
        <li>Знаю, что такое токен и почему русский текст обычно дороже английского.</li>
        <li>Понимаю: модель не помнит прошлые запросы, историю каждый раз отправляет клиент.</li>
        <li>Могу объяснить, что такое окно контекста и что бывает при переполнении.</li>
        <li>Понимаю, почему «правдоподобно» не значит «правильно» и откуда галлюцинации.</li>
        <li>Понимаю, почему вдвое больше шагов агента стоит почти вчетверо дороже по входу.</li>
        <li>Могу назвать три способа снизить галлюцинации: дать контекст, дать инструмент проверки, проверить результат тестами.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Отлично. Теперь вы знаете, с каким «двигателем» работаете. Дальше соберём вокруг него машину.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://habr.com/ru/companies/ods/articles/716918/" target="_blank" rel="noopener">Как работает ChatGPT: объясняем на простом русском эволюцию языковых моделей с T9 до чуда</a><span>самое понятное введение: от предсказания следующего слова до ChatGPT, без формул. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/companies/timeweb/articles/1055872/" target="_blank" rel="noopener">Как на самом деле работают LLM</a><span>по шагам: токенизация, эмбеддинги, внимание, предсказание следующего токена. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/486358/" target="_blank" rel="noopener">Transformer в картинках</a><span>перевод классики Джея Аламмара: механизм внимания (attention) на рисунках. <span class="pill ok">рус., перевод</span></span></li><li><a href="https://habr.com/ru/companies/bothub/articles/928752/" target="_blank" rel="noopener">Ключевые понятия LLM</a><span>коротко про токены, контекстное окно и температуру: почему один и тот же запрос даёт разные ответы. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/companies/simbirsoft/articles/895012/" target="_blank" rel="noopener">Галлюцинации в языковых моделях: виды, причины и способы уменьшения</a><span>откуда берутся выдумки модели и как их снижать. <span class="pill ok">рус.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://tiktokenizer.vercel.app/" target="_blank" rel="noopener">Tiktokenizer</a><span>вставить одну фразу по-русски и по-английски и сравнить число токенов.</span></li><li><a href="https://poloclub.github.io/transformer-explainer/" target="_blank" rel="noopener">Transformer Explainer</a><span>живая GPT-2 в браузере: видно внимание и вероятности следующего токена, есть ползунок температуры.</span></li><li><a href="https://bbycroft.net/llm" target="_blank" rel="noopener">LLM Visualization</a><span>3D-прогулка по всем слоям маленькой GPT, шаг за шагом.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .phone { background: var(--hc-surface); border-radius: var(--hc-r-md); padding: 0.9rem 1rem; display: grid; gap: 0.6rem; max-width: 26rem; }
.hc .phone .typed { font: 500 var(--hc-fs-lg) var(--hc-f-body); min-height: 1.6em; }
.hc .phone .hc-caret { display: inline-block; width: 2px; height: 1.1em; background: var(--hc-accent); vertical-align: -0.15em; animation: hc-blink 1s steps(2) infinite; }
@keyframes hc-blink { 50% { opacity: 0; } }
.hc .suggest { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.hc .suggest span { background: var(--hc-surface-2); border-radius: 6px; padding: 0.2rem 0.55rem; font-size: var(--hc-fs-sm); }
.hc .suggest span b { font: 600 var(--hc-fs-xs) var(--hc-f-mono); color: var(--hc-muted); margin-left: 0.35rem; }
.hc .gen-text { font: 500 var(--hc-fs-lg)/1.5 var(--hc-f-body); background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.75rem 0.9rem; min-height: 3.4rem; }
.hc .gen-text .p { color: var(--hc-muted); }
.hc .gen-text .tok { background: var(--hc-accent-soft); border-radius: 4px; padding: 0 0.1em; }
.hc .gen-text .tok.fresh { animation: hc-pop 0.3s ease-out; }
.hc .cands { display: grid; gap: 0.35rem; }
.hc .cand { display: grid; grid-template-columns: minmax(6rem, 12rem) minmax(0, 1fr) 3.5rem; gap: 0.6rem; align-items: center; font-size: var(--hc-fs-sm); }
.hc .cand .lbl { font-family: var(--hc-f-mono); white-space: pre; overflow: hidden; text-overflow: ellipsis; }
.hc .cand .bar { height: 0.9rem; background: var(--hc-surface-2); border-radius: 4px; overflow: hidden; }
.hc .cand .bar i { display: block; height: 100%; background: var(--hc-accent); transition: width 0.35s; }
.hc .cand.picked .bar i { background: var(--hc-warm); }
.hc .cand.picked .lbl { font-weight: 700; color: var(--hc-warm); }
.hc .cand .pct { text-align: right; font: 500 var(--hc-fs-xs) var(--hc-f-mono); font-variant-numeric: tabular-nums; }
.hc .runs { list-style: none; padding: 0; display: grid; gap: 0.3rem; font-size: var(--hc-fs-sm); }
.hc .runs li { margin: 0; background: var(--hc-bg); padding: 0.35rem 0.6rem; border-radius: 6px; }
.hc .tokens { display: flex; flex-wrap: wrap; gap: 2px; font: 400 0.92rem/1.9 var(--hc-f-mono); }
.hc .tokens span { padding: 0 3px; border-radius: 3px; white-space: pre; }
.hc .tokens span:nth-child(5n+1) { background: color-mix(in srgb, var(--hc-accent) 18%, transparent); }
.hc .tokens span:nth-child(5n+2) { background: color-mix(in srgb, var(--hc-warm) 20%, transparent); }
.hc .tokens span:nth-child(5n+3) { background: color-mix(in srgb, var(--hc-ok) 20%, transparent); }
.hc .tokens span:nth-child(5n+4) { background: color-mix(in srgb, var(--hc-bad) 16%, transparent); }
.hc .tokens span:nth-child(5n+5) { background: color-mix(in srgb, var(--hc-warn) 20%, transparent); }
.hc .stats { display: flex; flex-wrap: wrap; gap: 1.2rem; font-size: var(--hc-fs-sm); }
.hc .stats b { font: 600 var(--hc-fs-lg) var(--hc-f-mono); display: block; font-variant-numeric: tabular-nums; }
.hc .attn-words { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.hc .attn-words button { font: 500 var(--hc-fs-md) var(--hc-f-body); border: 1.5px solid var(--hc-line); background: var(--hc-bg); color: var(--hc-ink); border-radius: 6px; padding: 0.25rem 0.55rem; cursor: pointer; position: relative; }
.hc .attn-words button[aria-pressed="true"] { border-color: var(--hc-warm); color: var(--hc-warm); font-weight: 700; }
.hc .attn-words button .w { position: absolute; left: 0; right: 0; bottom: -2px; height: 4px; border-radius: 2px; background: var(--hc-accent); transform-origin: left; transition: transform 0.35s; transform: scaleX(0); }
.hc .ctx-bar { display: flex; height: 2.4rem; border-radius: var(--hc-r-sm); overflow: hidden; background: var(--hc-surface-2); border: 1px solid var(--hc-line); }
.hc .ctx-bar div { height: 100%; display: grid; place-items: center; font: 600 0.7rem var(--hc-f-mono); color: var(--hc-ink); border-right: 2px solid var(--hc-surface); overflow: hidden; white-space: nowrap; transition: flex-basis 0.35s; }
.hc .ctx-bar .sys { background: color-mix(in srgb, var(--hc-ink) 18%, transparent); }
.hc .ctx-bar .user { background: color-mix(in srgb, var(--hc-accent) 30%, transparent); }
.hc .ctx-bar .file { background: color-mix(in srgb, var(--hc-warm) 30%, transparent); }
.hc .ctx-bar .sum { background: color-mix(in srgb, var(--hc-ok) 32%, transparent); }
.hc .ctx-bar .name { outline: 2px solid var(--hc-warm); outline-offset: -2px; }
.hc .ctx-log { list-style: none; padding: 0; display: grid; gap: 0.25rem; font-size: var(--hc-fs-sm); max-height: 11rem; overflow: auto; }
.hc .ctx-log li { margin: 0; display: flex; gap: 0.5rem; }
.hc .ctx-log li.gone { color: var(--hc-muted); text-decoration: line-through; }
.hc .answer { border-radius: var(--hc-r-sm); padding: 0.6rem 0.8rem; font-size: var(--hc-fs-sm); }
.hc .answer.ok { background: var(--hc-ok-soft); }
.hc .answer.bad { background: var(--hc-bad-soft); }
</style>
`;export{t as default};
