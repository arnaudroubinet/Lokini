# T002 — Base document model

## Statut : `pending`

## Description

Définir le modèle de base pour tous les types de documents. Propriétés communes : titre (optionnel, auto-généré), type de document, liste des participants, identifiant du document, serveur associé.

## Références spécifications

- §4.1 — Modèle unifié
- §4.3 — Création d'un document
- §5.0 — Propriétés communes
- §5.1 — Types initiaux

## Dépendances

- T001 (DeviceIdentity pour les participants)

## Critères d'acceptation

- [ ] Type `DocumentId` (identifiant opaque)
- [ ] Type `DocumentType` (enum extensible : `note`, futur `todo`, `shopping-list`)
- [ ] Type `DocumentMetadata` (titre, type, date création, serveur, participants)
- [ ] Type `Participant` (deviceId, pseudonyme chiffré, clé publique)
- [ ] Titre auto-généré si non défini (pattern : « Note du DD/MM/YYYY »)
- [ ] Limite configurable de devices par document (défaut : 40)
- [ ] Aucune dépendance plateforme
- [ ] Tests couvrant création, validation, auto-titre, limite participants

## Fichier cible

`packages/core/src/models/document.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier §4.1, §4.3, §5.0 et §5.1
- Identifier les invariants : un document = un serveur, max 40 devices, titre auto-généré
- **Commit** : `T002-step1: analyze base document model`

### Étape 2 — Définition des interfaces

- Définir `DocumentId`, `DocumentType`, `ServerAddress`
- Définir `Participant` (deviceId + pseudonyme + publicKey)
- Définir `DocumentMetadata` (id, type, titre, créé le, serveur, participants, maxDevices)
- Définir `DocumentConfig` (limites configurables)
- **Commit** : `T002-step2: define base document interfaces`

### Étape 3 — Écriture des tests

- Tester la création d'un document avec titre explicite
- Tester l'auto-génération du titre
- Tester l'ajout/retrait de participants
- Tester le rejet quand la limite de devices est atteinte
- Tester la validation des champs obligatoires
- **Commit** : `T002-step3: write base document model tests`

### Étape 4 — Implémentation

- Implémenter les types et fonctions factory
- `createDocument`, `generateDefaultTitle`, `addParticipant`, `removeParticipant`
- Faire passer les tests
- **Commit** : `T002-step4: implement base document model`
