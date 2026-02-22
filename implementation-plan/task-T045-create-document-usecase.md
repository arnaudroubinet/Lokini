# T045 — Create document use case (web)

## Statut : `pending`

## Description

Implémenter le cas d'usage « créer un document » côté client web. Orchestre la création d'un document CRDT local, la génération des clés cryptographiques, l'enregistrement auprès du serveur, et la mise à jour des stores.

## Références spécifications

- §4.3 — Création d'un document
- §6.3 — Jonction et distribution des chain keys (création)

## Dépendances

- T043 (Device store)
- T044 (Document store)
- T011 (CRDT document creation)
- T005 (X25519 key generation)
- T009 (Chain key generation)

## Critères d'acceptation

- [ ] Création d'un document CRDT local vide (type Note)
- [ ] Génération de l'identité device pour ce document (X25519 + Ed25519)
- [ ] Génération de la chain key initiale
- [ ] Enregistrement du document sur le serveur choisi
- [ ] Mise à jour du device store et du document store
- [ ] Chiffrement et stockage local
- [ ] Tests unitaires avec mocks des ports

## Fichier cible

`packages/web/src/application/usecases/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux complet de création côté client
- **Commit** : `T045-step1: analyze create document use case`

### Étape 2 — Définition des interfaces

- Définir `CreateDocumentParams` et `CreateDocumentResult`
- **Commit** : `T045-step2: define create document use case interfaces`

### Étape 3 — Écriture des tests

- Tester la création complète (mocks)
- Tester les erreurs (serveur injoignable, etc.)
- **Commit** : `T045-step3: write create document use case tests`

### Étape 4 — Implémentation

- Implémenter le use case
- Faire passer les tests
- **Commit** : `T045-step4: implement create document use case`
