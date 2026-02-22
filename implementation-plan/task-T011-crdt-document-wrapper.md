# T011 — CRDT document wrapper (Automerge)

## Statut : `pending`

## Description

Créer le wrapper autour d'Automerge pour gérer les documents CRDT Lokini. Ce wrapper encapsule la création, le chargement et la manipulation de documents Automerge en les adaptant aux types de documents Lokini (Note pour le MVP).

## Références spécifications

- §4.8 — Gestion des conflits (CRDT)
- §4.8 — Stratégie par type de document (CRDT séquence pour Note)
- §8.2 — @lokini/core — CRDT : moteur CRDT

## Dépendances

- T002 (DocumentMetadata)
- T003 (NoteDocument, NoteContent)

## Critères d'acceptation

- [ ] Type `CrdtDocument<T>` wrappant un document Automerge typé
- [ ] Fonction `createCrdtDocument(type, initialContent)` → nouveau document CRDT
- [ ] Fonction `loadCrdtDocument(binary)` → document CRDT depuis binaire Automerge
- [ ] Fonction `saveCrdtDocument(doc)` → binaire Automerge
- [ ] Fonction `getDocumentContent(doc)` → contenu typé (NoteContent pour MVP)
- [ ] Fonction `getDocumentSize(doc)` → taille en bytes (pour avertissement §4.8)
- [ ] Actor ID unique par device/document
- [ ] Aucune dépendance UI ou plateforme
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crdt/document.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier l'API Automerge (init, change, save, load, merge, getActorId)
- Définir le schéma CRDT pour le type Note (texte riche → Automerge.Text ou string)
- Identifier les limites d'Automerge (taille, performance)
- **Commit** : `T011-step1: analyze CRDT document wrapper`

### Étape 2 — Définition des interfaces

- Définir `CrdtDocument<T>` (wrapper typé autour d'Automerge.Doc)
- Définir `CrdtDocumentOptions` (type, actorId)
- Définir les fonctions d'API publique
- **Commit** : `T011-step2: define CRDT document wrapper interfaces`

### Étape 3 — Écriture des tests

- Tester la création d'un document CRDT vide
- Tester save → load round-trip
- Tester l'actor ID unique
- Tester la récupération du contenu typé
- Tester le calcul de taille
- **Commit** : `T011-step3: write CRDT document wrapper tests`

### Étape 4 — Implémentation

- Implémenter avec @automerge/automerge
- Faire passer les tests
- **Commit** : `T011-step4: implement CRDT document wrapper`
