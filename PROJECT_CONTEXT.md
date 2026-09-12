# PROJECT_CONTEXT — AfricaFunds Frontend

> Statut : `APPLICABLE`
> Produit canonique : **AfricaFunds**.
> Repository : `Wealthtechinnovations/front_end_opcvm`.
> Branche canonique : `claude/code-review-improvements-ikvuj`.
> Production : S2.

## Identité projet versionnée

```text
PROJECT_UID  = CS-AFRICAFUNDS-001
PROJECT_ID   = chainsolutions.africafunds
PROJECT_NAME = AfricaFunds
REPOSITORY_ROLE = FRONTEND
PEER_REPOSITORY = Wealthtechinnovations/api_opcv
```

L’identité structurée commune est `.governance/project.json`. Le rôle local de ce dépôt est `.governance/repository.json`. L’explication humaine canonique du lien se trouve dans `docs/01-governance/PROJECT_IDENTITY.md`.

## Rôle

Ce dépôt porte le frontend AfricaFunds, l’expérience utilisateur, l’intégration avec l’API, les contrôles UX/SEO pertinents et le checkpoint opérationnel global du produit.

AfricaFunds est une application unique composée de deux historiques Git indépendants : ce dépôt frontend et `Wealthtechinnovations/api_opcv` pour l’API/backend.

## État global

`FUND_STATE = (API_HEAD, FRONTEND_HEAD, SUIVI_CHECKPOINT, PRODUCTION_ATTESTATION)`.

Le `SUIVI.md` de ce dépôt reste le checkpoint/historique opérationnel global. Un changement cross-repository doit réobserver et enregistrer les deux HEAD.

## Héritage

Les mentions historiques `FundAfrica` ou chemins techniques contenant `fundafrica` restent conservés lorsqu’ils décrivent l’histoire ou l’infrastructure réelle. Ils ne changent pas le nom produit canonique AfricaFunds.

## Principe

La gouvernance Regulatory Plus complète l’existant : lire, réutiliser, corriger, renforcer, étendre puis migrer compatiblement. Aucun document, code, donnée ou workflow historique utile n’est supprimé pour matérialiser ce lien.
