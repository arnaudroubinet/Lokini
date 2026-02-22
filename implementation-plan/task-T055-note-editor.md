# T055 — Note editor (ProseMirror integration)

## Statut : `pending`

## Description

Implémenter l'éditeur de notes riche avec ProseMirror. Mobile-first, avec formatage gras, italique, titres, listes et liens. Intégré avec le CRDT pour les modifications concurrentes.

## Références spécifications

- §5.1 — Note (texte riche, ProseMirror, mobile-first)
- §4.8 — CRDT séquence pour le texte

## Dépendances

- T047 (Edit document use case)
- T051 (Theme system)

## Critères d'acceptation

- [ ] Éditeur ProseMirror fonctionnel avec schéma Note
- [ ] Barre d'outils : gras, italique, titres (H1-H3), liste à puces, liste numérotée, lien
- [ ] Raccourcis clavier (Ctrl+B, Ctrl+I, etc.)
- [ ] Mobile-first : barre d'outils adaptée aux écrans tactiles
- [ ] Intégration avec le CRDT (chaque changement → delta CRDT)
- [ ] Application des deltas distants sans perdre la position du curseur
- [ ] Thème clair/sombre
- [ ] Accessibilité (ARIA, navigation clavier)
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/components/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le schéma ProseMirror complet
- Concevoir la barre d'outils mobile-first
- Planifier l'intégration CRDT ↔ ProseMirror
- **Commit** : `T055-step1: analyze note editor`

### Étape 2 — Définition des interfaces

- Définir le composant NoteEditor et ses props
- Définir le bridge CRDT ↔ ProseMirror
- **Commit** : `T055-step2: define note editor interfaces`

### Étape 3 — Écriture des tests

- Tester le rendu de l'éditeur
- Tester le formatage (bold, italic, etc.)
- Tester l'intégration CRDT (modifications locales → delta)
- Tester l'application de deltas distants
- **Commit** : `T055-step3: write note editor tests`

### Étape 4 — Implémentation

- Implémenter l'éditeur ProseMirror
- Faire passer les tests
- **Commit** : `T055-step4: implement note editor`
