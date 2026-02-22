# T037 — Pub/Sub adapter (stub)

## Statut : `pending`

## Description

Implémenter un adaptateur stub pour le pub/sub inter-instances (mode cluster). Pour le MVP en instance unique, c'est un pass-through local.

## Références spécifications

- §7.3 — Haute disponibilité (pub/sub)

## Dépendances

- T019 (PubSubPort interface)

## Critères d'acceptation

- [ ] Implémente `PubSubPort`
- [ ] Mode single-instance : pub/sub local (in-memory)
- [ ] Structure prête pour Redis/NATS/etc. en cluster
- [ ] Tests unitaires

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/out/pubsub/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le contrat pub/sub (canaux, messages)
- **Commit** : `T037-step1: analyze pub/sub adapter`

### Étape 2 — Définition des interfaces

- Définir les types de messages pub/sub
- Définir l'adapter local
- **Commit** : `T037-step2: define pub/sub adapter interfaces`

### Étape 3 — Écriture des tests

- Tester publish → subscribe local
- **Commit** : `T037-step3: write pub/sub adapter tests`

### Étape 4 — Implémentation

- Implémenter le stub local
- Faire passer les tests
- **Commit** : `T037-step4: implement pub/sub adapter stub`
