# T057 — Participant list component

## Statut : `pending`

## Description

Implémenter le composant affichant la liste des participants d'un document, avec leurs pseudonymes.

## Références spécifications

- §5.0 — Liste des participants

## Dépendances

- T044 (Document store — participants)

## Critères d'acceptation

- [ ] Affichage de la liste des pseudonymes des participants
- [ ] Indication du device courant (« Vous »)
- [ ] Indication de l'état de connexion (en ligne/hors ligne) si disponible
- [ ] Accessible depuis l'éditeur de document
- [ ] Responsive et accessible
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/components/`

## Étapes TDD

### Étape 1 — Analyse

- Wireframe du composant
- **Commit** : `T057-step1: analyze participant list component`

### Étape 2 — Définition des interfaces

- Définir les props du composant
- **Commit** : `T057-step2: define participant list interfaces`

### Étape 3 — Écriture des tests

- Tester le rendu avec plusieurs participants
- Tester l'indication « Vous »
- Tester l'état vide
- **Commit** : `T057-step3: write participant list tests`

### Étape 4 — Implémentation

- Implémenter le composant
- Faire passer les tests
- **Commit** : `T057-step4: implement participant list component`
