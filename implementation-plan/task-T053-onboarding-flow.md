# T053 — Onboarding flow

## Statut : `pending`

## Description

Implémenter le flux d'onboarding au premier lancement : choix du pseudonyme, configuration du serveur, introduction aux concepts clés.

## Références spécifications

- §4.11 — Premier lancement (3 étapes)

## Dépendances

- T043 (Device store — pour le pseudonyme)
- T051 (Theme system)
- T052 (i18n)

## Critères d'acceptation

- [ ] Étape 1 : choix du pseudonyme global (champ texte, validation)
- [ ] Étape 2 : configuration serveur (instance publique pré-sélectionnée, option serveur custom)
- [ ] Étape 3 : introduction rapide (carousel/slides des concepts clés)
- [ ] Navigation entre étapes (précédent/suivant)
- [ ] Persistance de la complétion (ne pas réafficher)
- [ ] Responsive design (mobile-first)
- [ ] Accessibilité (navigation clavier, ARIA)
- [ ] Tests unitaires (composants) et tests de navigation

## Fichier cible

`packages/web/src/presentation/pages/`

## Étapes TDD

### Étape 1 — Analyse

- Wireframes des 3 écrans d'onboarding
- Définir les validations
- **Commit** : `T053-step1: analyze onboarding flow`

### Étape 2 — Définition des interfaces

- Définir les composants et leurs props
- Définir le state de navigation
- **Commit** : `T053-step2: define onboarding flow interfaces`

### Étape 3 — Écriture des tests

- Tester le rendu de chaque étape
- Tester la navigation
- Tester la validation du pseudonyme
- Tester la persistance
- **Commit** : `T053-step3: write onboarding flow tests`

### Étape 4 — Implémentation

- Implémenter les composants React
- Faire passer les tests
- **Commit** : `T053-step4: implement onboarding flow`
