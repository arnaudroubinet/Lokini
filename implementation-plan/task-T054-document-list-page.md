# T054 — Document list page

## Statut : `pending`

## Description

Implémenter l'écran principal affichant la liste de tous les documents. Support du tri, du filtrage, et des actions rapides (ouvrir, créer, rejoindre).

## Références spécifications

- §4.11 — Écran principal
- §5.0 — Recherche locale

## Dépendances

- T044 (Document store)
- T051 (Theme system)
- T052 (i18n)

## Critères d'acceptation

- [ ] Affichage de la liste des documents (titre, type, date modification, nb participants)
- [ ] Tri par : date modification (défaut), nom, type
- [ ] Filtrage par type de document
- [ ] Recherche plein texte locale dans les titres et le contenu déchiffré des documents (§5.0)
- [ ] Bouton « Créer un document »
- [ ] Bouton « Rejoindre un document »
- [ ] État vide (aucun document, avec call-to-action)
- [ ] Responsive design
- [ ] Accessibilité
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/presentation/pages/`

## Étapes TDD

### Étape 1 — Analyse

- Wireframe de la page
- Définir les composants enfants
- **Commit** : `T054-step1: analyze document list page`

### Étape 2 — Définition des interfaces

- Définir les composants et props
- **Commit** : `T054-step2: define document list page interfaces`

### Étape 3 — Écriture des tests

- Tester le rendu de la liste
- Tester le tri et le filtrage
- Tester la recherche
- Tester l'état vide
- **Commit** : `T054-step3: write document list page tests`

### Étape 4 — Implémentation

- Implémenter les composants
- Faire passer les tests
- **Commit** : `T054-step4: implement document list page`
