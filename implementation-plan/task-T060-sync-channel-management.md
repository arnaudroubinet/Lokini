# T060 — Sync channel management

## Statut : `pending`

## Description

Implémenter la gestion du canal de synchronisation entre devices liés. Quand un device crée ou rejoint un document, il informe automatiquement ses devices liés via le canal.

## Références spécifications

- §4.10 — Synchronisation automatique
- §4.10 — Déliaison

## Dépendances

- T059 (Linking protocol)
- T015 (Sync protocol)

## Critères d'acceptation

- [ ] Notification automatique lors de création/jonction d'un document
- [ ] Transmission du lien d'invitation via le canal
- [ ] Les devices liés rejoignent via le flux normal de jonction
- [ ] Support de la déliaison (retrait du canal)
- [ ] Le canal est un document CRDT comme les autres
- [ ] Tests unitaires

## Fichier cible

`packages/core/src/sync/` (extension de `linking.ts`)

## Étapes TDD

### Étape 1 — Analyse

- Définir les messages du canal
- **Commit** : `T060-step1: analyze sync channel management`

### Étape 2 — Définition des interfaces

- Définir les types de messages (newDocument, removeDevice, etc.)
- **Commit** : `T060-step2: define sync channel interfaces`

### Étape 3 — Écriture des tests

- Tester la notification de nouveau document
- Tester la déliaison
- **Commit** : `T060-step3: write sync channel management tests`

### Étape 4 — Implémentation

- Implémenter la gestion du canal
- Faire passer les tests
- **Commit** : `T060-step4: implement sync channel management`
