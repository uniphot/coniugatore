/* ============================================================================
   UI wiring: search + autocomplete, tense selector, conjugation tables.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.Conjugator;
  var VERBS = window.VerbData.VERBS;
  var LIST = window.VerbData.VERB_LIST;

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
    renderVerbHead();
    renderSelector();
    renderTables();
    $result.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // focus search on load
  $search.focus();
})();
