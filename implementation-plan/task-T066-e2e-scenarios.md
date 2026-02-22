# T066 — E2E scenarios

## Statut : `pending`

## Description

Écrire les tests end-to-end simulant des scénarios utilisateur complets : création de document, édition, partage, synchronisation entre deux clients, mode offline.

## Références spécifications

- §8.5 — Stratégie de tests (tests E2E)

## Dépendances

- Phases 7 (Server) + Phase 10 (Web presentation) complètes

## Critères d'acceptation

- [ ] Scénario : premier lancement → onboarding → créer une note → éditer → sauvegarder
- [ ] Scénario : partager un document → deuxième client rejoint → édition concurrente → convergence
- [ ] Scénario : passer hors ligne → éditer → revenir en ligne → synchronisation
- [ ] Scénario : lier deux devices → créer un document → sync automatique
- [ ] Tests exécutables en CI (navigateur headless)
- [ ] Temps d'exécution raisonnable (< 5 minutes pour la suite complète)

## Fichier cible

`packages/web/tests/e2e/` (nouveau répertoire)

## Étapes TDD

### Étape 1 — Analyse

- Choisir le framework E2E (Playwright recommandé)
- Lister les scénarios critiques
- **Commit** : `T066-step1: analyze E2E scenarios`

### Étape 2 — Définition des interfaces

- Définir les page objects et helpers
- Configurer Playwright
- **Commit** : `T066-step2: define E2E test infrastructure`

### Étape 3 — Écriture des tests

- Écrire tous les scénarios E2E
- **Commit** : `T066-step3: write E2E scenario tests`

### Étape 4 — Implémentation

- S'assurer que tous les tests passent
- Optimiser les temps d'exécution
- **Commit** : `T066-step4: finalize E2E scenarios`
