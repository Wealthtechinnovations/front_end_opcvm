/**
 * VERIFICATION : les huit fiches fonds acceptent-elles les DEUX formes d URL ?
 *
 * Interroge chaque fiche sous `/1141` et sous `/afrinvest-dollar-fund-1141`, et
 * verifie quel identifiant part reellement dans les URL d API appelees. Attendu :
 * `1141` partout, et AUCUN `NaN`.
 *
 * POURQUOI CE SCRIPT EXISTE. Mesure du 2026-10-30 (lot DJ) : six fiches sur
 * sept faisaient `Number(params.fondId)`, qui vaut `NaN` sur un slug, et
 * appelaient donc `/api/.../NaN` — alors que leur balise canonique designait
 * precisement l URL a slug. Les canoniques annoncaient a Google une page sans
 * donnees. Le lot DK a corrige les sept vues ; ce script empeche la regression.
 *
 * CE QU IL MESURE, ET CE QU IL NE MESURE PAS. Il mesure l IDENTIFIANT envoye a
 * l API, lu sur les requetes reellement emises par le navigateur. Il ne mesure
 * PAS le contenu affiche : lance contre une instance locale, les requetes vers
 * l API de production sont bloquees par le CORS, et le corps reste vide quelle
 * que soit la correction. Un harnais qui jugerait le contenu en local
 * rapporterait donc un echec identique pour une page saine et pour une page
 * cassee — il ne mesurerait que lui-meme. C est arrive avant d arriver a cette
 * version : la premiere annonçait « 16 combinaisons en echec », y compris sur
 * `/funds/1141` qui fonctionne en production.
 *
 * Pour juger le CONTENU, viser une instance de meme origine que l API :
 *   BASE=https://africafunds.chainsolutions.fr node scripts/verif_slug_fiches_fonds.js
 *
 * Usage local (apres `npm run build` et `npx next start -p 3100`) :
 *   node scripts/verif_slug_fiches_fonds.js
 *
 * LECTURE SEULE : requetes GET uniquement.
 */
const { chromium } = require('playwright');
const B = process.env.BASE || 'http://127.0.0.1:3100';
const S = 'afrinvest-dollar-fund-1141';
const segs = ['', 'summary-eur/', 'summary-usd/', 'history/', 'portfolio/', 'documents/', 'download-nav/', 'performance/'];
(async () => {
  const b = await chromium.launch();
  let mauvais = 0, total = 0;
  for (const seg of segs) {
    for (const ref of [S, '1141']) {
      const p = await b.newPage();
      const ids = new Set();
      p.on('request', r => {
        const m = r.url().match(/\/api\/[^?]*?\/([A-Za-z0-9_.-]+)(?:\/[A-Z]{3})?$/);
        if (r.url().includes('/api/') && !r.url().includes('/auth/') && m) ids.add(m[1]);
      });
      try { await p.goto(`${B}/funds/${seg}${ref}`, { waitUntil: 'domcontentloaded', timeout: 40000 }); } catch (e) {}
      await p.waitForTimeout(5000);
      const liste = [...ids];
      const nan = liste.filter(x => x === 'NaN');
      total++;
      if (nan.length || !liste.includes('1141')) mauvais++;
      console.log(`${(seg + ref.slice(0,26)).padEnd(40)} ids=${JSON.stringify(liste.slice(0,4))} NaN=${nan.length}`);
      await p.close();
    }
  }
  console.log(mauvais === 0
    ? `\nLES ${total} COMBINAISONS ENVOIENT L IDENTIFIANT 1141, AUCUN NaN`
    : `\n${mauvais}/${total} COMBINAISON(S) FAUTIVE(S)`);
  await b.close();
})();
