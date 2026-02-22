# T065 — Client-server integration tests

## Statut : `pending`

## Description

Écrire les tests d'intégration validant la communication complète entre le client web et le serveur Quarkus. Scénarios couvrant la création, la jonction, la synchronisation et le départ.

## Références spécifications

- §8.5 — Stratégie de tests (tests d'intégration)

## Dépendances

- Phases 7 (Server adapters) + Phase 9 (Web application) complètes

## Critères d'acceptation

- [ ] Scénario : créer un document → envoyer un delta → récupérer le delta
- [ ] Scénario : créer une invitation → rejoindre → recevoir le document complet
- [ ] Scénario : quitter un document → vérifier le nettoyage
- [ ] Scénario : enregistrer push token → recevoir notification
- [ ] Scénario : WebSocket → recevoir delta en temps réel
- [ ] Tous les échanges sont chiffrés E2E (vérification)
- [ ] Tests exécutables en CI avec Docker

## Fichier cible

Tests répartis dans `packages/web/tests/integration/` et `server/src/test/java/.../integration/`

## Étapes TDD

### Étape 1 — Analyse

- Lister les scénarios d'intégration critiques
- Définir l'infrastructure de test (Testcontainers, serveur de dev)
- **Commit** : `T065-step1: analyze client-server integration tests`

### Étape 2 — Définition des interfaces

- Définir les helpers de test (setup/teardown serveur)
- **Commit** : `T065-step2: define integration test infrastructure`

### Étape 3 — Écriture des tests

- Écrire tous les scénarios
- **Commit** : `T065-step3: write client-server integration tests`

### Étape 4 — Implémentation

- S'assurer que tous les tests passent
- Ajuster l'infrastructure si nécessaire
- **Commit** : `T065-step4: finalize client-server integration tests`
