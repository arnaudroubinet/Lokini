# Plan d'implémentation — Lokini MVP

## Vue d'ensemble

Ce plan couvre l'implémentation complète du MVP Lokini tel que défini dans `SPECIFICATIONS.md` §11 :
- **Type de document** : Notes (texte riche) uniquement
- **Plateforme** : Application web (React)
- **Liaison multi-device** : incluse
- **Chiffrement E2E** : complet
- **Synchronisation** : REST + WebSocket + push notifications
- **Mode offline** : lecture et écriture hors-ligne
- **Serveur** : instance publique + auto-hébergement

## Méthodologie

Chaque tâche suit une approche **TDD stricte** en 4 étapes, chacune avec son propre commit :

| Étape | Description | Commit pattern |
|-------|-------------|----------------|
| 1. Analyse | Étude des spécifications, identification des cas limites | `TXXX-step1: analyze <sujet>` |
| 2. Interfaces | Définition des types, interfaces, contrats | `TXXX-step2: define <sujet> interfaces` |
| 3. Tests | Écriture des tests unitaires (RED) | `TXXX-step3: write <sujet> tests` |
| 4. Implémentation | Code de production (GREEN + REFACTOR) | `TXXX-step4: implement <sujet>` |

## Suivi d'avancement

| Phase | Tâches | Terminées | Statut |
|-------|--------|-----------|--------|
| 1. Core Models | T001–T003 | 0/3 | `pending` |
| 2. Crypto Primitives | T004–T010 | 0/7 | `pending` |
| 3. CRDT Engine | T011–T013 | 0/3 | `pending` |
| 4. Sync Logic | T014–T016 | 0/3 | `pending` |
| 5. Server Domain | T017–T026 | 0/10 | `pending` |
| 6. Server Persistence | T027–T030 | 0/4 | `pending` |
| 7. Server Adapters | T031–T037 | 0/7 | `pending` |
| 8. Web Infrastructure | T038–T042 | 0/5 | `pending` |
| 9. Web Application | T043–T050 | 0/8 | `pending` |
| 10. Web Presentation | T051–T058 | 0/8 | `pending` |
| 11. Multi-device Linking | T059–T064 | 0/6 | `pending` |
| 12. Integration & E2E | T065–T066 | 0/2 | `pending` |
| **Total** | **T001–T066** | **0/66** | |

## Graphe de dépendances

```
Phase 1: Core Models ──────────┬──── Phase 2: Crypto ────────┐
                               │                              │
                               ├──── Phase 3: CRDT ──────────┤
                               │                              │
                               │                    Phase 4: Sync Logic
                               │                              │
Phase 5: Server Domain ────────┤                              │
         │                     │                              │
Phase 6: Server Persistence    │                              │
         │                     │                              │
Phase 7: Server Adapters       │               Phase 8: Web Infrastructure
                               │                              │
                               │               Phase 9: Web Application
                               │                              │
                               │               Phase 10: Web Presentation
                               │                              │
Phase 11: Multi-device ────────┴──────────────────────────────┘
                                                              │
                               Phase 12: Integration & E2E ───┘
```

### Dépendances détaillées par tâche

#### Phase 1 — Core Models (aucune dépendance)
- **T001** Device identity model → aucune
- **T002** Base document model → T001
- **T003** Note document type → T002

#### Phase 2 — Crypto Primitives (dépend de Phase 1)
- **T004** HKDF-SHA256 → aucune
- **T005** X25519 key generation → T001
- **T006** XChaCha20-Poly1305 encryption → T004
- **T007** Ed25519 signatures → T001
- **T008** BLAKE2b token hashing → aucune
- **T009** Symmetric ratchet (Sender Keys) → T004, T006
- **T010** Argon2id at-rest encryption → T006

#### Phase 3 — CRDT Engine (dépend de Phase 1)
- **T011** CRDT document wrapper → T002, T003
- **T012** CRDT operations (deltas) → T011
- **T013** CRDT compaction → T011, T012

#### Phase 4 — Sync Logic (dépend de Phases 2 + 3)
- **T014** Delta packaging (encrypt/sign) → T006, T007, T009, T012
- **T015** Sync protocol (pull/push) → T014
- **T016** Offline queue → T014, T015

#### Phase 5 — Server Domain (indépendant du client)
- **T017** Server domain models → aucune
- **T018** Driving ports (use case interfaces) → T017
- **T019** Driven ports (repository/push/pubsub) → T017
- **T020** Store delta use case → T018, T019
- **T021** Retrieve deltas use case → T018, T019
- **T022** Join document use case → T018, T019
- **T023** Leave document use case → T018, T019
- **T024** Device push registration → T018, T019
- **T025** Delta retention/cleanup → T018, T019
- **T026** Device disconnection detection → T018, T019, T020

#### Phase 6 — Server Persistence (dépend de Phase 5)
- **T027** Liquibase schema → T017
- **T028** PostgreSQL delta repository → T019, T027
- **T029** PostgreSQL device repository → T019, T027
- **T030** PostgreSQL document repository → T019, T027

#### Phase 7 — Server Adapters (dépend de Phases 5 + 6)
- **T031** REST — Delta endpoints → T020, T021
- **T032** REST — Document join/leave → T022, T023
- **T033** REST — Device registration → T024
- **T034** WebSocket adapter → T020, T021
- **T035** Rate limiting → T031, T032, T033
- **T036** Push notification adapter (stub) → T019
- **T037** Pub/Sub adapter (stub) → T019

#### Phase 8 — Web Infrastructure (dépend de Phase 4)
- **T038** Application ports (interfaces) → T002, T014
- **T039** REST API client → T038
- **T040** WebSocket client → T038
- **T041** IndexedDB storage adapter → T038
- **T042** Push notification registration → T038

#### Phase 9 — Web Application (dépend de Phase 8)
- **T043** Device store (Zustand) → T001, T038
- **T044** Document store (Zustand) → T002, T038
- **T045** Create document use case → T043, T044, T011, T005, T009
- **T046** Join document use case → T043, T044, T005, T009
- **T047** Edit document use case → T044, T012
- **T048** Sync document use case → T044, T015, T039, T040
- **T049** Leave document use case → T044, T039
- **T050** Offline sync orchestration → T048, T016, T041

#### Phase 10 — Web Presentation (dépend de Phase 9)
- **T051** Theme system (light/dark/auto) → aucune (indépendant)
- **T052** i18n completion → aucune (indépendant)
- **T053** Onboarding flow → T043, T051, T052
- **T054** Document list page → T044, T051, T052
- **T055** Note editor (ProseMirror) → T047, T051
- **T056** Document sharing UI → T045, T046
- **T057** Participant list component → T044
- **T058** Settings page → T043, T051, T052

#### Phase 11 — Multi-device Linking (dépend de Phases multiples)
- **T059** Linking protocol (core) → T005, T006, T009
- **T060** Sync channel management → T059, T015
- **T061** Heartbeat & deactivation → T060
- **T062** Compromised device signaling → T060, T009
- **T063** Server linking support → T022, T034
- **T064** Web UI linking → T059, T060, T053

#### Phase 12 — Integration & E2E (dépend de tout)
- **T065** Client-server integration tests → Phases 7 + 9
- **T066** E2E scenarios → Phases 7 + 10

## Parallélisation possible

Les groupes suivants peuvent être développés en parallèle :

1. **Phase 2 (Crypto)** et **Phase 3 (CRDT)** — après Phase 1
2. **Phase 5 (Server Domain)** — indépendant des phases client
3. **Phase 10 T051/T052 (Theme/i18n)** — indépendant du reste

## Fichiers de tâches

Chaque tâche possède son propre fichier : `task-TXXX-<nom>.md`
