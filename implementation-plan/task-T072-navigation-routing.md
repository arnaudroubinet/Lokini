# T072 — Navigation & routing (web)

## Statut : `pending`

## Description

Implementer la configuration du routeur React et la structure de navigation de l'application web. Definit les routes, les layouts, les gardes (onboarding complete ?), et la navigation entre pages.

## References specifications

- §4.11 — Premier lancement (onboarding)
- §4.11 — Ecran principal
- §4.4 — Rejoindre un document (URL d'invitation)

## Dependances

- T053 (Onboarding flow — pour la garde onboarding)
- T054 (Document list page — page principale)
- T055 (Note editor — page d'edition)
- T058 (Settings page)

## Criteres d'acceptation

- [ ] Configuration du routeur (React Router v7 ou equivalent)
- [ ] Routes definies : `/` (document list), `/documents/:id` (editeur), `/settings`, `/onboarding`, `/join` (invitation)
- [ ] Layout principal avec navigation (header, sidebar responsive)
- [ ] Garde : redirection vers `/onboarding` si premier lancement
- [ ] Garde : redirection vers `/` si onboarding deja complete
- [ ] Page `/join` : parsing de l'URL d'invitation et redirection vers le flux de jonction
- [ ] Page 404 pour les routes inconnues
- [ ] Responsive design (mobile-first)
- [ ] Accessibilite : focus management lors des changements de route
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/router/`

## Etapes TDD

### Etape 1 — Analyse

- Lister toutes les routes necessaires pour le MVP
- Definir les layouts (principal, onboarding, bare)
- Identifier les gardes de navigation
- **Commit** : `T072-step1: analyze navigation and routing`

### Etape 2 — Definition des interfaces

- Definir la configuration des routes
- Definir les composants Layout
- Definir les gardes (hooks ou composants wrapper)
- **Commit** : `T072-step2: define navigation and routing interfaces`

### Etape 3 — Ecriture des tests

- Tester chaque route rend le bon composant
- Tester la garde onboarding (redirection)
- Tester le parsing de l'URL d'invitation
- Tester la page 404
- Tester le focus management
- **Commit** : `T072-step3: write navigation and routing tests`

### Etape 4 — Implementation

- Implementer le routeur et les layouts
- Faire passer les tests
- **Commit** : `T072-step4: implement navigation and routing`
