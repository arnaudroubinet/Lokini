# T028 — PostgreSQL delta repository

## Statut : `pending`

## Description

Implémenter l'adaptateur PostgreSQL pour le `DeltaRepository`. Gère le stockage, la récupération, le marquage de livraison et la suppression des deltas chiffrés.

## Références spécifications

- §7.1 — Rétention bornée
- §8.4 — Architecture hexagonale (adapters sortants)

## Dépendances

- T019 (DeltaRepository interface)
- T027 (Schéma Liquibase)

## Critères d'acceptation

- [ ] Implémente `DeltaRepository`
- [ ] Stockage d'un delta pour plusieurs destinataires
- [ ] Récupération des deltas non livrés pour un device
- [ ] Marquage d'un delta comme livré
- [ ] Suppression des deltas livrés à tous les destinataires
- [ ] Recherche des deltas expirés
- [ ] Tests d'intégration avec Testcontainers + PostgreSQL

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/out/persistence/`

## Étapes TDD

### Étape 1 — Analyse

- Définir les requêtes SQL nécessaires
- Optimiser pour les cas d'usage fréquents
- **Commit** : `T028-step1: analyze PostgreSQL delta repository`

### Étape 2 — Définition des interfaces

- Définir les entités JPA/Panache correspondantes
- Mapper entre modèles domaine et entités persistance
- **Commit** : `T028-step2: define PostgreSQL delta repository mapping`

### Étape 3 — Écriture des tests

- Tests d'intégration : store, retrieve, markDelivered, delete, findExpired
- Tester les performances avec un volume significatif
- **Commit** : `T028-step3: write PostgreSQL delta repository tests`

### Étape 4 — Implémentation

- Implémenter l'adapter avec Hibernate/Panache
- Faire passer les tests
- **Commit** : `T028-step4: implement PostgreSQL delta repository`
