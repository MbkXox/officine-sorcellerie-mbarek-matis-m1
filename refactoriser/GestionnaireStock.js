class GestionnaireStock {
    constructor() {
        this.stocks = {};
    }

    ajouter(nom, quantite) {
        if (!this.stocks[nom]) {
            this.stocks[nom] = 0;
        }
        this.stocks[nom] += quantite;
    }

    retirer(nom, quantite) {
        if (!this.stocks[nom]) {
            this.stocks[nom] = 0;
        }
        this.stocks[nom] -= quantite;
    }

    obtenir(nom) {
        return this.stocks[nom] || 0;
    }

    estDisponible(nom, quantite) {
        return this.obtenir(nom) >= quantite;
    }
}

module.exports = GestionnaireStock;
