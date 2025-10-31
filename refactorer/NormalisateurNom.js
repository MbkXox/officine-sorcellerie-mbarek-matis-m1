class NormalisateurNom {
    constructor() {
        this.tableNormalisation = {
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

    normaliser(nom) {
        const nomMinuscule = nom.toLowerCase().trim();
        return this.tableNormalisation[nomMinuscule] || nomMinuscule;
    }
}

module.exports = NormalisateurNom;
