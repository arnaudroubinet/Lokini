# T008 — BLAKE2b token hashing

## Statut : `pending`

## Description

Implémenter le hashing BLAKE2b pour les tokens d'invitation et identifiants internes. Hash rapide et sûr, utilisé pour les tokens d'invitation à usage unique.

## Références spécifications

- §6.2 — Choix cryptographiques (BLAKE2b)
- §4.4 — Rejoindre un document (token d'invitation)

## Dépendances

Aucune.

## Critères d'acceptation

- [ ] Fonction `hashToken(token)` → hash
- [ ] Fonction `hashWithKey(data, key)` → keyed hash
- [ ] Longueur de sortie configurable (défaut : 32 bytes)
- [ ] Hash déterministe : même entrée → même sortie
- [ ] Support du keyed hashing (MAC)
- [ ] Utilisation de `crypto_generichash*` de libsodium
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crypto/kdf.ts` (ou fichier dédié si nécessaire)

## Étapes TDD

### Étape 1 — Analyse

- Étudier BLAKE2b et l'API libsodium (`crypto_generichash`)
- Identifier les usages : hashing de tokens d'invitation, identifiants internes
- **Commit** : `T008-step1: analyze BLAKE2b hashing`

### Étape 2 — Définition des interfaces

- Définir `HashOptions` (outputLength, key optionnel)
- Définir les fonctions : `hashToken`, `hashWithKey`, `generateTokenId`
- **Commit** : `T008-step2: define BLAKE2b hashing interfaces`

### Étape 3 — Écriture des tests

- Tester le hashing d'un token (déterminisme)
- Tester des entrées différentes → hashes différents
- Tester le keyed hashing (clé différente → hash différent)
- Tester la longueur de sortie configurable
- Tester les cas d'erreur
- **Commit** : `T008-step3: write BLAKE2b hashing tests`

### Étape 4 — Implémentation

- Implémenter avec libsodium-wrappers-sumo
- Faire passer les tests
- **Commit** : `T008-step4: implement BLAKE2b hashing`
