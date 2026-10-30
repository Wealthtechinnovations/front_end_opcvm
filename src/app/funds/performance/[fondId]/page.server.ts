import { metadonneesFiche } from "@/lib/fundMetadata";

/**
 * Metadonnees de la page « Performances » d'un fonds, construites par
 * `@/lib/fundMetadata`, commun aux fiches fonds.
 *
 * POURQUOI CETTE PAGE A EXIGE UN DECOUPAGE. Les sept autres fiches separaient
 * deja un obus serveur (`page.tsx`) de leur composant client. Celle-ci etait
 * **elle-meme** `"use client"` sur 1 151 lignes, et un composant client ne peut
 * pas exporter `generateMetadata` : c'est la raison pour laquelle elle etait
 * restee la seule page fonds publique sans metadonnees. Le composant est donc
 * deplace dans `PerformanceView.tsx` — par `git mv`, sans une ligne modifiee,
 * et il n'avait aucun import relatif — et `page.tsx` devient l'obus mince des
 * quatre autres fiches, a l'identique.
 *
 * ZERO REGRESSION : le rendu est le meme composant, le meme `force-dynamic`, le
 * meme comportement client. Seules des metadonnees s'ajoutent, qui n'existaient
 * pas.
 */
export async function generateMetadata({ params }: { params: { fondId: string } }) {
    return metadonneesFiche(params.fondId, {
        // Canonique a slug, comme les sept autres fiches. Elle etait
        // provisoirement numerique au lot DJ parce que la vue rendait `NaN`
        // sous une URL a slug ; le lot DK l'a rendue tolerante, la canonique
        // designe donc a nouveau une page qui affiche ses donnees.
        chemin: 'performance',
        suffixeTitre: 'Performances OPCVM Afrique',
        repli: 'Performances',
        description: f => `Performances du fonds OPCVM ${f.nom_fond}${f.avecIsin} du ${f.pays}${f.parGestion} : rendements YTD, 1 mois, 3 mois, 1 an, 3 ans, 5 ans et depuis création, comparés à son benchmark sur Fundafrique.`,
        ogTitre: f => `${f.nom_fond} - Performances OPCVM ${f.pays} | Fundafrique`,
        ogDescription: f => `Performances du fonds ${f.nom_fond}${f.avecIsin} : rendements sur toutes les périodes et comparaison au benchmark déclaré.`,
    });
}
