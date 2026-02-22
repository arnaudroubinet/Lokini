# Lokini — Spécifications du projet

## 1. Vision du produit

Lokini est une application client-serveur permettant d'échanger des documents texte (sans média) entre devices. Un document peut prendre différentes formes : note, to-do, liste de courses, etc. Le système de types de documents est extensible.

### Principes fondamentaux

- **Privacy-first** : tout est chiffré côté device avant envoi. Le serveur ne peut jamais lire le contenu des documents.
- **Local-first** : les données vivent sur le device. Le serveur n'est qu'une aide à la synchronisation.
- **Simplicité** : toute la complexité technique (chiffrement, synchronisation) doit être invisible pour l'utilisateur.

## 2. Problème résolu

Partager des informations textuelles entre personnes de manière simple et privée. Lokini n'est pas une messagerie : c'est un outil de partage de documents.

## 3. Utilisateurs cibles

Tout le monde. L'application doit être accessible sans compétence technique particulière.
