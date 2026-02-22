# T062 — Compromised device signaling

## Statut : `pending`

## Description

Implémenter le signalement de device compromis et la rotation des chain keys sur tous les documents du device compromis.

## Références spécifications

- §4.10 — Signalement de device compromis

## Dépendances

- T060 (Sync channel management)
- T009 (Chain key — régénération)

## Critères d'acceptation

- [ ] Fonction `reportCompromisedDevice(deviceId)` depuis un device lié
- [ ] Déliaison immédiate du device compromis
- [ ] Rotation des chain keys sur tous les documents concernés
- [ ] Le device compromis perd l'accès aux futurs deltas
- [ ] Les données déjà présentes restent potentiellement accessibles (documenté)
- [ ] Tests unitaires

## Fichier cible

`packages/core/src/sync/` (extension)

## Étapes TDD

### Étape 1 — Analyse

- Modéliser le flux de signalement et rotation
- **Commit** : `T062-step1: analyze compromised device signaling`

### Étape 2 — Définition des interfaces

- Définir les commandes et événements
- **Commit** : `T062-step2: define compromised device interfaces`

### Étape 3 — Écriture des tests

- Tester le signalement
- Tester la rotation des chain keys
- Tester l'exclusion du device compromis
- **Commit** : `T062-step3: write compromised device tests`

### Étape 4 — Implémentation

- Implémenter la logique
- Faire passer les tests
- **Commit** : `T062-step4: implement compromised device signaling`
