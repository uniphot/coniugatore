/* ============================================================================
   Verb dictionary
   ----------------------------------------------------------------------------
   Structure:
     BASES     — hand-coded irregular verbs (marked stress overrides).
     TEMPLATES — non-standalone roots (e.g. -durre) used only to derive family
                 members; never exposed in the verb list.
     FAMILIES  — prefixed compounds derived from a base/template by prepending
                 an (unstressed) prefix to every marked form. This is how the
                 list scales accurately: one correct base → many compounds.
     REG       — regular verbs; the builder assigns `sstem` (stress-marked stem
                 for present-type forms), using an explicit override for
                 sdrucciole verbs (àbito, telèfono) or the last-stem-vowel
                 heuristic otherwise.

   Marking convention: one uppercase vowel = stressed; a lowercase accented
   vowel is inherently stressed.  `ortho`: care|gare|ciare|giare|sciare|iare.
   ========================================================================== */

(function (global) {
  'use strict';

  var VERBS = {};

  // ===================================================================
  //  IRREGULAR BASES
  // ===================================================================
  var BASES = {
    /* --- auxiliaries --- */
    essere: {
      inf: 'essere', tr: 'to be', group: 'ere', aux: 'essere', irregular: true,
      presente:      ['sOno', 'sEi', 'è', 'siAmo', 'siEte', 'sOno'],
      imperfetto:    ['Ero', 'Eri', 'Era', 'eravAmo', 'eravAte', 'Erano'],
      passatoRemoto: ['fUi', 'fOsti', 'fU', 'fUmmo', 'fOste', 'fUrono'],
      futuroStem:    'sar',
      congPresente:  ['sIa', 'sIa', 'sIa', 'siAmo', 'siAte', 'sIano'],
      congImperfetto:['fOssi', 'fOssi', 'fOsse', 'fOssimo', 'fOste', 'fOssero'],
      imperativo:    ['sIi', 'sIa', 'siAmo', 'siAte', 'sIano'],
      pp: 'stAto', gerundio: 'essEndo'
    },
    avere: {
      inf: 'avere', tr: 'to have', group: 'ere', stem: 'av', aux: 'avere', irregular: true,
      presente:      ['hO', 'hAi', 'hA', 'abbiAmo', 'avEte', 'hAnno'],
      passatoRemoto: ['Ebbi', 'avEsti', 'Ebbe', 'avEmmo', 'avEste', 'Ebbero'],
      futuroStem:    'avr',
      congPresente:  ['Abbia', 'Abbia', 'Abbia', 'abbiAmo', 'abbiAte', 'Abbiano'],
      imperativo:    ['Abbi', 'Abbia', 'abbiAmo', 'abbiAte', 'Abbiano']
    },

    /* --- -are irregulars --- */
    fare: {
      inf: 'fare', tr: 'to do / make', group: 'are', aux: 'avere', irregular: true,
      presente:      ['fAccio', 'fAi', 'fA', 'facciAmo', 'fAte', 'fAnno'],
      imperfStem:    'fac',
      passatoRemoto: ['fEci', 'facEsti', 'fEce', 'facEmmo', 'facEste', 'fEcero'],
      futuroStem:    'far',
      congPresente:  ['fAccia', 'fAccia', 'fAccia', 'facciAmo', 'facciAte', 'fAcciano'],
      imperativo:    ['fAi', 'fAccia', 'facciAmo', 'fAte', 'fAcciano'],
      pp: 'fAtto', gerundio: 'facEndo'
    },
    dare: {
      inf: 'dare', tr: 'to give', group: 'are', aux: 'avere', irregular: true,
      presente:      ['dO', 'dAi', 'dà', 'diAmo', 'dAte', 'dAnno'],
      passatoRemoto: ['diEdi', 'dEsti', 'diEde', 'dEmmo', 'dEste', 'diEdero'],
      futuroStem:    'dar',
      congPresente:  ['dIa', 'dIa', 'dIa', 'diAmo', 'diAte', 'dIano'],
      congImperfetto:['dEssi', 'dEssi', 'dEsse', 'dEssimo', 'dEste', 'dEssero'],
      imperativo:    ['dAi', 'dIa', 'diAmo', 'dAte', 'dIano'],
      pp: 'dAto', gerundio: 'dAndo'
    },
    stare: {
      inf: 'stare', tr: 'to stay / be', group: 'are', aux: 'essere', irregular: true,
      presente:      ['stO', 'stAi', 'stA', 'stiAmo', 'stAte', 'stAnno'],
      passatoRemoto: ['stEtti', 'stEsti', 'stEtte', 'stEmmo', 'stEste', 'stEttero'],
      futuroStem:    'star',
      congPresente:  ['stIa', 'stIa', 'stIa', 'stiAmo', 'stiAte', 'stIano'],
      congImperfetto:['stEssi', 'stEssi', 'stEsse', 'stEssimo', 'stEste', 'stEssero'],
      imperativo:    ['stAi', 'stIa', 'stiAmo', 'stAte', 'stIano'],
      pp: 'stAto', gerundio: 'stAndo'
    },
    andare: {
      inf: 'andare', tr: 'to go', group: 'are', aux: 'essere', irregular: true,
      presente:      ['vAdo', 'vAi', 'vA', 'andiAmo', 'andAte', 'vAnno'],
      futuroStem:    'andr',
      congPresente:  ['vAda', 'vAda', 'vAda', 'andiAmo', 'andiAte', 'vAdano'],
      imperativo:    ['vAi', 'vAda', 'andiAmo', 'andAte', 'vAdano'],
      pp: 'andAto', gerundio: 'andAndo'
    },

    /* --- -ere irregulars --- */
    potere: {
      inf: 'potere', tr: 'to be able / can', group: 'ere', stem: 'pot', aux: 'avere',
      irregular: true, defectiveImperative: true,
      presente:      ['pOsso', 'puOi', 'può', 'possiAmo', 'potEte', 'pOssono'],
      futuroStem:    'potr',
      congPresente:  ['pOssa', 'pOssa', 'pOssa', 'possiAmo', 'possiAte', 'pOssano']
    },
    volere: {
      inf: 'volere', tr: 'to want', group: 'ere', stem: 'vol', aux: 'avere',
      irregular: true, defectiveImperative: true,
      presente:      ['vOglio', 'vuOi', 'vuOle', 'vogliAmo', 'volEte', 'vOgliono'],
      passatoRemoto: ['vOlli', 'volEsti', 'vOlle', 'volEmmo', 'volEste', 'vOllero'],
      futuroStem:    'vorr',
      congPresente:  ['vOglia', 'vOglia', 'vOglia', 'vogliAmo', 'vogliAte', 'vOgliano'],
      pp: 'volUto'
    },
    dovere: {
      inf: 'dovere', tr: 'to have to / must', group: 'ere', stem: 'dov', aux: 'avere',
      irregular: true, defectiveImperative: true,
      presente:      ['dEvo', 'dEvi', 'dEve', 'dobbiAmo', 'dovEte', 'dEvono'],
      futuroStem:    'dovr',
      congPresente:  ['dEbba', 'dEbba', 'dEbba', 'dobbiAmo', 'dobbiAte', 'dEbbano'],
      pp: 'dovUto'
    },
    sapere: {
      inf: 'sapere', tr: 'to know', group: 'ere', stem: 'sap', aux: 'avere', irregular: true,
      presente:      ['sO', 'sAi', 'sA', 'sappiAmo', 'sapEte', 'sAnno'],
      passatoRemoto: ['sEppi', 'sapEsti', 'sEppe', 'sapEmmo', 'sapEste', 'sEppero'],
      futuroStem:    'sapr',
      congPresente:  ['sAppia', 'sAppia', 'sAppia', 'sappiAmo', 'sappiAte', 'sAppiano'],
      imperativo:    ['sAppi', 'sAppia', 'sappiAmo', 'sappiAte', 'sAppiano'],
      pp: 'sapUto'
    },
    bere: {
      inf: 'bere', tr: 'to drink', group: 'ere', stem: 'bev', aux: 'avere', irregular: true,
      presente:      ['bEvo', 'bEvi', 'bEve', 'beviAmo', 'bevEte', 'bEvono'],
      imperfStem:    'bev',
      passatoRemoto: ['bEvvi', 'bevEsti', 'bEvve', 'bevEmmo', 'bevEste', 'bEvvero'],
      futuroStem:    'berr',
      congPresente:  ['bEva', 'bEva', 'bEva', 'beviAmo', 'beviAte', 'bEvano'],
      imperativo:    ['bEvi', 'bEva', 'beviAmo', 'bevEte', 'bEvano'],
      pp: 'bevUto', gerundio: 'bevEndo'
    },
    vedere: {
      inf: 'vedere', tr: 'to see', group: 'ere', stem: 'ved', sstem: 'vEd', aux: 'avere', irregular: true,
      passatoRemoto: ['vIdi', 'vedEsti', 'vIde', 'vedEmmo', 'vedEste', 'vIdero'],
      futuroStem:    'vedr',
      pp: 'vIsto'
    },
    tenere: {
      inf: 'tenere', tr: 'to hold / keep', group: 'ere', stem: 'ten', aux: 'avere', irregular: true,
      presente:      ['tEngo', 'tiEni', 'tiEne', 'teniAmo', 'tenEte', 'tEngono'],
      passatoRemoto: ['tEnni', 'tenEsti', 'tEnne', 'tenEmmo', 'tenEste', 'tEnnero'],
      futuroStem:    'terr',
      congPresente:  ['tEnga', 'tEnga', 'tEnga', 'teniAmo', 'teniAte', 'tEngano'],
      imperativo:    ['tiEni', 'tEnga', 'teniAmo', 'tenEte', 'tEngano'],
      pp: 'tenUto'
    },
    mettere: {
      inf: 'mettere', tr: 'to put', group: 'ere', stem: 'mett', sstem: 'mEtt', aux: 'avere', irregular: true,
      passatoRemoto: ['mIsi', 'mettEsti', 'mIse', 'mettEmmo', 'mettEste', 'mIsero'],
      pp: 'mEsso'
    },
    prendere: {
      inf: 'prendere', tr: 'to take', group: 'ere', stem: 'prend', sstem: 'prEnd', aux: 'avere', irregular: true,
      passatoRemoto: ['prEsi', 'prendEsti', 'prEse', 'prendEmmo', 'prendEste', 'prEsero'],
      pp: 'prEso'
    },
    chiudere: {
      inf: 'chiudere', tr: 'to close', group: 'ere', stem: 'chiud', sstem: 'chiUd', aux: 'avere', irregular: true,
      passatoRemoto: ['chiUsi', 'chiudEsti', 'chiUse', 'chiudEmmo', 'chiudEste', 'chiUsero'],
      pp: 'chiUso'
    },
    scrivere: {
      inf: 'scrivere', tr: 'to write', group: 'ere', stem: 'scriv', sstem: 'scrIv', aux: 'avere', irregular: true,
      passatoRemoto: ['scrIssi', 'scrivEsti', 'scrIsse', 'scrivEmmo', 'scrivEste', 'scrIssero'],
      pp: 'scrItto'
    },
    leggere: {
      inf: 'leggere', tr: 'to read', group: 'ere', stem: 'legg', sstem: 'lEgg', aux: 'avere', irregular: true,
      passatoRemoto: ['lEssi', 'leggEsti', 'lEsse', 'leggEmmo', 'leggEste', 'lEssero'],
      pp: 'lEtto'
    },
    chiedere: {
      inf: 'chiedere', tr: 'to ask', group: 'ere', stem: 'chied', sstem: 'chiEd', aux: 'avere', irregular: true,
      passatoRemoto: ['chiEsi', 'chiedEsti', 'chiEse', 'chiedEmmo', 'chiedEste', 'chiEsero'],
      pp: 'chiEsto'
    },
    rispondere: {
      inf: 'rispondere', tr: 'to answer', group: 'ere', stem: 'rispond', sstem: 'rispOnd', aux: 'avere', irregular: true,
      passatoRemoto: ['rispOsi', 'rispondEsti', 'rispOse', 'rispondEmmo', 'rispondEste', 'rispOsero'],
      pp: 'rispOsto'
    },
    scendere: {
      inf: 'scendere', tr: 'to go down / get off', group: 'ere', stem: 'scend', sstem: 'scEnd', aux: 'essere', irregular: true,
      passatoRemoto: ['scEsi', 'scendEsti', 'scEse', 'scendEmmo', 'scendEste', 'scEsero'],
      pp: 'scEso'
    },
    perdere: {
      inf: 'perdere', tr: 'to lose', group: 'ere', stem: 'perd', sstem: 'pErd', aux: 'avere', irregular: true,
      passatoRemoto: ['pErsi', 'perdEsti', 'pErse', 'perdEmmo', 'perdEste', 'pErsero'],
      pp: 'pErso'
    },
    vincere: {
      inf: 'vincere', tr: 'to win', group: 'ere', stem: 'vinc', sstem: 'vInc', aux: 'avere', irregular: true,
      passatoRemoto: ['vInsi', 'vincEsti', 'vInse', 'vincEmmo', 'vincEste', 'vInsero'],
      pp: 'vInto'
    },
    correre: {
      inf: 'correre', tr: 'to run', group: 'ere', stem: 'corr', sstem: 'cOrr', aux: 'avere', irregular: true,
      passatoRemoto: ['cOrsi', 'corrEsti', 'cOrse', 'corrEmmo', 'corrEste', 'cOrsero'],
      pp: 'cOrso'
    },
    rompere: {
      inf: 'rompere', tr: 'to break', group: 'ere', stem: 'romp', sstem: 'rOmp', aux: 'avere', irregular: true,
      passatoRemoto: ['rUppi', 'rompEsti', 'rUppe', 'rompEmmo', 'rompEste', 'rUppero'],
      pp: 'rOtto'
    },
    conoscere: {
      inf: 'conoscere', tr: 'to know / meet', group: 'ere', stem: 'conosc', sstem: 'conOsc', aux: 'avere', irregular: true,
      passatoRemoto: ['conObbi', 'conoscEsti', 'conObbe', 'conoscEmmo', 'conoscEste', 'conObbero'],
      pp: 'conosciUto'
    },
    nascere: {
      inf: 'nascere', tr: 'to be born', group: 'ere', stem: 'nasc', sstem: 'nAsc', aux: 'essere', irregular: true,
      passatoRemoto: ['nAcqui', 'nascEsti', 'nAcque', 'nascEmmo', 'nascEste', 'nAcquero'],
      pp: 'nAto'
    },
    vivere: {
      inf: 'vivere', tr: 'to live', group: 'ere', stem: 'viv', sstem: 'vIv', aux: 'avere', irregular: true,
      passatoRemoto: ['vIssi', 'vivEsti', 'vIsse', 'vivEmmo', 'vivEste', 'vIssero'],
      futuroStem:    'vivr',
      pp: 'vissUto'
    },
    piacere: {
      inf: 'piacere', tr: 'to please / like', group: 'ere', stem: 'piac', aux: 'essere', irregular: true,
      presente:      ['piAccio', 'piAci', 'piAce', 'piacciAmo', 'piacEte', 'piAcciono'],
      passatoRemoto: ['piAcqui', 'piacEsti', 'piAcque', 'piacEmmo', 'piacEste', 'piAcquero'],
      congPresente:  ['piAccia', 'piAccia', 'piAccia', 'piacciAmo', 'piacciAte', 'piAcciano'],
      pp: 'piaciUto'
    },
    muovere: {
      inf: 'muovere', tr: 'to move', group: 'ere', stem: 'muov', aux: 'avere', irregular: true,
      presente:      ['muOvo', 'muOvi', 'muOve', 'muoviAmo', 'muovEte', 'muOvono'],
      passatoRemoto: ['mOssi', 'muovEsti', 'mOsse', 'muovEmmo', 'muovEste', 'mOssero'],
      congPresente:  ['muOva', 'muOva', 'muOva', 'muoviAmo', 'muoviAte', 'muOvano'],
      imperativo:    ['muOvi', 'muOva', 'muoviAmo', 'muovEte', 'muOvano'],
      pp: 'mOsso'
    },
    sedere: {
      inf: 'sedere', tr: 'to sit', group: 'ere', stem: 'sed', aux: 'essere', irregular: true,
      presente:      ['siEdo', 'siEdi', 'siEde', 'sediAmo', 'sedEte', 'siEdono'],
      congPresente:  ['siEda', 'siEda', 'siEda', 'sediAmo', 'sediAte', 'siEdano'],
      imperativo:    ['siEdi', 'siEda', 'sediAmo', 'sedEte', 'siEdano'],
      pp: 'sedUto'
    },
    spegnere: {
      inf: 'spegnere', tr: 'to switch off', group: 'ere', stem: 'spegn', aux: 'avere', irregular: true,
      presente:      ['spEngo', 'spEgni', 'spEgne', 'spegniAmo', 'spegnEte', 'spEngono'],
      passatoRemoto: ['spEnsi', 'spegnEsti', 'spEnse', 'spegnEmmo', 'spegnEste', 'spEnsero'],
      congPresente:  ['spEnga', 'spEnga', 'spEnga', 'spegniAmo', 'spegniAte', 'spEngano'],
      imperativo:    ['spEgni', 'spEnga', 'spegniAmo', 'spegnEte', 'spEngano'],
      pp: 'spEnto'
    },
    cadere: {
      inf: 'cadere', tr: 'to fall', group: 'ere', stem: 'cad', sstem: 'cAd', aux: 'essere', irregular: true,
      passatoRemoto: ['cAddi', 'cadEsti', 'cAdde', 'cadEmmo', 'cadEste', 'cAddero'],
      futuroStem:    'cadr',
      pp: 'cadUto'
    },
    rimanere: {
      inf: 'rimanere', tr: 'to remain', group: 'ere', stem: 'riman', aux: 'essere', irregular: true,
      presente:      ['rimAngo', 'rimAni', 'rimAne', 'rimaniAmo', 'rimanEte', 'rimAngono'],
      passatoRemoto: ['rimAsi', 'rimanEsti', 'rimAse', 'rimanEmmo', 'rimanEste', 'rimAsero'],
      futuroStem:    'rimarr',
      congPresente:  ['rimAnga', 'rimAnga', 'rimAnga', 'rimaniAmo', 'rimaniAte', 'rimAngano'],
      imperativo:    ['rimAni', 'rimAnga', 'rimaniAmo', 'rimanEte', 'rimAngano'],
      pp: 'rimAsto'
    },
    scegliere: {
      inf: 'scegliere', tr: 'to choose', group: 'ere', stem: 'scegli', aux: 'avere', irregular: true,
      presente:      ['scElgo', 'scEgli', 'scEglie', 'scegliAmo', 'scegliEte', 'scElgono'],
      passatoRemoto: ['scElsi', 'scegliEsti', 'scElse', 'scegliEmmo', 'scegliEste', 'scElsero'],
      congPresente:  ['scElga', 'scElga', 'scElga', 'scegliAmo', 'scegliAte', 'scElgano'],
      imperativo:    ['scEgli', 'scElga', 'scegliAmo', 'scegliEte', 'scElgano'],
      pp: 'scElto'
    },
    cogliere: {
      inf: 'cogliere', tr: 'to pick / grasp', group: 'ere', stem: 'cogli', aux: 'avere', irregular: true,
      presente:      ['cOlgo', 'cOgli', 'cOglie', 'cogliAmo', 'cogliEte', 'cOlgono'],
      passatoRemoto: ['cOlsi', 'cogliEsti', 'cOlse', 'cogliEmmo', 'cogliEste', 'cOlsero'],
      congPresente:  ['cOlga', 'cOlga', 'cOlga', 'cogliAmo', 'cogliAte', 'cOlgano'],
      imperativo:    ['cOgli', 'cOlga', 'cogliAmo', 'cogliEte', 'cOlgano'],
      pp: 'cOlto'
    },

    /* --- -ire irregulars --- */
    dire: {
      inf: 'dire', tr: 'to say / tell', group: 'ire', aux: 'avere', irregular: true,
      presente:      ['dIco', 'dIci', 'dIce', 'diciAmo', 'dIte', 'dIcono'],
      imperfStem:    'dic',
      passatoRemoto: ['dIssi', 'dicEsti', 'dIsse', 'dicEmmo', 'dicEste', 'dIssero'],
      futuroStem:    'dir',
      congPresente:  ['dIca', 'dIca', 'dIca', 'diciAmo', 'diciAte', 'dIcano'],
      imperativo:    ['dì', 'dIca', 'diciAmo', 'dIte', 'dIcano'],
      pp: 'dEtto', gerundio: 'dicEndo'
    },
    venire: {
      inf: 'venire', tr: 'to come', group: 'ire', aux: 'essere', irregular: true,
      presente:      ['vEngo', 'viEni', 'viEne', 'veniAmo', 'venIte', 'vEngono'],
      passatoRemoto: ['vEnni', 'venIsti', 'vEnne', 'venImmo', 'venIste', 'vEnnero'],
      futuroStem:    'verr',
      congPresente:  ['vEnga', 'vEnga', 'vEnga', 'veniAmo', 'veniAte', 'vEngano'],
      imperativo:    ['viEni', 'vEnga', 'veniAmo', 'venIte', 'vEngano'],
      pp: 'venUto'
    },
    uscire: {
      inf: 'uscire', tr: 'to go out', group: 'ire', aux: 'essere', irregular: true,
      presente:      ['Esco', 'Esci', 'Esce', 'usciAmo', 'uscIte', 'Escono'],
      congPresente:  ['Esca', 'Esca', 'Esca', 'usciAmo', 'usciAte', 'Escano'],
      imperativo:    ['Esci', 'Esca', 'usciAmo', 'uscIte', 'Escano']
    },
    morire: {
      inf: 'morire', tr: 'to die', group: 'ire', aux: 'essere', irregular: true,
      presente:      ['muOio', 'muOri', 'muOre', 'moriAmo', 'morIte', 'muOiono'],
      futuroStem:    'morr',
      congPresente:  ['muOia', 'muOia', 'muOia', 'moriAmo', 'moriAte', 'muOiano'],
      imperativo:    ['muOri', 'muOia', 'moriAmo', 'morIte', 'muOiano'],
      pp: 'mOrto'
    },
    salire: {
      inf: 'salire', tr: 'to go up / climb', group: 'ire', aux: 'essere', irregular: true,
      presente:      ['sAlgo', 'sAli', 'sAle', 'saliAmo', 'salIte', 'sAlgono'],
      congPresente:  ['sAlga', 'sAlga', 'sAlga', 'saliAmo', 'saliAte', 'sAlgano'],
      imperativo:    ['sAli', 'sAlga', 'saliAmo', 'salIte', 'sAlgano']
    },

    /* --- porre / trarre (real bases for productive families) --- */
    porre: {
      inf: 'porre', tr: 'to put / place', group: 'ere', aux: 'avere', irregular: true,
      presente:      ['pOngo', 'pOni', 'pOne', 'poniAmo', 'ponEte', 'pOngono'],
      imperfStem:    'pon',
      passatoRemoto: ['pOsi', 'ponEsti', 'pOse', 'ponEmmo', 'ponEste', 'pOsero'],
      futuroStem:    'porr',
      congPresente:  ['pOnga', 'pOnga', 'pOnga', 'poniAmo', 'poniAte', 'pOngano'],
      imperativo:    ['pOni', 'pOnga', 'poniAmo', 'ponEte', 'pOngano'],
      pp: 'pOsto', gerundio: 'ponEndo'
    },
    trarre: {
      inf: 'trarre', tr: 'to draw / pull', group: 'ere', aux: 'avere', irregular: true,
      presente:      ['trAggo', 'trAi', 'trAe', 'traiAmo', 'traEte', 'trAggono'],
      imperfStem:    'tra',
      passatoRemoto: ['trAssi', 'traEsti', 'trAsse', 'traEmmo', 'traEste', 'trAssero'],
      futuroStem:    'trarr',
      congPresente:  ['trAgga', 'trAgga', 'trAgga', 'traiAmo', 'traiAte', 'trAggano'],
      imperativo:    ['trAi', 'trAgga', 'traiAmo', 'traEte', 'trAggano'],
      pp: 'trAtto', gerundio: 'traEndo'
    }
  };

  // ===================================================================
  //  TEMPLATES (not real standalone verbs — used only to derive family)
  // ===================================================================
  var TEMPLATES = {
    durre: {
      group: 'ere', aux: 'avere', irregular: true,
      presente:      ['dUco', 'dUci', 'dUce', 'duciAmo', 'ducEte', 'dUcono'],
      imperfStem:    'duc',
      passatoRemoto: ['dUssi', 'ducEsti', 'dUsse', 'ducEmmo', 'ducEste', 'dUssero'],
      futuroStem:    'durr',
      congPresente:  ['dUca', 'dUca', 'dUca', 'duciAmo', 'duciAte', 'dUcano'],
      imperativo:    ['dUci', 'dUca', 'duciAmo', 'ducEte', 'dUcano'],
      pp: 'dOtto', gerundio: 'ducEndo'
    }
  };

  // ===================================================================
  //  FAMILY DERIVATION
  //  Prepend an unstressed prefix to every marked form of a base.
  // ===================================================================
  var PREFIXED_FIELDS = ['presente', 'imperfetto', 'passatoRemoto', 'congPresente',
                         'congImperfetto', 'imperativo'];
  var PREFIXED_STRINGS = ['pp', 'gerundio', 'sstem', 'imperfStem', 'futuroStem', 'stem'];

  function derive(base, prefix, inf, tr, aux) {
    var v = { inf: inf, tr: tr, group: base.group, aux: aux || base.aux,
              irregular: true };
    if (base.defectiveImperative) v.defectiveImperative = true;
    PREFIXED_FIELDS.forEach(function (f) {
      if (base[f]) v[f] = base[f].map(function (form) { return prefix + form; });
    });
    PREFIXED_STRINGS.forEach(function (f) {
      if (base[f] != null) v[f] = prefix + base[f];
    });
    return v;
  }

  // family lists: [prefix, infinitive, translation, aux?]
  var FAMILIES = [
    ['prendere', [
      ['ap', 'apprendere', 'to learn'],
      ['com', 'comprendere', 'to understand / include'],
      ['ri', 'riprendere', 'to resume'],
      ['sor', 'sorprendere', 'to surprise'],
      ['intra', 'intraprendere', 'to undertake']
    ]],
    ['mettere', [
      ['am', 'ammettere', 'to admit'],
      ['com', 'commettere', 'to commit'],
      ['per', 'permettere', 'to allow'],
      ['pro', 'promettere', 'to promise'],
      ['ri', 'rimettere', 'to put back'],
      ['s', 'smettere', 'to stop / quit'],
      ['scom', 'scommettere', 'to bet'],
      ['tras', 'trasmettere', 'to transmit'],
      ['di', 'dimettere', 'to dismiss']
    ]],
    ['tenere', [
      ['appar', 'appartenere', 'to belong', 'essere'],
      ['con', 'contenere', 'to contain'],
      ['man', 'mantenere', 'to maintain'],
      ['ot', 'ottenere', 'to obtain'],
      ['ri', 'ritenere', 'to retain / believe'],
      ['sos', 'sostenere', 'to support'],
      ['trat', 'trattenere', 'to hold back']
    ]],
    ['venire', [
      ['av', 'avvenire', 'to happen', 'essere'],
      ['con', 'convenire', 'to agree / suit', 'essere'],
      ['di', 'divenire', 'to become', 'essere'],
      ['inter', 'intervenire', 'to intervene', 'essere'],
      ['pro', 'provenire', 'to come from', 'essere'],
      ['s', 'svenire', 'to faint', 'essere']
    ]],
    ['fare', [
      ['ri', 'rifare', 'to redo'],
      ['dis', 'disfare', 'to undo']
    ]],
    ['dire', [
      ['pre', 'predire', 'to predict'],
      ['contrad', 'contraddire', 'to contradict'],
      ['dis', 'disdire', 'to cancel'],
      ['bene', 'benedire', 'to bless'],
      ['male', 'maledire', 'to curse']
    ]],
    ['porre', [
      ['com', 'comporre', 'to compose'],
      ['pro', 'proporre', 'to propose'],
      ['dis', 'disporre', 'to arrange'],
      ['es', 'esporre', 'to expose'],
      ['im', 'imporre', 'to impose'],
      ['op', 'opporre', 'to oppose'],
      ['sup', 'supporre', 'to suppose'],
      ['ri', 'riporre', 'to put away'],
      ['sotto', 'sottoporre', 'to submit']
    ]],
    ['trarre', [
      ['at', 'attrarre', 'to attract'],
      ['con', 'contrarre', 'to contract'],
      ['es', 'estrarre', 'to extract'],
      ['sot', 'sottrarre', 'to subtract'],
      ['dis', 'distrarre', 'to distract'],
      ['ri', 'ritrarre', 'to portray']
    ]],
    ['scrivere', [
      ['de', 'descrivere', 'to describe'],
      ['i', 'iscrivere', 'to enrol'],
      ['pre', 'prescrivere', 'to prescribe'],
      ['tra', 'trascrivere', 'to transcribe'],
      ['sotto', 'sottoscrivere', 'to sign / subscribe']
    ]]
  ];

  var TEMPLATE_FAMILIES = [
    ['durre', [
      ['con', 'condurre', 'to lead / drive'],
      ['pro', 'produrre', 'to produce'],
      ['ri', 'ridurre', 'to reduce'],
      ['tra', 'tradurre', 'to translate'],
      ['in', 'indurre', 'to induce'],
      ['intro', 'introdurre', 'to introduce'],
      ['se', 'sedurre', 'to seduce']
    ]]
  ];

  // ===================================================================
  //  REGULAR VERBS
  //  [inf, tr] or [inf, tr, {aux, ortho, sstem}]
  //  sstem override is only needed for sdrucciole (3rd-last-syllable) stress.
  // ===================================================================
  var REG = [
    /* -are */
    ['parlare', 'to speak'],
    ['guardare', 'to watch / look at'],
    ['ascoltare', 'to listen'],
    ['lavorare', 'to work'],
    ['amare', 'to love'],
    ['aiutare', 'to help'],
    ['aspettare', 'to wait'],
    ['cantare', 'to sing'],
    ['comprare', 'to buy'],
    ['cucinare', 'to cook'],
    ['imparare', 'to learn'],
    ['incontrare', 'to meet'],
    ['insegnare', 'to teach'],
    ['pensare', 'to think'],
    ['portare', 'to bring / carry'],
    ['provare', 'to try'],
    ['ricordare', 'to remember'],
    ['trovare', 'to find'],
    ['usare', 'to use'],
    ['chiamare', 'to call'],
    ['lavare', 'to wash'],
    ['guadagnare', 'to earn'],
    ['sognare', 'to dream'],
    ['sembrare', 'to seem', { aux: 'essere' }],
    ['costare', 'to cost', { aux: 'essere' }],
    ['cambiare', 'to change', { ortho: 'iare' }],
    ['mandare', 'to send'],
    ['creare', 'to create'],
    ['firmare', 'to sign'],
    ['tagliare', 'to cut', { ortho: 'giare' }],
    ['sbagliare', 'to make a mistake', { ortho: 'giare' }],
    ['svegliare', 'to wake', { ortho: 'giare' }],
    ['pettinare', 'to comb', { sstem: 'pEttin' }],
    ['ordinare', 'to order', { sstem: 'Ordin' }],
    ['immaginare', 'to imagine', { sstem: 'immAgin' }],
    ['considerare', 'to consider', { sstem: 'considEr' }],
    ['desiderare', 'to wish', { sstem: 'desidEr' }],
    ['dimenticare', 'to forget', { ortho: 'care', sstem: 'dimEntic' }],
    ['comunicare', 'to communicate', { ortho: 'care', sstem: 'comUnic' }],
    ['dedicare', 'to dedicate', { ortho: 'care', sstem: 'dEdic' }],
    ['indicare', 'to indicate', { ortho: 'care', sstem: 'Indic' }],
    ['praticare', 'to practise', { ortho: 'care', sstem: 'prAtic' }],
    ['abitare', 'to live / reside', { sstem: 'Abit' }],
    ['telefonare', 'to phone', { sstem: 'telEfon' }],
    ['studiare', 'to study', { ortho: 'iare', sstem: 'stUdi' }],
    ['mangiare', 'to eat', { ortho: 'giare', sstem: 'mAngi' }],
    ['viaggiare', 'to travel', { ortho: 'giare', sstem: 'viAggi' }],
    ['cominciare', 'to begin', { ortho: 'ciare', sstem: 'comInci' }],
    ['lasciare', 'to leave / let', { ortho: 'sciare', sstem: 'lAsci' }],
    ['baciare', 'to kiss', { ortho: 'ciare', sstem: 'bAci' }],
    ['cercare', 'to look for', { ortho: 'care', sstem: 'cErc' }],
    ['giocare', 'to play', { ortho: 'care', sstem: 'giOc' }],
    ['pagare', 'to pay', { ortho: 'gare', sstem: 'pAg' }],
    ['pregare', 'to pray / beg', { ortho: 'gare', sstem: 'prEg' }],
    ['spiegare', 'to explain', { ortho: 'gare', sstem: 'spiEg' }],
    ['visitare', 'to visit', { sstem: 'vIsit' }],
    ['tornare', 'to return', { aux: 'essere' }],
    ['arrivare', 'to arrive', { aux: 'essere' }],
    ['entrare', 'to enter', { aux: 'essere' }],
    ['restare', 'to stay', { aux: 'essere' }],
    ['diventare', 'to become', { aux: 'essere' }],
    ['camminare', 'to walk'],
    ['nuotare', 'to swim'],
    ['ballare', 'to dance'],
    ['suonare', 'to play (instrument)'],
    ['abbracciare', 'to hug', { ortho: 'ciare', sstem: 'abbrAcci' }],
    ['pesare', 'to weigh'],
    ['salutare', 'to greet'],
    ['dimostrare', 'to demonstrate'],
    ['augurare', 'to wish', { sstem: 'augUr' }],
    ['scusare', 'to excuse'],
    ['riposare', 'to rest'],
    ['sperare', 'to hope'],
    ['votare', 'to vote'],
    ['fumare', 'to smoke'],
    ['affittare', 'to rent'],
    ['prenotare', 'to book'],
    ['controllare', 'to check'],
    ['dichiarare', 'to declare'],
    ['fermare', 'to stop'],
    ['funzionare', 'to work / function'],

    /* -ere (regular) */
    ['credere', 'to believe'],
    ['ricevere', 'to receive'],
    ['temere', 'to fear'],
    ['vendere', 'to sell'],
    ['ripetere', 'to repeat'],
    ['battere', 'to beat', { sstem: 'bAtt' }],
    ['premere', 'to press', { sstem: 'prEm' }],
    ['cedere', 'to yield'],
    ['spremere', 'to squeeze', { sstem: 'sprEm' }],

    /* -ire (non-isc) */
    ['dormire', 'to sleep'],
    ['sentire', 'to hear / feel'],
    ['seguire', 'to follow'],
    ['servire', 'to serve'],
    ['vestire', 'to dress'],
    ['partire', 'to leave / depart', { aux: 'essere' }],
    ['aprire', 'to open', { pp: 'apErto' }],
    ['coprire', 'to cover', { pp: 'copErto', sstem: 'cOpr' }],
    ['scoprire', 'to discover', { pp: 'scopErto', sstem: 'scOpr' }],
    ['offrire', 'to offer', { pp: 'offErto' }],
    ['soffrire', 'to suffer', { pp: 'soffErto', sstem: 'sOffr' }],
    ['bollire', 'to boil'],
    ['cucire', 'to sew'],
    ['fuggire', 'to flee', { aux: 'essere' }],
    ['mentire', 'to lie'],
    ['avvertire', 'to warn'],
    ['divertire', 'to amuse'],

    /* -ire (isc) */
    ['finire', 'to finish', { isc: true }],
    ['capire', 'to understand', { isc: true }],
    ['preferire', 'to prefer', { isc: true }],
    ['pulire', 'to clean', { isc: true }],
    ['costruire', 'to build', { isc: true }],
    ['spedire', 'to send', { isc: true }],
    ['unire', 'to unite', { isc: true }],
    ['colpire', 'to hit', { isc: true }],
    ['favorire', 'to favour', { isc: true }],
    ['fornire', 'to supply', { isc: true }],
    ['garantire', 'to guarantee', { isc: true }],
    ['gestire', 'to manage', { isc: true }],
    ['guarire', 'to heal', { isc: true, aux: 'essere' }],
    ['impedire', 'to prevent', { isc: true }],
    ['inserire', 'to insert', { isc: true }],
    ['obbedire', 'to obey', { isc: true }],
    ['proibire', 'to forbid', { isc: true }],
    ['punire', 'to punish', { isc: true }],
    ['reagire', 'to react', { isc: true }],
    ['restituire', 'to give back', { isc: true }],
    ['riferire', 'to report', { isc: true }],
    ['sostituire', 'to replace', { isc: true }],
    ['stabilire', 'to establish', { isc: true }],
    ['suggerire', 'to suggest', { isc: true }],
    ['tradire', 'to betray', { isc: true }],
    ['trasferire', 'to transfer', { isc: true }],
    ['chiarire', 'to clarify', { isc: true }],
    ['dimagrire', 'to lose weight', { isc: true, aux: 'essere' }]
  ];

  // ===================================================================
  //  BUILD
  // ===================================================================
  function computeSstem(stem) {
    var idx = -1;
    for (var i = 0; i < stem.length; i++) {
      if ('aeiouàèéìòù'.indexOf(stem.charAt(i)) !== -1) idx = i;
    }
    if (idx === -1) return stem;
    return stem.slice(0, idx) + stem.charAt(idx).toUpperCase() + stem.slice(idx + 1);
  }

  function buildReg(entry) {
    var inf = entry[0], tr = entry[1], opts = entry[2] || {};
    var group = opts.isc ? 'ire_isc' : inf.slice(-3);
    var v = { inf: inf, tr: tr, group: group, aux: opts.aux || 'avere' };
    if (opts.ortho) v.ortho = opts.ortho;
    if (opts.pp) v.pp = opts.pp;
    if (group !== 'ire_isc') {
      v.sstem = opts.sstem || computeSstem(inf.slice(0, -3));
    }
    return v;
  }

  // 1) irregular bases
  Object.keys(BASES).forEach(function (k) { VERBS[k] = BASES[k]; });

  // 2) families from real bases
  FAMILIES.forEach(function (fam) {
    var base = BASES[fam[0]];
    fam[1].forEach(function (m) {
      VERBS[m[1]] = derive(base, m[0], m[1], m[2], m[3]);
    });
  });
  // 3) families from templates
  TEMPLATE_FAMILIES.forEach(function (fam) {
    var base = TEMPLATES[fam[0]];
    fam[1].forEach(function (m) {
      VERBS[m[1]] = derive(base, m[0], m[1], m[2], m[3]);
    });
  });

  // 4) regular verbs (skip the placeholder)
  REG.forEach(function (entry) {
    if (entry[0].indexOf('?') !== -1) return;
    VERBS[entry[0]] = buildReg(entry);
  });

  // ===================================================================
  //  EXPANSION BATCH
  // ===================================================================

  // -- full irregular verbs added directly --
  var EXTRA_FULL = {
    tacere: {
      inf: 'tacere', tr: 'to be silent', group: 'ere', stem: 'tac', aux: 'avere', irregular: true,
      presente:      ['tAccio', 'tAci', 'tAce', 'tacciAmo', 'tacEte', 'tAcciono'],
      passatoRemoto: ['tAcqui', 'tacEsti', 'tAcque', 'tacEmmo', 'tacEste', 'tAcquero'],
      congPresente:  ['tAccia', 'tAccia', 'tAccia', 'tacciAmo', 'tacciAte', 'tAcciano'],
      pp: 'taciUto'
    }
  };
  Object.keys(EXTRA_FULL).forEach(function (k) { BASES[k] = EXTRA_FULL[k]; VERBS[k] = EXTRA_FULL[k]; });

  // -- sigmatic -ere verbs: regular present/imperfect/future, irregular
  //    passato remoto (1/3/6 = strong root) and past participle.
  //    row: [inf, tr, stem, strongRoot(marked), pp(marked), aux?]
  function buildSig(r) {
    var stem = r[2], root = r[3];
    return {
      inf: r[0], tr: r[1], group: 'ere', stem: stem, aux: r[5] || 'avere', irregular: true,
      sstem: computeSstem(stem),
      passatoRemoto: [root + 'i', stem + 'Esti', root + 'e', stem + 'Emmo', stem + 'Este', root + 'ero'],
      pp: r[4]
    };
  }
  var SIG = [
    ['nascondere', 'to hide', 'nascond', 'nascOs', 'nascOsto'],
    ['spendere', 'to spend', 'spend', 'spEs', 'spEso'],
    ['accendere', 'to switch on', 'accend', 'accEs', 'accEso'],
    ['difendere', 'to defend', 'difend', 'difEs', 'difEso'],
    ['offendere', 'to offend', 'offend', 'offEs', 'offEso'],
    ['rendere', 'to render / give back', 'rend', 'rEs', 'rEso'],
    ['tendere', 'to stretch / tend', 'tend', 'tEs', 'tEso'],
    ['fondere', 'to melt / merge', 'fond', 'fUs', 'fUso'],
    ['dividere', 'to divide', 'divid', 'divIs', 'divIso'],
    ['decidere', 'to decide', 'decid', 'decIs', 'decIso'],
    ['ridere', 'to laugh', 'rid', 'rIs', 'rIso'],
    ['uccidere', 'to kill', 'uccid', 'uccIs', 'uccIso'],
    ['spingere', 'to push', 'sping', 'spIns', 'spInto'],
    ['stringere', 'to tighten', 'string', 'strIns', 'strEtto'],
    ['dipingere', 'to paint', 'diping', 'dipIns', 'dipInto'],
    ['piangere', 'to cry', 'piang', 'piAns', 'piAnto'],
    ['fingere', 'to pretend', 'fing', 'fIns', 'fInto'],
    ['giungere', 'to arrive / reach', 'giung', 'giUns', 'giUnto', 'essere'],
    ['reggere', 'to hold / support', 'regg', 'rEss', 'rEtto'],
    ['friggere', 'to fry', 'frigg', 'frIss', 'frItto'],
    ['proteggere', 'to protect', 'protegg', 'protEss', 'protEtto'],
    ['distruggere', 'to destroy', 'distrugg', 'distrUss', 'distrUtto'],
    ['crescere', 'to grow', 'cresc', 'crEbb', 'cresciUto', 'essere'],
    ['mordere', 'to bite', 'mord', 'mOrs', 'mOrso'],
    ['concedere', 'to grant', 'conced', 'concEss', 'concEsso'],
    ['succedere', 'to happen', 'succed', 'succEss', 'succEsso', 'essere'],
    ['porgere', 'to hand / offer', 'porg', 'pOrs', 'pOrto'],
    ['sorgere', 'to rise', 'sorg', 'sOrs', 'sOrto', 'essere'],
    ['appendere', 'to hang', 'append', 'appEs', 'appEso']
  ];
  SIG.forEach(function (r) { var v = buildSig(r); BASES[r[0]] = v; VERBS[r[0]] = v; });

  // -- new template: -cludere --
  TEMPLATES.cludere = {
    group: 'ere', aux: 'avere', irregular: true, stem: 'clud', sstem: 'clUd',
    passatoRemoto: ['clUsi', 'cludEsti', 'clUse', 'cludEmmo', 'cludEste', 'clUsero'], pp: 'clUso'
  };

  // -- more families (bases now include SIG additions) --
  var EXTRA_FAMILIES = [
    ['tendere', [
      ['at', 'attendere', 'to wait for'], ['pre', 'pretendere', 'to demand'],
      ['in', 'intendere', 'to intend / mean'], ['es', 'estendere', 'to extend'],
      ['s', 'stendere', 'to lay out']
    ]],
    ['fondere', [['con', 'confondere', 'to confuse'], ['dif', 'diffondere', 'to spread']]],
    ['reggere', [['cor', 'correggere', 'to correct'], ['sor', 'sorreggere', 'to hold up']]],
    ['vincere', [['con', 'convincere', 'to convince']]],
    ['correre', [
      ['ac', 'accorrere', 'to rush', 'essere'], ['oc', 'occorrere', 'to be necessary', 'essere'],
      ['per', 'percorrere', 'to cover (distance)'], ['ri', 'ricorrere', 'to resort / recur'],
      ['soc', 'soccorrere', 'to rescue']
    ]],
    ['vivere', [['soprav', 'sopravvivere', 'to survive', 'essere'], ['con', 'convivere', 'to live together']]],
    ['conoscere', [['ri', 'riconoscere', 'to recognize']]],
    ['chiedere', [['ri', 'richiedere', 'to require']]],
    ['scendere', [['di', 'discendere', 'to descend', 'essere']]]
  ];
  EXTRA_FAMILIES.forEach(function (fam) {
    var base = BASES[fam[0]];
    fam[1].forEach(function (m) { VERBS[m[1]] = derive(base, m[0], m[1], m[2], m[3]); });
  });
  [['cludere', [
    ['in', 'includere', 'to include'], ['con', 'concludere', 'to conclude'],
    ['es', 'escludere', 'to exclude'], ['pre', 'precludere', 'to preclude']
  ]]].forEach(function (fam) {
    var base = TEMPLATES[fam[0]];
    fam[1].forEach(function (m) { VERBS[m[1]] = derive(base, m[0], m[1], m[2], m[3]); });
  });

  // -- more regular verbs --
  var EXTRA_REG = [
    ['accettare', 'to accept'],
    ['alzare', 'to raise / lift'],
    ['apprezzare', 'to appreciate', { sstem: 'apprEzz' }],
    ['aumentare', 'to increase'],
    ['calcolare', 'to calculate', { sstem: 'cAlcol' }],
    ['collegare', 'to connect', { ortho: 'gare', sstem: 'collEg' }],
    ['completare', 'to complete'],
    ['confermare', 'to confirm'],
    ['conservare', 'to preserve'],
    ['consigliare', 'to advise', { ortho: 'giare', sstem: 'consIgli' }],
    ['continuare', 'to continue', { sstem: 'contInu' }],
    ['curare', 'to cure / care for'],
    ['disegnare', 'to draw'],
    ['evitare', 'to avoid', { sstem: 'Evit' }],
    ['girare', 'to turn'],
    ['iniziare', 'to begin', { ortho: 'iare', sstem: 'inIzi' }],
    ['interessare', 'to interest'],
    ['invitare', 'to invite'],
    ['mancare', 'to miss / lack', { ortho: 'care', aux: 'essere' }],
    ['migliorare', 'to improve'],
    ['misurare', 'to measure'],
    ['occupare', 'to occupy', { sstem: 'Occup' }],
    ['organizzare', 'to organize', { sstem: 'organIzz' }],
    ['osservare', 'to observe'],
    ['passare', 'to pass'],
    ['presentare', 'to present'],
    ['raccontare', 'to tell'],
    ['regalare', 'to give (as a gift)'],
    ['rispettare', 'to respect'],
    ['saltare', 'to jump'],
    ['salvare', 'to save'],
    ['significare', 'to mean', { ortho: 'care', sstem: 'signIfic' }],
    ['sistemare', 'to arrange'],
    ['superare', 'to overcome', { sstem: 'sUper' }],
    ['terminare', 'to end', { sstem: 'termIn' }],
    ['tirare', 'to pull'],
    ['utilizzare', 'to use', { sstem: 'utilIzz' }],
    ['verificare', 'to verify', { ortho: 'care', sstem: 'verIfic' }],
    ['sposare', 'to marry'],
    ['abolire', 'to abolish', { isc: true }],
    ['agire', 'to act', { isc: true }],
    ['arricchire', 'to enrich', { isc: true }],
    ['condire', 'to season', { isc: true }],
    ['definire', 'to define', { isc: true }],
    ['digerire', 'to digest', { isc: true }],
    ['distribuire', 'to distribute', { isc: true }],
    ['esaurire', 'to exhaust', { isc: true }],
    ['fallire', 'to fail', { isc: true }],
    ['ferire', 'to wound', { isc: true }],
    ['ingrandire', 'to enlarge', { isc: true }],
    ['percepire', 'to perceive', { isc: true }],
    ['rapire', 'to kidnap', { isc: true }],
    ['scolpire', 'to sculpt', { isc: true }],
    ['sparire', 'to disappear', { isc: true, aux: 'essere' }],
    ['stupire', 'to amaze', { isc: true }],
    ['subire', 'to undergo', { isc: true }],
    ['svanire', 'to vanish', { isc: true, aux: 'essere' }],
    ['tossire', 'to cough', { isc: true }],
    ['convertire', 'to convert'],
    ['investire', 'to invest / hit'],
    ['nutrire', 'to nourish'],
    ['applaudire', 'to applaud']
  ];
  EXTRA_REG.forEach(function (entry) { VERBS[entry[0]] = buildReg(entry); });

  // ===================================================================
  //  EXPANSION BATCH 2
  // ===================================================================

  // -- irregular-present full bases --
  var EXTRA_FULL2 = {
    togliere: {
      inf: 'togliere', tr: 'to remove', group: 'ere', stem: 'togli', aux: 'avere', irregular: true,
      presente:      ['tOlgo', 'tOgli', 'tOglie', 'togliAmo', 'togliEte', 'tOlgono'],
      passatoRemoto: ['tOlsi', 'togliEsti', 'tOlse', 'togliEmmo', 'togliEste', 'tOlsero'],
      congPresente:  ['tOlga', 'tOlga', 'tOlga', 'togliAmo', 'togliAte', 'tOlgano'],
      imperativo:    ['tOgli', 'tOlga', 'togliAmo', 'togliEte', 'tOlgano'],
      pp: 'tOlto'
    },
    valere: {
      inf: 'valere', tr: 'to be worth', group: 'ere', stem: 'val', aux: 'essere', irregular: true,
      presente:      ['vAlgo', 'vAli', 'vAle', 'valiAmo', 'valEte', 'vAlgono'],
      passatoRemoto: ['vAlsi', 'valEsti', 'vAlse', 'valEmmo', 'valEste', 'vAlsero'],
      futuroStem:    'varr',
      congPresente:  ['vAlga', 'vAlga', 'vAlga', 'valiAmo', 'valiAte', 'vAlgano'],
      imperativo:    ['vAli', 'vAlga', 'valiAmo', 'valEte', 'vAlgano'],
      pp: 'vAlso'
    },
    giacere: {
      inf: 'giacere', tr: 'to lie (down)', group: 'ere', stem: 'giac', aux: 'essere', irregular: true,
      presente:      ['giAccio', 'giAci', 'giAce', 'giacciAmo', 'giacEte', 'giAcciono'],
      passatoRemoto: ['giAcqui', 'giacEsti', 'giAcque', 'giacEmmo', 'giacEste', 'giAcquero'],
      congPresente:  ['giAccia', 'giAccia', 'giAccia', 'giacciAmo', 'giacciAte', 'giAcciano'],
      pp: 'giaciUto'
    },
    cuocere: {
      inf: 'cuocere', tr: 'to cook', group: 'ere', stem: 'cuoc', aux: 'avere', irregular: true,
      presente:      ['cuOcio', 'cuOci', 'cuOce', 'cuociAmo', 'cuocEte', 'cuOciono'],
      passatoRemoto: ['cOssi', 'cuocEsti', 'cOsse', 'cuocEmmo', 'cuocEste', 'cOssero'],
      congPresente:  ['cuOcia', 'cuOcia', 'cuOcia', 'cuociAmo', 'cuociAte', 'cuOciano'],
      imperativo:    ['cuOci', 'cuOcia', 'cuociAmo', 'cuocEte', 'cuOciano'],
      pp: 'cOtto'
    }
  };
  Object.keys(EXTRA_FULL2).forEach(function (k) { BASES[k] = EXTRA_FULL2[k]; VERBS[k] = EXTRA_FULL2[k]; });

  // -- more sigmatic -ere bases --
  var SIG2 = [
    ['cingere', 'to encircle', 'cing', 'cIns', 'cInto'],
    ['spargere', 'to scatter', 'sparg', 'spArs', 'spArso'],
    ['torcere', 'to twist', 'torc', 'tOrs', 'tOrto'],
    ['scorgere', 'to make out', 'scorg', 'scOrs', 'scOrto'],
    ['volgere', 'to turn', 'volg', 'vOls', 'vOlto'],
    ['immergere', 'to immerse', 'immerg', 'immErs', 'immErso'],
    ['emergere', 'to emerge', 'emerg', 'emErs', 'emErso', 'essere'],
    ['assumere', 'to hire / take on', 'assum', 'assUns', 'assUnto'],
    ['presumere', 'to presume', 'presum', 'presUns', 'presUnto'],
    ['esprimere', 'to express', 'esprim', 'esprEss', 'esprEsso'],
    ['comprimere', 'to compress', 'comprim', 'comprEss', 'comprEsso'],
    ['opprimere', 'to oppress', 'opprim', 'opprEss', 'opprEsso'],
    ['reprimere', 'to repress', 'reprim', 'reprEss', 'reprEsso'],
    ['imprimere', 'to imprint', 'imprim', 'imprEss', 'imprEsso'],
    ['deprimere', 'to depress', 'deprim', 'deprEss', 'deprEsso'],
    ['deludere', 'to disappoint', 'delud', 'delUs', 'delUso'],
    ['illudere', 'to delude', 'illud', 'illUs', 'illUso'],
    ['alludere', 'to allude', 'allud', 'allUs', 'allUso'],
    ['eludere', 'to elude', 'elud', 'elUs', 'elUso'],
    ['radere', 'to shave', 'rad', 'rAs', 'rAso'],
    ['invadere', 'to invade', 'invad', 'invAs', 'invAso'],
    ['evadere', 'to evade', 'evad', 'evAs', 'evAso', 'essere'],
    ['persuadere', 'to persuade', 'persuad', 'persuAs', 'persuAso'],
    ['rodere', 'to gnaw', 'rod', 'rOs', 'rOso'],
    ['esplodere', 'to explode', 'esplod', 'esplOs', 'esplOso', 'essere'],
    ['mungere', 'to milk', 'mung', 'mUns', 'mUnto'],
    ['ungere', 'to grease', 'ung', 'Uns', 'Unto'],
    ['pungere', 'to sting', 'pung', 'pUns', 'pUnto'],
    ['discutere', 'to discuss', 'discut', 'discUss', 'discUsso'],
    ['affliggere', 'to afflict', 'afflig', 'afflIss', 'afflItto'],
    ['infliggere', 'to inflict', 'inflig', 'inflIss', 'inflItto'],
    ['sconfiggere', 'to defeat', 'sconfig', 'sconfIss', 'sconfItto'],
    ['dirigere', 'to direct', 'dirig', 'dirEss', 'dirEtto'],
    ['erigere', 'to erect', 'erig', 'erEss', 'erEtto'],
    ['redigere', 'to draft', 'redig', 'redAss', 'redAtto'],
    ['struggere', 'to consume (with longing)', 'strugg', 'strUss', 'strUtto'],
    ['assolvere', 'to absolve', 'assolv', 'assOls', 'assOlto'],
    ['risolvere', 'to resolve', 'risolv', 'risOls', 'risOlto'],
    ['scindere', 'to split', 'scind', 'scIss', 'scIsso'],
    ['rescindere', 'to rescind', 'rescind', 'rescIss', 'rescIsso'],
    ['prescindere', 'to disregard', 'prescind', 'prescIss', 'prescIsso']
  ];
  SIG2.forEach(function (r) { var v = buildSig(r); BASES[r[0]] = v; VERBS[r[0]] = v; });

  // -- new template: -cuotere (scuotere / percuotere / riscuotere) --
  TEMPLATES.cuotere = {
    group: 'ere', aux: 'avere', irregular: true, stem: 'cuot',
    presente:      ['cuOto', 'cuOti', 'cuOte', 'cuotiAmo', 'cuotEte', 'cuOtono'],
    passatoRemoto: ['cOssi', 'cuotEsti', 'cOsse', 'cuotEmmo', 'cuotEste', 'cOssero'],
    congPresente:  ['cuOta', 'cuOta', 'cuOta', 'cuotiAmo', 'cuotiAte', 'cuOtano'],
    imperativo:    ['cuOti', 'cuOta', 'cuotiAmo', 'cuotEte', 'cuOtano'],
    pp: 'cOsso'
  };

  // -- more families off existing/new bases --
  var EXTRA_FAMILIES2 = [
    ['giungere', [
      ['ag', 'aggiungere', 'to add', 'avere'], ['rag', 'raggiungere', 'to reach', 'avere'],
      ['con', 'congiungere', 'to join', 'avere'], ['sog', 'soggiungere', 'to add (say)', 'avere']
    ]],
    ['volgere', [
      ['s', 'svolgere', 'to carry out'], ['ri', 'rivolgere', 'to address'],
      ['av', 'avvolgere', 'to wrap'], ['coin', 'coinvolgere', 'to involve'],
      ['scon', 'sconvolgere', 'to upset'], ['tra', 'travolgere', 'to overwhelm']
    ]],
    ['muovere', [
      ['com', 'commuovere', 'to move (emotionally)'], ['pro', 'promuovere', 'to promote'],
      ['ri', 'rimuovere', 'to remove']
    ]],
    ['cogliere', [['rac', 'raccogliere', 'to collect'], ['ac', 'accogliere', 'to welcome']]],
    ['chiudere', [
      ['rac', 'racchiudere', 'to enclose'], ['rin', 'rinchiudere', 'to shut in'], ['s', 'schiudere', 'to open up']
    ]],
    ['crescere', [['ac', 'accrescere', 'to increase', 'avere'], ['rin', 'rincrescere', 'to regret', 'essere']]],
    ['piacere', [['dis', 'dispiacere', 'to be sorry', 'essere'], ['com', 'compiacere', 'to please', 'avere']]],
    ['sorgere', [['ri', 'risorgere', 'to rise again'], ['in', 'insorgere', 'to rise up']]],
    ['porgere', [['s', 'sporgere', 'to lean out']]],
    ['assumere', [['ri', 'riassumere', 'to summarize']]],
    ['dividere', [['con', 'condividere', 'to share'], ['sud', 'suddividere', 'to subdivide']]],
    ['ridere', [['sor', 'sorridere', 'to smile'], ['de', 'deridere', 'to mock']]]
  ];
  EXTRA_FAMILIES2.forEach(function (fam) {
    var base = BASES[fam[0]];
    fam[1].forEach(function (m) { VERBS[m[1]] = derive(base, m[0], m[1], m[2], m[3]); });
  });
  [['cuotere', [
    ['s', 'scuotere', 'to shake'], ['per', 'percuotere', 'to strike'], ['ris', 'riscuotere', 'to collect (money)']
  ]]].forEach(function (fam) {
    var base = TEMPLATES[fam[0]];
    fam[1].forEach(function (m) { VERBS[m[1]] = derive(base, m[0], m[1], m[2], m[3]); });
  });

  // -- more regular verbs --
  var EXTRA_REG2 = [
    ['abbandonare', 'to abandon', { sstem: 'abbandOn' }],
    ['accompagnare', 'to accompany', { sstem: 'accompAgn' }],
    ['adorare', 'to adore'],
    ['affrontare', 'to face'],
    ['allenare', 'to train'],
    ['ammirare', 'to admire'],
    ['asciugare', 'to dry', { ortho: 'gare', sstem: 'asciUg' }],
    ['attaccare', 'to attach / attack', { ortho: 'care', sstem: 'attAcc' }],
    ['avvicinare', 'to bring near', { sstem: 'avvicIn' }],
    ['bagnare', 'to wet'],
    ['bloccare', 'to block', { ortho: 'care', sstem: 'blOcc' }],
    ['bussare', 'to knock'],
    ['buttare', 'to throw'],
    ['celebrare', 'to celebrate', { sstem: 'cElebr' }],
    ['collaborare', 'to collaborate', { sstem: 'collAbor' }],
    ['consumare', 'to consume'],
    ['criticare', 'to criticize', { ortho: 'care', sstem: 'crItic' }],
    ['esagerare', 'to exaggerate', { sstem: 'esAger' }],
    ['esplorare', 'to explore'],
    ['festeggiare', 'to celebrate', { ortho: 'giare', sstem: 'festEggi' }],
    ['frequentare', 'to attend'],
    ['ignorare', 'to ignore'],
    ['illuminare', 'to illuminate', { sstem: 'illUmin' }],
    ['indossare', 'to wear'],
    ['litigare', 'to quarrel', { ortho: 'gare', sstem: 'lItig' }],
    ['odiare', 'to hate', { ortho: 'iare', sstem: 'Odi' }],
    ['ospitare', 'to host', { sstem: 'Ospit' }],
    ['pranzare', 'to have lunch'],
    ['preparare', 'to prepare'],
    ['pronunciare', 'to pronounce', { ortho: 'ciare', sstem: 'pronUnci' }],
    ['raccomandare', 'to recommend'],
    ['respirare', 'to breathe'],
    ['ringraziare', 'to thank', { ortho: 'iare', sstem: 'ringrAzi' }],
    ['rovinare', 'to ruin'],
    ['scherzare', 'to joke'],
    ['spaventare', 'to frighten'],
    ['spostare', 'to move'],
    ['tremare', 'to tremble'],
    ['versare', 'to pour'],
    ['inseguire', 'to chase'],
    ['proseguire', 'to continue'],
    ['consentire', 'to consent'],
    ['ripartire', 'to set off again', { aux: 'essere' }],
    ['abbellire', 'to embellish', { isc: true }],
    ['approfondire', 'to deepen', { isc: true }],
    ['arrossire', 'to blush', { isc: true, aux: 'essere' }],
    ['attribuire', 'to attribute', { isc: true }],
    ['contribuire', 'to contribute', { isc: true }],
    ['custodire', 'to guard', { isc: true }],
    ['demolire', 'to demolish', { isc: true }],
    ['esibire', 'to exhibit', { isc: true }],
    ['fiorire', 'to bloom', { isc: true, aux: 'essere' }],
    ['gioire', 'to rejoice', { isc: true }],
    ['gradire', 'to appreciate', { isc: true }],
    ['impazzire', 'to go mad', { isc: true, aux: 'essere' }],
    ['infastidire', 'to annoy', { isc: true }],
    ['intuire', 'to sense', { isc: true }],
    ['partorire', 'to give birth', { isc: true }],
    ['riunire', 'to reunite', { isc: true }],
    ['sancire', 'to sanction', { isc: true }],
    ['smentire', 'to deny', { isc: true }],
    ['snellire', 'to slim down', { isc: true }],
    ['trasgredire', 'to break (rules)', { isc: true }],
    ['ubbidire', 'to obey', { isc: true }]
  ];
  EXTRA_REG2.forEach(function (entry) { VERBS[entry[0]] = buildReg(entry); });

  // sorted infinitive list for autocomplete
  var VERB_LIST = Object.keys(VERBS).map(function (k) {
    return { inf: VERBS[k].inf, tr: VERBS[k].tr };
  }).sort(function (a, b) { return a.inf < b.inf ? -1 : 1; });

  global.VerbData = { VERBS: VERBS, VERB_LIST: VERB_LIST };
})(typeof window !== 'undefined' ? window : this);
