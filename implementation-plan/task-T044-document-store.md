# T044 — Document store (Zustand)

## Statut : `pending`

## Description

Implémenter le store Zustand pour la gestion des documents : liste des documents, document actif, état de synchronisation.

## Références spécifications

- §4.11 — Écran principal (liste de documents)
- §5.0 — Propriétés communes

## Dépendances

- T002 (DocumentMetadata)
- T038 (LocalStoragePort)

## Critères d'acceptation

- [ ] Store `useDocumentStore` avec état : documents[], activeDocumentId, syncStatus
- [ ] Action `addDocument(metadata)` — ajouter un document à la liste
- [ ] Action `removeDocument(id)` — supprimer un document
- [ ] Action `setActiveDocument(id)` — sélectionner le document actif
- [ ] Action `updateDocumentMetadata(id, patch)` — mettre à jour les métadonnées
- [ ] Sélecteurs : `getActiveDocument`, `getDocumentById`, `getSortedDocuments`
- [ ] Persistance dans IndexedDB
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/application/store/`

## Étapes TDD

### Étape 1 — Analyse

- Définir la structure du state
- **Commit** : `T044-step1: analyze document store`

### Étape 2 — Définition des interfaces

- Définir `DocumentStoreState` et `DocumentStoreActions`
- **Commit** : `T044-step2: define document store interfaces`

### Étape 3 — Écriture des tests

- Tester chaque action et sélecteur
- Tester la persistance
- **Commit** : `T044-step3: write document store tests`

### Étape 4 — Implémentation

- Implémenter le store Zustand
- Faire passer les tests
- **Commit** : `T044-step4: implement document store`
