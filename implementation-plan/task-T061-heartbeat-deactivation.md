# T061 — Heartbeat & deactivation

## Statut : `pending`

## Description

Implémenter le heartbeat entre devices liés et la détection/désactivation des devices inactifs.

## Références spécifications

- §4.10 — Heartbeat et désactivation (1/jour, 7 jours → proposition, 30 jours → forcé)

## Dépendances

- T060 (Sync channel management)

## Critères d'acceptation

- [ ] Envoi d'un heartbeat max 1 fois par jour
- [ ] Détection des devices inactifs (>7 jours → proposition, >30 jours → forcé)
- [ ] Proposition de désactivation à l'utilisateur
- [ ] Désactivation forcée automatique après 30 jours (configurable)
- [ ] Tests unitaires

## Fichier cible

`packages/core/src/sync/` (extension)

## Étapes TDD

### Étape 1 — Analyse

- Définir la logique de heartbeat et les seuils
- **Commit** : `T061-step1: analyze heartbeat and deactivation`

### Étape 2 — Définition des interfaces

- Définir les types et fonctions
- **Commit** : `T061-step2: define heartbeat interfaces`

### Étape 3 — Écriture des tests

- Tester l'envoi de heartbeat (fréquence)
- Tester la détection d'inactivité
- Tester la désactivation forcée
- **Commit** : `T061-step3: write heartbeat tests`

### Étape 4 — Implémentation

- Implémenter la logique
- Faire passer les tests
- **Commit** : `T061-step4: implement heartbeat and deactivation`
