# T007 — Ed25519 digital signatures

## Statut : `pending`

## Description

Implémenter les signatures numériques Ed25519. Chaque device signe ses opérations CRDT pour garantir l'authenticité et l'intégrité des deltas.

## Références spécifications

- §6.2 — Choix cryptographiques (Ed25519)
- §6.5 — Chiffrement en transit (signatures)
- §7.9 — Signature invalide → rejet + alerte

## Dépendances

- T001 (DeviceKeyPair contient la clé publique Ed25519)

## Critères d'acceptation

- [ ] Fonction `generateEd25519KeyPair()` → `{ publicKey, secretKey }`
- [ ] Fonction `sign(message, secretKey)` → signature
- [ ] Fonction `verify(message, signature, publicKey)` → boolean
- [ ] Les signatures sont de taille fixe (64 bytes)
- [ ] Vérification déterministe et rapide
- [ ] Erreurs explicites : clé invalide, signature invalide
- [ ] Utilisation de `crypto_sign_*` de libsodium
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crypto/signatures.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier Ed25519 et l'API libsodium (`crypto_sign_keypair`, `crypto_sign_detached`, `crypto_sign_verify_detached`)
- Comprendre le workflow sign/verify pour les deltas CRDT
- **Commit** : `T007-step1: analyze Ed25519 signatures`

### Étape 2 — Définition des interfaces

- Définir `Ed25519KeyPair` (publicKey, secretKey)
- Définir `Signature` (Uint8Array de 64 bytes)
- Définir les fonctions : `generateEd25519KeyPair`, `sign`, `verify`
- **Commit** : `T007-step2: define Ed25519 signature interfaces`

### Étape 3 — Écriture des tests

- Tester sign → verify round-trip (signature valide)
- Tester le rejet d'une signature forgée
- Tester le rejet si le message est modifié
- Tester le rejet avec une mauvaise clé publique
- Tester la taille de la signature (64 bytes)
- **Commit** : `T007-step3: write Ed25519 signature tests`

### Étape 4 — Implémentation

- Implémenter avec libsodium-wrappers-sumo
- Faire passer les tests
- **Commit** : `T007-step4: implement Ed25519 signatures`
