function W(f,j){const{$:t,$$:l,el:i,sleep:O}=f,b=["фундамент","стены","окна","крыша","отделка"],y=[["фундамент",!0],["стены, 3 этажа",!1],["окна на север",!1],["плоская крыша",!1],["отделка ок",!0]];function g(){const e=(n,s)=>{t(n).replaceChildren(i("span",{text:s}),...b.map(r=>i("div",{class:"brick",text:r})))};e("#build-vibe","Без чертежа"),e("#build-spec","По чертежу"),t("#build-note").textContent=""}let v=!1;t("#build-play").addEventListener("click",async()=>{if(v)return;v=!0,g();const e=l("#build-vibe .brick"),n=l("#build-spec .brick");for(let s=0;s<b.length;s++)await O(600),e[s].textContent=y[s][0],e[s].className="brick pop "+(y[s][1]?"ok":"bad"),n[s].textContent=b[s]+" по чертежу",n[s].className="brick pop ok";t("#build-note").textContent="Приёмка: без чертежа 2 из 5 пунктов, по чертежу 5 из 5.",v=!1}),t("#build-reset").addEventListener("click",g),g();const D=["openspec/","├── specs/","│   └── auth/spec.md","└── changes/"],p="add-login-rate-limit",o=[{node:0,file:`changes/${p}/proposal.md`,add:[`    └── ${p}/`,"        ├── proposal.md"],cur:"proposal.md",text:`## Why
Боты перебирают пароли: 12 000 неудачных
входов за неделю.

## What Changes
- Блокировка после 5 неудачных попыток
  на 15 минут, ответ 429.

## Impact
- auth, redis`,say:"Предложение отвечает на «зачем». Его читает человек и соглашается или нет. Кода ещё нет."},{node:1,file:`changes/${p}/specs/auth/spec.md`,add:["        ├── specs/auth/spec.md"],cur:"specs/auth/spec.md",text:`## ADDED Requirements
### Requirement: Ограничение попыток входа
Система SHALL блокировать вход по логину
на 15 минут после 5 неудачных попыток.

#### Scenario: Шестая попытка заблокирована
- **WHEN** 5 неверных паролей подряд
- **THEN** шестая попытка получает 429`,say:"Дельта описывает только то, что меняется в поведении: ADDED, MODIFIED или REMOVED. Основная спецификация пока не тронута."},{node:2,file:`changes/${p}/design.md`,add:["        ├── design.md"],cur:"design.md",text:`## Decisions
- Счётчик в redis: ключ login_fail:{login},
  TTL 15 минут.
- Ключ по логину, не по IP: боты
  меняют IP, логин остаётся.

## Risks
- Злоумышленник может заблокировать
  чужой логин. Принимаем: блок временный.`,say:"Дизайн нужен, когда «как» не очевидно. Здесь зафиксировано спорное решение: считать по логину, а не по IP."},{node:3,file:`changes/${p}/tasks.md`,add:["        └── tasks.md"],cur:"tasks.md",text:`- [ ] 1.1 Счётчик в redis с TTL 15 минут
- [ ] 1.2 Проверка лимита, ответ 429
- [ ] 1.3 Сброс при успешном входе
- [ ] 2.1 Тесты по сценариям
- [ ] 2.2 Проверка на стенде`,say:"Задачи — маленькие шаги с чекбоксами. Агент берёт первую незакрытую. Новая сессия видит, что уже сделано."},{node:4,file:"src/Auth/LoginRateLimiter.php",add:[],cur:"tasks.md",text:`- [x] 1.1 Счётчик в redis с TTL 15 минут
- [x] 1.2 Проверка лимита, ответ 429
- [x] 1.3 Сброс при успешном входе
- [ ] 2.1 Тесты по сценариям
- [ ] 2.2 Проверка на стенде

+ src/Auth/LoginRateLimiter.php
+ src/Controller/LoginController.php (изм.)`,say:"Агент пишет код по задачам и отмечает чекбоксы. Если сессия оборвётся, следующая продолжит с задачи 2.1."},{node:5,file:"tests/Auth/LoginRateLimitTest.php",add:[],cur:"tasks.md",text:`testSixthAttemptIsBlocked ............ OK
testSuccessfulLoginResetsCounter ...... OK

- [x] 2.1 Тесты по сценариям
- [x] 2.2 Проверка на стенде`,say:"Каждый сценарий стал тестом. Зелёные тесты — доказательство, что договор выполнен, а не «вроде работает»."},{node:6,file:"openspec/specs/auth/spec.md",add:[],cur:"auth/spec.md",archived:!0,text:`### Requirement: Вход по паролю
...

### Requirement: Ограничение попыток входа
Система SHALL блокировать вход по логину
на 15 минут после 5 неудачных попыток.
...`,say:"Архив: требование из дельты вошло в основную спецификацию. Папка изменения ушла в архив. specs/ снова описывает систему как она есть."}],I=l("#lc-flow .node");function k(e){I.forEach((s,c)=>{s.classList.toggle("is-active",c===(e>=0?o[e].node:-1)),s.classList.toggle("is-done",e>=0&&c<o[e].node)});const n=D.map(s=>({t:s,cls:""}));if(e>=0){const s=o.slice(0,e+1).flatMap(c=>c.add);o[e].archived?(n[3]={t:"└── changes/archive/2026-10-18-"+p+"/",cls:"gone"},n[2]={t:"│   └── auth/spec.md  (обновлён)",cls:"cur"}):s.forEach(c=>n.push({t:c,cls:o.slice(0,e).flatMap(r=>r.add).includes(c)?"new":"cur"}))}t("#lc-tree").replaceChildren(...n.map(s=>i("li",{class:s.cls,text:s.t}))),t("#lc-fname").textContent=e>=0?o[e].file:"Нажмите «Дальше»",t("#lc-text").textContent=e>=0?o[e].text:"Изменение начинается с вопроса «зачем».",t("#lc-say").textContent=e>=0?o[e].say:""}f.stepper({steps:o.map((e,n)=>()=>k(n)),onReset:()=>k(-1),prev:t("#lc-prev"),next:t("#lc-next"),play:t("#lc-play"),reset:t("#lc-reset"),label:t("#lc-label"),interval:2600});const h=["быстро","удобно","интуитивно","оптимально","корректно","по возможности","и т.д.","достаточно","нормально","надёжно","при необходимости"],A={bad:`Вход должен работать быстро и удобно.
При необходимости блокировать подозрительных пользователей.`,mid:`### Requirement: Лимит входа
Система SHALL блокировать вход после нескольких неудачных попыток.

#### Scenario: Много попыток
- **WHEN** пользователь много раз ошибся
- система корректно реагирует`,good:`### Requirement: Лимит входа
Система SHALL блокировать вход по логину на 15 минут
после 5 неудачных попыток подряд.

#### Scenario: Шестая попытка заблокирована
- **WHEN** пользователь 5 раз подряд ввёл неверный пароль
- **THEN** шестая попытка получает ответ 429`},P=[{code:"NO_MODAL",test:e=>!/\b(SHALL|MUST)\b/.test(e),msg:"Нет SHALL или MUST. Агент не поймёт, обязательно это или пожелание. Пишите «Система SHALL …»."},{code:"VAGUE_WORD",test:e=>h.some(n=>e.toLowerCase().includes(n)),msg:e=>"Размытые слова: "+h.filter(n=>e.toLowerCase().includes(n)).map(n=>"«"+n+"»").join(", ")+". Замените числом или проверяемым результатом."},{code:"NO_NUMBER",warn:!0,test:e=>/SHALL|MUST/.test(e)&&!/\d/.test(e),msg:"Нет ни одного числа. Сколько попыток, какой срок, какой код ответа? Без чисел агент выберет сам."},{code:"NO_SCENARIO",test:e=>!/^#### Scenario:/m.test(e),msg:"Нет сценария «#### Scenario:». Без него требование нельзя проверить тестом."},{code:"NO_THEN",test:e=>/^#### Scenario:/m.test(e)&&!/^\s*(-\s*)?(\*\*)?THEN\b/m.test(e),msg:"В сценарии нет THEN. Непонятно, какой результат ждать."}];function x(){const e=t("#lint-input").value,n=P.filter(a=>a.test(e)),s=t("#lint-preview");s.replaceChildren();const c=new RegExp("("+h.map(a=>a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")","gi");e.split(c).forEach(a=>s.append(h.includes(a.toLowerCase())?i("span",{class:"lint-mark",text:a}):a));const r=n.filter(a=>!a.warn).length,m=n.filter(a=>a.warn).length,u=Math.max(0,100-r*25-m*10);t("#lint-score").textContent=`Качество: ${u} из 100`,t("#lint-meter").style.width=u+"%",t("#lint-meter").style.background=u>=90?"var(--hc-ok)":u>=50?"var(--hc-warn)":"var(--hc-bad)",t("#lint-out").replaceChildren(...n.length?n.map(a=>i("li",{},i("span",{class:"pill "+(a.warn?"warn":"bad"),text:a.code}),i("span",{text:typeof a.msg=="function"?a.msg(e):a.msg}))):[i("li",{},i("span",{class:"pill ok",text:"OK"}),i("span",{text:"Однозначно и проверяемо. Из сценария получится тест."}))])}t("#lint-input").addEventListener("input",x),l("[data-lint]").forEach(e=>e.addEventListener("click",()=>{l("[data-lint]").forEach(n=>n.setAttribute("aria-pressed",String(n===e))),t("#lint-input").value=A[e.dataset.lint],x()})),t("#lint-input").value=A.bad,x();const L=[{name:"Шестая попытка заблокирована",given:[],when:["пользователь 5 раз подряд ввёл неверный пароль"],then:["шестая попытка получает ответ 429"]},{name:"Успешный вход сбрасывает счётчик",given:["у логина 4 неудачные попытки"],when:["пользователь ввёл верный пароль"],then:["счётчик неудачных попыток равен 0","ответ 200"]},{name:"Блокировка снимается через 15 минут",given:["логин заблокирован"],when:["прошло 15 минут"],then:["вход по логину снова доступен"]}],M={php:"PHP · PHPUnit",py:"Python · pytest",js:"JS · node:test",ts:"TS · node:test"},T=e=>({"Шестая попытка заблокирована":"SixthAttemptIsBlocked","Успешный вход сбрасывает счётчик":"SuccessfulLoginResetsCounter","Блокировка снимается через 15 минут":"BlockIsLiftedAfter15Minutes"})[e]||"Scenario",_=e=>T(e).replace(/([a-z0-9])([A-Z])/g,"$1_$2").toLowerCase();function N(e,n){const s=n==="py"?"#":"//",c=[...e.given.map(a=>`${s} GIVEN ${a}`),...e.when.map(a=>`${s} WHEN ${a}`)],r=e.then.map(a=>`${s} THEN ${a}`),m={php:"self::markTestIncomplete('TODO');",py:'pytest.fail("TODO")',js:'assert.fail("TODO");',ts:'assert.fail("TODO");'}[n];if(n==="php")return`<?php
final class LoginRateLimitTest extends WebTestCase
{
    /** Scenario: ${e.name} */
    public function test${T(e.name)}(): void
    {
${[...c,...r].map(a=>"        "+a).join(`
`)}
        ${m}
    }
}
`;if(n==="py")return`import pytest

def test_${_(e.name)}(client):
    """Scenario: ${e.name}"""
${[...c,...r].map(a=>"    "+a).join(`
`)}
    ${m}
`;const u=n==="ts"?"async (): Promise<void> =>":"async () =>";return`import { test } from "node:test";
import assert from "node:assert/strict";

test("Scenario: ${e.name}", ${u} {
${[...c,...r].map(a=>"  "+a).join(`
`)}
  ${m}
});
`}let E=0,S="php";const R=t("#s2t-scen"),H=t("#s2t-lang");L.forEach((e,n)=>{const s=i("button",{class:"chip-btn",type:"button","aria-pressed":String(n===0),text:e.name});s.addEventListener("click",()=>{E=n,l("button",R).forEach(c=>c.setAttribute("aria-pressed",String(c===s))),C()}),R.append(s)}),Object.entries(M).forEach(([e,n])=>{const s=i("button",{class:"chip-btn",type:"button","aria-pressed":String(e==="php"),text:n});s.addEventListener("click",()=>{S=e,l("button",H).forEach(c=>c.setAttribute("aria-pressed",String(c===s))),C()}),H.append(s)});function C(){const e=L[E];t("#s2t-src").textContent=`#### Scenario: ${e.name}
${[...e.given.map((c,r)=>`- **${r?"AND":"GIVEN"}** ${c}`),...e.when.map(c=>`- **WHEN** ${c}`),...e.then.map((c,r)=>`- **${r?"AND":"THEN"}** ${c}`)].join(`
`)}`;const n=t("#s2t-out");n.querySelector(".copy-btn")?.remove(),n.textContent=N(e,S);const s=i("button",{type:"button",class:"copy-btn",text:"Копировать"});s.addEventListener("click",()=>f.copyText(N(L[E],S),s)),n.append(s)}C();const $=[{vibe:["Сделал лимит: 5 попыток, блок на 15 минут, по логину.",!1],spec:["Прочитал spec.md: 5 попыток, 15 минут, по логину. Сделал. Тест зелёный.",!1]},{vibe:["Новая сессия. «Улучшил»: считаю по IP, так надёжнее.",!0],spec:["Новая сессия. Прочитал tasks.md, взял задачу 1.3: сброс при входе.",!1]},{vibe:["Добавил сброс счётчика. Заодно поднял лимит до 10: «5 слишком строго».",!0],spec:["Хотел поднять лимит, но тест сценария упал бы. Оставил 5, предложил изменение в proposal.",!1]},{vibe:["Ответ при блокировке поменял на 403: «так принято».",!0],spec:["Ответ 429, как в сценарии. Тест подтверждает.",!1]},{vibe:["Приёмка: проверяем договорённости из чата недельной давности.",null],spec:["Приёмка: все сценарии из spec.md прошли. Изменение в архив.",null]}];let d=0;function w(){d=0,t("#race-vibe-list").replaceChildren(),t("#race-spec-list").replaceChildren(),t("#race-vibe-final").textContent="",t("#race-spec-final").textContent="",t("#race-vibe").style.borderColor="",t("#race-spec").style.borderColor="",t("#race-label").textContent="Сессия 0 из 5",t("#race-next").disabled=!1}t("#race-next").addEventListener("click",()=>{if(d>=$.length)return;const e=$[d];t("#race-vibe-list").append(i("li",{class:"pop "+(e.vibe[1]?"dev":e.vibe[1]===!1?"keep":""),text:e.vibe[0]})),t("#race-spec-list").append(i("li",{class:"pop "+(e.spec[1]?"dev":e.spec[1]===!1?"keep":""),text:e.spec[0]})),d++,t("#race-label").textContent=`Сессия ${d} из 5`,d===$.length&&(t("#race-vibe-final").textContent="Итог: 1 из 4 договорённостей выполнена. Лимит 10, по IP, ответ 403.",t("#race-spec-final").textContent="Итог: 4 из 4. Отступление остановил тест, а не память агента.",t("#race-vibe").style.borderColor="var(--hc-bad)",t("#race-spec").style.borderColor="var(--hc-ok)",t("#race-next").disabled=!0)}),t("#race-reset").addEventListener("click",w),w()}export{W as default};
