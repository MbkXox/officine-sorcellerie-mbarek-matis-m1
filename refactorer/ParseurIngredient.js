class ParseurIngredient {
    static parser(chaine, normaliseur) {
        const match = chaine.trim().match(/^(-?\d+)\s+(.+)$/);
        
        if (!match) {
            throw new Error(`Format invalide: "${chaine}". Format attendu: "nombre ingredient"`);
        }
        
        const quantite = parseInt(match[1], 10);
        const nom = normaliseur(match[2]);
        
        if (quantite <= 0) {
            throw new Error("La quantité doit être positive");
        }
        
        return { quantite, nom };
    }
}

module.exports = ParseurIngredient;
