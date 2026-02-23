# T005 — X25519 key generation & exchange

## Statut : `done`

## Description

Implémenter la génération de paires de clés X25519 et l'échange Diffie-Hellman éphémère pour la jonction de documents. Chaque device génère une clé X25519 par document.

## Références spécifications

- §6.2 — Choix cryptographiques (X25519 ECDH)
- §6.6 — Échange de clés et jonction

## Dépendances

- T001 (DeviceKeyPair)

## Critères d'acceptation

- [x] Fonction `generateX25519KeyPair()` → `{ publicKey, privateKey }`
- [x] Fonction `computeSharedSecret(myPrivateKey, theirPublicKey)` → secret partagé
- [x] Le secret partagé est identique des deux côtés (propriété DH)
- [x] Les clés générées sont de la bonne taille (32 bytes)
- [x] Les clés privées ne sont jamais exposées involontairement (pas de sérialisation directe)
- [x] Utilisation de `crypto_box_keypair` / `crypto_scalarmult` de libsodium
- [x] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crypto/keys.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier X25519 et l'API libsodium (`crypto_box_keypair`, `crypto_scalarmult`)
- Comprendre le flux de jonction (§6.6)
- Identifier les contraintes de sécurité
- **Commit** : `T005-step1: analyze X25519 key exchange`

### Étape 2 — Définition des interfaces

- Définir `X25519KeyPair` (publicKey, privateKey comme Uint8Array)
- Définir `SharedSecret` (Uint8Array de 32 bytes)
- Définir les fonctions : `generateX25519KeyPair`, `computeSharedSecret`
- **Commit** : `T005-step2: define X25519 key exchange interfaces`

### Étape 3 — Écriture des tests

- Tester la génération de paires de clés (taille, unicité)
- Tester l'échange DH : deux parties arrivent au même secret
- Tester que des clés différentes donnent des secrets différents
- Tester les cas d'erreur (clé invalide)
- **Commit** : `T005-step3: write X25519 key exchange tests`

### Étape 4 — Implémentation

- Implémenter avec libsodium-wrappers-sumo
- Faire passer les tests
- **Commit** : `T005-step4: implement X25519 key exchange`
