# T003 — Note document type

## Statut : `pending`

## Description

Définir le type de document « Note » pour le MVP. Texte riche avec un AST compatible ProseMirror, optimisé pour le CRDT. Formatage supporté : gras, italique, titres, listes, liens.

## Références spécifications

- §5.1 — Types initiaux (Note)
- §4.8 — Gestion des conflits (CRDT séquence pour le texte)

## Dépendances

- T002 (DocumentMetadata comme base)

## Critères d'acceptation

- [ ] Type `NoteDocument` étendant le modèle de base avec `type: 'note'`
- [ ] Type `NoteContent` représentant le contenu comme AST ProseMirror-compatible
- [ ] Schéma ProseMirror minimal défini (paragraphe, heading, bold, italic, list, link)
- [ ] Fonctions de conversion : contenu vide → AST initial
- [ ] Validation de la structure AST
- [ ] Aucune dépendance directe sur ProseMirror (types compatibles uniquement)
- [ ] Tests unitaires couvrant la structure et la validation

## Fichier cible

`packages/core/src/models/note.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier §5.1 et les structures ProseMirror
- Définir le schéma minimal pour le MVP
- Identifier les nœuds et marques nécessaires
- **Commit** : `T003-step1: analyze note document type`

### Étape 2 — Définition des interfaces

- Définir `NoteContent` (AST JSON compatible ProseMirror)
- Définir les types de nœuds (`paragraph`, `heading`, `bulletList`, `orderedList`, `listItem`)
- Définir les marques (`bold`, `italic`, `link`)
- Définir `NoteDocument` (extends DocumentMetadata + NoteContent)
- **Commit** : `T003-step2: define note document interfaces`

### Étape 3 — Écriture des tests

- Tester la création d'une note vide (AST par défaut)
- Tester la validation d'un AST valide
- Tester le rejet d'un AST invalide
- Tester les différents types de nœuds et marques
- **Commit** : `T003-step3: write note document type tests`

### Étape 4 — Implémentation

- Implémenter `createNoteDocument`, `createEmptyContent`, `validateNoteContent`
- Faire passer les tests
- **Commit** : `T003-step4: implement note document type`
