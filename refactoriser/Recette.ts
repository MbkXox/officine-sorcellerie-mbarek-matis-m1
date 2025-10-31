import GestionnaireStock = require('./GestionnaireStock');

interface Ingredient {
    nom: string;
    quantite: number;
}

class Recette {
    nom: string;
    ingredients: Ingredient[];

    constructor(nom: string, ingredients: Ingredient[]) {
        this.nom = nom;
        this.ingredients = ingredients;
    }

    calculerMaxPreparations(stock: GestionnaireStock): number {
        let max = Infinity;
        
        for (const ingredient of this.ingredients) {
            const stockDisponible = stock.obtenir(ingredient.nom);
            const possibleAvecCetIngredient = Math.floor(stockDisponible / ingredient.quantite);
            max = Math.min(max, possibleAvecCetIngredient);
        }
        
        return max === Infinity ? 0 : max;
    }

    consommerIngredients(stock: GestionnaireStock, nombre: number): void {
        for (const ingredient of this.ingredients) {
            stock.retirer(ingredient.nom, ingredient.quantite * nombre);
        }
    }
}

export = Recette;
