import { metadonneesFiche } from "@/lib/fundMetadata";

/**
 * Les metadonnees de cette fiche sont construites par `@/lib/fundMetadata`,
 * commun aux sept fiches fonds. Ce module documente les deux defauts qu'il
 * corrige — le « null » affiche a la place d'un ISIN absent (451 fonds sur
 * 1 260) et le suffixe « | Fundafrique » ecrit deux fois.
 */
export async function generateMetadata({ params }: { params: { fondId: string } }) {
    return metadonneesFiche(params.fondId, {
        chemin: 'documents',
        suffixeTitre: 'Documents OPCVM Afrique',
        repli: 'Documents du fonds',
        description: f => `Documents du fonds OPCVM ${f.nom_fond}${f.avecIsin} du ${f.pays}${f.parGestion} : notice d'information, rapports et documents réglementaires sur Fundafrique.`,
        ogTitre: f => `${f.nom_fond} - Documents OPCVM ${f.pays} | Fundafrique`,
        ogDescription: f => `Documents réglementaires du fonds ${f.nom_fond}${f.avecIsin}.`,
    });
}
