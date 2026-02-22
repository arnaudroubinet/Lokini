# T027 — Liquibase database schema

## Statut : `pending`

## Description

Créer le schéma PostgreSQL initial via Liquibase. Tables pour les deltas chiffrés, les devices, les documents, les tokens d'invitation et les push tokens.

## Références spécifications

- §7.1 — Rétention bornée (structure de stockage)
- §4.7 — Identification côté serveur
- §7.8 — Migration de la base de données

## Dépendances

- T017 (Server domain models — base pour le schéma)

## Critères d'acceptation

- [ ] Table `documents` (id, created_at)
- [ ] Table `devices` (id, document_id, push_token, last_activity, created_at)
- [ ] Table `deltas` (id, document_id, source_device_id, encrypted_payload, sequence, created_at)
- [ ] Table `delta_delivery` (delta_id, target_device_id, retrieved_at)
- [ ] Table `invitation_tokens` (token_hash, document_id, expires_at, used_at, created_at)
- [ ] Index performants sur les requêtes fréquentes
- [ ] Migrations réversibles (rollback)
- [ ] Tests d'intégration avec Testcontainers

## Fichier cible

`server/src/main/resources/db/changelog/`

## Étapes TDD

### Étape 1 — Analyse

- Concevoir le schéma de données à partir des modèles domaine
- Identifier les index nécessaires
- Planifier les contraintes d'intégrité référentielle
- **Commit** : `T027-step1: analyze database schema`

### Étape 2 — Définition des interfaces

- Écrire les changesets Liquibase (XML ou YAML)
- Définir les rollback pour chaque changeset
- **Commit** : `T027-step2: define database schema changesets`

### Étape 3 — Écriture des tests

- Test d'intégration : la migration s'applique correctement
- Test d'intégration : le rollback fonctionne
- Test : les index existent
- **Commit** : `T027-step3: write database schema tests`

### Étape 4 — Implémentation

- Finaliser les migrations
- Faire passer les tests d'intégration
- **Commit** : `T027-step4: implement database schema`
