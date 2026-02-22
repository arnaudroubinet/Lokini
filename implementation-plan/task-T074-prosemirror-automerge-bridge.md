# T074 — ProseMirror-Automerge bridge

## Statut : `pending`

## Description

Implementer le pont bidirectionnel entre ProseMirror et Automerge. Transforme les transactions ProseMirror en operations Automerge et vice-versa. Gere l'application des deltas distants sans perdre la position du curseur local. C'est l'un des composants les plus complexes du projet.

## References specifications

- §4.8 — Gestion des conflits (CRDT sequence pour le texte)
- §4.8 — Deltas (operations CRDT, idempotentes)
- §5.1 — Note (texte riche, AST compatible ProseMirror)

## Dependances

- T055 (Note editor — ProseMirror schema et editeur de base)
- T012 (CRDT operations — applyChange, applyDelta)
- T047 (Edit document use case — orchestration des modifications)

## Criteres d'acceptation

- [ ] Transformation ProseMirror Transaction -> Automerge Change
- [ ] Transformation Automerge Change -> ProseMirror Transaction
- [ ] Application des deltas distants sans deplacer le curseur local
- [ ] Gestion des modifications concurrentes (deux utilisateurs editent en meme temps)
- [ ] Convergence garantie : tous les clients arrivent au meme etat final
- [ ] Support de tous les types de noeuds du schema Note (paragraphe, heading, listes, bold, italic, link)
- [ ] Debouncing des changements locaux pour grouper les frappes rapides
- [ ] Hook React `useCollaborativeEditor(documentId)` encapsulant la logique
- [ ] Performance : application d'un delta distant en < 16ms (60fps)
- [ ] Couverture >= 90%

## Fichier cible

`packages/web/src/presentation/components/editor/bridge.ts`

## Etapes TDD

### Etape 1 — Analyse

- Etudier les approches existantes (prosemirror-collab, yjs-prosemirror, automerge-prosemirror)
- Definir la strategie de mapping entre l'AST ProseMirror et le schema Automerge
- Identifier les cas limites (suppression concurrente, formatage concurrent, split de paragraphe)
- **Commit** : `T074-step1: analyze ProseMirror-Automerge bridge`

### Etape 2 — Definition des interfaces

- Definir `EditorBridge` (interface principale)
- Definir `LocalChange` et `RemoteChange` (types de changements)
- Definir le hook `useCollaborativeEditor`
- **Commit** : `T074-step2: define ProseMirror-Automerge bridge interfaces`

### Etape 3 — Ecriture des tests

- Tester la transformation locale : frappe de texte -> operation Automerge
- Tester la transformation distante : operation Automerge -> transaction ProseMirror
- Tester le round-trip : local -> Automerge -> remote -> ProseMirror (meme resultat)
- Tester les modifications concurrentes : deux utilisateurs tapent en meme temps
- Tester la preservation du curseur lors d'un delta distant
- Tester le formatage concurrent (un user met en gras, l'autre tape du texte)
- Tester la performance (benchmark < 16ms)
- **Commit** : `T074-step3: write ProseMirror-Automerge bridge tests`

### Etape 4 — Implementation

- Implementer le bridge
- Implementer le hook React
- Faire passer les tests
- **Commit** : `T074-step4: implement ProseMirror-Automerge bridge`
