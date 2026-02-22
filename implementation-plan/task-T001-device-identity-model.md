# T001 — Device identity model

## Statut : `pending`

## Description

Définir le modèle d'identité d'un device dans le contexte d'un document. Chaque device génère un couple clé privée/publique **par document** auquel il participe. Il n'y a pas d'identité globale du device au sens cryptographique.

## Références spécifications

- §4.2 — Identité
- §4.2 — Pseudonyme
- §6.2 — Choix cryptographiques (X25519, Ed25519)

## Dépendances

Aucune.

## Critères d'acceptation

- [ ] Type `DeviceId` (identifiant opaque du device pour un document)
- [ ] Type `DeviceKeyPair` contenant clé publique X25519 et clé publique Ed25519
- [ ] Type `DeviceIdentity` regroupant id, key pair, pseudonyme, et document associé
- [ ] Le pseudonyme est une string optionnelle (peut être surchargé par document)
- [ ] Le pseudonyme global est distinct du pseudonyme par document
- [ ] Aucune dépendance sur React, navigateur ou plateforme
- [ ] Tests unitaires couvrant la structure et la validation des types

## Fichier cible

`packages/core/src/models/device.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier §4.2 (identité par document, pseudonyme global/par document)
- Identifier les invariants : un device a N identités (une par document)
- Lister les types nécessaires
- **Commit** : `T001-step1: analyze device identity model`

### Étape 2 — Définition des interfaces

- Définir `DeviceId` (branded type ou opaque)
- Définir `DeviceKeyPair` (clés publiques X25519 + Ed25519)
- Définir `DeviceIdentity` (id + keyPair + pseudonyme + documentId)
- Définir `DeviceProfile` (pseudonyme global, liste des identités)
- Exporter depuis `models/index.ts`
- **Commit** : `T001-step2: define device identity interfaces`

### Étape 3 — Écriture des tests

- Tester la création d'une identité device valide
- Tester la validation : identifiant non vide, clés non vides
- Tester le pseudonyme : global, surchargé par document, absent
- Tester qu'un device peut avoir plusieurs identités (une par document)
- **Commit** : `T001-step3: write device identity model tests`

### Étape 4 — Implémentation

- Implémenter les types et fonctions de création/validation
- Fonctions factory : `createDeviceIdentity`, `resolveDisplayName`
- Faire passer tous les tests (GREEN)
- Refactoring si nécessaire
- **Commit** : `T001-step4: implement device identity model`
