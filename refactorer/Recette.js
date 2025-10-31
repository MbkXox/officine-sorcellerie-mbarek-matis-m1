/**
 * Classe représentant une recette de potion
 */
class Recette {
    constructor(nom, ingredients) {
        this.nom = nom;
        this.ingredients = ingredients; // [{nom: string, quantite: number}]
    }

    /**
     * Calcule le nombre maximum de fois que la recette peut être préparée
     * @param {GestionnaireStock} stock - Le gestionnaire de stock
     * @returns {number} - Nombre maximum de potions préparables
     */
    calculerMaxPreparations(stock) {
        let max = Infinity;
        
        for (const ingredient of this.ingredients) {
            const stockDisponible = stock.obtenir(ingredient.nom);
            const possibleAvecCetIngredient = Math.floor(stockDisponible / ingredient.quantite);
            max = Math.min(max, possibleAvecCetIngredient);
        }
        
        return max === Infinity ? 0 : max;
    }

    /**
     * Consomme les ingrédients nécessaires pour préparer un certain nombre de potions
     * @param {GestionnaireStock} stock - Le gestionnaire de stock
     * @param {number} nombre - Nombre de potions à préparer
     */
    consommerIngredients(stock, nombre) {
        for (const ingredient of this.ingredients) {
            stock.retirer(ingredient.nom, ingredient.quantite * nombre);
        }
    }
}

module.exports = Recette;
