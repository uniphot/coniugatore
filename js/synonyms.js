/* ============================================================================
   Synonyms by CEFR level.
   ----------------------------------------------------------------------------
   Shape:  headword: [ownLevel, [[synonym, level], ...]]

   Levels (A1…C2) are pedagogical estimates — there is no single official CEFR
   word list for Italian — so treat them as "roughly how advanced this word is",
   which is exactly what a learner needs to pick the right register.

   Only synonyms that exist in VERBS are kept, so every one is clickable and
   conjugable. Reflexive-only synonyms (-si) are deliberately excluded.
   ========================================================================== */

(function (global) {
  'use strict';

  var RAW = {
    // ---------- core A1 verbs ----------
    'parlare':    ['A1', [['chiacchierare', 'B1'], ['conversare', 'B2'], ['dialogare', 'B2'], ['discorrere', 'C1']]],
    'dire':       ['A1', [['raccontare', 'A2'], ['comunicare', 'B1'], ['affermare', 'B2'], ['dichiarare', 'B2'], ['esprimere', 'B2']]],
    'fare':       ['A1', [['creare', 'A2'], ['compiere', 'B2'], ['eseguire', 'B2'], ['realizzare', 'B2'], ['effettuare', 'C1']]],
    'dare':       ['A1', [['offrire', 'B1'], ['consegnare', 'B1'], ['fornire', 'B2'], ['concedere', 'B2'], ['porgere', 'C1']]],
    'prendere':   ['A1', [['afferrare', 'B2'], ['cogliere', 'B2'], ['agguantare', 'C1']]],
    'mettere':    ['A1', [['posare', 'B1'], ['sistemare', 'B1'], ['porre', 'B2'], ['collocare', 'C1']]],
    'vedere':     ['A1', [['notare', 'B1'], ['osservare', 'B1'], ['distinguere', 'B2'], ['scorgere', 'C1']]],
    'guardare':   ['A1', [['osservare', 'B1'], ['fissare', 'B2'], ['contemplare', 'C1']]],
    'sentire':    ['A1', [['ascoltare', 'A2'], ['avvertire', 'B2'], ['percepire', 'B2'], ['udire', 'C1']]],
    'ascoltare':  ['A1', [['sentire', 'A1'], ['udire', 'C1']]],
    'capire':     ['A1', [['comprendere', 'B1'], ['afferrare', 'B2'], ['intuire', 'B2']]],
    'pensare':    ['A1', [['credere', 'A2'], ['considerare', 'B1'], ['riflettere', 'B1'], ['ritenere', 'B2'], ['meditare', 'C1']]],
    'credere':    ['A2', [['pensare', 'A1'], ['immaginare', 'B1'], ['ritenere', 'B2'], ['supporre', 'B2']]],
    'volere':     ['A1', [['desiderare', 'B1'], ['ambire', 'C1'], ['bramare', 'C2']]],
    'andare':     ['A1', [['partire', 'A1'], ['dirigere', 'B2'], ['giungere', 'C1']]],
    'venire':     ['A1', [['arrivare', 'A1'], ['giungere', 'C1']]],
    'arrivare':   ['A1', [['raggiungere', 'B1'], ['giungere', 'C1'], ['pervenire', 'C2']]],
    'tornare':    ['A1', [['ritornare', 'A2'], ['rientrare', 'B1']]],
    'entrare':    ['A1', [['accedere', 'C1'], ['penetrare', 'C1']]],
    'trovare':    ['A1', [['scoprire', 'B1'], ['individuare', 'C1'], ['reperire', 'C2']]],
    'cercare':    ['A1', [['esplorare', 'B2'], ['indagare', 'C1'], ['ricercare', 'B2']]],
    'lasciare':   ['A1', [['abbandonare', 'B1'], ['mollare', 'B2']]],
    'chiedere':   ['A1', [['domandare', 'A2'], ['pregare', 'B1'], ['interrogare', 'B2'], ['richiedere', 'B2']]],
    'rispondere': ['A1', [['reagire', 'B2'], ['replicare', 'C1'], ['ribattere', 'C1']]],
    'aspettare':  ['A1', [['attendere', 'B1']]],
    'mangiare':   ['A1', [['consumare', 'B1'], ['divorare', 'B2'], ['ingerire', 'C1']]],
    'bere':       ['A1', [['sorseggiare', 'C1']]],
    'dormire':    ['A1', [['riposare', 'B1']]],
    'vivere':     ['A1', [['abitare', 'A1'], ['esistere', 'B1'], ['risiedere', 'C1'], ['dimorare', 'C2']]],
    'abitare':    ['A1', [['vivere', 'A1'], ['alloggiare', 'C1'], ['risiedere', 'C1']]],
    'morire':     ['A1', [['perire', 'C2'], ['decedere', 'C2']]],
    'lavorare':   ['A1', [['operare', 'B2'], ['faticare', 'B2']]],
    'studiare':   ['A1', [['imparare', 'A1'], ['apprendere', 'B2'], ['approfondire', 'B2']]],
    'imparare':   ['A1', [['studiare', 'A1'], ['apprendere', 'B2'], ['memorizzare', 'B2']]],
    'comprare':   ['A1', [['acquistare', 'B1'], ['procurare', 'B2']]],
    'pagare':     ['A1', [['versare', 'B2'], ['saldare', 'C1'], ['retribuire', 'C2']]],
    'perdere':    ['A1', [['sprecare', 'B2'], ['smarrire', 'C1']]],
    'aprire':     ['A1', [['spalancare', 'C1'], ['schiudere', 'C2']]],
    'chiudere':   ['A1', [['serrare', 'C1'], ['sigillare', 'C1']]],
    'correre':    ['A1', [['scappare', 'B1'], ['fuggire', 'B1']]],
    'camminare':  ['A1', [['passeggiare', 'B1'], ['procedere', 'B2']]],
    'portare':    ['A1', [['condurre', 'B2'], ['trasportare', 'B2'], ['recare', 'C2']]],
    'usare':      ['A1', [['utilizzare', 'B1'], ['adoperare', 'B2'], ['impiegare', 'B2']]],
    'scrivere':   ['A1', [['annotare', 'B2'], ['comporre', 'B2'], ['redigere', 'C2']]],
    'leggere':    ['A1', [['consultare', 'B2'], ['sfogliare', 'B2']]],
    'giocare':    ['A1', [['scherzare', 'B1']]],
    'cantare':    ['A1', [['intonare', 'C1']]],
    'ballare':    ['A1', [['danzare', 'B1']]],
    'cucinare':   ['A1', [['preparare', 'A2'], ['cuocere', 'B1']]],
    'pulire':     ['A1', [['lavare', 'A1'], ['ripulire', 'B1'], ['detergere', 'C2']]],
    'lavare':     ['A1', [['pulire', 'A1'], ['sciacquare', 'C1']]],
    'salire':     ['A1', [['arrampicare', 'B2'], ['ascendere', 'C2']]],
    'scendere':   ['A1', [['calare', 'B2'], ['discendere', 'C1']]],
    'sapere':     ['A1', [['conoscere', 'A1']]],
    'conoscere':  ['A1', [['sapere', 'A1'], ['riconoscere', 'B1']]],
    'piacere':    ['A1', [['apprezzare', 'B1'], ['gradire', 'B2']]],
    'amare':      ['A1', [['adorare', 'B1']]],
    'aiutare':    ['A1', [['sostenere', 'B2'], ['assistere', 'B2'], ['soccorrere', 'C1']]],
    'viaggiare':  ['A1', [['girare', 'A2']]],
    'partire':    ['A1', [['andare', 'A1'], ['allontanare', 'B2']]],

    // ---------- A2 ----------
    'raccontare': ['A2', [['narrare', 'C1'], ['riferire', 'B2'], ['descrivere', 'B2']]],
    'diventare':  ['A2', [['divenire', 'C1']]],
    'sembrare':   ['A2', [['parere', 'B1'], ['apparire', 'B2'], ['risultare', 'B2']]],
    'ricordare':  ['A2', [['memorizzare', 'B2'], ['rammentare', 'C1'], ['rievocare', 'C2']]],
    'dimenticare':['A2', [['scordare', 'B1'], ['trascurare', 'B2'], ['omettere', 'C1']]],
    'insegnare':  ['A2', [['formare', 'B1'], ['educare', 'B2'], ['istruire', 'C1']]],
    'spiegare':   ['A2', [['chiarire', 'B2'], ['illustrare', 'B2'], ['esporre', 'B2']]],
    'mostrare':   ['A2', [['indicare', 'B1'], ['rivelare', 'B2'], ['esibire', 'C1']]],
    'scegliere':  ['A2', [['preferire', 'A2'], ['selezionare', 'B2'], ['eleggere', 'C1'], ['optare', 'C1']]],
    'decidere':   ['A2', [['risolvere', 'B1'], ['stabilire', 'B2'], ['determinare', 'B2']]],
    'provare':    ['A2', [['tentare', 'B1'], ['sperimentare', 'B2']]],
    'togliere':   ['A2', [['levare', 'B1'], ['eliminare', 'B1'], ['rimuovere', 'B2']]],
    'ripetere':   ['A2', [['replicare', 'C1'], ['reiterare', 'C2']]],
    'cadere':     ['A2', [['crollare', 'B2'], ['precipitare', 'B2']]],
    'saltare':    ['A2', [['scavalcare', 'B2'], ['balzare', 'C1']]],
    'toccare':    ['A2', [['sfiorare', 'B2']]],
    'tirare':     ['A2', [['tendere', 'B2'], ['trascinare', 'B2']]],
    'rompere':    ['A2', [['spaccare', 'B2'], ['spezzare', 'B2'], ['frantumare', 'C1'], ['infrangere', 'C1']]],
    'creare':     ['A2', [['inventare', 'B1'], ['produrre', 'B1'], ['generare', 'B2'], ['ideare', 'C1']]],
    'cambiare':   ['A1', [['modificare', 'B1'], ['trasformare', 'B1'], ['variare', 'B2'], ['alterare', 'C1']]],
    'ridere':     ['A2', [['sorridere', 'B1']]],
    'piangere':   ['A2', [['lamentare', 'B2'], ['singhiozzare', 'C2']]],
    'nascere':    ['A2', [['sorgere', 'B2'], ['originare', 'C1']]],
    'mandare':    ['A2', [['inviare', 'B1'], ['spedire', 'B1'], ['trasmettere', 'B2']]],
    'ricevere':   ['A2', [['ottenere', 'B1'], ['accogliere', 'B2']]],
    'seguire':    ['A2', [['inseguire', 'B2']]],
    'fermare':    ['A2', [['bloccare', 'B1'], ['arrestare', 'B2'], ['sospendere', 'B2']]],
    'incontrare': ['A2', [['conoscere', 'A1'], ['riunire', 'B2']]],
    'invitare':   ['A2', [['convocare', 'C1']]],
    'salutare':   ['A2', [['accogliere', 'B2']]],
    'spendere':   ['A2', [['investire', 'B2'], ['sborsare', 'C2']]],
    'costare':    ['A2', [['valere', 'B1'], ['ammontare', 'C1']]],
    'continuare': ['A2', [['proseguire', 'B2'], ['perseverare', 'C2']]],
    'preparare':  ['A2', [['organizzare', 'B1'], ['allestire', 'C1'], ['predisporre', 'C2']]],
    'funzionare': ['A2', [['operare', 'B2']]],
    'guidare':    ['A2', [['condurre', 'B2'], ['dirigere', 'B2'], ['pilotare', 'C1']]],

    // ---------- B1 ----------
    'finire':     ['A1', [['completare', 'B1'], ['terminare', 'B1'], ['concludere', 'B2'], ['ultimare', 'C1'], ['cessare', 'C1']]],
    'cominciare': ['A1', [['iniziare', 'A2'], ['avviare', 'B2'], ['intraprendere', 'C1']]],
    'iniziare':   ['A2', [['cominciare', 'A1'], ['avviare', 'B2'], ['esordire', 'C2']]],
    'vincere':    ['B1', [['battere', 'B1'], ['superare', 'B1'], ['sconfiggere', 'B2'], ['trionfare', 'C1']]],
    'costruire':  ['B1', [['realizzare', 'B2'], ['edificare', 'C1'], ['erigere', 'C2']]],
    'nascondere': ['B1', [['celare', 'C1'], ['occultare', 'C2'], ['dissimulare', 'C2']]],
    'scoprire':   ['B1', [['trovare', 'A1'], ['rivelare', 'B2'], ['svelare', 'B2']]],
    'accettare':  ['B1', [['approvare', 'B1'], ['ammettere', 'B2'], ['acconsentire', 'C1']]],
    'rifiutare':  ['B1', [['negare', 'B2'], ['respingere', 'B2'], ['declinare', 'C1']]],
    'permettere': ['B1', [['concedere', 'B2'], ['consentire', 'B2'], ['autorizzare', 'B2']]],
    'aumentare':  ['B1', [['crescere', 'A2'], ['accrescere', 'C2'], ['incrementare', 'C1']]],
    'diminuire':  ['B1', [['ridurre', 'B1'], ['abbassare', 'B1'], ['calare', 'B2']]],
    'migliorare': ['B1', [['perfezionare', 'C1'], ['ottimizzare', 'C1']]],
    'ottenere':   ['B1', [['raggiungere', 'B1'], ['acquisire', 'C1'], ['conseguire', 'C2']]],
    'offrire':    ['B1', [['regalare', 'A2'], ['donare', 'B1'], ['proporre', 'B1']]],
    'tenere':     ['A1', [['mantenere', 'B1'], ['conservare', 'B1'], ['trattenere', 'B2']]],
    'mantenere':  ['B1', [['conservare', 'B1'], ['sostenere', 'B2'], ['preservare', 'C1']]],
    'proteggere': ['B1', [['difendere', 'B1'], ['tutelare', 'C1'], ['salvaguardare', 'C2']]],
    'difendere':  ['B1', [['proteggere', 'B1'], ['tutelare', 'C1']]],
    'colpire':    ['B1', [['battere', 'B1'], ['urtare', 'B2'], ['percuotere', 'C2']]],
    'uccidere':   ['B1', [['ammazzare', 'B2'], ['assassinare', 'C1'], ['sopprimere', 'C2']]],
    'salvare':    ['B1', [['liberare', 'B1'], ['soccorrere', 'C1']]],
    'unire':      ['B1', [['collegare', 'B1'], ['fondere', 'B2'], ['congiungere', 'C1']]],
    'dividere':   ['B1', [['separare', 'B1'], ['spartire', 'C1'], ['scindere', 'C2']]],
    'lanciare':   ['B1', [['buttare', 'A2'], ['gettare', 'B1'], ['scagliare', 'C1']]],
    'gettare':    ['B1', [['buttare', 'A2'], ['lanciare', 'B1']]],
    'spingere':   ['B1', [['premere', 'B1'], ['sospingere', 'C2']]],
    'discutere':  ['B1', [['litigare', 'B1'], ['dibattere', 'C1'], ['argomentare', 'C1']]],
    'controllare':['B1', [['verificare', 'B1'], ['sorvegliare', 'B2'], ['ispezionare', 'C1']]],
    'verificare': ['B1', [['controllare', 'B1'], ['accertare', 'C1'], ['appurare', 'C2']]],
    'riparare':   ['B1', [['aggiustare', 'B1'], ['sistemare', 'B1'], ['restaurare', 'C1']]],
    'eliminare':  ['B1', [['cancellare', 'B1'], ['rimuovere', 'B2'], ['sopprimere', 'C2']]],
    'cancellare': ['B1', [['eliminare', 'B1'], ['annullare', 'B2']]],
    'tradurre':   ['B1', [['interpretare', 'B2'], ['trasporre', 'C2']]],
    'significare':['B1', [['indicare', 'B1'], ['denotare', 'C2']]],
    'indicare':   ['B1', [['mostrare', 'A2'], ['segnalare', 'B2'], ['denotare', 'C2']]],
    'sparire':    ['B1', [['scomparire', 'B2'], ['svanire', 'C1'], ['dileguare', 'C2']]],
    'restare':    ['A2', [['rimanere', 'A2'], ['sostare', 'C1'], ['permanere', 'C2']]],
    'rimanere':   ['A2', [['restare', 'A2'], ['permanere', 'C2']]],
    'soffrire':   ['B1', [['patire', 'C1'], ['penare', 'C2']]],
    'curare':     ['B1', [['guarire', 'B1'], ['trattare', 'B1'], ['medicare', 'C1']]],
    'pregare':    ['B1', [['implorare', 'C1'], ['supplicare', 'C1']]],
    'gridare':    ['B1', [['urlare', 'B1'], ['esclamare', 'B2'], ['strillare', 'C1']]],
    'sperare':    ['A2', [['confidare', 'C1']]],
    'desiderare': ['B1', [['volere', 'A1'], ['bramare', 'C2'], ['agognare', 'C2']]],
    'odiare':     ['B1', [['detestare', 'B2'], ['disprezzare', 'C1'], ['aborrire', 'C2']]],
    'organizzare':['B1', [['preparare', 'A2'], ['pianificare', 'B2'], ['allestire', 'C1']]],
    'gestire':    ['B1', [['dirigere', 'B2'], ['amministrare', 'C1']]],
    'svolgere':   ['B1', [['compiere', 'B2'], ['eseguire', 'B2'], ['effettuare', 'C1']]],
    'calcolare':  ['B1', [['contare', 'A2'], ['stimare', 'B2'], ['computare', 'C2']]],
    'misurare':   ['B1', [['valutare', 'B2'], ['stimare', 'B2']]],
    'giudicare':  ['B1', [['valutare', 'B2'], ['sentenziare', 'C2']]],
    'indossare':  ['B1', [['vestire', 'B1'], ['portare', 'A1']]],
    'vestire':    ['B1', [['indossare', 'B1']]],
    'legare':     ['B1', [['allacciare', 'B2'], ['annodare', 'C1'], ['vincolare', 'C2']]],
    'liberare':   ['B1', [['sciogliere', 'B2'], ['affrancare', 'C2']]],
    'muovere':    ['B1', [['spostare', 'B1'], ['agitare', 'B2']]],
    'ridurre':    ['B1', [['diminuire', 'B1'], ['abbassare', 'B1'], ['contrarre', 'C2']]],
    'risparmiare':['B1', [['economizzare', 'C2']]],
    'ospitare':   ['B1', [['accogliere', 'B2'], ['alloggiare', 'C1']]],
    'riuscire':   ['B1', [['conseguire', 'C2']]],
    'utilizzare': ['B1', [['usare', 'A1'], ['adoperare', 'B2'], ['impiegare', 'B2']]],

    // ---------- B2 and up ----------
    'realizzare':  ['B2', [['fare', 'A1'], ['compiere', 'B2'], ['attuare', 'C1'], ['concretizzare', 'C2']]],
    'compiere':    ['B2', [['eseguire', 'B2'], ['svolgere', 'B1'], ['realizzare', 'B2']]],
    'eseguire':    ['B2', [['compiere', 'B2'], ['svolgere', 'B1'], ['effettuare', 'C1']]],
    'condurre':    ['B2', [['guidare', 'A2'], ['portare', 'A1'], ['dirigere', 'B2']]],
    'dirigere':    ['B2', [['guidare', 'A2'], ['gestire', 'B1'], ['amministrare', 'C1']]],
    'distruggere': ['B2', [['demolire', 'C1'], ['devastare', 'C1'], ['annientare', 'C2']]],
    'apparire':    ['B2', [['comparire', 'B2'], ['sembrare', 'A2']]],
    'rivelare':    ['B2', [['svelare', 'B2'], ['divulgare', 'C1'], ['palesare', 'C2']]],
    'valutare':    ['B2', [['giudicare', 'B1'], ['considerare', 'B1'], ['stimare', 'B2']]],
    'annullare':   ['B2', [['cancellare', 'B1'], ['revocare', 'C2']]],
    'vietare':     ['B2', [['proibire', 'B2'], ['impedire', 'B2'], ['ostacolare', 'C1']]],
    'accogliere':  ['B2', [['ricevere', 'A2'], ['ospitare', 'B1']]],
    'attaccare':   ['B1', [['colpire', 'B1'], ['aggredire', 'B2'], ['assalire', 'C1']]],
    'interpretare':['B2', [['tradurre', 'B1'], ['spiegare', 'A2']]],
    'peggiorare':  ['B2', [['aggravare', 'C1']]],
    'stancare':    ['B1', [['affaticare', 'C1'], ['spossare', 'C2']]],
    'temere':      ['B1', [['paventare', 'C2']]]
  };

  // Keep only synonyms that exist in the dictionary, so every chip is clickable.
  var VERBS = (global.VerbData && global.VerbData.VERBS) || {};
  var SYNONYMS = {};
  var LEVEL_OF = {};

  Object.keys(RAW).forEach(function (head) {
    if (!VERBS[head]) return;                       // headword must be conjugable
    LEVEL_OF[head] = RAW[head][0];
    var kept = RAW[head][1].filter(function (s) { return !!VERBS[s[0]]; })
                           .map(function (s) { return { inf: s[0], level: s[1] }; });
    if (kept.length) SYNONYMS[head] = kept;
  });

  // Levels for verbs that appear only as synonyms, so their badge is known too.
  Object.keys(RAW).forEach(function (head) {
    RAW[head][1].forEach(function (s) {
      if (!LEVEL_OF[s[0]]) LEVEL_OF[s[0]] = s[1];
    });
  });

  global.VerbSynonyms = {
    SYNONYMS: SYNONYMS,          // headword -> [{inf, level}, ...]
    LEVEL_OF: LEVEL_OF,          // infinitive -> CEFR level
    get: function (inf) { return SYNONYMS[inf] || null; },
    levelOf: function (inf) { return LEVEL_OF[inf] || null; }
  };
})(typeof window !== 'undefined' ? window : this);
