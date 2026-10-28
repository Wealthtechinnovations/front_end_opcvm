import { metadonneesFiche } from "@/lib/fundMetadata";

/**
 * Les metadonnees de cette fiche sont construites par `@/lib/fundMetadata`,
 * commun aux sept fiches fonds. Ce module documente les deux defauts qu'il
 * corrige — le « null » affiche a la place d'un ISIN absent (451 fonds sur
 * 1 260) et le suffixe « | Fundafrique » ecrit deux fois.
 */
export async function generateMetadata({ params }: { params: { fondId: string } }) {
    return metadonneesFiche(params.fondId, {
        chemin: 'portfolio',
        suffixeTitre: 'Composition du portefeuille OPCVM Afrique',
        repli: 'Composition du portefeuille',
        description: f => `Composition du portefeuille du fonds OPCVM ${f.nom_fond}${f.avecIsin} du ${f.pays}${f.parGestion} : répartition des actifs et détails du portefeuille sur Fundafrique.`,
        ogTitre: f => `${f.nom_fond} - Composition du portefeuille OPCVM ${f.pays} | Fundafrique`,
        ogDescription: f => `Composition du portefeuille du fonds ${f.nom_fond}${f.avecIsin} : répartition des actifs et détails du portefeuille.`,
    });
}
