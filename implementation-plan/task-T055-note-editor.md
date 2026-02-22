# T055 — Note editor (ProseMirror)

## Statut : `pending`

## Description

Implémenter l'éditeur de notes riche avec ProseMirror. Mobile-first, avec formatage gras, italique, titres, listes et liens. Cet éditeur fonctionne en local sans CRDT ; l'intégration CRDT est dans T074 (ProseMirror-Automerge bridge).

## Références spécifications

- §5.1 — Note (texte riche, ProseMirror, mobile-first)

## Dépendances

- T003 (Note document type — schéma AST)
- T051 (Theme system)

## Critères d'acceptation

- [ ] Schéma ProseMirror complet pour le type Note (paragraphe, heading H1-H3, liste à puces, liste numérotée, lien, gras, italique)
- [ ] Composant `NoteEditor` React encapsulant ProseMirror
- [ ] Barre d'outils : gras, italique, titres (H1-H3), liste à puces, liste numérotée, lien
- [ ] Raccourcis clavier (Ctrl+B, Ctrl+I, etc.)
- [ ] Mobile-first : barre d'outils adaptée aux écrans tactiles
- [ ] Callbacks `onChange(content)` pour notifier les changements
- [ ] Thème clair/sombre
- [ ] Accessibilité (ARIA, navigation clavier)
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/components/editor/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le schéma ProseMirror complet correspondant au type Note (T003)
- Concevoir la barre d'outils mobile-first
- **Commit** : `T055-step1: analyze note editor`

### Étape 2 — Définition des interfaces

- Définir le composant `NoteEditor` et ses props (`content`, `onChange`, `readOnly`, `theme`)
- Définir les commandes de formatage
- **Commit** : `T055-step2: define note editor interfaces`

### Étape 3 — Écriture des tests

- Tester le rendu de l'éditeur
- Tester le formatage (bold, italic, headings, lists, links)
- Tester les raccourcis clavier
- Tester le callback onChange
- Tester le thème clair/sombre
- **Commit** : `T055-step3: write note editor tests`

### Étape 4 — Implémentation

- Implémenter l'éditeur ProseMirror
- Faire passer les tests
- **Commit** : `T055-step4: implement note editor`
