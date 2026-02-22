# T006 — XChaCha20-Poly1305 symmetric encryption

## Statut : `pending`

## Description

Implémenter le chiffrement symétrique authentifié avec XChaCha20-Poly1305. Nonce de 192 bits éliminant le risque de collision. Utilisé pour chiffrer les deltas et le stockage local.

## Références spécifications

- §6.2 — Choix cryptographiques (XChaCha20-Poly1305)
- §6.5 — Chiffrement en transit

## Dépendances

- T004 (HKDF pour dérivation de clés)

## Critères d'acceptation

- [ ] Fonction `encrypt(plaintext, key)` → `{ ciphertext, nonce }`
- [ ] Fonction `decrypt(ciphertext, nonce, key)` → plaintext
- [ ] Le nonce est généré aléatoirement (192 bits / 24 bytes)
- [ ] Chiffrement authentifié : toute modification du ciphertext est détectée
- [ ] Support des données associées (AAD) optionnelles
- [ ] Erreurs explicites : clé invalide, déchiffrement échoué, données corrompues
- [ ] Utilisation de `crypto_aead_xchacha20poly1305_ietf_*` de libsodium
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crypto/encryption.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier XChaCha20-Poly1305 et l'API libsodium AEAD
- Comprendre le rôle du nonce et de l'AAD
- Identifier les tailles de clé/nonce/tag
- **Commit** : `T006-step1: analyze XChaCha20-Poly1305 encryption`

### Étape 2 — Définition des interfaces

- Définir `EncryptedPayload` (ciphertext + nonce)
- Définir `EncryptOptions` (AAD optionnel)
- Définir les fonctions : `encrypt`, `decrypt`, `generateKey`
- **Commit** : `T006-step2: define XChaCha20-Poly1305 interfaces`

### Étape 3 — Écriture des tests

- Tester encrypt → decrypt round-trip
- Tester que le ciphertext est différent du plaintext
- Tester que deux chiffrements du même message donnent des résultats différents (nonce aléatoire)
- Tester la détection de modification (tamper detection)
- Tester les erreurs : mauvaise clé, données corrompues
- Tester avec et sans AAD
- **Commit** : `T006-step3: write XChaCha20-Poly1305 encryption tests`

### Étape 4 — Implémentation

- Implémenter avec libsodium-wrappers-sumo
- Faire passer les tests
- **Commit** : `T006-step4: implement XChaCha20-Poly1305 encryption`
