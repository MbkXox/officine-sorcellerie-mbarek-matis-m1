import NormalisateurNom = require('./NormalisateurNom');
import ParseurIngredient = require('./ParseurIngredient');
import GestionnaireStock = require('./GestionnaireStock');
import Recette = require('./Recette');

class Officine {
    private normalisateur: NormalisateurNom;
    private stock: GestionnaireStock;
    private recettes: Map<string, Recette>;

    constructor() {
        this.normalisateur = new NormalisateurNom();
        this.stock = new GestionnaireStock();
        this.recettes = this._initialiserRecettes();
    }

    private _initialiserRecettes(): Map<string, Recette> {
        const recettesData: { [key: string]: string[] } = {
            "fiole de glaires purulentes": ["2 larmes de brume funèbre", "1 goutte de sang de citrouille"],
            "bille d'âme évanescente": ["3 pincées de poudre de lune", "1 œil de grenouille"],
            "soupçon de sels suffocants": ["2 crocs de troll", "1 fragment d'écaille de dragonnet", "1 radicelle de racine hurlante"],
            "baton de pâte sépulcrale": ["3 radicelles de racine hurlante", "1 fiole de glaires purulentes"],
            "bouffée d'essence de cauchemar": ["2 pincées de poudre de lune", "2 larmes de brume funèbre"]
        };

        const recettes = new Map<string, Recette>();

        for (const [nomPotion, ingredientsStr] of Object.entries(recettesData)) {
            const ingredients = ingredientsStr.map(str => {
                const parsed = ParseurIngredient.parser(str, (nom) => this.normalisateur.normaliser(nom));
                return { nom: parsed.nom, quantite: parsed.quantite };
            });
            recettes.set(nomPotion, new Recette(nomPotion, ingredients));
        }

        return recettes;
    }

    rentrer(chaine: string): void {
        const { quantite, nom } = ParseurIngredient.parser(
            chaine, 
            (nom) => this.normalisateur.normaliser(nom)
        );
        this.stock.ajouter(nom, quantite);
    }

    quantite(nom: string): number {
        const nomNormalise = this.normalisateur.normaliser(nom);
        return this.stock.obtenir(nomNormalise);
    }

    preparer(chaine: string): number {
        const { quantite: quantiteDemandee, nom: potion } = ParseurIngredient.parser(
            chaine,
            (nom) => this.normalisateur.normaliser(nom)
        );

        const recette = this.recettes.get(potion);
        if (!recette) {
            throw new Error(`Recette inconnue pour: "${potion}"`);
        }

        const maxPossible = recette.calculerMaxPreparations(this.stock);
        const potionsAPrearer = Math.min(quantiteDemandee, maxPossible);

        if (potionsAPrearer > 0) {
            recette.consommerIngredients(this.stock, potionsAPrearer);
            this.stock.ajouter(potion, potionsAPrearer);
        }

        return potionsAPrearer;
    }
}

export = Officine;
