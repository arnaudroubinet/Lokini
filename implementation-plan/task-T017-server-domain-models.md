# T017 — Server domain models

## Statut : `pending`

## Description

Définir les modèles de domaine du serveur Java. Le serveur est zero-knowledge : ces modèles ne contiennent que des identifiants opaques et des blobs chiffrés, jamais de contenu en clair.

## Références spécifications

- §7.1 — Rétention bornée des deltas
- §4.7 — Identification côté serveur ({device_id, document_id})
- §12.1 — Minimisation des données

## Dépendances

Aucune.

## Critères d'acceptation

- [ ] Record `DeviceId` (identifiant opaque)
- [ ] Record `DocumentId` (identifiant opaque)
- [ ] Record `EncryptedDelta` (blob chiffré + métadonnées : deviceId source, documentId, timestamp, sequence)
- [ ] Record `DeviceRegistration` (deviceId, documentId, pushToken optionnel, dernière activité)
- [ ] Record `InvitationToken` (tokenHash, documentId, expiresAt, used)
- [ ] Record `RetentionConfig` (maxAge, maxDeltas)
- [ ] Aucune annotation framework (Java pur dans le domaine)
- [ ] Tests unitaires de validation

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/model/`

## Étapes TDD

### Étape 1 — Analyse

- Identifier toutes les données que le serveur manipule (§7, §4.7)
- Vérifier que rien ne viole le zero-knowledge
- **Commit** : `T017-step1: analyze server domain models`

### Étape 2 — Définition des interfaces

- Définir les records Java avec validation
- Utiliser des value objects (branded types Java)
- **Commit** : `T017-step2: define server domain model interfaces`

### Étape 3 — Écriture des tests

- Tester la création de chaque record avec données valides
- Tester la validation (rejet des données invalides)
- Tester l'immutabilité des records
- **Commit** : `T017-step3: write server domain model tests`

### Étape 4 — Implémentation

- Implémenter les records Java
- Faire passer les tests
- **Commit** : `T017-step4: implement server domain models`
