# T004 — HKDF-SHA256 key derivation

## Statut : `done`

## Description

Implémenter la dérivation de clés via HKDF-SHA256 en utilisant libsodium. HKDF est le mécanisme central pour dériver des sous-clés (chiffrement, signature, stockage) à partir de secrets partagés.

## Références spécifications

- §6.2 — Choix cryptographiques (HKDF-SHA256)
- §6.3 — Gestion des clés (dérivation de message keys)

## Dépendances

Aucune.

## Critères d'acceptation

- [ ] Fonction `hkdfDerive(ikm, salt, info, length)` → sous-clé
- [ ] Support des contextes d'info distincts (ex: `"encryption"`, `"signing"`, `"storage"`)
- [ ] Dérivation déterministe : mêmes entrées → même sortie
- [ ] Longueur de clé configurable
- [ ] Erreurs explicites pour entrées invalides (clé trop courte, longueur invalide)
- [ ] Utilisation exclusive de libsodium-wrappers-sumo
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crypto/kdf.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier HKDF-SHA256 (RFC 5869) et l'API libsodium correspondante
- Identifier les fonctions libsodium à utiliser (`crypto_kdf_*` ou HKDF via `crypto_auth_hmacsha256`)
- Documenter les contraintes de taille de clé
- **Commit** : `T004-step1: analyze HKDF key derivation`

### Étape 2 — Définition des interfaces

- Définir `HkdfParams` (ikm, salt, info, length)
- Définir `DeriveKeyOptions` (contexte, sous-clé ID)
- Définir les fonctions exportées : `deriveKey`, `deriveSubKeys`
- **Commit** : `T004-step2: define HKDF interfaces`

### Étape 3 — Écriture des tests

- Tester la dérivation avec des vecteurs de test connus (RFC 5869)
- Tester le déterminisme (même input → même output)
- Tester des contextes différents donnent des clés différentes
- Tester les cas d'erreur (entrées invalides)
- **Commit** : `T004-step3: write HKDF key derivation tests`

### Étape 4 — Implémentation

- Implémenter avec libsodium-wrappers-sumo
- Faire passer les tests
- **Commit** : `T004-step4: implement HKDF key derivation`
