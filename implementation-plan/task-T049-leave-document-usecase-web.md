# T049 — Leave document use case (web)

## Statut : `pending`

## Description

Implémenter le cas d'usage « quitter un document » côté client web. Signale le départ au serveur, archive le document localement, nettoie les clés.

## Références spécifications

- §4.5 — Quitter un document

## Dépendances

- T044 (Document store)
- T039 (REST API client)
- T069 (Chain key distribution — régénération et distribution aux participants restants)

## Critères d'acceptation

- [ ] Signalement du départ au serveur
- [ ] Régénération de la chain key locale et distribution aux participants restants (§6.3)
- [ ] Archivage du document en local (dernière version)
- [ ] Suppression des clés cryptographiques pour ce document
- [ ] Mise à jour du store (document marqué comme archivé)
- [ ] Option de suppression locale
- [ ] Tests unitaires avec mocks

## Fichier cible

`packages/web/src/application/usecases/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux de départ côté client
- **Commit** : `T049-step1: analyze leave document use case`

### Étape 2 — Définition des interfaces

- Définir `LeaveDocumentParams`
- **Commit** : `T049-step2: define leave document use case interfaces`

### Étape 3 — Écriture des tests

- Tester le départ normal
- Tester l'archivage
- Tester la suppression
- **Commit** : `T049-step3: write leave document use case tests`

### Étape 4 — Implémentation

- Implémenter le use case
- Faire passer les tests
- **Commit** : `T049-step4: implement leave document use case`
