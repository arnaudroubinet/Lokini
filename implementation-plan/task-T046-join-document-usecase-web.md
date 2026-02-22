# T046 — Join document use case (web)

## Statut : `pending`

## Description

Implémenter le cas d'usage « rejoindre un document » côté client web. Parse le lien d'invitation, valide le token, effectue l'échange de clés X25519, reçoit les chain keys et le document complet.

## Références spécifications

- §4.4 — Rejoindre un document
- §6.6 — Échange de clés et jonction

## Dépendances

- T043 (Device store)
- T044 (Document store)
- T005 (X25519 key exchange)
- T009 (Chain key distribution)

## Critères d'acceptation

- [ ] Parsing du lien d'invitation (serveur, documentId, token)
- [ ] Validation du token auprès du serveur
- [ ] Échange de clés X25519 avec un device existant
- [ ] Réception et déchiffrement des chain keys
- [ ] Réception et déchiffrement du document complet
- [ ] Génération de la chain key du nouveau device
- [ ] Distribution de la chain key aux participants existants
- [ ] Mise à jour des stores
- [ ] Gestion des erreurs (token expiré, document plein, etc.)
- [ ] Tests unitaires avec mocks

## Fichier cible

`packages/web/src/application/usecases/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux complet de jonction côté client
- **Commit** : `T046-step1: analyze join document use case`

### Étape 2 — Définition des interfaces

- Définir `JoinDocumentParams` et `JoinDocumentResult`
- **Commit** : `T046-step2: define join document use case interfaces`

### Étape 3 — Écriture des tests

- Tester la jonction réussie
- Tester chaque erreur possible
- **Commit** : `T046-step3: write join document use case tests`

### Étape 4 — Implémentation

- Implémenter le use case
- Faire passer les tests
- **Commit** : `T046-step4: implement join document use case`
