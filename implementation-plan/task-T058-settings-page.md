# T058 — Settings page

## Statut : `pending`

## Description

Implémenter la page de paramètres : pseudonyme global, serveurs configurés, thème, langue, gestion des devices liés.

## Références spécifications

- §4.2 — Pseudonyme (modifiable)
- §4.3 — Choix du serveur
- §4.11 — Thème visuel, langues

## Dépendances

- T043 (Device store)
- T051 (Theme system)
- T052 (i18n)

## Critères d'acceptation

- [ ] Section « Profil » : modifier le pseudonyme global
- [ ] Section « Serveurs » : liste des serveurs, ajouter/supprimer un serveur
- [ ] Section « Apparence » : choix du thème (clair/sombre/auto)
- [ ] Section « Langue » : choix FR/EN
- [ ] Section « Devices liés » : liste des devices, actions (placeholder pour Phase 11)
- [ ] Responsive et accessible
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/pages/`

## Étapes TDD

### Étape 1 — Analyse

- Wireframe de la page
- **Commit** : `T058-step1: analyze settings page`

### Étape 2 — Définition des interfaces

- Définir les composants et sections
- **Commit** : `T058-step2: define settings page interfaces`

### Étape 3 — Écriture des tests

- Tester le rendu de chaque section
- Tester la modification du pseudonyme
- Tester le changement de thème et de langue
- **Commit** : `T058-step3: write settings page tests`

### Étape 4 — Implémentation

- Implémenter la page
- Faire passer les tests
- **Commit** : `T058-step4: implement settings page`
