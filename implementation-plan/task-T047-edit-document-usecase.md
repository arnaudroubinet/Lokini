# T047 — Edit document use case (local)

## Statut : `pending`

## Description

Implémenter le cas d'usage « modifier un document localement ». Applique les changements CRDT, génère le delta, et le met en file d'attente pour synchronisation.

## Références spécifications

- §4.7 — Synchronisation
- §4.8 — Gestion des conflits
- §5.1 — Note (texte riche)

## Dépendances

- T044 (Document store)
- T012 (CRDT operations)
- T014 (Delta packaging — scellement du delta avant mise en file)

## Critères d'acceptation

- [ ] Application d'une modification sur le document CRDT actif
- [ ] Génération du delta CRDT correspondant
- [ ] Scellement du delta (chiffrement + signature via sealDelta, T014) avant mise en file
- [ ] Mise en file d'attente du delta scellé pour envoi
- [ ] Mise à jour du store avec le nouveau contenu
- [ ] Sauvegarde locale automatique (debounced)
- [ ] Support du texte riche (ProseMirror-compatible)
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/application/usecases/`

## Étapes TDD

### Étape 1 — Analyse

- Flux de modification locale
- Intégration avec ProseMirror (côté présentation)
- **Commit** : `T047-step1: analyze edit document use case`

### Étape 2 — Définition des interfaces

- Définir `EditDocumentParams` (changement CRDT)
- **Commit** : `T047-step2: define edit document use case interfaces`

### Étape 3 — Écriture des tests

- Tester la modification et la génération du delta
- Tester la mise à jour du store
- Tester la sauvegarde locale
- **Commit** : `T047-step3: write edit document use case tests`

### Étape 4 — Implémentation

- Implémenter le use case
- Faire passer les tests
- **Commit** : `T047-step4: implement edit document use case`
