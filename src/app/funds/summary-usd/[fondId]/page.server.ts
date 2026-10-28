import { metadonneesFiche } from "@/lib/fundMetadata";

/**
 * Les metadonnees de cette fiche sont construites par `@/lib/fundMetadata`,
 * commun aux sept fiches fonds. Ce module documente les deux defauts qu'il
 * corrige — le « null » affiche a la place d'un ISIN absent (451 fonds sur
 * 1 260) et le suffixe « | Fundafrique » ecrit deux fois.
 */
export async function generateMetadata({ params }: { params: { fondId: string } }) {
    return metadonneesFiche(params.fondId, {
        chemin: 'summary-usd',
        suffixeTitre: 'Synthèse USD OPCVM Afrique',
        repli: 'Synthèse USD',
        description: f => `Synthèse en USD du fonds OPCVM ${f.nom_fond}${f.avecIsin} du ${f.pays}${f.parGestion} : VL, performances et ratios de risque convertis en dollars sur Fundafrique.`,
        ogTitre: f => `${f.nom_fond} - Synthèse USD OPCVM ${f.pays} | Fundafrique`,
        ogDescription: f => `Synthèse en USD du fonds ${f.nom_fond}${f.avecIsin} : valeur liquidative, performances et ratios de risque.`,
    });
}
