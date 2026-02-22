# T029 — PostgreSQL device repository

## Statut : `pending`

## Description

Implémenter l'adaptateur PostgreSQL pour le `DeviceRepository`. Gère l'enregistrement des devices, leurs push tokens et leur activité.

## Références spécifications

- §4.7 — Identification côté serveur
- §8.4 — Adapters sortants

## Dépendances

- T019 (DeviceRepository interface)
- T027 (Schéma Liquibase)

## Critères d'acceptation

- [ ] Implémente `DeviceRepository`
- [ ] Enregistrement d'un device pour un document
- [ ] Récupération des devices d'un document
- [ ] Mise à jour du push token
- [ ] Mise à jour de la dernière activité
- [ ] Désenregistrement d'un device
- [ ] Tests d'intégration avec Testcontainers

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/out/persistence/`

## Étapes TDD

### Étape 1 — Analyse

- Requêtes SQL nécessaires
- **Commit** : `T029-step1: analyze PostgreSQL device repository`

### Étape 2 — Définition des interfaces

- Entités JPA et mappers
- **Commit** : `T029-step2: define PostgreSQL device repository mapping`

### Étape 3 — Écriture des tests

- Tests d'intégration couvrant toutes les opérations
- **Commit** : `T029-step3: write PostgreSQL device repository tests`

### Étape 4 — Implémentation

- Implémenter l'adapter
- Faire passer les tests
- **Commit** : `T029-step4: implement PostgreSQL device repository`
