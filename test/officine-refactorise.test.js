const Officine = require('../refactoriser/officine-refactorise');
const GestionnaireStock = require('../refactoriser/GestionnaireStock');
const Recette = require('../refactoriser/Recette');
const NormalisateurNom = require('../refactoriser/NormalisateurNom');
const ParseurIngredient = require('../refactoriser/ParseurIngredient');

describe('Officine Refactorisée - Tests unitaires', () => {
    let officine;

    beforeEach(() => {
        officine = new Officine();
    });

    // ========== TESTS DE LA MÉTHODE rentrer() ==========
    
    describe('rentrer() - Cas usuels', () => {
        test('devrait ajouter des ingrédients au stock', () => {
            officine.rentrer('3 yeux de grenouille');
            expect(officine.quantite('œil de grenouille')).toBe(3);
        });

        test('devrait gérer le singulier et le pluriel', () => {
            officine.rentrer('1 œil de grenouille');
            officine.rentrer('2 yeux de grenouille');
            expect(officine.quantite('œil de grenouille')).toBe(3);
            expect(officine.quantite('yeux de grenouille')).toBe(3);
        });

        test('devrait cumuler les ajouts successifs', () => {
            officine.rentrer('5 larmes de brume funèbre');
            officine.rentrer('3 larmes de brume funèbre');
            expect(officine.quantite('larme de brume funèbre')).toBe(8);
        });

        test('devrait gérer plusieurs types d\'ingrédients', () => {
            officine.rentrer('3 yeux de grenouille');
            officine.rentrer('5 larmes de brume funèbre');
            officine.rentrer('2 crocs de troll');
            
            expect(officine.quantite('œil de grenouille')).toBe(3);
            expect(officine.quantite('larme de brume funèbre')).toBe(5);
            expect(officine.quantite('croc de troll')).toBe(2);
        });
    });

    describe('rentrer() - Cas extrêmes', () => {
        test('devrait gérer de grandes quantités', () => {
            officine.rentrer('1000 yeux de grenouille');
            expect(officine.quantite('œil de grenouille')).toBe(1000);
        });

        test('devrait gérer les espaces en début et fin de chaîne', () => {
            officine.rentrer('  5 yeux de grenouille  ');
            expect(officine.quantite('œil de grenouille')).toBe(5);
        });

        test('devrait être insensible à la casse', () => {
            officine.rentrer('3 YEUX DE GRENOUILLE');
            expect(officine.quantite('œil de grenouille')).toBe(3);
        });
    });

    describe('rentrer() - Cas d\'erreur', () => {
        test('devrait lever une erreur pour un format invalide', () => {
            expect(() => officine.rentrer('yeux de grenouille')).toThrow('Format invalide');
        });

        test('devrait lever une erreur pour une quantité négative', () => {
            expect(() => officine.rentrer('-3 yeux de grenouille')).toThrow('La quantité doit être positive');
        });

        test('devrait lever une erreur pour une quantité nulle', () => {
            expect(() => officine.rentrer('0 yeux de grenouille')).toThrow('La quantité doit être positive');
        });

        test('devrait lever une erreur pour une chaîne vide', () => {
            expect(() => officine.rentrer('')).toThrow('Format invalide');
        });
    });

    // ========== TESTS DE LA MÉTHODE quantite() ==========
    
    describe('quantite() - Cas usuels', () => {
        test('devrait retourner 0 pour un ingrédient non en stock', () => {
            expect(officine.quantite('œil de grenouille')).toBe(0);
        });

        test('devrait retourner la quantité correcte après ajout', () => {
            officine.rentrer('5 yeux de grenouille');
            expect(officine.quantite('œil de grenouille')).toBe(5);
        });

        test('devrait gérer singulier et pluriel', () => {
            officine.rentrer('7 yeux de grenouille');
            expect(officine.quantite('œil de grenouille')).toBe(7);
            expect(officine.quantite('yeux de grenouille')).toBe(7);
        });
    });

    describe('quantite() - Cas extrêmes', () => {
        test('devrait être insensible à la casse', () => {
            officine.rentrer('10 yeux de grenouille');
            expect(officine.quantite('YEUX DE GRENOUILLE')).toBe(10);
        });

        test('devrait gérer les espaces en début et fin', () => {
            officine.rentrer('8 yeux de grenouille');
            expect(officine.quantite('  yeux de grenouille  ')).toBe(8);
        });
    });

    // ========== TESTS DE LA MÉTHODE preparer() ==========
    
    describe('preparer() - Cas usuels', () => {
        test('devrait préparer une potion simple avec ingrédients suffisants', () => {
            officine.rentrer('2 larmes de brume funèbre');
            officine.rentrer('1 goutte de sang de citrouille');
            
            const resultat = officine.preparer('1 fiole de glaires purulentes');
            
            expect(resultat).toBe(1);
            expect(officine.quantite('fiole de glaires purulentes')).toBe(1);
            expect(officine.quantite('larme de brume funèbre')).toBe(0);
            expect(officine.quantite('goutte de sang de citrouille')).toBe(0);
        });

        test('devrait préparer plusieurs potions', () => {
            officine.rentrer('6 larmes de brume funèbre');
            officine.rentrer('3 gouttes de sang de citrouille');
            
            const resultat = officine.preparer('3 fioles de glaires purulentes');
            
            expect(resultat).toBe(3);
            expect(officine.quantite('fiole de glaires purulentes')).toBe(3);
            expect(officine.quantite('larme de brume funèbre')).toBe(0);
            expect(officine.quantite('goutte de sang de citrouille')).toBe(0);
        });

        test('devrait gérer une recette complexe', () => {
            officine.rentrer('2 crocs de troll');
            officine.rentrer('1 fragment d\'écaille de dragonnet');
            officine.rentrer('1 radicelle de racine hurlante');
            
            const resultat = officine.preparer('1 soupçon de sels suffocants');
            
            expect(resultat).toBe(1);
            expect(officine.quantite('soupçon de sels suffocants')).toBe(1);
        });

        test('devrait gérer une recette avec une potion comme ingrédient', () => {
            officine.rentrer('2 larmes de brume funèbre');
            officine.rentrer('1 goutte de sang de citrouille');
            officine.preparer('1 fiole de glaires purulentes');
            
            officine.rentrer('3 radicelles de racine hurlante');
            const resultat = officine.preparer('1 baton de pâte sépulcrale');
            
            expect(resultat).toBe(1);
            expect(officine.quantite('baton de pâte sépulcrale')).toBe(1);
            expect(officine.quantite('fiole de glaires purulentes')).toBe(0);
        });
    });

    describe('preparer() - Cas extrêmes', () => {
        test('devrait préparer 0 potion si ingrédients insuffisants', () => {
            officine.rentrer('1 larme de brume funèbre');
            officine.rentrer('1 goutte de sang de citrouille');
            
            const resultat = officine.preparer('1 fiole de glaires purulentes');
            
            expect(resultat).toBe(0);
            expect(officine.quantite('fiole de glaires purulentes')).toBe(0);
            expect(officine.quantite('larme de brume funèbre')).toBe(1);
        });

        test('devrait préparer moins de potions que demandé si ingrédients limités', () => {
            officine.rentrer('5 larmes de brume funèbre');
            officine.rentrer('10 gouttes de sang de citrouille');
            
            const resultat = officine.preparer('5 fioles de glaires purulentes');

            expect(resultat).toBe(2);
            expect(officine.quantite('fiole de glaires purulentes')).toBe(2);
            expect(officine.quantite('larme de brume funèbre')).toBe(1);
            expect(officine.quantite('goutte de sang de citrouille')).toBe(8);
        });

        test('devrait préparer 0 potion si aucun ingrédient en stock', () => {
            const resultat = officine.preparer('1 fiole de glaires purulentes');
            expect(resultat).toBe(0);
        });

        test('devrait conserver les surplus d\'ingrédients', () => {
            officine.rentrer('10 larmes de brume funèbre');
            officine.rentrer('10 gouttes de sang de citrouille');
            
            officine.preparer('3 fioles de glaires purulentes');
            
            expect(officine.quantite('larme de brume funèbre')).toBe(4);
            expect(officine.quantite('goutte de sang de citrouille')).toBe(7);
        });

        test('devrait gérer le singulier et pluriel pour les potions', () => {
            officine.rentrer('6 larmes de brume funèbre');
            officine.rentrer('3 gouttes de sang de citrouille');
            
            officine.preparer('2 fioles de glaires purulentes');
            
            expect(officine.quantite('fiole de glaires purulentes')).toBe(2);
            expect(officine.quantite('fioles de glaires purulentes')).toBe(2);
        });
    });

    describe('preparer() - Cas d\'erreur', () => {
        test('devrait lever une erreur pour une recette inconnue', () => {
            expect(() => officine.preparer('1 potion inconnue')).toThrow('Recette inconnue');
        });

        test('devrait lever une erreur pour un format invalide', () => {
            expect(() => officine.preparer('fiole de glaires purulentes')).toThrow('Format invalide');
        });

        test('devrait lever une erreur pour une quantité négative', () => {
            expect(() => officine.preparer('-1 fiole de glaires purulentes')).toThrow('La quantité doit être positive');
        });

        test('devrait lever une erreur pour une quantité nulle', () => {
            expect(() => officine.preparer('0 fiole de glaires purulentes')).toThrow('La quantité doit être positive');
        });
    });

    // ========== TESTS DES CLASSES UTILITAIRES ==========
    
    describe('GestionnaireStock - Tests unitaires', () => {
        let stock;

        beforeEach(() => {
            stock = new GestionnaireStock();
        });

        test('devrait retirer un ingrédient inexistant sans erreur', () => {
            stock.retirer('œil de grenouille', 5);
            expect(stock.obtenir('œil de grenouille')).toBe(-5);
        });

        test('devrait vérifier la disponibilité d\'un ingrédient inexistant', () => {
            expect(stock.estDisponible('larme de brume funèbre', 1)).toBe(false);
        });

        test('devrait vérifier la disponibilité correctement', () => {
            stock.ajouter('croc de troll', 10);
            expect(stock.estDisponible('croc de troll', 5)).toBe(true);
            expect(stock.estDisponible('croc de troll', 15)).toBe(false);
        });

        test('devrait intégrer correctement avec Officine', () => {
            officine.rentrer('10 larmes de brume funèbre');
            officine.rentrer('5 gouttes de sang de citrouille');
            const result = officine.preparer('5 fioles de glaires purulentes');
            expect(result).toBe(5);
        });
    });

    describe('Recette - Tests unitaires', () => {
        test('devrait calculer 0 pour une recette sans ingrédients', () => {
            const stock = new GestionnaireStock();
            const recetteSansIngredients = new Recette('potion vide', []);
            
            expect(recetteSansIngredients.calculerMaxPreparations(stock)).toBe(0);
        });

        test('devrait calculer le max de préparations correctement', () => {
            const stock = new GestionnaireStock();
            stock.ajouter('œil de grenouille', 10);
            stock.ajouter('pincée de poudre de lune', 15);
            
            const recette = new Recette('bille d\'âme évanescente', [
                { nom: 'pincée de poudre de lune', quantite: 3 },
                { nom: 'œil de grenouille', quantite: 1 }
            ]);
            
            expect(recette.calculerMaxPreparations(stock)).toBe(5);
        });

        test('devrait consommer les ingrédients correctement', () => {
            const stock = new GestionnaireStock();
            stock.ajouter('œil de grenouille', 10);
            stock.ajouter('pincée de poudre de lune', 15);
            
            const recette = new Recette('bille d\'âme évanescente', [
                { nom: 'pincée de poudre de lune', quantite: 3 },
                { nom: 'œil de grenouille', quantite: 1 }
            ]);
            
            recette.consommerIngredients(stock, 3);
            
            expect(stock.obtenir('œil de grenouille')).toBe(7);
            expect(stock.obtenir('pincée de poudre de lune')).toBe(6);
        });
    });

    describe('NormalisateurNom - Tests unitaires', () => {
        let normalisateur;

        beforeEach(() => {
            normalisateur = new NormalisateurNom();
        });

        test('devrait normaliser les ingrédients connus', () => {
            expect(normalisateur.normaliser('yeux de grenouille')).toBe('œil de grenouille');
            expect(normalisateur.normaliser('YEUX DE GRENOUILLE')).toBe('œil de grenouille');
            expect(normalisateur.normaliser('  yeux de grenouille  ')).toBe('œil de grenouille');
        });

        test('devrait retourner le nom tel quel pour un ingrédient inconnu', () => {
            expect(normalisateur.normaliser('ingredient inconnu')).toBe('ingredient inconnu');
        });
    });

    describe('ParseurIngredient - Tests unitaires', () => {
        const normalisateur = (nom) => nom.toLowerCase().trim();

        test('devrait parser correctement une chaîne valide', () => {
            const resultat = ParseurIngredient.parser('5 yeux de grenouille', normalisateur);
            expect(resultat.quantite).toBe(5);
            expect(resultat.nom).toBe('yeux de grenouille');
        });

        test('devrait gérer les espaces multiples', () => {
            const resultat = ParseurIngredient.parser('  10   larmes de brume funèbre  ', normalisateur);
            expect(resultat.quantite).toBe(10);
            expect(resultat.nom).toBe('larmes de brume funèbre');
        });

        test('devrait lever une erreur pour un format invalide', () => {
            expect(() => ParseurIngredient.parser('ingrédient sans quantité', normalisateur))
                .toThrow('Format invalide');
        });

        test('devrait lever une erreur pour une quantité négative', () => {
            expect(() => ParseurIngredient.parser('-5 yeux de grenouille', normalisateur))
                .toThrow('La quantité doit être positive');
        });

        test('devrait lever une erreur pour une quantité nulle', () => {
            expect(() => ParseurIngredient.parser('0 yeux de grenouille', normalisateur))
                .toThrow('La quantité doit être positive');
        });
    });

    // ========== TESTS D'INTÉGRATION ==========
    
    describe('Tests d\'intégration - Scénarios complexes', () => {
        test('scénario complet: rentrer, quantité, préparer plusieurs potions', () => {
            officine.rentrer('10 yeux de grenouille');
            officine.rentrer('20 pincées de poudre de lune');
            officine.rentrer('10 larmes de brume funèbre');
            officine.rentrer('5 gouttes de sang de citrouille');

            expect(officine.quantite('œil de grenouille')).toBe(10);
            expect(officine.quantite('pincée de poudre de lune')).toBe(20);
            
            const billes = officine.preparer('5 billes d\'âme évanescente');
            expect(billes).toBe(5);
            expect(officine.quantite('bille d\'âme évanescente')).toBe(5);
            expect(officine.quantite('pincée de poudre de lune')).toBe(5);
            expect(officine.quantite('œil de grenouille')).toBe(5);
            
            const fioles = officine.preparer('3 fioles de glaires purulentes');
            expect(fioles).toBe(3);
            expect(officine.quantite('fiole de glaires purulentes')).toBe(3);
        });

        test('scénario avec recette composée', () => {
            officine.rentrer('6 larmes de brume funèbre');
            officine.rentrer('3 gouttes de sang de citrouille');
            officine.preparer('3 fioles de glaires purulentes');
            
            officine.rentrer('9 radicelles de racine hurlante');
            const batons = officine.preparer('2 batons de pâte sépulcrale');
            
            expect(batons).toBe(2);
            expect(officine.quantite('baton de pâte sépulcrale')).toBe(2);
            expect(officine.quantite('fiole de glaires purulentes')).toBe(1);
            expect(officine.quantite('radicelle de racine hurlante')).toBe(3);
        });
    });
});
