# T010 — Argon2id at-rest encryption

## Statut : `pending`

## Description

Implémenter le chiffrement au repos des documents stockés localement. Utilise Argon2id pour dériver une clé de chiffrement à partir d'un secret propre au device, puis XChaCha20-Poly1305 pour le chiffrement effectif.

## Références spécifications

- §6.2 — Choix cryptographiques (Argon2id)
- §6.4 — Chiffrement au repos

## Dépendances

- T006 (XChaCha20-Poly1305 pour le chiffrement)

## Critères d'acceptation

- [ ] Fonction `deriveLocalKey(deviceSecret, salt)` → clé de chiffrement via Argon2id
- [ ] Fonction `encryptLocal(data, deviceSecret)` → données chiffrées + salt + params
- [ ] Fonction `decryptLocal(encryptedData, deviceSecret)` → données déchiffrées
- [ ] Paramètres Argon2id configurables (opsLimit, memLimit) avec défauts sécurisés
- [ ] Le salt est généré aléatoirement pour chaque opération de chiffrement
- [ ] Erreurs explicites : mauvais secret, données corrompues
- [ ] Utilisation de `crypto_pwhash` de libsodium
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crypto/local.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier Argon2id et l'API libsodium (`crypto_pwhash`)
- Déterminer les paramètres sécurisés pour mobile et web
- Comprendre le flux : deviceSecret → Argon2id → clé → XChaCha20 → chiffrement
- **Commit** : `T010-step1: analyze Argon2id at-rest encryption`

### Étape 2 — Définition des interfaces

- Définir `LocalEncryptionParams` (opsLimit, memLimit)
- Définir `LocalEncryptedData` (ciphertext, nonce, salt, params)
- Définir les fonctions : `deriveLocalKey`, `encryptLocal`, `decryptLocal`
- **Commit** : `T010-step2: define Argon2id at-rest interfaces`

### Étape 3 — Écriture des tests

- Tester encrypt → decrypt round-trip
- Tester que le même secret avec le même salt donne la même clé (déterminisme Argon2id)
- Tester que des salts différents donnent des clés différentes
- Tester le rejet avec un mauvais secret
- Tester les cas d'erreur (données corrompues)
- **Commit** : `T010-step3: write Argon2id at-rest tests`

### Étape 4 — Implémentation

- Implémenter avec libsodium-wrappers-sumo
- Faire passer les tests
- **Commit** : `T010-step4: implement Argon2id at-rest encryption`
