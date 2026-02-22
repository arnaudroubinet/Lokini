# T052 — i18n completion

## Statut : `pending`

## Description

Compléter la configuration i18n (react-i18next) avec toutes les clés de traduction nécessaires pour le MVP en français et en anglais.

## Références spécifications

- §4.11 — Langues (FR/EN)

## Dépendances

Aucune (indépendant).

## Critères d'acceptation

- [ ] Configuration react-i18next complète et fonctionnelle
- [ ] Détection automatique de la langue du navigateur
- [ ] Changement de langue à la volée
- [ ] Toutes les clés de traduction pour le MVP (onboarding, liste documents, éditeur, partage, settings, erreurs)
- [ ] Namespace organisé par feature
- [ ] Hook `useTranslation()` fonctionnel
- [ ] Fallback sur l'anglais si clé manquante
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/i18n/`

## Étapes TDD

### Étape 1 — Analyse

- Lister toutes les chaînes à traduire pour le MVP
- Organiser par namespace
- **Commit** : `T052-step1: analyze i18n completion`

### Étape 2 — Définition des interfaces

- Définir les namespaces et structure des fichiers de traduction
- Définir le typage des clés (type-safe i18n)
- **Commit** : `T052-step2: define i18n structure`

### Étape 3 — Écriture des tests

- Tester la détection de langue
- Tester le changement de langue
- Tester le fallback
- Tester la présence de toutes les clés dans les deux langues
- **Commit** : `T052-step3: write i18n tests`

### Étape 4 — Implémentation

- Compléter les fichiers de traduction FR et EN
- Faire passer les tests
- **Commit** : `T052-step4: implement i18n completion`
