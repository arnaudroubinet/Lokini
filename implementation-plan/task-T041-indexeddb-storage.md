# T041 — IndexedDB storage adapter

## Statut : `pending`

## Description

Implémenter l'adaptateur de stockage local IndexedDB pour persister les documents chiffrés, les clés et les métadonnées sur le device.

## Références spécifications

- §6.4 — Chiffrement au repos
- §8.3 — Infrastructure (stockage local)

## Dépendances

- T038 (LocalStoragePort interface)

## Critères d'acceptation

- [ ] Implémente `LocalStoragePort`
- [ ] Stockage/récupération de documents chiffrés
- [ ] Stockage/récupération des clés chiffrées (chain keys, clés locales)
- [ ] Stockage/récupération des métadonnées (non chiffrées côté client : titre, type, serveur)
- [ ] Liste de tous les documents avec métadonnées
- [ ] Suppression d'un document et de ses données associées
- [ ] Gestion du versioning du schéma IndexedDB
- [ ] Tests unitaires avec fake-indexeddb

## Fichier cible

`packages/web/src/infrastructure/storage/`

## Étapes TDD

### Étape 1 — Analyse

- Concevoir le schéma IndexedDB (stores, index)
- Identifier les patterns d'accès
- **Commit** : `T041-step1: analyze IndexedDB storage adapter`

### Étape 2 — Définition des interfaces

- Définir les object stores et leur structure
- Définir le mapper entre types domaine et objets stockés
- **Commit** : `T041-step2: define IndexedDB storage interfaces`

### Étape 3 — Écriture des tests

- Tester toutes les opérations CRUD
- Tester le versioning du schéma
- Tester la suppression en cascade
- **Commit** : `T041-step3: write IndexedDB storage adapter tests`

### Étape 4 — Implémentation

- Implémenter l'adapter
- Faire passer les tests
- **Commit** : `T041-step4: implement IndexedDB storage adapter`
