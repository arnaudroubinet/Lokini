# T043 — Device store (Zustand)

## Statut : `pending`

## Description

Implémenter le store Zustand pour la gestion de l'identité du device : pseudonyme global, identités par document, profil local.

## Références spécifications

- §4.2 — Identité (pseudonyme global, identités par document)
- §4.11 — Premier lancement (onboarding)

## Dépendances

- T001 (DeviceIdentity, DeviceProfile)
- T005 (X25519 — génération des paires de clés pour chaque document)
- T007 (Ed25519 — génération des paires de clés de signature)
- T038 (LocalStoragePort pour persistance)

## Critères d'acceptation

- [ ] Store `useDeviceStore` avec état : pseudonyme global, identités par document
- [ ] Action `setGlobalPseudonym(name)` — définir/modifier le pseudonyme
- [ ] Action `createIdentityForDocument(documentId)` — générer une identité (appelle T005/T007 pour les paires de clés X25519 + Ed25519)
- [ ] Action `getIdentityForDocument(documentId)` — récupérer l'identité
- [ ] Action `setDocumentPseudonym(documentId, name)` — surcharger le pseudo pour un document
- [ ] Persistance automatique dans IndexedDB
- [ ] Hydratation au démarrage
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/application/store/`

## Étapes TDD

### Étape 1 — Analyse

- Définir la structure du state
- Identifier les actions et sélecteurs
- **Commit** : `T043-step1: analyze device store`

### Étape 2 — Définition des interfaces

- Définir `DeviceStoreState` et `DeviceStoreActions`
- **Commit** : `T043-step2: define device store interfaces`

### Étape 3 — Écriture des tests

- Tester chaque action
- Tester la persistance et l'hydratation
- **Commit** : `T043-step3: write device store tests`

### Étape 4 — Implémentation

- Implémenter le store Zustand
- Faire passer les tests
- **Commit** : `T043-step4: implement device store`
