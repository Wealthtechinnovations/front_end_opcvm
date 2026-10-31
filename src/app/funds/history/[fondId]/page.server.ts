import { metadonneesFiche } from "@/lib/fundMetadata";

/**
 * Les metadonnees de cette fiche sont construites par `@/lib/fundMetadata`,
 * commun aux sept fiches fonds. Ce module documente les deux defauts qu'il
 * corrige — le « null » affiche a la place d'un ISIN absent (451 fonds sur
 * 1 260) et le suffixe « | Fundafrique » ecrit deux fois.
 */
export async function generateMetadata({ params }: { params: { fondId: string } }) {
    return metadonneesFiche(params.fondId, {
        chemin: 'history',
        suffixeTitre: 'Historique VL OPCVM Afrique',
        repli: 'Historique VL',
        description: f => `Historique des valeurs liquidatives du fonds OPCVM ${f.nom_fond}${f.avecIsin} du ${f.pays}${f.parGestion} : courbe base 100, performances mensuelles et annuelles sur Fundafrique.`,
        ogTitre: f => `${f.nom_fond} - Historique VL OPCVM ${f.pays} | Fundafrique`,
        ogDescription: f => `Historique complet du fonds ${f.nom_fond}${f.avecIsin} : courbe base 100, performances mensuelles et annuelles.`,
    });
}
