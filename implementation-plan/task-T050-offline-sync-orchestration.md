# T050 — Offline sync orchestration

## Statut : `pending`

## Description

Implémenter l'orchestration du mode offline complet. Détecte la connectivité, bascule en mode offline, stocke les modifications localement, et synchronise au retour de la connexion.

## Références spécifications

- §4.7 — Mode offline
- §7.9 — Serveur injoignable

## Dépendances

- T048 (Sync document use case)
- T016 (Offline queue)
- T041 (IndexedDB storage)

## Critères d'acceptation

- [ ] Détection de la connectivité (navigator.onLine + heartbeat)
- [ ] Basculement automatique online ↔ offline
- [ ] En offline : stockage des modifications dans la queue locale
- [ ] Au retour en ligne : pull → merge → push automatique
- [ ] Indicateur d'état de connectivité pour la couche présentation
- [ ] Gestion des conflits au retour en ligne
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/application/usecases/`

## Étapes TDD

### Étape 1 — Analyse

- Modéliser la machine à états online/offline
- Définir le flux de resynchronisation
- **Commit** : `T050-step1: analyze offline sync orchestration`

### Étape 2 — Définition des interfaces

- Définir `ConnectivityState` et callbacks
- **Commit** : `T050-step2: define offline sync orchestration interfaces`

### Étape 3 — Écriture des tests

- Tester la détection online/offline
- Tester le stockage offline
- Tester la resynchronisation au retour
- **Commit** : `T050-step3: write offline sync orchestration tests`

### Étape 4 — Implémentation

- Implémenter l'orchestration
- Faire passer les tests
- **Commit** : `T050-step4: implement offline sync orchestration`
