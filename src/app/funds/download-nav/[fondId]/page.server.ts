import { metadonneesFiche } from "@/lib/fundMetadata";

/**
 * Les metadonnees de cette fiche sont construites par `@/lib/fundMetadata`,
 * commun aux sept fiches fonds. Ce module documente les deux defauts qu'il
 * corrige — le « null » affiche a la place d'un ISIN absent (451 fonds sur
 * 1 260) et le suffixe « | Fundafrique » ecrit deux fois.
 */
export async function generateMetadata({ params }: { params: { fondId: string } }) {
    return metadonneesFiche(params.fondId, {
        chemin: 'download-nav',
        suffixeTitre: 'Télécharger les VL OPCVM Afrique',
        repli: 'Télécharger les VL',
        description: f => `Télécharger les valeurs liquidatives du fonds OPCVM ${f.nom_fond}${f.avecIsin} du ${f.pays}${f.parGestion} : export des VL historiques sur Fundafrique.`,
        ogTitre: f => `${f.nom_fond} - Télécharger les VL OPCVM ${f.pays} | Fundafrique`,
        ogDescription: f => `Télécharger les valeurs liquidatives du fonds ${f.nom_fond}${f.avecIsin} : export des VL historiques.`,
    });
}
