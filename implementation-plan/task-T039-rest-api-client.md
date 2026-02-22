# T039 — REST API client

## Statut : `pending`

## Description

Implémenter le client REST pour communiquer avec le serveur Lokini. Implémente les ports `DocumentApiPort` et `DeltaApiPort`.

## Références spécifications

- §4.7 — Protocole de communication (REST/HTTPS)
- §7.7 — Versioning du protocole

## Dépendances

- T038 (Application ports interfaces)

## Critères d'acceptation

- [ ] Implémente `DocumentApiPort` et `DeltaApiPort`
- [ ] Utilise `fetch` natif (pas de bibliothèque externe)
- [ ] Envoi du header `X-Protocol-Version`
- [ ] Gestion des erreurs HTTP (4xx, 5xx)
- [ ] Retry automatique sur erreurs réseau (avec backoff exponentiel)
- [ ] Support de plusieurs serveurs (un par document)
- [ ] Sérialisation/désérialisation correcte des blobs binaires
- [ ] Tests unitaires avec mock du fetch

## Fichier cible

`packages/web/src/infrastructure/api/`

## Étapes TDD

### Étape 1 — Analyse

- Définir les endpoints à appeler (miroir de l'API serveur)
- Stratégie de retry et gestion des erreurs
- **Commit** : `T039-step1: analyze REST API client`

### Étape 2 — Définition des interfaces

- Définir les classes/fonctions du client
- Définir le mapper entre réponses API et types domaine
- **Commit** : `T039-step2: define REST API client interfaces`

### Étape 3 — Écriture des tests

- Tester chaque endpoint (mock fetch)
- Tester la gestion des erreurs
- Tester le retry avec backoff
- Tester le versioning
- **Commit** : `T039-step3: write REST API client tests`

### Étape 4 — Implémentation

- Implémenter le client
- Faire passer les tests
- **Commit** : `T039-step4: implement REST API client`
