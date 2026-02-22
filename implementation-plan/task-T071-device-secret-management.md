# T071 — Device secret generation & management (core)

## Statut : `pending`

## Description

Implementer la generation et la gestion du secret propre au device, utilise pour le chiffrement au repos via Argon2id (T010). Ce secret est genere une seule fois au premier lancement et stocke de maniere securisee.

## References specifications

- §6.4 — Chiffrement au repos (« un secret propre au device »)
- §6.2 — Argon2id pour le chiffrement au repos
- §4.10 — Signalement de device compromis (le chiffrement au repos est la « derniere ligne de defense »)

## Dependances

- T010 (Argon2id — consommateur du device secret)

## Criteres d'acceptation

- [ ] Type `DeviceSecret` (Uint8Array de taille securisee, 32 bytes minimum)
- [ ] Fonction `generateDeviceSecret()` -> nouveau secret aleatoire cryptographiquement sur
- [ ] Fonction `isDeviceSecretValid(secret)` -> boolean (validation de format/taille)
- [ ] Le secret est genere via `crypto_secretbox_keygen` ou equivalent libsodium
- [ ] Le secret ne doit jamais etre transmis sur le reseau
- [ ] Le secret ne doit jamais etre inclus dans les exports ou backups
- [ ] Documentation des strategies de stockage par plateforme (Web: IndexedDB non-exportable, Mobile: Keychain/Keystore)
- [ ] Aucune dependance plateforme (la generation est dans core, le stockage est dans infrastructure)
- [ ] Couverture >= 90%

## Fichier cible

`packages/core/src/crypto/device-secret.ts`

## Etapes TDD

### Etape 1 — Analyse

- Etudier les options de stockage securise par plateforme
- Definir les contraintes de securite (taille, entropie)
- Identifier la relation avec le chiffrement au repos (T010)
- **Commit** : `T071-step1: analyze device secret management`

### Etape 2 — Definition des interfaces

- Definir `DeviceSecret` (branded type)
- Definir les fonctions de generation et validation
- **Commit** : `T071-step2: define device secret interfaces`

### Etape 3 — Ecriture des tests

- Tester la generation (taille, aleatoire, unicite)
- Tester la validation (taille correcte, rejet si trop court)
- Tester que deux generations donnent des secrets differents
- **Commit** : `T071-step3: write device secret management tests`

### Etape 4 — Implementation

- Implementer avec libsodium-wrappers-sumo
- Faire passer les tests
- **Commit** : `T071-step4: implement device secret management`
