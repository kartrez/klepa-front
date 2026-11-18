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
      <span class="eyebrow">Часть 2 · Агент в вашем проекте · Урок 3</span>
      <h1>Память проекта: что агенту знать заранее и как это хранить</h1>
      <p class="lead">Модель ничего не помнит между сессиями. Всё, что агент должен знать о проекте, надо где-то хранить и вовремя ему подавать. Разберём, что хранить, как раскладывать и как доставать без лишних токенов.</p>
      <div class="facts">
        <span class="fact">~50 минут</span>
        <span class="fact">4 интерактива</span>
        <span class="fact">12 вопросов</span>
        <span class="fact">Примеры: JS · TS · PHP · Python</span>
      </div>
      <div class="outcomes">
        <h2>После урока вы сможете</h2>
        <ul>
          <li>объяснить, зачем агенту внешняя память и чем она отличается от окна контекста;</li>
          <li>разложить знания проекта на заметки: правила, решения, справку, грабли;</li>
          <li>выбрать способ выдачи знаний: всё сразу, оглавление или поиск;</li>
          <li>написать простой поиск по заметкам с бюджетом токенов;</li>
          <li>не дать устаревшей заметке сломать работу агента.</li>
        </ul>
      </div>
    </header>

    <!-- ============ 1. АНАЛОГИЯ ============ -->
    <section class="step" id="analogy">
      <div class="step-head">
        <span class="step-tag"><b>1</b> Аналогия</span>
        <h2>Библиотекарь с каталогом</h2>
      </div>
      <div class="analogy">
        <span class="label">Представьте</span>
        <p>Новому сотруднику не читают вслух всю вики компании. Ему дают оглавление и говорят: «Нужно что-то — найди по каталогу». На столе лежат только книги для текущей задачи.</p>
      </div>
      <div class="stand lib" id="lib">
        <div class="stand-head"><h3>Как библиотекарь находит ответ</h3><span class="badge">схема</span></div>
        <div class="flow" id="lib-flow">
          <div class="node"><b>Вопрос</b><small>«Как выкатить бэкенд?»</small></div>
          <span class="arrow">→</span>
          <div class="node"><b>Каталог</b><small>оглавление: 40 заметок, по строке на каждую</small></div>
          <span class="arrow">→</span>
          <div class="node"><b>Полка</b><small>берём 2 подходящие заметки</small></div>
          <span class="arrow">→</span>
          <div class="node"><b>Стол</b><small>только они попадают в контекст</small></div>
        </div>
        <div class="lib-desk" id="lib-desk"><span class="task">На столе пусто.</span></div>
        <div class="row">
          <button class="btn small" type="button" id="lib-play">▶ Показать</button>
          <button class="btn small quiet" type="button" id="lib-reset">Сначала</button>
        </div>
      </div>
      <div class="map-pairs" aria-label="Соответствия аналогии">
        <div><b>Блокнот и вики новичка</b><span>= заметки памяти агента</span></div>
        <div><b>Оглавление вики</b><span>= индекс (одна строка на заметку)</span></div>
        <div><b>Библиотекарь</b><span>= поиск нужного по задаче</span></div>
        <div><b>Рабочий стол</b><span>= окно контекста</span></div>
        <div><b>Устаревшая страница вики</b><span>= заметка, которая разошлась с кодом</span></div>
      </div>
      <p>Главная мысль: хорошая память — это не «запомнить всё». Это <strong>быстро найти нужное и не тащить лишнее</strong>. Каждая лишняя заметка на столе стоит денег и мешает модели заметить главное.</p>
    </section>

    <!-- ============ 2. ОБЪЯСНЕНИЕ ============ -->
    <section class="step" id="explain">
      <div class="step-head">
        <span class="step-tag"><b>2</b> Объяснение</span>
        <h2>От простого к сложному</h2>
      </div>

      <div class="level" data-level="1">
        <span class="level-tag">Уровень 1 · Суть</span>
        <h3>Внешняя память — это папка с текстом и правило, как её читать</h3>
        <p>Из урока 1 вы знаете: модель не хранит состояние. Закрыли сессию — всё забыто. Окно контекста ограничено. Значит, знания о проекте надо держать <strong>снаружи</strong>, в обычных файлах. Это и называют Second Brain (<span class="term" data-tip="«Второй мозг» — внешняя база знаний, которую человек или агент пополняет и из которой берёт нужное по задаче.">второй мозг</span>).</p>
        <p>Схема простая. Перед задачей harness читает оглавление, выбирает подходящие заметки и кладёт их в контекст. После задачи агент дописывает новое знание.</p>
        <div class="code-tabs">
<pre data-lang="js">// Перед задачей
const index = read("memory/INDEX.md");            // 40 строк: имя + описание
const picked = choose(index, task);              // 2–3 заметки по теме задачи
context.push(...picked.map(name => read(\`memory/\${name}.md\`)));

// После задачи
if (learnedSomethingNew) write("memory/new-fact.md", note);</pre>
<pre data-lang="php">&lt;?php
// Перед задачей
$index = file_get_contents('memory/INDEX.md');      // 40 строк: имя + описание
$picked = choose($index, $task);                    // 2–3 заметки по теме задачи
foreach ($picked as $name) {
    $context[] = file_get_contents("memory/{$name}.md");
}

// После задачи
if ($learnedSomethingNew) {
    file_put_contents('memory/new-fact.md', $note);
}</pre>
<pre data-lang="py">from pathlib import Path

# Перед задачей
index = Path("memory/INDEX.md").read_text()      # 40 строк: имя + описание
picked = choose(index, task)                      # 2–3 заметки по теме задачи
context += [Path(f"memory/{name}.md").read_text() for name in picked]

# После задачи
if learned_something_new:
    Path("memory/new-fact.md").write_text(note)</pre>
        </div>
        <div class="tip"><b>Что важно</b>Память — не замена коду и документации. Это короткие подсказки: где лежит правда, какие решения уже приняты, на какие грабли уже наступали.</div>
      </div>

      <div class="level" data-level="2">
        <span class="level-tag">Уровень 2 · Детали</span>
        <h3>Что хранить и как раскладывать</h3>
        <p><strong>Пять видов знаний</strong>, которые окупаются почти в любом проекте:</p>
        <ul>
          <li><strong>Правила проекта.</strong> «Деньги храним в копейках, целым числом». «Миграции только через Doctrine».</li>
          <li><strong>Архитектурные решения.</strong> Формат <span class="term" data-tip="Architecture Decision Record — короткая запись: какой был контекст, что решили, какие последствия. Одна запись — одно решение.">ADR</span>: контекст, решение, последствия. Объясняет «почему так», чтобы агент не «улучшил» обратно.</li>
          <li><strong>Справка.</strong> Как запустить проект, тесты, деплой. Команды, которые агент выполнит сам.</li>
          <li><strong>Продуктовый контекст.</strong> Кто пользователи, что для бизнеса важно, какие слова нельзя писать клиентам.</li>
          <li><strong>Грабли.</strong> Инциденты и их причины: «перезапуск воркера руками обрывает очередь».</li>
        </ul>
        <p><strong>Как раскладывать.</strong> Одна мысль — один маленький файл. В начале файла — <span class="term" data-tip="Frontmatter — блок метаданных в начале markdown-файла между строками ---. Обычно в формате YAML: ключ: значение.">frontmatter</span>: имя, однострочное описание, тип. Отдельный файл-оглавление собирает по строке на каждую заметку. Заметки ссылаются друг на друга через <code>[[имя]]</code>.</p>
        <pre data-lang="text">---
name: money-in-kopecks
description: Деньги храним целым числом в копейках, никогда не float
type: rule
updated: 2026-09-14
---
Все суммы в БД и коде — integer в копейках (1 BYN = 100).
Float теряет точность: 0.1 + 0.2 != 0.3.
Связано: [[adr-003-money-type]], [[incident-refund-rounding]]</pre>
        <p><strong>Три способа выдачи</strong> знаний агенту:</p>
        <ul>
          <li><strong>Всё сразу.</strong> Склеить все заметки в системный промпт. Просто, но дорого. При росте базы важное тонет в шуме.</li>
          <li><strong>Оглавление и подгрузка.</strong> Агент видит только индекс и сам открывает нужные файлы. Дёшево, точно, но требует хороших описаний.</li>
          <li><strong>Поиск.</strong> Программа находит заметки по тексту задачи и подкладывает их. Работает на больших базах. Может промахнуться.</li>
        </ul>
        <details class="more">
          <summary>Пример структуры каталога памяти <span class="hint">— как это выглядит на диске</span></summary>
          <div class="more-body">
<pre data-lang="text">memory/
├── INDEX.md                      ← оглавление: по строке на заметку
├── rules/
│   ├── money-in-kopecks.md
│   └── migrations-only-doctrine.md
├── decisions/
│   ├── adr-001-symfony-messenger.md
│   └── adr-003-money-type.md
├── howto/
│   ├── run-tests.md
│   └── deploy-backend.md
├── product/
│   └── never-mention-fees.md
└── incidents/
    └── 2026-08-worker-restart.md</pre>
<pre data-lang="md"># INDEX.md
- [money-in-kopecks](rules/money-in-kopecks.md) — деньги целым числом в копейках
- [deploy-backend](howto/deploy-backend.md) — выкатка только через make up
- [adr-001-symfony-messenger](decisions/adr-001-symfony-messenger.md) — очереди на Messenger, не на cron
- [2026-08-worker-restart](incidents/2026-08-worker-restart.md) — ручной рестарт воркера обрывает очередь</pre>
          </div>
        </details>
        <details class="more">
          <summary>Пример ADR <span class="hint">— контекст, решение, последствия</span></summary>
          <div class="more-body">
<pre data-lang="md"># ADR-003. Тип для денежных сумм

Статус: принято, 2026-03-02

## Контекст
Суммы хранились во float. При возвратах накопились расхождения в 1 копейку.

## Решение
Храним суммы целым числом в копейках (BIGINT). В коде — value object Money.

## Последствия
+ Нет ошибок округления.
- При выводе нужно делить на 100. Все старые колонки переводим миграцией.
- Внешние API, которые отдают float, переводим в копейки на входе.</pre>
          </div>
        </details>
        <details class="more">
          <summary>AGENTS.md, который отсылает к памяти <span class="hint">— точка входа для агента</span></summary>
          <div class="more-body">
            <p>Файл правил (урок 2) остаётся коротким. Он не пересказывает всё, а говорит, где искать.</p>
<pre data-lang="md"># Правила для агента

- Перед задачей прочитай memory/INDEX.md и открой заметки по теме.
- Заметка — подсказка, а не правда. Перед действием сверь её с кодом.
- Если заметка разошлась с кодом — прав код. Исправь заметку и обнови дату.
- Новое знание (решение, грабли) — отдельной заметкой и строкой в INDEX.md.
- Как запускать тесты и деплой — docs/howto/*.md, не выдумывай команды.</pre>
          </div>
        </details>
      </div>

      <div class="level" data-level="3">
        <span class="level-tag">Уровень 3 · Усложнение</span>
        <h3>Поиск по смыслу, устаревание и иерархия правды</h3>
        <p><strong>Поиск по словам</strong> находит заметки, где есть слова из запроса. Простой подсчёт совпадений работает плохо: частые слова вроде «код» есть везде. Алгоритм <span class="term" data-tip="BM25 — классическая формула ранжирования в поисковиках. Учитывает, как часто слово в документе, насколько оно редкое во всей базе и длину документа.">BM25</span> даёт больший вес редким словам и не любит слишком длинные документы.</p>
        <p><strong>Поиск по смыслу</strong> решает проблему синонимов. «Деплой» и «выкатка» — разные слова, но смысл один. Текст превращают в <span class="term" data-tip="Embedding — список из сотен чисел, который описывает смысл текста. Близкие по смыслу тексты дают близкие списки.">эмбеддинг</span>: координаты смысла. Представьте карту, где похожие по смыслу фразы лежат рядом. Поиск — это «найди точки рядом с вопросом». Схему «найти, подложить в контекст, ответить» называют <span class="term" data-tip="Retrieval-Augmented Generation — генерация с подкладыванием найденных документов в контекст.">RAG</span>.</p>
        <p><strong>Устаревание</strong> — главная беда любой базы знаний. Код меняют каждый день, а заметки — редко. Правила гигиены:</p>
        <ul>
          <li>в заметке есть дата обновления;</li>
          <li>перед действием агент сверяет заметку с кодом;</li>
          <li>нашёл расхождение — исправил заметку сразу, а не завёл вторую рядом;</li>
          <li>противоречивые заметки — это баг, его чинят.</li>
        </ul>
        <div class="note"><b>Иерархия источников правды</b>Когда источники спорят, побеждает старший: прямое указание человека в задаче, потом код и тесты, потом спецификации (урок 5), потом документация, и только потом заметки памяти. Память лишь подсказывает, где смотреть.</div>
        <details class="more">
          <summary>BM25 и косинусная близость без страха <span class="hint">— для любопытных</span></summary>
          <div class="more-body">
            <p>BM25 для каждого слова запроса считает два множителя и складывает результат по всем словам:</p>
            <ul>
              <li><strong>IDF</strong> (редкость слова): чем в меньшем числе заметок встречается слово, тем оно ценнее. «Doctrine» ценнее, чем «проект».</li>
              <li><strong>TF с насыщением</strong>: второе упоминание слова в заметке добавляет меньше, чем первое, десятое — почти ничего. Длинные заметки слегка штрафуются.</li>
            </ul>
<pre data-lang="text">score(док, запрос) = Σ IDF(слово) · tf·(k+1) / (tf + k·(1 − b + b·длина/средняя_длина))
обычно k ≈ 1.2, b ≈ 0.75

близость(a, b) = (a · b) / (|a| · |b|)   ← косинус угла между векторами смысла, от −1 до 1</pre>
            <p>Эмбеддинги считает отдельная модель. Векторы хранят в базе с поиском ближайших соседей (например, расширение pgvector для Postgres). На старте проекта часто хватает обычного поиска по словам и хорошего оглавления.</p>
          </div>
        </details>
        <details class="more">
          <summary>Простой поиск по заметкам в коде <span class="hint">— JS, TS, PHP, Python</span></summary>
          <div class="more-body">
            <p>Подсчёт совпавших слов без стоп-слов. Не BM25, но для базы из сотни заметок уже полезно.</p>
            <div class="code-tabs">
<pre data-lang="js">import { readdirSync, readFileSync } from "node:fs";

const STOP = new Set(["и", "в", "на", "как", "что", "по", "с", "для", "не"]);
const words = s => s.toLowerCase().match(/[a-zа-яё0-9]+/g)?.filter(w => !STOP.has(w)) ?? [];

function search(dir, query, limit = 3) {
  const q = new Set(words(query));
  return readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map(f => {
      const text = readFileSync(\`\${dir}/\${f}\`, "utf8");
      const score = new Set(words(text).filter(w => q.has(w))).size;
      return { file: f, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

console.log(search("memory", "как выкатить бэкенд на прод"));</pre>
<pre data-lang="ts">import { readdirSync, readFileSync } from "node:fs";

interface Hit { file: string; score: number }

const STOP = new Set(["и", "в", "на", "как", "что", "по", "с", "для", "не"]);
const words = (s: string): string[] =>
  (s.toLowerCase().match(/[a-zа-яё0-9]+/g) ?? []).filter(w => !STOP.has(w));

export function search(dir: string, query: string, limit = 3): Hit[] {
  const q = new Set(words(query));
  return readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map((file): Hit => {
      const text = readFileSync(\`\${dir}/\${file}\`, "utf8");
      return { file, score: new Set(words(text).filter(w => q.has(w))).size };
    })
    .filter(h => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}</pre>
<pre data-lang="php">&lt;?php
const STOP = ['и', 'в', 'на', 'как', 'что', 'по', 'с', 'для', 'не'];

function words(string $s): array
{
    preg_match_all('/[a-zа-яё0-9]+/u', mb_strtolower($s), $m);
    return array_values(array_diff($m[0], STOP));
}

function search(string $dir, string $query, int $limit = 3): array
{
    $q = array_unique(words($query));
    $hits = [];
    foreach (glob($dir . '/*.md') as $file) {
        $score = count(array_intersect($q, array_unique(words(file_get_contents($file)))));
        if ($score > 0) {
            $hits[] = ['file' => basename($file), 'score' => $score];
        }
    }
    usort($hits, fn ($a, $b) => $b['score'] <=> $a['score']);
    return array_slice($hits, 0, $limit);
}

print_r(search(__DIR__ . '/memory', 'как выкатить бэкенд на прод'));</pre>
<pre data-lang="py">import re
from pathlib import Path

STOP = {"и", "в", "на", "как", "что", "по", "с", "для", "не"}

def words(s: str) -> list[str]:
    return [w for w in re.findall(r"[a-zа-яё0-9]+", s.lower()) if w not in STOP]

def search(folder: str, query: str, limit: int = 3) -> list[tuple[str, int]]:
    q = set(words(query))
    hits = []
    for path in Path(folder).glob("*.md"):
        score = len(q & set(words(path.read_text(encoding="utf-8"))))
        if score:
            hits.append((path.name, score))
    return sorted(hits, key=lambda h: -h[1])[:limit]

print(search("memory", "как выкатить бэкенд на прод"))</pre>
            </div>
            <p class="footer-note">Заметьте проблему: «выкатить» не найдёт заметку со словом «выкатка». Окончания разные. Поиск по смыслу или обрезка окончаний (стемминг) это лечат. В интерактиве ниже стоит грубая обрезка.</p>
          </div>
        </details>
      </div>
    </section>

    <!-- ============ 3. ИНТЕРАКТИВ ============ -->
    <section class="step" id="interactive">
      <div class="step-head">
        <span class="step-tag"><b>3</b> Интерактив</span>
        <h2>Память вымышленного проекта Shopik</h2>
        <p>Shopik — бэкенд небольшого интернет-магазина на Symfony. У него есть база из 16 заметок. На ней и поработаем.</p>
      </div>

      <!-- 3.1 Карта знаний -->
      <div class="stand" id="kmap-stand">
        <div class="stand-head"><h3>Карта знаний</h3><span class="badge">интерактив 1 из 4</span></div>
        <p class="task">Нажмите на заметку. Увидите её текст, на кого она ссылается и кто ссылается на неё. Так агент переходит от одной заметки к соседним.</p>
        <div class="legend">
          <span><i style="border-color: var(--hc-warm); background: var(--hc-warm-soft)"></i>выбрана</span>
          <span><i style="border-color: var(--hc-accent); background: var(--hc-accent-soft)"></i>она ссылается</span>
          <span><i style="border-color: var(--hc-ok); background: var(--hc-ok-soft)"></i>ссылаются на неё</span>
        </div>
        <div class="row" role="group" aria-label="Фильтр по типу" id="kmap-filter"></div>
        <div class="kmap" id="kmap"></div>
        <div class="kdetail" id="kmap-detail" aria-live="polite"><span class="task">Выберите заметку.</span></div>
      </div>

      <!-- 3.2 Поиск -->
      <div class="stand" id="search-stand">
        <div class="stand-head"><h3>Поиск и бюджет контекста</h3><span class="badge">интерактив 2 из 4</span></div>
        <p class="task">Введите вопрос. Поиск упрощённый, похож на BM25: редкие слова весят больше. Окончания грубо обрезаются до 5 букв. Ползунок задаёт, сколько токенов мы готовы отдать памяти. Что не влезло — агент не увидит.</p>
        <div class="row" role="group" aria-label="Готовые вопросы">
          <button class="chip-btn" type="button" data-q="как выкатить бэкенд на прод">Как выкатить бэкенд?</button>
          <button class="chip-btn" type="button" data-q="почему сумма возврата отличается на копейку">Возврат на копейку</button>
          <button class="chip-btn" type="button" data-q="как запустить тесты локально">Запуск тестов</button>
          <button class="chip-btn" type="button" data-q="деплой">Синоним: «деплой»</button>
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="search-q">Вопрос агенту</label>
            <input type="text" id="search-q" value="как выкатить бэкенд на прод">
          </div>
          <div class="field">
            <label for="search-budget">Бюджет памяти: <span id="search-budget-val" class="mono">400</span> токенов</label>
            <input type="range" id="search-budget" min="100" max="1500" step="50" value="400">
          </div>
        </div>
        <div class="stats">
          <div><b id="search-in">0</b>заметок в контексте</div>
          <div><b id="search-used">0</b>токенов занято</div>
          <div><b id="search-all">0</b>токенов, если грузить всё</div>
        </div>
        <ul class="hits" id="search-hits" aria-live="polite"></ul>
        <details class="more">
          <summary>Почему «деплой» ничего не нашёл <span class="hint">— откройте после пробы</span></summary>
          <div class="more-body">
            <p>В заметках написано «выкатка» и «make up», слова «деплой» нет. Поиск по словам не знает, что это синонимы. Варианты лечения: добавить синонимы в описание заметки, держать хорошее оглавление, чтобы агент выбирал сам, или включить поиск по смыслу (эмбеддинги).</p>
          </div>
        </details>
      </div>

      <!-- 3.3 Устаревшая заметка -->
      <div class="stand" id="stale">
        <div class="stand-head"><h3>Заметка говорит одно, код — другое</h3><span class="badge">интерактив 3 из 4</span></div>
        <p class="task">Задача агенту: «Добавь поле <code>deliveryDate</code> в ответ <code>GET /api/orders/{id}</code>». Заметка написана полгода назад. Переключите режим и пройдите по шагам.</p>
        <div class="row" role="group" aria-label="Режим агента">
          <button class="chip-btn" type="button" data-mode="check" aria-pressed="true">Агент сверяет с кодом</button>
          <button class="chip-btn" type="button" data-mode="trust" aria-pressed="false">Агент верит заметке</button>
        </div>
        <div class="two-col">
          <div class="pane" id="stale-mem"><h4>Память: orders-serialization.md</h4><pre id="stale-mem-text" class="no-copy"></pre></div>
          <div class="pane" id="stale-code"><h4>Код проекта</h4><pre id="stale-code-text" class="no-copy"></pre></div>
        </div>
        <ol class="story" id="stale-story"></ol>
        <div class="row">
          <button class="btn quiet" type="button" id="stale-prev">← Назад</button>
          <button class="btn" type="button" id="stale-next">Дальше →</button>
          <button class="btn secondary" type="button" id="stale-play">▶ Авто</button>
          <button class="btn quiet" type="button" id="stale-reset">Сначала</button>
          <span class="task" id="stale-label">Шаг 0</span>
        </div>
      </div>

      <!-- 3.4 Стратегии -->
      <div class="stand" id="strat">
        <div class="stand-head"><h3>Всё сразу, оглавление или поиск</h3><span class="badge">интерактив 4 из 4</span></div>
        <p class="task">Пять вопросов агенту по базе Shopik на 60 заметок. Выберите стратегию и посмотрите, сколько токенов она съела и сколько ответов верны. Цифры учебные, но соотношение типичное.</p>
        <div class="row" role="group" aria-label="Стратегия">
          <button class="chip-btn" type="button" data-strat="all" aria-pressed="true">Всё сразу</button>
          <button class="chip-btn" type="button" data-strat="index" aria-pressed="false">Оглавление и подгрузка</button>
          <button class="chip-btn" type="button" data-strat="search" aria-pressed="false">Поиск</button>
        </div>
        <div class="strat-bars" id="strat-bars"></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Вопрос</th><th>Результат</th><th>Почему</th></tr></thead>
            <tbody id="strat-table"></tbody>
          </table>
        </div>
        <p class="task" id="strat-sum" aria-live="polite"></p>
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
        <div class="q" data-q="l5-why">
          <p>Зачем агенту внешняя память, если у модели огромное окно контекста?</p>
          <div class="options">
            <button>Чтобы модель быстрее думала</button>
            <button data-right>Модель ничего не помнит между сессиями, а окно ограничено и дорого: знания надо хранить снаружи и подавать по задаче</button>
            <button>Без памяти модель не умеет писать код</button>
          </div>
          <p class="why">Окно живёт один запрос. Новая сессия начинается с нуля. Память в файлах переживает сессии, а выдача по задаче экономит токены.</p>
        </div>
        <div class="q" data-q="l5-stale">
          <p>Заметка говорит «сериализатор — JMS», а в коде Symfony Serializer. Что должен сделать агент?</p>
          <div class="options">
            <button>Следовать заметке: её написали люди</button>
            <button>Спросить пользователя и ждать ответа</button>
            <button data-right>Делать по коду и сразу исправить заметку, обновив дату</button>
          </div>
          <p class="why">Код — источник правды выше памяти. Расхождение — баг заметки. Его чинят сразу, а не копят вторую заметку рядом.</p>
        </div>
        <div class="q" data-q="l5-all">
          <p>Почему плохо просто склеить все 300 заметок в системный промпт?</p>
          <div class="options">
            <button data-right>Дорого на каждом шаге, важное тонет в шуме, середину длинного текста модель замечает хуже</button>
            <button>Модель откажется читать больше 10 файлов</button>
            <button>Так нельзя по лицензии</button>
          </div>
          <p class="why">Помните урок 1: история отправляется на каждом шаге, и эффект «потерянной середины». Оглавление или поиск дают те же знания за долю токенов.</p>
        </div>
        <div class="q" data-q="l5-emb">
          <p>Что такое эмбеддинг простыми словами?</p>
          <div class="options">
            <button>Сжатая копия текста для архива</button>
            <button data-right>Список чисел — «координаты смысла»: близкие по смыслу тексты получают близкие координаты</button>
            <button>Хэш текста для проверки целостности</button>
          </div>
          <p class="why">Поэтому поиск по эмбеддингам находит «выкатку» по запросу «деплой»: слова разные, смысл рядом.</p>
        </div>
        <div class="q" data-q="l3-kinds" data-multi>
          <p>Что из этого стоит положить в память проекта?</p>
          <div class="options">
            <button data-right>«Деньги храним в копейках, целым числом»</button>
            <button data-right>«Перезапуск воркера руками обрывает очередь»</button>
            <button data-right>Почему очередь сделали на Messenger: контекст, решение, последствия</button>
            <button>Выгрузку таблицы заказов, чтобы агент знал данные</button>
          </div>
          <p class="why">Правило, грабли и решение ADR — короткие знания, которых нет в коде, а ошибиться без них легко. Выгрузка данных — не знание о проекте: она огромная, быстро устаревает и может содержать личные данные клиентов.</p>
        </div>
        <div class="q" data-q="l3-note-shape" data-multi>
          <p>Как устроена хорошая заметка в памяти?</p>
          <div class="options">
            <button data-right>Одна мысль — один небольшой файл</button>
            <button data-right>В начале frontmatter: имя, однострочное описание, тип</button>
            <button data-right>Ссылки на соседние заметки через <code>[[имя]]</code></button>
            <button>Всё о проекте в одном большом файле, чтобы агенту не искать</button>
          </div>
          <p class="why">Маленькую заметку дёшево подложить в контекст и легко обновить. Описание из frontmatter попадает в оглавление — по нему агент решает, открывать ли файл. Ссылки ведут к соседним темам. Один большой файл — это «всё сразу» со всеми его минусами.</p>
        </div>
        <div class="q" data-q="l3-index-desc">
          <p>Агент видит только оглавление INDEX.md. От чего зависит, откроет ли он нужную заметку?</p>
          <div class="options">
            <button data-right>От строки-описания этой заметки в оглавлении</button>
            <button>От длины заметки: длинные открываются первыми</button>
            <button>От даты создания файла</button>
          </div>
          <p class="why">Модель выбирает по тексту, который видит. Строка «deploy-backend — выкатка бэкенда: только make up» сразу говорит, когда она нужна. Строка «заметки про сервер» не говорит ничего.</p>
        </div>
        <div class="q" data-q="l3-budget">
          <p>Поиск отсортировал заметки по очкам: A — 40 токенов, B — 25, C — 10. Бюджет — 50 токенов. Что он возьмёт по правилу из урока?</p>
          <div class="options">
            <button>Только A: дальше места нет</button>
            <button data-right>A и C: B не влезла и пропущена, а C влезла</button>
            <button>A и B: они важнее по очкам</button>
          </div>
          <p class="why">Идём по списку и берём, что влезает. После A осталось 10 токенов. B на 25 не влезает — её пропускаем, но не останавливаемся. C на 10 влезает ровно. Так бюджет используется полностью.</p>
        </div>
        <div class="q" data-q="l3-truth-order" data-multi>
          <p>Источники спорят. Что верно про иерархию правды?</p>
          <div class="options">
            <button data-right>Прямое указание человека в задаче важнее кода</button>
            <button data-right>Код и тесты важнее заметок памяти</button>
            <button>Заметка памяти важнее кода: её писали специально для агента</button>
            <button data-right>Спецификация важнее обычной документации</button>
          </div>
          <p class="why">Порядок такой: человек, код и тесты, спецификации, документация, память. Память — подсказка, где смотреть. Если она спорит с кодом, устарела заметка, а не код.</p>
        </div>
        <div class="q" data-q="l3-synonyms" data-multi>
          <p>Запрос «как выкатить» не нашёл заметку со словом «выкатка». Что поможет?</p>
          <div class="options">
            <button data-right>Поиск по смыслу через эмбеддинги</button>
            <button data-right>Обрезка окончаний слов (стемминг)</button>
            <button>Увеличить бюджет токенов вдвое</button>
            <button>Повторить тот же поиск ещё раз</button>
          </div>
          <p class="why">Поиск по словам сравнивает буквы: «выкатить» и «выкатка» для него разные. Стемминг сводит их к общему началу, эмбеддинги ставят рядом по смыслу. Бюджет и повтор не помогут: заметка просто не попала в найденное.</p>
        </div>
        <div class="q" data-q="l3-bm25">
          <p>Почему простой подсчёт совпавших слов ищет плохо, а BM25 — лучше?</p>
          <div class="options">
            <button data-right>Частые слова вроде «код» есть почти везде, а BM25 даёт больший вес редким словам</button>
            <button>BM25 понимает смысл и находит синонимы</button>
            <button>BM25 читает только заголовки заметок и поэтому быстрее</button>
          </div>
          <p class="why">Слово «Doctrine» говорит о заметке больше, чем слово «проект». BM25 это учитывает и не даёт длинным заметкам выигрывать числом слов. Но он всё ещё сравнивает слова — синонимы находит поиск по смыслу.</p>
        </div>
        <div class="q" data-q="l3-adr-check" data-multi>
          <p>Агент пишет новый ADR. Что harness стоит проверить перед сохранением?</p>
          <div class="options">
            <button data-right>Есть строка «Статус:»</button>
            <button data-right>Есть разделы «Контекст», «Решение» и «Последствия»</button>
            <button data-right>Под каждым разделом есть текст, а не пустой заголовок</button>
            <button>Есть пример кода на четырёх языках</button>
          </div>
          <p class="why">Формат ADR простой, и его легко проверить кодом до записи. Пустое «Решение» хуже, чем никакого: агент потом примет его за принятое решение. Примеры кода в ADR не обязательны — важно, почему так решили.</p>
        </div>
      </div>

      <details class="more">
        <summary>Задание на своём проекте <span class="hint">— 30 минут</span></summary>
        <div class="more-body">
          <ol>
            <li>Создайте в репозитории папку <code>memory/</code> (или <code>docs/agent/</code>).</li>
            <li>Напишите пять заметок с frontmatter: как запустить проект, как запустить тесты, одно правило, одно архитектурное решение в формате ADR, одни грабли из вашей практики.</li>
            <li>Соберите <code>INDEX.md</code>: по строке на заметку, с хорошим описанием. Проверьте: по одной строке понятно, когда открывать заметку?</li>
            <li>Добавьте в файл правил агента три строки: «прочитай INDEX.md», «сверяй заметку с кодом», «нашёл расхождение — исправь заметку».</li>
            <li>Дайте агенту задачу, где пригодится одна из заметок. Посмотрите, открыл ли он её.</li>
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
        <li>Понимаю, зачем агенту внешняя память и почему окна контекста недостаточно.</li>
        <li>Знаю пять видов знаний: правила, решения (ADR), справка, продуктовый контекст, грабли.</li>
        <li>Умею писать заметку: одна мысль, frontmatter, ссылки на соседей.</li>
        <li>Могу сравнить три способа выдачи: всё сразу, оглавление, поиск.</li>
        <li>Понимаю разницу между поиском по словам и по смыслу (эмбеддинги).</li>
        <li>Знаю иерархию правды: человек, код и тесты, спецификации, документация, память.</li>
        <li>Ответил на вопросы урока: заметки, ADR и поиск с бюджетом.</li>
        <li>Знаю, что делать с устаревшей заметкой: исправить сразу и обновить дату.</li>
      </ul>
      <div class="tip done-banner"><b>Урок пройден</b>Теперь у агента есть память, которая не врёт. Дальше подключим агента к вашим системам через MCP и поставим хуки.</div>
    </section>

    <!-- ============ 6. ССЫЛКИ ============ -->
    <section class="step" id="links">
      <div class="step-head">
        <span class="step-tag"><b>6</b> Ссылки</span>
        <h2>Что почитать и где попробовать</h2>
      </div>
      <p class="task">Материалы на русском отмечены зелёной меткой. Все ссылки проверены 18 октября 2026 года.</p>
      <div class="links">
        <div><h3>Почитать</h3><ul><li><a href="https://code.claude.com/docs/ru/memory" target="_blank" rel="noopener">Как Claude запоминает ваш проект</a><span>официально: CLAUDE.md, правила и автопамять, что и когда грузится. <span class="pill ok">рус., офиц.</span></span></li><li><a href="https://habr.com/ru/companies/otus/articles/840412/" target="_blank" rel="noopener">Немного о подходе Architecture Decision Records</a><span>зачем ADR (записи архитектурных решений) и из чего состоит запись. <span class="pill ok">рус.</span></span></li><li><a href="https://adr.github.io/" target="_blank" rel="noopener">Architectural Decision Records (ADRs)</a><span>шаблоны ADR и инструменты для ведения журнала решений. <span class="pill">англ.</span></span></li><li><a href="https://habr.com/ru/articles/1029740/" target="_blank" rel="noopener">Что такое RAG-система? Полный разбор от теории до продакшена</a><span>RAG по частям: чанкинг, эмбеддинги, векторный поиск, генерация. <span class="pill ok">рус.</span></span></li><li><a href="https://habr.com/ru/articles/1072876/" target="_blank" rel="noopener">У Claude Code уже есть такая память. Тогда зачем я держу свою?</a><span>память агента на markdown-файлах вместо RAG: что стоит помнить и почему. <span class="pill ok">рус.</span></span></li></ul></div>
        <div><h3>Песочницы по теме</h3><ul><li><a href="https://chunkviz.up.railway.app/" target="_blank" rel="noopener">ChunkViz</a><span>вставить текст и посмотреть, как разные способы нарезки делят его на чанки для RAG.</span></li><li><a href="https://projector.tensorflow.org/" target="_blank" rel="noopener">Embedding Projector</a><span>увидеть, как слова с похожим смыслом оказываются рядом в векторном пространстве.</span></li><li><a href="https://mermaid.live/" target="_blank" rel="noopener">Mermaid Live Editor</a><span>нарисовать схему для документации текстом, который агент тоже может читать и править.</span></li></ul></div>
        <div><h3>Запустить код из урока</h3><ul><li><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground</a><span>JS и TS из примеров урока: вставить и запустить кнопкой Run.</span></li><li><a href="https://3v4l.org/" target="_blank" rel="noopener">3v4l.org</a><span>PHP-примеры урока на любой версии PHP.</span></li><li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLite</a><span>Python-примеры урока прямо в браузере, без установки.</span></li></ul></div>
      </div>
    </section>
  </main>
</div>
<style>
.hc .lib { display: grid; gap: 0.6rem; }
.hc .lib .flow .node { min-height: 4.2rem; }
.hc .lib-desk { display: flex; flex-wrap: wrap; gap: 0.4rem; min-height: 2rem; align-items: center; font-size: var(--hc-fs-sm); }
.hc .book { background: var(--hc-warm-soft); color: var(--hc-warm); border-radius: 4px; padding: 0.15rem 0.5rem; font: 600 var(--hc-fs-xs) var(--hc-f-mono); }
.hc .kmap { display: grid; grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); gap: 0.5rem; }
.hc .kcard { text-align: left; font: 500 var(--hc-fs-sm)/1.35 var(--hc-f-body); color: var(--hc-ink); background: var(--hc-bg); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.5rem 0.6rem; cursor: pointer; display: grid; gap: 0.3rem; transition: border-color 0.2s, background 0.2s, opacity 0.2s; }
.hc .kcard:hover { border-color: var(--hc-accent); }
.hc .kcard.is-sel { border-color: var(--hc-warm); background: var(--hc-warm-soft); }
.hc .kcard.is-link { border-color: var(--hc-accent); background: var(--hc-accent-soft); }
.hc .kcard.is-back { border-color: var(--hc-ok); background: var(--hc-ok-soft); }
.hc .kmap.has-sel .kcard:not(.is-sel):not(.is-link):not(.is-back) { opacity: 0.45; }
.hc .kdetail { background: var(--hc-bg); border-radius: var(--hc-r-sm); padding: 0.75rem 0.9rem; display: grid; gap: 0.5rem; font-size: var(--hc-fs-sm); }
.hc .kdetail pre { font-size: 0.8rem; }
.hc .legend { display: flex; flex-wrap: wrap; gap: 0.8rem; font-size: var(--hc-fs-xs); color: var(--hc-muted); }
.hc .legend i { display: inline-block; width: 0.8rem; height: 0.8rem; border-radius: 3px; vertical-align: -0.1rem; margin-right: 0.3rem; border: 1.5px solid; }
.hc .hits { list-style: none; padding: 0; display: grid; gap: 0.4rem; }
.hc .hits li { margin: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.2rem 0.75rem; background: var(--hc-bg); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.5rem 0.7rem; font-size: var(--hc-fs-sm); }
.hc .hits li.in { border-color: var(--hc-ok); }
.hc .hits li.out { opacity: 0.6; border-style: dashed; }
.hc .hits .nm { font: 600 var(--hc-fs-sm) var(--hc-f-mono); }
.hc .hits .sn { grid-column: 1 / -1; color: var(--hc-muted); }
.hc .hits mark { background: color-mix(in srgb, var(--hc-warm) 30%, transparent); color: inherit; border-radius: 2px; padding: 0 1px; }
.hc .score { display: flex; gap: 0.4rem; align-items: center; justify-content: flex-end; }
.hc .score .bar { width: 4.5rem; height: 0.55rem; border-radius: 3px; background: var(--hc-surface-2); overflow: hidden; }
.hc .score .bar i { display: block; height: 100%; background: var(--hc-accent); }
.hc .two-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
@media (max-width: 760px) {
.hc .two-col { grid-template-columns: minmax(0, 1fr); }
}
.hc .pane { background: var(--hc-bg); border: 1.5px solid var(--hc-line); border-radius: var(--hc-r-sm); padding: 0.6rem 0.75rem; display: grid; gap: 0.4rem; min-width: 0; transition: border-color 0.3s; }
.hc .pane h4 { font: 600 var(--hc-fs-xs) var(--hc-f-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--hc-muted); }
.hc .pane pre { font-size: 0.78rem; }
.hc .pane.hot { border-color: var(--hc-accent); }
.hc .pane.bad { border-color: var(--hc-bad); }
.hc .pane.ok { border-color: var(--hc-ok); }
.hc .story { list-style: none; padding: 0; display: grid; gap: 0.3rem; font-size: var(--hc-fs-sm); }
.hc .story li { margin: 0; padding: 0.35rem 0.6rem; border-radius: 6px; background: var(--hc-bg); }
.hc .story li.cur { background: var(--hc-accent-soft); font-weight: 600; }
.hc .story li.badline { background: var(--hc-bad-soft); }
.hc .story li.okline { background: var(--hc-ok-soft); }
.hc .strat-bars { display: grid; gap: 0.45rem; }
.hc .sbar { display: grid; grid-template-columns: 9.5rem minmax(0, 1fr) 6.5rem; gap: 0.6rem; align-items: center; font-size: var(--hc-fs-sm); }
.hc .sbar .track { height: 1rem; background: var(--hc-surface-2); border-radius: 4px; overflow: hidden; }
.hc .sbar .track i { display: block; height: 100%; transition: width 0.4s; }
.hc .sbar .val { text-align: right; font: 500 var(--hc-fs-xs) var(--hc-f-mono); font-variant-numeric: tabular-nums; }
@media (max-width: 560px) {
.hc .sbar { grid-template-columns: minmax(0, 1fr) 5.5rem; }
.hc .sbar .track { grid-column: 1 / -1; grid-row: 2; }
}
</style>
`;export{n as default};
