# T013 — CRDT compaction

## Statut : `pending`

## Description

Implémenter la compaction automatique des documents CRDT pour nettoyer les métadonnées obsolètes (vecteurs d'horloge, tombstones) et réduire la taille en mémoire et sur disque.

## Références spécifications

- §4.8 — Compaction automatique
- §4.8 — Limite de taille des documents

## Dépendances

- T011 (CrdtDocument)
- T012 (CrdtDelta, opérations)

## Critères d'acceptation

- [ ] Fonction `compactDocument(doc)` → document compacté (même contenu, taille réduite)
- [ ] Fonction `shouldCompact(doc, threshold)` → boolean
- [ ] Fonction `getDocumentStats(doc)` → `{ size, changeCount, tombstoneCount }`
- [ ] La compaction préserve le contenu du document intégralement
- [ ] Seuil de compaction configurable (défaut raisonnable)
- [ ] Avertissement de taille configurable (défaut : 1 Mo)
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crdt/compaction.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier les mécanismes de compaction d'Automerge
- Identifier ce qui peut être nettoyé (historique, tombstones)
- Définir les seuils pertinents
- **Commit** : `T013-step1: analyze CRDT compaction`

### Étape 2 — Définition des interfaces

- Définir `CompactionOptions` (thresholds)
- Définir `DocumentStats` (taille, compteurs)
- Définir les fonctions d'API publique
- **Commit** : `T013-step2: define CRDT compaction interfaces`

### Étape 3 — Écriture des tests

- Tester que la compaction préserve le contenu
- Tester que la compaction réduit la taille après de nombreuses opérations
- Tester shouldCompact avec différents seuils
- Tester getDocumentStats
- Tester l'avertissement de taille
- **Commit** : `T013-step3: write CRDT compaction tests`

### Étape 4 — Implémentation

- Implémenter avec Automerge
- Faire passer les tests
- **Commit** : `T013-step4: implement CRDT compaction`
