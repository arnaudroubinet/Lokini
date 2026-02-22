# T068 — Create invitation use case (server)

## Statut : `pending`

## Description

Implementer le cas d'usage « creer un token d'invitation » cote serveur. Un device participant genere un token a usage unique avec une duree de validite configurable (defaut : 1 heure). Le serveur stocke le hash du token (jamais le token en clair).

## References specifications

- §4.4 — Rejoindre un document (token d'invitation)
- §6.2 — BLAKE2b pour le hash des tokens
- §7.9 — Erreurs de jonction (token expire, token utilise)

## Dependances

- T018 (Driving ports — ajouter l'interface `CreateInvitationUseCase`)
- T019 (Driven ports — `InvitationTokenRepository`, `DeviceRepository`)
- T008 (BLAKE2b — hash du token)

## Criteres d'acceptation

- [ ] Interface `CreateInvitationUseCase` dans les driving ports
- [ ] Le token est genere cote client ; le serveur ne recoit que le hash
- [ ] Stockage du hash du token avec documentId et date d'expiration
- [ ] Duree de validite configurable (defaut : 1 heure)
- [ ] Validation : le device demandeur est participant du document
- [ ] Validation : le document n'a pas atteint la limite de devices (40)
- [ ] Le token brut n'est jamais stocke en base (zero-knowledge)
- [ ] Tests unitaires avec mocks

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Etapes TDD

### Etape 1 — Analyse

- Comprendre le flux de creation d'invitation (§4.4)
- Definir la separation : token brut (client) vs hash (serveur)
- **Commit** : `T068-step1: analyze create invitation use case`

### Etape 2 — Definition des interfaces

- Definir `CreateInvitationCommand` (tokenHash, documentId, deviceId, validityDuration)
- Definir `CreateInvitationResult` (success/failure)
- Ajouter `CreateInvitationUseCase` dans les driving ports
- **Commit** : `T068-step2: define create invitation use case interfaces`

### Etape 3 — Ecriture des tests

- Tester la creation reussie
- Tester le rejet si device non participant
- Tester le rejet si document plein
- Tester la duree de validite configurable
- **Commit** : `T068-step3: write create invitation use case tests`

### Etape 4 — Implementation

- Implementer `CreateInvitationUseCaseImpl`
- Faire passer les tests
- **Commit** : `T068-step4: implement create invitation use case`
