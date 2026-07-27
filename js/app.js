/* ============================================================================
   UI wiring: search + autocomplete, tense selector, conjugation tables.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.Conjugator;
  var VERBS = window.VerbData.VERBS;
  var LIST = window.VerbData.VERB_LIST;
  var RANKED = window.VerbData.COMMON_RANKED || [];

  var COMMON = ['presente', 'imperfetto', 'passatoProssimo', 'futuroSemplice',
                'congPresente', 'condizionale'];

  // ------------------------------ state --------------------------------
  var state = {
    verb: null,                 // current verb object
    selected: new Set(['presente'])
  };

  // ---------------------------- elements -------------------------------
  var $search   = document.getElementById('search');
  var $sugg     = document.getElementById('suggestions');
  var $block    = document.getElementById('searchBlock');
  var $result   = document.getElementById('result');
  var $verbHead = document.getElementById('verbHead');
  var $selector = document.getElementById('tenseSelector');
  var $tables   = document.getElementById('tables');
  var $emptyHint= document.getElementById('emptyHint');
  var $recent   = document.getElementById('recent');
  var $practice = document.getElementById('practice');
  var $ripeti   = document.getElementById('ripetiBtn');

  var activeIndex = -1;
  var currentSuggestions = [];

  // =====================================================================
  //  STRESS RENDERING
  // =====================================================================
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function markStress(text, stress) {
    if (stress < 0 || stress >= text.length) return esc(text);
    return esc(text.slice(0, stress)) +
           '<span class="stress">' + esc(text.charAt(stress)) + '</span>' +
           esc(text.slice(stress + 1));
  }
  function renderForm(form) {
    if (!form) return '';
    if (form.compound) {
      return '<span class="aux">' + markStress(form.aux.text, form.aux.stress) + '</span> ' +
             markStress(form.ppText, form.ppStress);
    }
    var html = markStress(form.text, form.stress);
    if (form.approx) {
      html += '<span class="approx-dot" title="Ударение в основе определено автоматически — проверьте">•</span>';
    }
    return html;
  }

  // =====================================================================
  //  AUTOCOMPLETE
  // =====================================================================
  function isInfinitive(q) { return /^[a-zàèéìòù]+(are|ere|ire)$/.test(q); }

  function detectOrtho(inf) {
    if (/care$/.test(inf)) return 'care';
    if (/gare$/.test(inf)) return 'gare';
    if (/sciare$/.test(inf)) return 'sciare';
    if (/ciare$/.test(inf)) return 'ciare';
    if (/giare$/.test(inf)) return 'giare';
    if (/iare$/.test(inf)) return 'iare';
    return null;
  }
  function buildFallback(inf) {
    var group = inf.slice(-3);
    var v = { inf: inf, tr: '', group: group, aux: 'avere', fallback: true };
    var o = detectOrtho(inf);
    if (o) v.ortho = o;
    return v;
  }

  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    var starts = [], contains = [];
    LIST.forEach(function (item) {
      var i = item.inf.indexOf(q);
      if (i === 0) starts.push(item);
      else if (i > 0) contains.push(item);
    });
    var results = starts.concat(contains).slice(0, 8).map(function (item) {
      return { inf: item.inf, tr: item.tr, fallback: false };
    });
    // Offer a regular-pattern fallback for a valid-looking unknown infinitive.
    if (isInfinitive(q) && !VERBS[q] && !results.some(function (r) { return r.inf === q; })) {
      results.unshift({ inf: q, tr: 'schema regolare', fallback: true });
    }
    return results;
  }

  function renderSuggestions(list) {
    currentSuggestions = list;
    activeIndex = -1;
    if (!list.length) {
      $sugg.hidden = true;
      $search.setAttribute('aria-expanded', 'false');
      return;
    }
    $sugg.innerHTML = list.map(function (r, idx) {
      var cls = 'sugg-item' + (r.fallback ? ' s-fallback' : '');
      return '<li class="' + cls + '" role="option" data-idx="' + idx + '">' +
               '<span class="s-inf">' + esc(r.inf) + '</span>' +
               '<span class="s-tr">' + esc(r.tr || '') + '</span>' +
             '</li>';
    }).join('');
    $sugg.hidden = false;
    $search.setAttribute('aria-expanded', 'true');
  }

  function highlightActive() {
    var items = $sugg.querySelectorAll('li');
    items.forEach(function (li, i) {
      li.classList.toggle('active', i === activeIndex);
    });
    if (activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function chooseSuggestion(idx) {
    var r = currentSuggestions[idx];
    if (!r) return;
    var verb = r.fallback ? buildFallback(r.inf) : VERBS[r.inf];
    selectVerb(verb);
  }

  // =====================================================================
  //  VERB SELECTION + HEADER
  // =====================================================================
  function selectVerb(verb) {
    state.verb = verb;
    $search.value = verb.inf;
    $sugg.hidden = true;
    $search.setAttribute('aria-expanded', 'false');
    $block.classList.add('docked');
    $result.hidden = false;
    recordHistory(verb.inf);
    renderVerbHead();
    renderSelector();
    renderTables();
    $result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Open a verb by infinitive (real one if known, else a regular-schema fallback).
  function openInf(inf) {
    selectVerb(VERBS[inf] || buildFallback(inf));
  }

  var GROUP_LABEL = { are: '1ª · -are', ere: '2ª · -ere', ire: '3ª · -ire', ire_isc: '3ª · -ire (isc)' };

  function renderVerbHead() {
    var v = state.verb;
    var ind = C.indefiniti(v, VERBS);
    var pp = ind.participioPassato, ger = ind.gerundioPresente;
    var trHtml = v.tr ? '<span class="vh-tr">' + esc(v.tr) + '</span>' : '';
    var fallbackTag = v.fallback
      ? '<span class="vh-tr" style="color:var(--accent-2)">auto · schema regolare</span>' : '';
    $verbHead.innerHTML =
      '<span class="vh-inf">' + esc(v.inf) + '</span>' +
      trHtml + fallbackTag +
      '<span class="vh-meta">' +
        '<span><b>gruppo</b> ' + (GROUP_LABEL[v.group] || v.group) + '</span>' +
        '<span><b>aus.</b> ' + esc(v.aux) + '</span>' +
        '<span><b>part.</b> <span class="form">' + markStress(pp.text, pp.stress) + '</span></span>' +
        '<span><b>ger.</b> <span class="form">' + markStress(ger.text, ger.stress) + '</span></span>' +
      '</span>';
  }

  // =====================================================================
  //  TENSE SELECTOR
  // =====================================================================
  function moods() {
    var order = [], byMood = {};
    C.TENSES.forEach(function (t) {
      if (!byMood[t.mood]) { byMood[t.mood] = []; order.push(t.mood); }
      byMood[t.mood].push(t);
    });
    return order.map(function (m) { return { mood: m, tenses: byMood[m] }; });
  }

  function renderSelector() {
    $selector.innerHTML = moods().map(function (g) {
      var chips = g.tenses.map(function (t) {
        var on = state.selected.has(t.key) ? ' on' : '';
        return '<span class="chip' + on + '" data-key="' + t.key + '">' + esc(t.label) + '</span>';
      }).join('');
      return '<div class="mood-group">' +
               '<div class="mood-name" data-mood="' + esc(g.mood) + '">' +
                 '<span>' + esc(g.mood) + '</span><span class="all">tutti</span>' +
               '</div>' +
               '<div class="chip-list">' + chips + '</div>' +
             '</div>';
    }).join('');
  }

  function toggleTense(key) {
    if (state.selected.has(key)) state.selected.delete(key);
    else state.selected.add(key);
    renderSelector();
    renderTables();
  }
  function toggleMood(mood) {
    var group = moods().filter(function (g) { return g.mood === mood; })[0];
    if (!group) return;
    var allOn = group.tenses.every(function (t) { return state.selected.has(t.key); });
    group.tenses.forEach(function (t) {
      if (allOn) state.selected.delete(t.key);
      else state.selected.add(t.key);
    });
    renderSelector();
    renderTables();
  }

  // =====================================================================
  //  TABLES
  // =====================================================================
  function renderTables() {
    var v = state.verb;
    if (!v) return;
    var cards = C.TENSES.filter(function (t) { return state.selected.has(t.key); })
      .map(function (t) { return renderCard(v, t); }).join('');
    $tables.innerHTML = cards;
    $emptyHint.hidden = state.selected.size !== 0;
  }

  function renderCard(v, t) {
    var forms = C.conjugate(v, t.key, VERBS);
    var subjects = t.imperative ? C.IMP_SUBJECTS : C.SUBJECTS;
    var rows;
    if (!forms) {
      rows = '<div class="conj-row none"><span class="subj"></span>' +
             '<span class="form">— niente imperativo</span></div>';
    } else {
      rows = forms.map(function (f, i) {
        return '<div class="conj-row">' +
                 '<span class="subj">' + esc(subjects[i]) + '</span>' +
                 '<span class="form">' + renderForm(f) + '</span>' +
               '</div>';
      }).join('');
    }
    return '<div class="tense-card">' +
             '<h3>' + esc(t.label) +
               '<span class="mood-tag">' + esc(t.mood) + '</span>' +
             '</h3>' + rows +
           '</div>';
  }

  // =====================================================================
  //  LOOKUP HISTORY  (localStorage, per browser)
  // =====================================================================
  var HISTORY_KEY = 'iy_history_v1';
  var HISTORY_MAX = 50;

  function loadHistory() {
    try {
      var arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveHistory(arr) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr)); } catch (e) {}
  }
  function recordHistory(inf) {
    var arr = loadHistory().filter(function (h) { return h.inf !== inf; });
    arr.unshift({ inf: inf, ts: Date.now() });
    if (arr.length > HISTORY_MAX) arr = arr.slice(0, HISTORY_MAX);
    saveHistory(arr);
    renderRecent();
    updateRipetiVisibility();
  }
  function clearHistory() {
    saveHistory([]);
    renderRecent();
    updateRipetiVisibility();
    // If the setup screen is open (no quiz in progress), refresh it so the
    // "Cercati" source reflects the now-empty history; leave a running quiz alone.
    if (practice.active && practice.queue.length === 0) {
      practice.source = 'common';
      renderPracticeSetup();
    }
  }

  function renderRecent() {
    var arr = loadHistory();
    if (!arr.length) { $recent.hidden = true; $recent.innerHTML = ''; return; }
    var chips = arr.slice(0, 14).map(function (h) {
      return '<button class="recent-chip" type="button" data-inf="' + esc(h.inf) + '">' +
               esc(h.inf) + '</button>';
    }).join('');
    $recent.innerHTML =
      '<span class="recent-label">Recenti</span>' +
      '<div class="recent-list">' + chips + '</div>' +
      '<button class="mini recent-clear" id="recentClear" type="button">svuota</button>';
    $recent.hidden = false;
  }

  function updateRipetiVisibility() {
    // Always available: practice works from the common-verb list even with no lookups.
    $ripeti.hidden = false;
  }

  // =====================================================================
  //  PRACTICE / REPETITION MODE
  // =====================================================================
  var practice = {
    active: false,
    source: 'recent',   // 'recent' (looked-up verbs) or 'common' (frequency list)
    selected: new Set(['presente']),
    verbCount: 10,      // how many recent verbs to draw from
    commonCount: 50,    // how many of the most-common verbs, or 'all'
    length: 20,         // session length: a number, or 'all'
    queue: [],
    idx: 0,
    score: 0,
    answered: false
  };

  function stripDia(s) {
    return String(s).toLowerCase()
      .replace(/[àá]/g, 'a').replace(/[èé]/g, 'e').replace(/[ìí]/g, 'i')
      .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u')
      .replace(/[’']/g, "'")
      .replace(/\s+/g, ' ').trim();
  }
  // Split "andato/a" -> ["andato","andata"]; "andati/e" -> ["andati","andate"].
  function ppVariants(ppText) {
    var slash = ppText.indexOf('/');
    if (slash === -1) return [ppText];
    var base = ppText.slice(0, slash);
    var altV = ppText.slice(slash + 1);           // 'a' or 'e'
    return [base, base.slice(0, -1) + altV];
  }
  function acceptableAnswers(form) {
    if (!form.compound) return [stripDia(form.text)];
    var aux = form.aux.text;
    return ppVariants(form.ppText).map(function (pp) { return stripDia(aux + ' ' + pp); });
  }
  function isCorrect(userText, form) {
    return acceptableAnswers(form).indexOf(stripDia(userText)) !== -1;
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function practicePool() {
    if (practice.source === 'common') {
      var n = practice.commonCount === 'all' ? RANKED.length : practice.commonCount;
      return RANKED.slice(0, n).map(function (inf) { return VERBS[inf] || buildFallback(inf); });
    }
    return loadHistory().slice(0, practice.verbCount).map(function (h) {
      return VERBS[h.inf] || buildFallback(h.inf);
    });
  }

  function buildQueue() {
    var pool = practicePool();
    var tenses = C.TENSES.filter(function (t) { return practice.selected.has(t.key); });
    var q = [];
    pool.forEach(function (v) {
      tenses.forEach(function (t) {
        var forms = C.conjugate(v, t.key, VERBS);
        if (!forms) return;   // e.g. defective imperative
        var subjects = t.imperative ? C.IMP_SUBJECTS : C.SUBJECTS;
        forms.forEach(function (f, i) {
          q.push({ inf: v.inf, label: t.label, mood: t.mood, subject: subjects[i], form: f });
        });
      });
    });
    shuffle(q);
    if (practice.length !== 'all' && q.length > practice.length) q = q.slice(0, practice.length);
    return q;
  }

  function openPractice() {
    practice.active = true;
    // With no lookups yet, start from the common-verb list.
    if (!loadHistory().length) practice.source = 'common';
    $practice.hidden = false;
    renderPracticeSetup();
    $practice.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function closePractice() {
    practice.active = false;
    practice.queue = [];
    $practice.hidden = true;
    $practice.innerHTML = '';
  }

  function prHead(extra) {
    return '<div class="pr-head">' +
             '<h2 class="pr-title">Ripetizione</h2>' +
             (extra || '') +
             '<button class="mini" id="prClose" type="button">chiudi</button>' +
           '</div>';
  }

  function renderPracticeSetup() {
    practice.queue = [];   // on the setup screen there is no quiz in progress
    var histLen = loadHistory().length;

    // source: looked-up verbs vs the frequency list
    var recentOn = practice.source === 'recent' ? ' on' : '';
    var commonOn = practice.source === 'common' ? ' on' : '';
    var recentDisabled = histLen === 0 ? ' disabled' : '';
    var sourceChips =
      '<button class="chip pr-source' + recentOn + '" type="button" data-source="recent"' + recentDisabled + '>' +
        'Cercati' + (histLen ? ' <span class="pr-dim">(' + histLen + ')</span>' : '') + '</button>' +
      '<button class="chip pr-source' + commonOn + '" type="button" data-source="common">Più comuni</button>';

    // count row — depends on the chosen source
    var countLabel, countChips;
    if (practice.source === 'common') {
      countLabel = 'Quanti';
      countChips = [50, 100, 'all'].map(function (n) {
        var on = practice.commonCount === n ? ' on' : '';
        var label = n === 'all' ? 'tutti ' + RANKED.length : 'primi ' + n;
        return '<button class="chip pr-common-count' + on + '" type="button" data-count="' + n + '">' + label + '</button>';
      }).join('');
    } else {
      countLabel = 'Verbi';
      countChips = [5, 10, 20].map(function (n) {
        var on = practice.verbCount === n ? ' on' : '';
        var avail = Math.min(n, histLen);
        return '<button class="chip pr-count' + on + '" type="button" data-count="' + n + '">ultimi ' + n +
               (avail < n ? ' <span class="pr-dim">(' + avail + ')</span>' : '') + '</button>';
      }).join('');
    }

    var lenChips = [20, 'all'].map(function (n) {
      var on = practice.length === n ? ' on' : '';
      return '<button class="chip pr-len' + on + '" type="button" data-len="' + n + '">' +
             (n === 'all' ? 'tutte' : n + ' domande') + '</button>';
    }).join('');

    var tenseGroups = moods().map(function (g) {
      var chips = g.tenses.map(function (t) {
        var on = practice.selected.has(t.key) ? ' on' : '';
        return '<button class="chip pr-tense' + on + '" type="button" data-key="' + t.key + '">' +
                 esc(t.label) + '</button>';
      }).join('');
      return '<div class="pr-mood"><span class="pr-mood-name">' + esc(g.mood) + '</span>' +
             '<div class="chip-list">' + chips + '</div></div>';
    }).join('');

    var canStart = practice.selected.size > 0 &&
                   (practice.source === 'common' || histLen > 0);
    var note = '';
    if (practice.source === 'recent' && histLen === 0) note = 'Non hai ancora cercato verbi — prova “Più comuni”.';
    else if (practice.selected.size === 0) note = 'Scegli almeno un tempo.';

    $practice.innerHTML = prHead() +
      '<div class="pr-setup">' +
        '<div class="pr-field"><span class="pr-field-label">Verbi da ripassare</span>' +
          '<div class="chip-list">' + sourceChips + '</div></div>' +
        '<div class="pr-field"><span class="pr-field-label">' + countLabel + '</span>' +
          '<div class="chip-list">' + countChips + '</div></div>' +
        '<div class="pr-field"><span class="pr-field-label">Lunghezza</span>' +
          '<div class="chip-list">' + lenChips + '</div></div>' +
        '<div class="pr-field"><span class="pr-field-label">Tempi</span>' +
          '<div class="pr-tenses">' + tenseGroups + '</div></div>' +
        '<button class="pr-start" id="prStart" type="button"' + (canStart ? '' : ' disabled') + '>Inizia →</button>' +
        (note ? '<p class="pr-note">' + esc(note) + '</p>' : '') +
      '</div>';
  }

  function startPractice() {
    practice.queue = buildQueue();
    practice.idx = 0;
    practice.score = 0;
    practice.answered = false;
    if (!practice.queue.length) { renderPracticeSetup(); return; }
    renderQuestion();
  }

  function renderQuestion() {
    var total = practice.queue.length;
    var q = practice.queue[practice.idx];
    var progress = '<span class="pr-progress">' + (practice.idx + 1) + ' / ' + total +
                   ' · <b>' + practice.score + '</b> ✓</span>';
    $practice.innerHTML = prHead(progress) +
      '<div class="pr-quiz">' +
        '<div class="pr-prompt">' +
          '<span class="pr-inf">' + esc(q.inf) + '</span>' +
          '<span class="pr-cue">' + esc(q.subject) + ' · ' + esc(q.label) +
            ' <span class="pr-mood-tag">' + esc(q.mood) + '</span></span>' +
        '</div>' +
        '<form class="pr-answer" id="prForm" autocomplete="off">' +
          '<input class="pr-input" id="prInput" type="text" autocomplete="off" ' +
            'autocapitalize="off" autocorrect="off" spellcheck="false" ' +
            'placeholder="scrivi la forma…" aria-label="La tua risposta" />' +
          '<button class="pr-check" id="prCheck" type="submit">Verifica</button>' +
        '</form>' +
        '<div class="pr-feedback" id="prFeedback"></div>' +
      '</div>';
    var inp = document.getElementById('prInput');
    if (inp) inp.focus();
  }

  function submitAnswer() {
    if (practice.answered) return;
    var inp = document.getElementById('prInput');
    if (!inp) return;
    var val = inp.value.trim();
    if (!val) return;
    practice.answered = true;
    var q = practice.queue[practice.idx];
    var ok = isCorrect(val, q.form);
    if (ok) practice.score++;

    inp.classList.add(ok ? 'ok' : 'no');
    inp.disabled = true;
    document.getElementById('prCheck').disabled = true;

    var last = practice.idx === practice.queue.length - 1;
    var fb = document.getElementById('prFeedback');
    fb.innerHTML =
      '<div class="pr-verdict ' + (ok ? 'ok' : 'no') + '">' +
        (ok ? '✓ Giusto!' : '✗ Non proprio') +
      '</div>' +
      '<div class="pr-correct"><span class="pr-correct-label">Forma corretta</span>' +
        '<span class="pr-correct-form">' + renderForm(q.form) + '</span></div>' +
      '<button class="pr-next" id="prNext" type="button">' +
        (last ? 'Risultato →' : 'Avanti →') + '</button>';
    var nb = document.getElementById('prNext');
    if (nb) nb.focus();
  }

  function nextQuestion() {
    if (practice.idx >= practice.queue.length - 1) { renderSummary(); return; }
    practice.idx++;
    practice.answered = false;
    renderQuestion();
  }

  function renderSummary() {
    var total = practice.queue.length;
    var pct = total ? Math.round((practice.score / total) * 100) : 0;
    var msg = pct >= 90 ? 'Bravissimo!' : pct >= 70 ? 'Bel lavoro.' :
              pct >= 50 ? 'Continua così.' : 'Da ripassare.';
    $practice.innerHTML = prHead() +
      '<div class="pr-summary">' +
        '<div class="pr-score-big">' + practice.score + ' / ' + total + '</div>' +
        '<div class="pr-score-pct">' + pct + '% · ' + msg + '</div>' +
        '<div class="pr-summary-actions">' +
          '<button class="pr-start" id="prAgain" type="button">Ancora →</button>' +
          '<button class="mini" id="prBackSetup" type="button">cambia impostazioni</button>' +
        '</div>' +
      '</div>';
  }

  // =====================================================================
  //  EVENTS
  // =====================================================================
  $search.addEventListener('input', function () {
    renderSuggestions(search($search.value));
  });
  $search.addEventListener('focus', function () {
    if ($search.value.trim()) renderSuggestions(search($search.value));
  });
  $search.addEventListener('keydown', function (e) {
    if ($sugg.hidden) {
      if (e.key === 'ArrowDown') { renderSuggestions(search($search.value)); return; }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, currentSuggestions.length - 1);
      highlightActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      highlightActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      chooseSuggestion(activeIndex >= 0 ? activeIndex : 0);
    } else if (e.key === 'Escape') {
      $sugg.hidden = true;
    }
  });

  $sugg.addEventListener('click', function (e) {
    var li = e.target.closest('li[data-idx]');
    if (li) chooseSuggestion(parseInt(li.getAttribute('data-idx'), 10));
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-shell')) $sugg.hidden = true;
  });

  $selector.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (chip) { toggleTense(chip.getAttribute('data-key')); return; }
    var mood = e.target.closest('.mood-name');
    if (mood) toggleMood(mood.getAttribute('data-mood'));
  });

  document.getElementById('selNone').addEventListener('click', function () {
    state.selected.clear();
    renderSelector(); renderTables();
  });
  document.getElementById('selCommon').addEventListener('click', function () {
    state.selected = new Set(COMMON);
    renderSelector(); renderTables();
  });

  // ------- recent lookups -------
  $recent.addEventListener('click', function (e) {
    var chip = e.target.closest('.recent-chip');
    if (chip) { openInf(chip.getAttribute('data-inf')); return; }
    if (e.target.closest('#recentClear')) clearHistory();
  });

  // ------- practice mode -------
  $ripeti.addEventListener('click', openPractice);

  $practice.addEventListener('click', function (e) {
    if (e.target.closest('#prClose')) { closePractice(); return; }
    if (e.target.closest('#prStart') || e.target.closest('#prAgain')) { startPractice(); return; }
    if (e.target.closest('#prBackSetup')) { renderPracticeSetup(); return; }
    if (e.target.closest('#prNext')) { nextQuestion(); return; }

    var src = e.target.closest('.pr-source');
    if (src) { practice.source = src.getAttribute('data-source'); renderPracticeSetup(); return; }
    var cnt = e.target.closest('.pr-count');
    if (cnt) { practice.verbCount = parseInt(cnt.getAttribute('data-count'), 10); renderPracticeSetup(); return; }
    var ccnt = e.target.closest('.pr-common-count');
    if (ccnt) {
      var cv = ccnt.getAttribute('data-count');
      practice.commonCount = (cv === 'all') ? 'all' : parseInt(cv, 10);
      renderPracticeSetup(); return;
    }
    var len = e.target.closest('.pr-len');
    if (len) {
      var v = len.getAttribute('data-len');
      practice.length = (v === 'all') ? 'all' : parseInt(v, 10);
      renderPracticeSetup(); return;
    }
    var tn = e.target.closest('.pr-tense');
    if (tn) {
      var key = tn.getAttribute('data-key');
      if (practice.selected.has(key)) practice.selected.delete(key);
      else practice.selected.add(key);
      renderPracticeSetup(); return;
    }
  });

  $practice.addEventListener('submit', function (e) {
    if (e.target.id === 'prForm') { e.preventDefault(); submitAnswer(); }
  });
  // Enter submits the answer, then Enter again advances to the next question.
  $practice.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'prInput') { e.preventDefault(); submitAnswer(); }
  });

  // ------- init -------
  renderRecent();
  updateRipetiVisibility();

  // focus search on load
  $search.focus();
})();
