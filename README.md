# Officine - Système de gestion d'ingrédients et de potions

## Description

Ce projet implémente un système de gestion d'officine permettant de stocker des ingrédients et de préparer des potions selon des recettes prédéfinies. Le projet est développé en JavaScript avec des tests unitaires Jest.

## Structure du projet

```
TEST/
├── refactoriser
│   ├── NormalisateurNom.js            # Classe pour normaliser les noms (singulier/pluriel)
│   ├── ParseurIngredient.js           # Classe pour parser les chaînes "X ingredient"
│   ├── GestionnaireStock.js           # Classe pour gérer les stocks
│   ├── Recette.js                     # Classe représentant une recette
│   └── officine-refactorise.js        # Version refactorisée (architecture améliorée)
├── test
│   ├── officine-refactorise.test.js   # Tests pour la version refactorisée
│   └── officine.test.js               # Tests pour la version originale
├── officine.js                        # Version originale de la classe Officine
├── package.json                       # Configuration npm et dépendances
└── README.md                          # Ce fichier
```

## Installation

```bash
npm install
```

## Utilisation

### Version originale (monolithique)

```javascript
const Officine = require('./officine');

const officine = new Officine();

// Rentrer des ingrédients
officine.rentrer('3 yeux de grenouille');
officine.rentrer('5 larmes de brume funèbre');

// Vérifier les quantités
console.log(officine.quantite('œil de grenouille')); // 3

// Préparer des potions
officine.rentrer('2 larmes de brume funèbre');
officine.rentrer('1 goutte de sang de citrouille');
const potionsPréparées = officine.preparer('1 fiole de glaires purulentes');
console.log(potionsPréparées); // 1
```

### Version refactorisée (avec classes séparées)

```javascript
const Officine = require('../refactorer/officine-refactorise');

const officine = new Officine();
// Utilisation identique à la version originale
```

## Recettes disponibles

1. **Fiole de glaires purulentes** : 2 larmes de brume funèbre + 1 goutte de sang de citrouille
2. **Bille d'âme évanescente** : 3 pincées de poudre de lune + 1 œil de grenouille
3. **Soupçon de sels suffocants** : 2 crocs de troll + 1 fragment d'écaille de dragonnet + 1 radicelle de racine hurlante
4. **Baton de pâte sépulcrale** : 3 radicelles de racine hurlante + 1 fiole de glaires purulentes
5. **Bouffée d'essence de cauchemar** : 2 pincées de poudre de lune + 2 larmes de brume funèbre

## Fonctionnalités

### Méthodes principales

- **`rentrer(chaine)`** : Ajoute des ingrédients au stock
  - Format : `"quantité nom_ingredient"` (ex: `"3 yeux de grenouille"`)
  - Gère le singulier et le pluriel
  - Insensible à la casse

- **`quantite(nom)`** : Retourne la quantité en stock d'un ingrédient
  - Accepte singulier ou pluriel
  - Retourne 0 si l'ingrédient n'est pas en stock

- **`preparer(chaine)`** : Prépare une ou plusieurs potions
  - Format : `"quantité nom_potion"` (ex: `"2 fioles de glaires purulentes"`)
  - Retourne le nombre de potions réellement préparées
  - Ajuste automatiquement selon les ingrédients disponibles
  - Met à jour les stocks (retire ingrédients, ajoute potions)

### Gestion des erreurs

- Format invalide (absence de quantité)
- Quantité négative ou nulle
- Recette inconnue

## Tests

### Lancer tous les tests

```bash
npm test
```

### Lancer les tests avec coverage

```bash
npm run test:coverage
```

### Lancer uniquement les tests d'une version

```bash
# Version originale
npm test -- officine.test.js

# Version refactorisée
npm test -- officine-refactorise.test.js
```

## Couverture des tests

Les tests couvrent :

✅ **Cas usuels** : Fonctionnement normal de chaque méthode

✅ **Cas extrêmes** : 
- Grandes quantités
- Gestion singulier/pluriel
- Insensibilité à la casse
- Espaces en début/fin de chaîne
- Stocks insuffisants
- Surplus d'ingrédients

✅ **Cas d'erreur** :
- Format invalide
- Quantités négatives ou nulles
- Recettes inconnues
- Chaînes vides

✅ **Tests d'intégration** : Scénarios complets avec plusieurs opérations

**Résultat** : 31 tests passent avec succès ✅

## Améliorations (Version refactorisée)

La version refactorisée respecte les principes SOLID et améliore la maintenabilité :

1. **Séparation des responsabilités** :
   - `NormalisateurNom` : Gestion singulier/pluriel
   - `ParseurIngredient` : Parsing des chaînes
   - `GestionnaireStock` : Gestion des stocks
   - `Recette` : Logique métier des recettes
   - `Officine` : Orchestration

2. **Réutilisabilité** : Chaque classe peut être testée et réutilisée indépendamment

3. **Maintenabilité** : Code plus facile à comprendre et à modifier

4. **Testabilité** : Possibilité de tester chaque composant isolément

## Auteur

Projet développé dans le cadre d'un exercice de programmation orientée objet et de tests unitaires.

## Licence

ISC