# T064 — Web UI for device linking

## Statut : `pending`

## Description

Implémenter l'interface web pour lier des devices : initiation de l'appairage, affichage du QR code/lien, acceptation, gestion des devices liés.

## Références spécifications

- §4.10 — Liaison multi-device
- §4.10 — Retrait, déliaison, signalement

## Dépendances

- T059 (Linking protocol)
- T060 (Sync channel management)
- T053 (Onboarding — intégration possible)

## Critères d'acceptation

- [ ] Page/modale « Lier un device » avec QR code et lien
- [ ] Page d'acceptation d'un lien d'appairage
- [ ] Liste des devices liés dans les paramètres
- [ ] Actions : délier un device, signaler un device compromis
- [ ] Responsive et accessible
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/pages/` et `packages/web/src/presentation/components/`

## Étapes TDD

### Étape 1 — Analyse

- Wireframes des écrans de linking
- **Commit** : `T064-step1: analyze web UI linking`

### Étape 2 — Définition des interfaces

- Définir les composants
- **Commit** : `T064-step2: define web UI linking interfaces`

### Étape 3 — Écriture des tests

- Tester le rendu des écrans
- Tester les actions
- **Commit** : `T064-step3: write web UI linking tests`

### Étape 4 — Implémentation

- Implémenter les composants
- Faire passer les tests
- **Commit** : `T064-step4: implement web UI linking`
