# T035 — Rate limiting middleware

## Statut : `pending`

## Description

Implémenter la protection anti-abus par rate limiting sur les endpoints REST et WebSocket.

## Références spécifications

- §7.4 — Protection anti-abus

## Dépendances

- T031 (REST delta endpoints)
- T032 (REST document endpoints)
- T033 (REST device endpoints)

## Critères d'acceptation

- [ ] Limitation par device ID et par IP
- [ ] Fenêtre de temps configurable
- [ ] Seuils configurables par administrateur (variables d'environnement)
- [ ] Réponse HTTP 429 (Too Many Requests) avec header Retry-After
- [ ] Application sur tous les endpoints REST
- [ ] Rate limiting sur les connexions WebSocket (limite de connexions/déconnexions rapides)
- [ ] Protection contre les abus de reconnexion WebSocket (backoff imposé)
- [ ] Tests unitaires et d'intégration

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/in/rest/` (filtre/intercepteur)

## Étapes TDD

### Étape 1 — Analyse

- Choisir l'algorithme de rate limiting (token bucket, sliding window)
- Définir les seuils par défaut
- **Commit** : `T035-step1: analyze rate limiting`

### Étape 2 — Définition des interfaces

- Définir `RateLimiterConfig`
- Définir le filtre/intercepteur JAX-RS
- **Commit** : `T035-step2: define rate limiting interfaces`

### Étape 3 — Écriture des tests

- Tester le passage sous le seuil
- Tester le rejet au-dessus du seuil
- Tester le reset après la fenêtre
- Tester la configuration dynamique
- **Commit** : `T035-step3: write rate limiting tests`

### Étape 4 — Implémentation

- Implémenter le filtre
- Faire passer les tests
- **Commit** : `T035-step4: implement rate limiting`
