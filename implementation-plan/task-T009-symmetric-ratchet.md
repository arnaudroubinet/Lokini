# T009 — Symmetric ratchet (Sender Keys)

## Statut : `pending`

## Description

Implémenter le ratchet symétrique inspiré du protocole Sender Keys (Signal). Chaque device maintient une chain key par document. À chaque envoi de delta, une message key unique est dérivée via HKDF puis la chain key avance (ratchet). Fournit la forward secrecy par message.

## Références spécifications

- §6.3 — Gestion des clés — Sender Keys avec ratchet symétrique
- §6.3 — Jonction et distribution des chain keys

## Dépendances

- T004 (HKDF pour dérivation)
- T006 (XChaCha20-Poly1305 pour chiffrement des message keys)

## Critères d'acceptation

- [ ] Type `ChainKey` (secret de 32 bytes)
- [ ] Type `MessageKey` (clé de chiffrement dérivée, usage unique)
- [ ] Fonction `generateChainKey()` → nouvelle chain key aléatoire
- [ ] Fonction `ratchetForward(chainKey)` → `{ messageKey, nextChainKey }`
- [ ] La chain key avance dans un seul sens (irréversible)
- [ ] Les message keys sont uniques et non réutilisables
- [ ] Deux devices avec la même chain key initiale dérivent les mêmes message keys dans l'ordre
- [ ] Fonction `deriveMessageKeys(chainKey, count)` → tableau de message keys (pour rattraper le ratchet)
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crypto/ratchet.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier le protocole Sender Keys de Signal
- Comprendre le flux : generateChainKey → ratchet → messageKey → encrypt
- Identifier les scénarios : jonction, sortie (régénération), rattrapage
- **Commit** : `T009-step1: analyze symmetric ratchet`

### Étape 2 — Définition des interfaces

- Définir `ChainKey`, `MessageKey` (branded types)
- Définir `RatchetState` (chainKey + counter)
- Définir les fonctions : `generateChainKey`, `ratchetForward`, `deriveMessageKeys`
- **Commit** : `T009-step2: define symmetric ratchet interfaces`

### Étape 3 — Écriture des tests

- Tester le ratchet forward : chain key change, message key extraite
- Tester le déterminisme : même chain key → mêmes dérivations dans l'ordre
- Tester l'irréversibilité : impossible de revenir à la chain key précédente
- Tester le rattrapage : dériver N message keys d'un coup
- Tester la génération de chain key (aléatoire, unique)
- **Commit** : `T009-step3: write symmetric ratchet tests`

### Étape 4 — Implémentation

- Implémenter avec HKDF (T004) et libsodium
- Faire passer les tests
- **Commit** : `T009-step4: implement symmetric ratchet`
