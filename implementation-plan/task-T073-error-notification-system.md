# T073 — Error notification system (web)

## Statut : `pending`

## Description

Implementer le systeme de notification d'erreurs et de feedback utilisateur. Affiche des messages contextuels (toast/snackbar) pour les erreurs de synchronisation, de jonction, de chiffrement, et les evenements systeme.

## References specifications

- §7.9 — Scenarios d'erreur (token expire, signature invalide, serveur injoignable, delta corrompu, cle corrompue)
- §4.4 — Erreurs de jonction (token expire, token utilise, document plein)
- §4.8 — Limite de taille des documents (avertissement)

## Dependances

- T051 (Theme system — style des notifications)
- T052 (i18n — traduction des messages d'erreur)

## Criteres d'acceptation

- [ ] Composant `Toast` / `Notification` reutilisable
- [ ] Support de plusieurs niveaux : erreur, avertissement, succes, info
- [ ] Empilement de notifications multiples
- [ ] Dismissible manuellement et auto-dismiss configurable
- [ ] Store Zustand `useNotificationStore` pour emettre des notifications depuis les use cases
- [ ] Messages d'erreur traduits (FR/EN) pour tous les scenarios de §7.9
- [ ] Alerte de securite specifique pour signature invalide (§7.9)
- [ ] Avertissement de taille de document (§4.8)
- [ ] Accessible (ARIA live region, role="alert")
- [ ] Theme clair/sombre
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/components/notifications/`

## Etapes TDD

### Etape 1 — Analyse

- Lister tous les messages d'erreur necessaires depuis §7.9
- Definir le design des notifications (position, animation, empilement)
- **Commit** : `T073-step1: analyze error notification system`

### Etape 2 — Definition des interfaces

- Definir `Notification` type (id, level, message, dismissible, autoDismiss)
- Definir `useNotificationStore` (actions: addNotification, dismissNotification)
- Definir le composant `NotificationContainer` et `Toast`
- **Commit** : `T073-step2: define error notification interfaces`

### Etape 3 — Ecriture des tests

- Tester l'ajout et la suppression de notifications
- Tester l'auto-dismiss
- Tester l'empilement
- Tester l'accessibilite (role="alert")
- Tester le rendu dans les deux themes
- **Commit** : `T073-step3: write error notification system tests`

### Etape 4 — Implementation

- Implementer le store et les composants
- Faire passer les tests
- **Commit** : `T073-step4: implement error notification system`
