const MonFormulaire = {
    autreLabel: document.querySelector('label[for="autre"]'),
    montantAffiche: document.querySelector('.montant__afficher'),
    radios: document.querySelectorAll('input[name="montant"]'),
    autre: document.getElementById('autre'),
    textInputfocus: document.querySelector('.hiddenInput'), // Déplacer la sélection ici
    textInputMontant: document.getElementById('montant'),
    textInput: document.querySelector('#textInput'),
    //conserse le tableau des messages d'erreur
    tErreurs: [],
    //tableau des validités des champs
    tValide: [],

    init: function () {
        this.radios.forEach((radio) => {
            radio.addEventListener('change', this.handleRadioChange.bind(this));
        });
    },

    handleRadioChange: function (event) {
        const textInput = event.target.parentElement.querySelector('.hiddenInput');
        if (event.target.value === 'autre' && event.target.checked) {
            this.montantAffiche.style.display = 'none';
            textInput.style.transition = '300ms';
            textInput.style.display = 'block';
            textInput.focus();
            this.autreLabel.classList.add('checked');
            this.textInputfocus.addEventListener('blur', this.verifierFocus.bind(this, this.textInput));
            event.target.addEventListener('click', this.clickAutreMontant.bind(this, textInput));
        } else {
            textInput.value = '';
            this.effacerChampErreur();
            this.effacerBorderInput(event);
            this.montantAffiche.style.display = 'block';
            textInput.style.transition = '300ms';
            textInput.style.display = 'none';
            this.textInputMontant.style.display = 'none'
            this.autreLabel.classList.remove('checked');
        }
    },
    verifierFocus: function (event) {
        let valide = false;
        if (this.validerSiVide(event) === true) {
            //si vide, afficher le message d'erreur
            this.afficherChampErreur(event, 'Veuillez saisir un montant.');
            this.afficherBorderInput(event);
            event.style.display = 'block';
            this.montantAffiche.style.display = 'none';

        } else if (this.validerPaterne(event) === true) {
            this.afficherChampErreur(event, 'Veuillez saisir un montant différent de zéro.');
        } else {
            event.style.display = 'none';
            this.montantAffiche.style.display = 'block';
            this.effacerChampErreur(event);
            this.effacerBorderInput(event);
            this.textInputMontant.innerText = event.value + '$';
            valide = true;
        }
        //modifier le tableau des validitées
        this.modifierTableauValidation("textInput", valide);
        return valide;
    },

    clickAutreMontant: function (event) {
        event.style.display = 'block';
        this.montantAffiche.style.display = 'none';
        event.focus();
    },


    effacerChampErreur: function () {
        document.getElementById("err_textInput").innerHTML = "";
    },

    validerSiVide: function (objCible) {
        let valide = false; //false = champ vide
        if (objCible.value === "") {
            valide = true; //si false, champ contient quelque chose
        }
        return valide;
    },

    validerPaterne: function (objCible) {
        let valide = false; //false = champ vide
        if (objCible.value === "0") {
            valide = true; //si false, champ contient quelque chose
        }
        return valide;
    },

    afficherChampErreur: function (objCible, message) {
        let nom = "err_textInput";
        document.getElementById(nom).innerHTML = '<img src="liaisons/images/alert-circle.svg" alt="icone erreur"> ' + message;
        document.getElementById(nom).style.display = "flex";
        document.getElementById(nom).style.gap = "4px";
    },

    afficherBorderInput: function (objCible) {
        let nom = "textInput";
        document.getElementById(nom).style.borderColor = "#FF5733";
    },

    effacerBorderInput: function (objCible) {
        let nom = "textInput";
        document.getElementById(nom).style.borderColor = "";
    },

    modifierTableauValidation: function (nomChamp, valide) {
        this.tValide[nomChamp] = valide;
        return valide;
    },


};
// window.addEventListener('load', MonFormulaire.init.bind(MonFormulaire));

MonFormulaire.init(); // Appel de la méthode d'initialisation pour démarrer l'écoute des événements

let validation = {
    //conserve la référence de l'élément de formulaire
    refFormulaire: null,
    //conserse le tableau des messages d'erreur
    tErreurs: [],
    //tableau des validités des champs
    tValide: [],

    /**
     * Méthode d'initialisation de la validation du formulaire
     */
    initialiser: function () {
        //si le javascript et activé, la classe js est placée dans le body indiquant au CSS qu'il est actif
        document.body.className = "js";

        //obtient la référence de la balise <form> en utilisant la classe formulaire
        this.refFormulaire = document.querySelector(".form");

        //empêche la validation html quand il y a du javascript
        this.refFormulaire.setAttribute('novalidate', 'novalidate');
        const nextButton = document.getElementsByName("next");
        // défini les écouteurs d'événement des boutons submit et reset
        nextButton.forEach(button => {
            button.addEventListener("click", this.changerSuivant.bind(this))
        });

        this.refFormulaire.addEventListener('submit', this.validerFormulaire.bind(this));

        this.refFormulaire.querySelector("#prenom").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#nom").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#courriel").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#adresse").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#codePostal").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#nomTitulaire").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#numeroCarte").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#codeSecurite").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#codePostalDeux").addEventListener("blur", this.validerChampTexte.bind(this));
        this.mettreAFalse();
    },

    chargeJSON: function (objJSON) {
        //fonction fetch (chargement asynchrone du JSON)
        fetch(objJSON)
            .then(response => response.json()) //la prommesse retourne une réponse de type JSON
            .then(monJSON => this.tErreurs = monJSON); // une fois reçu, on stock le JSON dans la letiable
    },

    changerSuivant: function () {
        if (currentStep < steps.length) {
            // Effectuez la validation ici avant de passer à l'étape suivante
            if (this.validerEtape(currentStep)) {
                if (this.refFormulaire.querySelector('.erreur')){
                    this.refFormulaire.querySelector('.active').classList.remove("erreur");
                }
                currentStep++;
                showStep(currentStep);
            } else {
                this.refFormulaire.querySelector('.active').classList.add("erreur");
                console.log('hello')
            }
        }
    },

    validerEtape: function (stepNumber) {
        let valide = true;
        switch (stepNumber) {
            case 1:
                let idMontantAutre = document.getElementById('montant');
                let inputAutre = document.querySelector('input#autre');
                if (inputAutre.checked) {
                    valide = idMontantAutre.innerText !== '' && idMontantAutre.innerText !== '0$';
                    if (valide) {
                        let montantDonRadioSpan = document.getElementById("montantDonValue");
                        let montantDonRadioInput = document.getElementById("montantDonValueConfirmation");
                        montantDonRadioSpan.innerText = idMontantAutre.innerText
                        montantDonRadioInput.value = "Confirmer le Don de " + idMontantAutre.textContent;
                    }
                } else {
                    valide = true;
                }
                return valide;
            case 2:
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#prenom")) === false) {
                    valide = false;
                }
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#nom")) === false) {
                    valide = false;
                }
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#courriel")) === false) {
                    valide = false;
                }
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#adresse")) === false) {
                    valide = false;
                }

                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#codePostalDeux")) === false) {
                    valide = false;
                }
                document.getElementById('review__pays').innerText = this.refFormulaire.querySelector("#pays").value
                document.getElementById('review__province').innerText = this.refFormulaire.querySelector("#province").value

                return valide;
            case 3:
                let valideDate = true;
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#nomTitulaire")) === false) {
                    valide = false;
                }
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#numeroCarte")) === false) {
                    valide = false;
                }
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#codeSecurite")) === false) {
                    valide = false;
                }
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#codePostal")) === false) {
                    valide = false;
                }
                if (this.validerSectionSuivant(this.refFormulaire.querySelector("#moisExpiration")) === false) {
                    valide = false;
                    valideDate = false;
                } else if (valideDate) {
                    if (this.validerSectionSuivant(this.refFormulaire.querySelector("#anneeExpiration")) === false) {
                        valide = false;
                    }
                }
                if (valideDate) {
                    document.getElementById('review__anneeExpiration').innerText = this.refFormulaire.querySelector("#moisExpiration").value + '/' + this.refFormulaire.querySelector("#anneeExpiration").value
                }

                return valide;
            default:
                return true;
        }
    },


    validerSectionSuivant: function (objCible) {
        //champ invalide par défaut
        let valide = false;
        let strChaineExp = new RegExp(objCible.getAttribute('pattern'));
        let nomChamp = objCible.getAttribute("name");
        //valide si pas vide
        if (this.validerSiVide(objCible) === true) {
            //si vide, afficher le message d'erreur
            if (this.tErreurs[nomChamp] && this.tErreurs[nomChamp]["vide"]) {
                let messageErreur = this.tErreurs[nomChamp]["vide"];
                // Vérifiez si le message d'erreur est défini
                if (messageErreur) {
                    this.afficherChampErreur(objCible, messageErreur);
                }
            }
            this.afficherBorderInput(objCible);
        } else {
            if (objCible.hasAttribute("pattern")) {
                let nom = "review__" + objCible.getAttribute("id");
                if (document.getElementById(nom).innerHTML) {
                    document.getElementById(nom).innerHTML = objCible.value;
                }

                //si pas vide, tester le pattern
                if (strChaineExp.test(objCible.value)) {
                    //si pattern ok
                    valide = true;
                    //effacer le champ d'erreur
                    this.effacerChampErreur(objCible);
                    this.effacerBorderInput(objCible);
                } else {
                    //si pattern invalide afficher message détaillé
                    this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["pattern"]);
                    this.afficherBorderInput(objCible);
                }
            } else {
                this.effacerChampErreur(objCible);
                this.effacerBorderInput(objCible);
                valide = true;
            }
        }
        //modifier le tableau des validitées
        if (objCible.getAttribute("id") !== 'moisExpiration' && objCible.getAttribute("id") !== 'anneeExpiration') {
            let nom = "review__" + objCible.getAttribute("id");
            if (document.getElementById(nom)) {
                document.getElementById(nom).innerHTML = objCible.value;
            }
        }

        this.modifierTableauValidation(objCible.getAttribute("name"), valide);
        return valide;
    },

    modifierTableauValidation: function (nomChamp, valide) {
        this.tValide[nomChamp] = valide;
        return valide;
    },

    /**
     * Méthode de validation des champs de texte
     * @param evenement
     */
    validerChampTexte: function (evenement) {
        //champ invalide par défaut
        let valide = false;
        //objet du DOM déclancheur, initialise un objet jQuery
        let objCible = evenement.currentTarget;
        //retrouve le regexp de l'objet du DOM en lisant l'attribut pattern
        let strChaineExp = new RegExp(objCible.getAttribute('pattern'));
        //valide si pas vide
        if (this.validerSiVide(objCible) === true) {
            //si vide, afficher le message d'erreur
            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
            this.afficherBorderInput(objCible);
        } else {
            if (objCible.hasAttribute("pattern")) {
                //si pas vide, tester le pattern
                if (strChaineExp.test(objCible.value)) {
                    //si pattern ok
                    valide = true;
                    let nom = "review__" + objCible.getAttribute("id");
                    document.getElementById(nom).innerHTML = objCible.value;
                    let prenomNomElement = document.getElementById('review__prenomNom');
                    if (objCible.getAttribute("id") === "prenom") {
                        prenomNomElement.innerHTML = objCible.value.trim();
                    }
                    if (objCible.getAttribute("id") === "nom"){
                        prenomNomElement.innerHTML = (prenomNomElement.innerHTML + ' ' + objCible.value).trim();
                    }
                    //effacer le champ d'erreur
                    this.effacerChampErreur(objCible);
                    this.effacerBorderInput(objCible);
                } else {
                    //si pattern invalide afficher message détaillé
                    this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["pattern"]);
                    this.afficherBorderInput(objCible);
                }
            } else {
                this.effacerChampErreur(objCible);
                this.effacerBorderInput(objCible);
                valide = true;
            }
        }
        //modifier le tableau des validitées
        this.modifierTableauValidation(objCible.getAttribute("name"), valide);
        return valide;
    },

    /**
     * Méthode de validation finale du formulaire et d'envoi
     * @param evenement
     */
    validerFormulaire: function (evenement) {
        //Par defaut, le formulaire est considé comme valide
        let valide = true;
        //Pour chacun des champs présent dans le tableau de validation
        for (let champ in this.tValide) {
            //Si un champ est invalide
            if (this.tValide[champ] === false) {
                //cible l'objet du DOM fautif
                let objCible = this.refFormulaire.querySelector("#" + champ);
                //ici deux possibilité de message, vide ou pattern
                if (this.validerSiVide(objCible) === true) {
                    this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
                    this.afficherBorderInput(objCible);

                } else {
                    if (objCible.hasAttribute("pattern")) {
                        let strChaineExp = new RegExp(objCible.getAttribute('pattern'));
                        if (strChaineExp.test(objCible.value)) {
                            //affiche que l'entrée n'est pas du bon format
                            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["pattern"]);
                            this.afficherBorderInput(objCible);
                        }
                    } else {
                        //effacer le champ d'erreur
                        this.effacerChampErreur(objCible);
                        this.effacerBorderInput(objCible);
                    }
                }
                //Le formulaire contient des champs invalide, et n'est donc pas prêt à l'envoi
                valide = false;
            }
        }

        // si le formulaire n'est pas valide, on annule la soumission du formulaire de l'événement submit
        if (valide === false) {
            evenement.preventDefault();
        } else {
            // pour que l'overlay affiche
            evenement.preventDefault();
            // Récupérez l'élément close par son ID
            let closeButton = document.getElementById("close");
            // Récupérez l'élément aside par son ID
            let asideElement = document.getElementById("myAside");
            // Récupérez l'élément overlay par sa classe
            let overlay = document.querySelector(".overlay");
            // Ajoutez un gestionnaire d'événements pour le clic sur le bouton close
            closeButton.addEventListener("click", function () {
                // Réduisez l'opacité de l'overlay et de l'aside à 0
                overlay.style.opacity = 0;
                asideElement.style.opacity = 0;

                // Attendez un court délai pour que la transition ait le temps de s'exécuter
                setTimeout(function () {
                    // Cachez l'élément aside
                    asideElement.style.display = "none";
                    // Cachez l'overlay
                    overlay.style.display = "none";
                }, 300); // Le délai doit correspondre à la durée de la transition CSS (0.3s)
            });
            // Réduisez l'opacité de l'overlay et de l'aside à 0
            overlay.style.opacity = 100;
            asideElement.style.opacity = 100;

            // Attendez un court délai pour que la transition ait le temps de s'exécuter
            setTimeout(function () {
                // Cachez l'élément aside
                asideElement.style.display = "flex";
                // Cachez l'overlay
                overlay.style.display = "flex";
            }, 300); // Le délai doit correspondre à la durée de la transition CSS (0.3s)
        }
    },


    //Méthodes utilitaires**********************************
    /**
     * Méthode de validation de champs si vide
     * @param objCible
     * @returns {boolean}
     */
    validerSiVide: function (objCible) {
        let valide = false; //false = champ vide
        if (objCible.value === "") {
            valide = true; //si false, champ contient quelque chose
        }
        return valide;
    },

    /**
     * Méthode d'affichage des messages d'erreur
     * @param objCible
     * @param message
     */
    afficherChampErreur: function (objCible, message) {
        let nom = "err_" + objCible.getAttribute("id");
        document.getElementById(nom).innerHTML = '<img src="liaisons/images/alert-circle.svg" alt="icone erreur"> ' + message;
        document.getElementById(nom).style.display = "flex";
        document.getElementById(nom).style.gap = "4px";
        objCible.parentNode.classList.add("formulaire__item--erreur");
    },


// <img src="liaisons/images/alert-circle.svg" alt="icone erreur">

    afficherBorderInput: function (objCible) {
        let nom = objCible.getAttribute("id");
        document.getElementById(nom).style.borderColor = "#FF5733";
    },

    effacerBorderInput: function (objCible) {
        let nom = objCible.getAttribute("id");
        document.getElementById(nom).style.borderColor = "";
    },

    /**
     * Méthode d'effacement des messages d'erreur
     * @param objCible
     */
    effacerChampErreur: function (objCible) {
        let nom = "err_" + objCible.getAttribute("id");
        document.getElementById(nom).innerHTML = "";
        objCible.parentNode.classList.remove("formulaire__item--erreur");
    },

    /**
     * Méthode de d'inscription de l'état des champs dans le tableau de validation
     * @param nomChamp
     * @param valide
     */
    modifierTableauValidation: function (nomChamp, valide) {
        this.tValide[nomChamp] = valide;
        return valide;
    },

    /**
     * Méthode d'effacement des message d'erreur et de remise à zéro des champs du formulaire
     */
    effacerFormulaire: function () {
        let liste = document.querySelectorAll(".error-message")
        liste.forEach(function (objetCible) {
            objetCible.innerHTML = "";
            objetCible.parentNode.classList.remove("formulaire__item--erreur");
        });
        this.mettreAFalse();

    },

    mettreAFalse: function () {
        this.tValide["prenom"] = false;
        // this.tValide["textInput"] = false;
        this.tValide["nom"] = false;
        this.tValide["courriel"] = false;
        this.tValide["adresse"] = false;
        this.tValide["codePostal"] = false;
        this.tValide["nomTitulaire"] = false;
        this.tValide["numeroCarte"] = false;
        this.tValide["codeSecurite"] = false;
        this.tValide["codePostalDeux"] = false;
    },

}

//*******************
// Écouteurs d'événements
//*******************
window.addEventListener('load', validation.initialiser.bind(validation));

