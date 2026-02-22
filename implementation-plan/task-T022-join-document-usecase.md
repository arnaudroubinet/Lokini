# T022 — Join document use case

## Statut : `pending`

## Description

Implémenter le cas d'usage « rejoindre un document via token d'invitation ». Valide le token, enregistre le device comme participant, et initie le flux d'échange de clés.

## Références spécifications

- §4.4 — Rejoindre un document
- §6.6 — Échange de clés et jonction
- §7.9 — Erreurs de jonction

## Dépendances

- T018 (JoinDocumentUseCase interface)
- T019 (InvitationTokenRepository, DeviceRepository)

## Critères d'acceptation

- [ ] Validation du token : existant, non expiré, non utilisé
- [ ] Vérification de la limite de devices (défaut : 40)
- [ ] Enregistrement du nouveau device comme participant
- [ ] Marquage du token comme utilisé
- [ ] Notification aux devices existants de l'arrivée
- [ ] Erreurs explicites : token expiré, token utilisé, document plein, aucun device actif
- [ ] Tests unitaires couvrant tous les scénarios d'erreur

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux complet de jonction côté serveur
- Lister tous les cas d'erreur (§7.9)
- **Commit** : `T022-step1: analyze join document use case`

### Étape 2 — Définition des interfaces

- Définir `JoinDocumentCommand` et `JoinDocumentResult`
- **Commit** : `T022-step2: define join document use case interfaces`

### Étape 3 — Écriture des tests

- Tester la jonction réussie
- Tester le rejet : token expiré
- Tester le rejet : token déjà utilisé
- Tester le rejet : document plein (40 devices)
- Tester la notification aux participants existants
- **Commit** : `T022-step3: write join document use case tests`

### Étape 4 — Implémentation

- Implémenter `JoinDocumentUseCaseImpl`
- Faire passer les tests
- **Commit** : `T022-step4: implement join document use case`
