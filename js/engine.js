/* ============================================================================
   Italian Verb Conjugation Engine
   ----------------------------------------------------------------------------
   Produces conjugated forms with the stressed vowel marked.

   A "form" is an object: { text: 'parlo', stress: 0, approx: false }
     - stress : index (into `text`) of the stressed vowel, or -1 if unknown
     - approx : true when the stem stress was guessed by heuristic

   Stress-marking convention used inside ending / stem templates:
     - exactly ONE uppercase Latin vowel [AEIOU] marks the stressed vowel
     - a lowercase accented vowel (à è é ì ò ù ...) is inherently stressed
   ========================================================================== */

(function (global) {
  'use strict';

  var SUBJECTS = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];
  var IMP_SUBJECTS = ['(tu)', '(Lei)', '(noi)', '(voi)', '(Loro)'];

  var VOWELS = 'aeiouàèéìíòóùúAEIOU';
  var ACCENTED = 'àèéìíòóùú';

  function isVowel(ch) { return VOWELS.indexOf(ch) !== -1; }
  function isUpperVowel(ch) { return 'AEIOU'.indexOf(ch) !== -1; }
  function isAccented(ch) { return ACCENTED.indexOf(ch) !== -1; }

  // Strip a marker/accent to its base lowercase letter, for orthographic checks.
  function baseLetter(ch) {
    var map = {
      'à': 'a', 'á': 'a', 'è': 'e', 'é': 'e', 'ì': 'i', 'í': 'i',
      'ò': 'o', 'ó': 'o', 'ù': 'u', 'ú': 'u'
    };
    ch = ch.toLowerCase();
    return map[ch] || ch;
  }

  /* Combine a stem and an ending into a finished form, resolving:
       - orthographic rules (-care/-gare -> h ; -ciare/-giare/-sciare -> drop i)
       - stress position (from an uppercase vowel or an accent)
     `ortho` is one of: undefined,'care','gare','ciare','giare','sciare'
     Returns { text, stress }.                                                */
  function combine(stem, ending, ortho) {
    var s = stem;

    // first meaningful letter of the ending (base, lowercased)
    var firstBase = ending.length ? baseLetter(ending.charAt(0)) : '';
    var frontVowel = (firstBase === 'e' || firstBase === 'i');

    if (frontVowel) {
      if (ortho === 'care' || ortho === 'gare') {
        // cerc + i -> cerch + i ;  pag + er -> pagh + er
        s = s + 'h';
      } else if (ortho === 'ciare' || ortho === 'giare' || ortho === 'sciare') {
        // orthographic i, dropped before BOTH e and i:
        // mangi + er -> mang + er ;  mangi + i -> mang + i
        if (s.charAt(s.length - 1) === 'i') s = s.slice(0, -1);
      } else if (ortho === 'iare') {
        // pronounced i, dropped only before another i:
        // studi + i -> studi ;  studi + er -> studier (kept)
        if (firstBase === 'i' && s.charAt(s.length - 1) === 'i') s = s.slice(0, -1);
      }
    }

    var combined = s + ending;

    // Resolve stress: prefer an explicit uppercase-vowel marker.
    var stress = -1;
    var out = '';
    var i, ch;
    for (i = 0; i < combined.length; i++) {
      ch = combined.charAt(i);
      if (stress === -1 && isUpperVowel(ch)) {
        stress = out.length;
        out += ch.toLowerCase();
      } else {
        out += ch;
      }
    }
    if (stress === -1) {
      // fall back to a lowercase accented vowel
      for (i = 0; i < out.length; i++) {
        if (isAccented(out.charAt(i))) { stress = i; break; }
      }
    }
    return { text: out, stress: stress };
  }

  /* Given a plain (lowercase) stem, produce a stress-marked stem for the
     stem-stressed present-type forms. Heuristic: stress the LAST stem vowel.
     Correct for the majority (parlo, lavóro, crédo, dórmo); wrong for
     sdrucciole verbs (àbito, telèfono) which must supply `sstem` in data.   */
  function guessStressedStem(stem) {
    var idx = -1;
    for (var i = 0; i < stem.length; i++) {
      if (isVowel(stem.charAt(i))) idx = i;
    }
    if (idx === -1) return { marked: stem, approx: true };
    var marked = stem.slice(0, idx) + stem.charAt(idx).toUpperCase() + stem.slice(idx + 1);
    return { marked: marked, approx: true };
  }

  /* -------------------- ending tables (regular verbs) -------------------- */
  // Uppercase vowel = stressed. Empty stress in ending => stem-stressed form.
  var END = {
    are: {
      presente:      ['o', 'i', 'a', 'iAmo', 'Ate', 'ano'],          // stem-stressed io/tu/lui/loro
      imperfetto:    ['Avo', 'Avi', 'Ava', 'avAmo', 'avAte', 'Avano'],
      passatoRemoto: ['Ai', 'Asti', 'ò', 'Ammo', 'Aste', 'Arono'],
      congPresente:  ['i', 'i', 'i', 'iAmo', 'iAte', 'ino'],         // stem-stressed
      congImperfetto:['Assi', 'Assi', 'Asse', 'Assimo', 'Aste', 'Assero'],
      imperativo:    ['a', 'i', 'iAmo', 'Ate', 'ino']                // tu Lei noi voi Loro
    },
    ere: {
      presente:      ['o', 'i', 'e', 'iAmo', 'Ete', 'ono'],
      imperfetto:    ['Evo', 'Evi', 'Eva', 'evAmo', 'evAte', 'Evano'],
      passatoRemoto: ['Ei', 'Esti', 'é', 'Emmo', 'Este', 'Erono'],
      congPresente:  ['a', 'a', 'a', 'iAmo', 'iAte', 'ano'],
      congImperfetto:['Essi', 'Essi', 'Esse', 'Essimo', 'Este', 'Essero'],
      imperativo:    ['i', 'a', 'iAmo', 'Ete', 'ano']
    },
    ire: {
      presente:      ['o', 'i', 'e', 'iAmo', 'Ite', 'ono'],
      imperfetto:    ['Ivo', 'Ivi', 'Iva', 'ivAmo', 'ivAte', 'Ivano'],
      passatoRemoto: ['Ii', 'Isti', 'ì', 'Immo', 'Iste', 'Irono'],
      congPresente:  ['a', 'a', 'a', 'iAmo', 'iAte', 'ano'],
      congImperfetto:['Issi', 'Issi', 'Isse', 'Issimo', 'Iste', 'Issero'],
      imperativo:    ['i', 'a', 'iAmo', 'Ite', 'ano']
    },
    ire_isc: {
      presente:      ['Isco', 'Isci', 'Isce', 'iAmo', 'Ite', 'Iscono'],  // ending-stressed
      imperfetto:    ['Ivo', 'Ivi', 'Iva', 'ivAmo', 'ivAte', 'Ivano'],
      passatoRemoto: ['Ii', 'Isti', 'ì', 'Immo', 'Iste', 'Irono'],
      congPresente:  ['Isca', 'Isca', 'Isca', 'iAmo', 'iAte', 'Iscano'],
      congImperfetto:['Issi', 'Issi', 'Isse', 'Issimo', 'Iste', 'Issero'],
      imperativo:    ['Isci', 'Isca', 'iAmo', 'Ite', 'Iscano']
    }
  };

  // Future / conditional endings (attached to the future stem, e.g. "parler").
  var FUT_END  = ['ò', 'Ai', 'à', 'Emo', 'Ete', 'Anno'];
  var COND_END = ['Ei', 'Esti', 'Ebbe', 'Emmo', 'Este', 'Ebbero'];

  // Which present-type forms are stem-stressed (need a stressed stem).
  var STEM_STRESSED = {
    presente:     [true, true, true, false, false, true],   // io tu lui noi voi loro
    congPresente: [true, true, true, false, false, true],
    imperativo:   [true, true, false, false, true]          // tu Lei noi voi Loro (are/ere/ire)
  };

  /* ------------------------- helpers per verb --------------------------- */

  function endingGroup(v) { return v.group === 'ire_isc' ? 'ire_isc' : v.group; }

  // plain stem = infinitive minus last 3 letters (are/ere/ire)
  function plainStem(v) {
    return v.stem != null ? v.stem : v.inf.slice(0, -3);
  }

  // stress-marked stem for present-type forms
  function stressedStem(v) {
    if (v.sstem) return { marked: v.sstem, approx: false };
    return guessStressedStem(plainStem(v));
  }

  // future/conditional stem (marked-free; endings carry the stress)
  function futureStem(v) {
    if (v.futuroStem) return v.futuroStem;
    var stem = plainStem(v);
    var connector = (v.group === 'ire' || v.group === 'ire_isc') ? 'ir' : 'er';
    return combine(stem, connector, v.ortho).text;
  }

  /* -------------------- simple (single-word) tenses --------------------- */
  // tenseKey: presente, imperfetto, passatoRemoto, futuroSemplice,
  //           congPresente, congImperfetto, condizionale, imperativo
  function conjugateSimple(v, tenseKey) {
    // Irregular explicit override wins.
    if (v[tenseKey]) return normalizeOverride(v[tenseKey], v, tenseKey);

    var grp = endingGroup(v);
    var out = [];
    var i;

    if (tenseKey === 'futuroSemplice' || tenseKey === 'condizionale') {
      var fstem = futureStem(v);
      var ends = tenseKey === 'futuroSemplice' ? FUT_END : COND_END;
      for (i = 0; i < 6; i++) {
        var r = combine(fstem, ends[i]);
        out.push({ text: r.text, stress: r.stress, approx: false });
      }
      return out;
    }

    // imperfetto for fare/dire/bere style verbs via imperfStem (+ere endings)
    if ((tenseKey === 'imperfetto' || tenseKey === 'congImperfetto') && v.imperfStem) {
      var iends = END.ere[tenseKey === 'imperfetto' ? 'imperfetto' : 'congImperfetto'];
      for (i = 0; i < 6; i++) {
        var ri = combine(v.imperfStem, iends[i]);
        out.push({ text: ri.text, stress: ri.stress, approx: false });
      }
      return out;
    }

    var endings = END[grp][tenseKey];
    // isc verbs (finisco) are ending-stressed even in present-type forms.
    var stemStressMask = (grp === 'ire_isc') ? null : STEM_STRESSED[tenseKey];
    var pstem = plainStem(v);
    var sstem = null;

    for (i = 0; i < endings.length; i++) {
      var useStemStress = stemStressMask && stemStressMask[i];
      var stemToUse, approx = false;
      if (useStemStress) {
        if (!sstem) sstem = stressedStem(v);
        stemToUse = sstem.marked;
        approx = sstem.approx;
      } else {
        stemToUse = pstem;
      }
      var res = combine(stemToUse, endings[i], v.ortho);
      out.push({ text: res.text, stress: res.stress, approx: approx });
    }
    return out;
  }

  // Turn a raw string[] override (marked) into form objects.
  function normalizeOverride(arr, v, tenseKey) {
    return arr.map(function (marked) {
      var r = combine(marked, '');
      return { text: r.text, stress: r.stress, approx: false };
    });
  }

  /* --------------------------- participle ------------------------------- */
  function participle(v) {
    if (v.pp) { var r = combine(v.pp, ''); return { text: r.text, stress: r.stress }; }
    var stem = plainStem(v);
    var suf = v.group === 'are' ? 'Ato' : (v.group === 'ere' ? 'Uto' : 'Ito');
    var res = combine(stem, suf, v.ortho);
    return { text: res.text, stress: res.stress };
  }

  function gerund(v) {
    if (v.gerundio) { var r = combine(v.gerundio, ''); return { text: r.text, stress: r.stress }; }
    var stem = v.imperfStem || plainStem(v);
    var suf = v.group === 'are' ? 'Ando' : 'Endo';
    var res = combine(stem, suf, v.imperfStem ? undefined : v.ortho);
    return { text: res.text, stress: res.stress };
  }

  /* --------------------------- compound tenses -------------------------- */
  // Mapping from compound tense -> the aux's simple tense.
  var COMPOUND_AUX = {
    passatoProssimo:   'presente',
    trapassatoProssimo:'imperfetto',
    trapassatoRemoto:  'passatoRemoto',
    futuroAnteriore:   'futuroSemplice',
    congPassato:       'congPresente',
    congTrapassato:    'congImperfetto',
    condPassato:       'condizionale'
  };

  // Agreement forms of a participle whose marked base ends in 'o'.
  function participleAgree(pp, number, applyAgreement) {
    // pp: {text, stress}. Returns display text (with /a, /i, /e when essere).
    if (!applyAgreement) return pp.text;
    if (pp.text.slice(-1) !== 'o') return pp.text; // irregular non -o: leave as is
    if (number === 'sing') return pp.text + '/a';
    return pp.text.slice(0, -1) + 'i/e';
  }

  function getAux(v, dict) {
    var name = v.aux || 'avere';
    return dict[name];
  }

  function conjugateCompound(v, compoundKey, dict) {
    var aux = getAux(v, dict);
    var auxTense = COMPOUND_AUX[compoundKey];
    var auxForms = conjugateSimple(aux, auxTense);
    var pp = participle(v);
    var essere = (v.aux === 'essere');
    var out = [];
    for (var i = 0; i < 6; i++) {
      var number = (i === 3 || i === 4 || i === 5) ? 'plur' : 'sing';
      var ppText = participleAgree(pp, number, essere);
      var a = auxForms[i];
      out.push({
        aux: a,               // {text, stress, approx}
        ppText: ppText,
        ppStress: pp.stress,  // stress index within the participle word
        compound: true
      });
    }
    return out;
  }

  /* --------------------------- public API ------------------------------- */
  // Full tense catalogue, grouped by mood.
  var TENSES = [
    { mood: 'Indicativo', key: 'presente',           label: 'Presente' },
    { mood: 'Indicativo', key: 'imperfetto',         label: 'Imperfetto' },
    { mood: 'Indicativo', key: 'passatoProssimo',    label: 'Passato prossimo', compound: true },
    { mood: 'Indicativo', key: 'trapassatoProssimo', label: 'Trapassato prossimo', compound: true },
    { mood: 'Indicativo', key: 'passatoRemoto',      label: 'Passato remoto' },
    { mood: 'Indicativo', key: 'trapassatoRemoto',   label: 'Trapassato remoto', compound: true },
    { mood: 'Indicativo', key: 'futuroSemplice',     label: 'Futuro semplice' },
    { mood: 'Indicativo', key: 'futuroAnteriore',    label: 'Futuro anteriore', compound: true },

    { mood: 'Congiuntivo', key: 'congPresente',   label: 'Presente' },
    { mood: 'Congiuntivo', key: 'congPassato',    label: 'Passato', compound: true },
    { mood: 'Congiuntivo', key: 'congImperfetto', label: 'Imperfetto' },
    { mood: 'Congiuntivo', key: 'congTrapassato', label: 'Trapassato', compound: true },

    { mood: 'Condizionale', key: 'condizionale', label: 'Presente' },
    { mood: 'Condizionale', key: 'condPassato',  label: 'Passato', compound: true },

    { mood: 'Imperativo', key: 'imperativo', label: 'Presente', imperative: true }
  ];

  function conjugate(v, tenseKey, dict) {
    // Defective verbs (potere/volere/dovere) have no real imperative.
    if (tenseKey === 'imperativo' && v.defectiveImperative) return null;
    if (COMPOUND_AUX[tenseKey]) return conjugateCompound(v, tenseKey, dict);
    return conjugateSimple(v, tenseKey);
  }

  // Modi indefiniti (non-finite) for the header card.
  function indefiniti(v, dict) {
    var aux = getAux(v, dict);
    var pp = participle(v);
    var ger = gerund(v);
    var infPast = conjugateSimple(aux, 'presente'); // not used; keep simple
    return {
      infinitoPresente: { text: v.inf, stress: -1 },
      participioPassato: pp,
      gerundioPresente: ger
    };
  }

  global.Conjugator = {
    SUBJECTS: SUBJECTS,
    IMP_SUBJECTS: IMP_SUBJECTS,
    TENSES: TENSES,
    conjugate: conjugate,
    participle: participle,
    gerund: gerund,
    indefiniti: indefiniti,
    isCompound: function (k) { return !!COMPOUND_AUX[k]; }
  };
})(typeof window !== 'undefined' ? window : this);
