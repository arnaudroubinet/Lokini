# T056 — Document sharing UI (invitation link/QR)

## Statut : `pending`

## Description

Implémenter l'interface de partage d'un document : génération de liens d'invitation et de QR codes, avec durée de validité configurable.

## Références spécifications

- §4.4 — Rejoindre un document (lien/QR code)

## Dépendances

- T045 (Create document use case — pour les invitations)
- T046 (Join document use case — pour le parsing du lien)

## Critères d'acceptation

- [ ] Bouton « Partager » dans l'éditeur de document
- [ ] Modale de partage avec lien d'invitation
- [ ] Génération de QR code à partir du lien
- [ ] Durée de validité configurable (défaut : 1 heure)
- [ ] Copie du lien dans le presse-papiers
- [ ] Page d'accueil pour les liens d'invitation (parsing et redirection)
- [ ] Responsive et accessible
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/components/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le format du lien d'invitation
- Choisir la bibliothèque QR code
- **Commit** : `T056-step1: analyze document sharing UI`

### Étape 2 — Définition des interfaces

- Définir les composants ShareModal, QRCode
- **Commit** : `T056-step2: define document sharing UI interfaces`

### Étape 3 — Écriture des tests

- Tester la génération du lien
- Tester le QR code
- Tester la copie dans le presse-papiers
- Tester le parsing du lien d'invitation
- **Commit** : `T056-step3: write document sharing UI tests`

### Étape 4 — Implémentation

- Implémenter les composants
- Faire passer les tests
- **Commit** : `T056-step4: implement document sharing UI`
