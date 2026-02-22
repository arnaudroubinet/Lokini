# T067 — Create document use case (server)

## Statut : `pending`

## Description

Implementer le cas d'usage « creer un document » cote serveur. Quand un device cree un document, le serveur enregistre le document, enregistre le device createur comme premier participant, et retourne les informations necessaires.

## References specifications

- §4.3 — Creation d'un document
- §4.1 — Modele unifie (un document = un serveur)
- §8.4 — Architecture hexagonale

## Dependances

- T018 (Driving ports — ajouter l'interface `CreateDocumentUseCase`)
- T019 (Driven ports — `DocumentRepository`, `DeviceRepository`)

## Criteres d'acceptation

- [ ] Interface `CreateDocumentUseCase` dans les driving ports
- [ ] Validation : les identifiants sont opaques et non vides
- [ ] Creation d'une entree document en base
- [ ] Enregistrement du device createur comme premier participant
- [ ] Retour du `documentId` cree
- [ ] Aucune donnee en clair (zero-knowledge)
- [ ] Aucune dependance framework dans l'implementation du use case
- [ ] Tests unitaires avec mocks des ports sortants

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Etapes TDD

### Etape 1 — Analyse

- Detailler le flux de creation d'un document cote serveur
- Identifier les donnees minimales necessaires
- **Commit** : `T067-step1: analyze create document use case`

### Etape 2 — Definition des interfaces

- Definir `CreateDocumentCommand` (deviceId, optionnel: documentId genere ou impose)
- Definir `CreateDocumentResult` (documentId)
- Ajouter `CreateDocumentUseCase` dans les driving ports (T018)
- **Commit** : `T067-step2: define create document use case interfaces`

### Etape 3 — Ecriture des tests

- Tester la creation reussie
- Tester le rejet si identifiants invalides
- Tester que le device createur est enregistre comme participant
- **Commit** : `T067-step3: write create document use case tests`

### Etape 4 — Implementation

- Implementer `CreateDocumentUseCaseImpl`
- Faire passer les tests
- **Commit** : `T067-step4: implement create document use case`
