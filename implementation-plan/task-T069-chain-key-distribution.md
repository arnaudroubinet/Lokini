# T069 — Chain key distribution protocol (core)

## Statut : `pending`

## Description

Implementer le protocole de distribution des chain keys entre devices participants d'un document. Couvre trois scenarios :
1. **Jonction** : le nouveau device recoit les chain keys de tous les participants existants et distribue la sienne
2. **Depart** : chaque device restant regenere sa chain key et la distribue
3. **Compromission** : rotation de toutes les chain keys (lien avec T062)

Le protocole utilise X25519 pour chiffrer les chain keys echangees entre devices.

## References specifications

- §6.3 — Jonction et distribution des chain keys
- §6.6 — Echange de cles et jonction (etapes 2 et 4)
- §4.5 — Quitter un document (regeneration des chain keys)

## Dependances

- T005 (X25519 — echange de cles pour chiffrer les chain keys)
- T006 (XChaCha20-Poly1305 — chiffrement des chain keys transmises)
- T009 (ChainKey, generateChainKey)

## Criteres d'acceptation

- [ ] Type `ChainKeyBundle` (ensemble des chain keys de tous les participants)
- [ ] Fonction `prepareChainKeysForNewDevice(existingChainKeys, newDevicePublicKey, senderPrivateKey)` -> chain keys chiffrees
- [ ] Fonction `receiveChainKeys(encryptedBundle, senderPublicKey, receiverPrivateKey)` -> chain keys dechiffrees
- [ ] Fonction `distributeNewChainKey(newChainKey, participantPublicKeys, senderPrivateKey)` -> messages chiffres individuels
- [ ] Fonction `rotateChainKeyOnLeave(currentChainKey)` -> nouvelle chain key + messages de distribution
- [ ] Fonction `rotateAllChainKeysOnCompromise(allChainKeys, compromisedDeviceId)` -> nouvelles chain keys
- [ ] Chaque echange est chiffre via X25519 + XChaCha20-Poly1305
- [ ] Le device parti/compromis ne recoit pas les nouvelles chain keys
- [ ] Couverture >= 90%

## Fichier cible

`packages/core/src/crypto/distribution.ts`

## Etapes TDD

### Etape 1 — Analyse

- Modeliser les trois scenarios de distribution
- Definir le format des messages de distribution (envelope chiffree)
- Identifier les invariants de securite
- **Commit** : `T069-step1: analyze chain key distribution protocol`

### Etape 2 — Definition des interfaces

- Definir `ChainKeyBundle`, `ChainKeyEnvelope` (chiffrement individuel)
- Definir les fonctions d'API publique
- **Commit** : `T069-step2: define chain key distribution interfaces`

### Etape 3 — Ecriture des tests

- Tester la preparation des chain keys pour un nouveau device
- Tester la reception et le dechiffrement
- Tester la distribution d'une nouvelle chain key
- Tester la rotation au depart
- Tester la rotation a la compromission
- Tester que le device exclu ne peut pas dechiffrer
- **Commit** : `T069-step3: write chain key distribution tests`

### Etape 4 — Implementation

- Implementer le protocole
- Faire passer les tests
- **Commit** : `T069-step4: implement chain key distribution protocol`
