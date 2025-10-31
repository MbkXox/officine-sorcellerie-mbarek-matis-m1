class Officine {
    private stocks: { [key: string]: number };
    private recettes: { [key: string]: string[] };
    private normalisationIngredients: { [key: string]: string };

    constructor() {
        this.stocks = {};
        
        this.recettes = {
            "fiole de glaires purulentes": ["2 larmes de brume funèbre", "1 goutte de sang de citrouille"],
            "bille d'âme évanescente": ["3 pincées de poudre de lune", "1 œil de grenouille"],
            "soupçon de sels suffocants": ["2 crocs de troll", "1 fragment d'écaille de dragonnet", "1 radicelle de racine hurlante"],
            "baton de pâte sépulcrale": ["3 radicelles de racine hurlante", "1 fiole de glaires purulentes"],
            "bouffée d'essence de cauchemar": ["2 pincées de poudre de lune", "2 larmes de brume funèbre"]
        };
        
        this.normalisationIngredients = {
            "œil de grenouille": "œil de grenouille",
            "yeux de grenouille": "œil de grenouille",
            "larme de brume funèbre": "larme de brume funèbre",
            "larmes de brume funèbre": "larme de brume funèbre",
            "radicelle de racine hurlante": "radicelle de racine hurlante",
            "radicelles de racine hurlante": "radicelle de racine hurlante",
            "pincée de poudre de lune": "pincée de poudre de lune",
            "pincées de poudre de lune": "pincée de poudre de lune",
            "croc de troll": "croc de troll",
            "crocs de troll": "croc de troll",
            "fragment d'écaille de dragonnet": "fragment d'écaille de dragonnet",
            "fragments d'écaille de dragonnet": "fragment d'écaille de dragonnet",
            "goutte de sang de citrouille": "goutte de sang de citrouille",
            "gouttes de sang de citrouille": "goutte de sang de citrouille",
            "fiole de glaires purulentes": "fiole de glaires purulentes",
            "fioles de glaires purulentes": "fiole de glaires purulentes",
            "bille d'âme évanescente": "bille d'âme évanescente",
            "billes d'âme évanescente": "bille d'âme évanescente",
            "soupçon de sels suffocants": "soupçon de sels suffocants",
            "soupçons de sels suffocants": "soupçon de sels suffocants",
            "baton de pâte sépulcrale": "baton de pâte sépulcrale",
            "batons de pâte sépulcrale": "baton de pâte sépulcrale",
            "bouffée d'essence de cauchemar": "bouffée d'essence de cauchemar",
            "bouffées d'essence de cauchemar": "bouffée d'essence de cauchemar"
        };
    }
    
    normaliserNom(nom: string): string {
        const nomMinuscule = nom.toLowerCase().trim();
        return this.normalisationIngredients[nomMinuscule] || nomMinuscule;
    }
    
    parserIngredient(chaine: string): { quantite: number; ingredient: string } {
        const match = chaine.trim().match(/^(-?\d+)\s+(.+)$/);
        if (!match) {
            throw new Error(`Format invalide: "${chaine}". Format attendu: "nombre ingredient"`);
        }
        
        const quantite = parseInt(match[1], 10);
        const ingredient = this.normaliserNom(match[2]);
        
        return { quantite, ingredient };
    }
    
    rentrer(chaine: string): void {
        const { quantite, ingredient } = this.parserIngredient(chaine);
        
        if (quantite <= 0) {
            throw new Error("La quantité doit être positive");
        }
        
        if (!this.stocks[ingredient]) {
            this.stocks[ingredient] = 0;
        }
        
        this.stocks[ingredient] += quantite;
    }
    
    quantite(nom: string): number {
        const nomNormalise = this.normaliserNom(nom);
        return this.stocks[nomNormalise] || 0;
    }
    
    preparer(chaine: string): number {
        const { quantite: quantiteDemandee, ingredient: potion } = this.parserIngredient(chaine);
        
        if (quantiteDemandee <= 0) {
            throw new Error("La quantité doit être positive");
        }
        
        const recette = this.recettes[potion];
        if (!recette) {
            throw new Error(`Recette inconnue pour: "${potion}"`);
        }
        
        const ingredientsNecessaires = recette.map(ing => this.parserIngredient(ing));
        
        let maxPotionsPossibles = Infinity;
        
        for (const { quantite: qteParPotion, ingredient } of ingredientsNecessaires) {
            const stockDisponible = this.quantite(ingredient);
            const potionsPossiblesAvecCetIngredient = Math.floor(stockDisponible / qteParPotion);
            maxPotionsPossibles = Math.min(maxPotionsPossibles, potionsPossiblesAvecCetIngredient);
        }
        
        const potionsAPrearer = Math.min(quantiteDemandee, maxPotionsPossibles);
        
        if (potionsAPrearer > 0) {
            for (const { quantite: qteParPotion, ingredient } of ingredientsNecessaires) {
                this.stocks[ingredient] -= qteParPotion * potionsAPrearer;
            }
            
            if (!this.stocks[potion]) {
                this.stocks[potion] = 0;
            }
            this.stocks[potion] += potionsAPrearer;
        }
        
        return potionsAPrearer;
    }
}

export = Officine;
