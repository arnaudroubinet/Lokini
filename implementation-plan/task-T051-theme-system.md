# T051 — Theme system (light/dark/auto)

## Statut : `pending`

## Description

Implémenter le système de thème avec trois modes : clair, sombre, et automatique (suit le système). Utilise Tailwind CSS v4 et les variables CSS pour le theming.

## Références spécifications

- §4.11 — Thème visuel (clair/sombre/automatique)
- §4.11 — Accessibilité WCAG 2.1 AA (contrastes)

## Dépendances

Aucune (indépendant).

## Critères d'acceptation

- [ ] Trois modes : `light`, `dark`, `auto`
- [ ] Mode `auto` par défaut (suit `prefers-color-scheme`)
- [ ] Persistance du choix de l'utilisateur
- [ ] Variables CSS pour toutes les couleurs du design system
- [ ] Contrastes WCAG 2.1 AA dans les deux thèmes
- [ ] Hook `useTheme()` pour les composants React
- [ ] Transition fluide entre les thèmes
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/theme/`

## Étapes TDD

### Étape 1 — Analyse

- Définir la palette de couleurs (clair + sombre)
- Vérifier les contrastes WCAG 2.1 AA
- Choisir l'approche Tailwind v4 (CSS custom properties)
- **Commit** : `T051-step1: analyze theme system`

### Étape 2 — Définition des interfaces

- Définir `ThemeMode` type
- Définir `useTheme()` hook interface
- Définir les tokens de design (couleurs, espacement, typographie)
- **Commit** : `T051-step2: define theme system interfaces`

### Étape 3 — Écriture des tests

- Tester le basculement entre modes
- Tester la persistance du choix
- Tester le mode auto (mock matchMedia)
- **Commit** : `T051-step3: write theme system tests`

### Étape 4 — Implémentation

- Implémenter le hook et les CSS
- Faire passer les tests
- **Commit** : `T051-step4: implement theme system`
