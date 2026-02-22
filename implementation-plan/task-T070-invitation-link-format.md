# T070 — Invitation link format & parsing (core)

## Statut : `pending`

## Description

Definir et implementer le format des liens d'invitation dans `@lokini/core`. Un lien d'invitation contient : l'adresse du serveur, l'identifiant du document, et le token d'invitation. Ce format est partage entre toutes les plateformes.

## References specifications

- §4.4 — Rejoindre un document (lien ou QR code)
- §4.4 — Contenu du lien : adresse serveur + identifiant document + token

## Dependances

- T002 (DocumentId, ServerAddress)

## Criteres d'acceptation

- [ ] Type `InvitationLink` (serverAddress, documentId, token)
- [ ] Fonction `createInvitationLink(serverAddress, documentId, token)` -> URL string
- [ ] Fonction `parseInvitationLink(url)` -> `InvitationLink | ParseError`
- [ ] Format d'URL lisible et copiable (ex: `https://server/join#docId/token`)
- [ ] Validation stricte du parsing (rejet des URLs malformees)
- [ ] Support des serveurs auto-heberges (URL custom)
- [ ] Le token n'est jamais envoye au serveur via l'URL (utiliser le fragment `#`)
- [ ] Aucune dependance plateforme
- [ ] Couverture >= 90%

## Fichier cible

`packages/core/src/models/invitation.ts`

## Etapes TDD

### Etape 1 — Analyse

- Definir le format exact de l'URL d'invitation
- Choisir entre query params, fragment, path pour les donnees
- S'assurer que le token ne fuit pas vers le serveur (via fragment #)
- **Commit** : `T070-step1: analyze invitation link format`

### Etape 2 — Definition des interfaces

- Definir `InvitationLink` et `InvitationParseError`
- Definir les fonctions d'API publique
- **Commit** : `T070-step2: define invitation link interfaces`

### Etape 3 — Ecriture des tests

- Tester la creation d'un lien d'invitation
- Tester le parsing d'un lien valide (round-trip)
- Tester le rejet de liens invalides (URL malformee, champs manquants)
- Tester le support de differents serveurs
- Tester que le token est dans le fragment (pas dans le path/query)
- **Commit** : `T070-step3: write invitation link format tests`

### Etape 4 — Implementation

- Implementer creation et parsing
- Faire passer les tests
- **Commit** : `T070-step4: implement invitation link format`
