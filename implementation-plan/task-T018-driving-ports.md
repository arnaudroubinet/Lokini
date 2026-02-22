# T018 — Driving ports (use case interfaces)

## Statut : `pending`

## Description

Définir les ports entrants (driving ports) du serveur : les interfaces des cas d'usage exposés aux adaptateurs REST et WebSocket.

## Références spécifications

- §8.4 — Architecture hexagonale (ports entrants)
- §4.7 — Protocole de communication

## Dépendances

- T017 (Server domain models)

## Critères d'acceptation

- [ ] Interface `StoreDeltaUseCase` (stocker un delta chiffré)
- [ ] Interface `RetrieveDeltasUseCase` (récupérer les deltas en attente pour un device)
- [ ] Interface `JoinDocumentUseCase` (jonction via token d'invitation)
- [ ] Interface `LeaveDocumentUseCase` (quitter un document)
- [ ] Interface `RegisterDeviceUseCase` (enregistrer le push token d'un device)
- [ ] Interface `CleanupDeltasUseCase` (nettoyage des deltas expirés)
- [ ] Toutes les interfaces utilisent uniquement des types du domaine
- [ ] Aucune dépendance framework
- [ ] Validation par ArchUnit (ports = interfaces uniquement)

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/port/in/`

## Étapes TDD

### Étape 1 — Analyse

- Lister tous les cas d'usage depuis les spécifications
- Définir les entrées/sorties de chaque use case
- **Commit** : `T018-step1: analyze driving ports`

### Étape 2 — Définition des interfaces

- Définir chaque interface Java avec ses méthodes
- Définir les DTOs de commande/réponse associés (records dans le domaine)
- **Commit** : `T018-step2: define driving port interfaces`

### Étape 3 — Écriture des tests

- Tester via ArchUnit que tous les ports sont des interfaces
- Tester que les ports ne dépendent que du domaine
- **Commit** : `T018-step3: write driving ports architecture tests`

### Étape 4 — Implémentation

- Finaliser les interfaces (ajustements si nécessaire)
- Vérifier les tests d'architecture
- **Commit** : `T018-step4: implement driving ports`
