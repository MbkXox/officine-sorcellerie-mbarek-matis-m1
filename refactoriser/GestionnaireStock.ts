class GestionnaireStock {
    private stocks: { [key: string]: number };

    constructor() {
        this.stocks = {};
    }

    ajouter(nom: string, quantite: number): void {
        if (!this.stocks[nom]) {
            this.stocks[nom] = 0;
        }
        this.stocks[nom] += quantite;
    }

    retirer(nom: string, quantite: number): void {
        if (!this.stocks[nom]) {
            this.stocks[nom] = 0;
        }
        this.stocks[nom] -= quantite;
    }

    obtenir(nom: string): number {
        return this.stocks[nom] || 0;
    }

    estDisponible(nom: string, quantite: number): boolean {
        return this.obtenir(nom) >= quantite;
    }
}

export = GestionnaireStock;
