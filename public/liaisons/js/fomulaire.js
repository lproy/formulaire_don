// Définissez des letiables pour suivre l'étape actuelle
let currentStep = 1;

// Sélectionnez les boutons "Suivant" et "Précédent"
const previousButton = document.getElementsByName("previous");

// Sélectionnez toutes les sections d'étape
const steps = document.querySelectorAll("section");

// Fonction pour afficher l'étape actuelle
function showStep(stepNumber) {
    for (let i = 0; i < steps.length; i++) {
        if (i + 1 === stepNumber) {
            steps[i].style.display = "flex";
        } else {
            steps[i].style.display = "none";
        }
    }

    // Mettez à jour les classes de la barre de progression
    const progressBarItems = document.querySelectorAll("#progressbar li");
    progressBarItems.forEach((item, index) => {
        if (index === stepNumber - 1) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }

        if (index < stepNumber - 1) {
            item.classList.add("completed");
        } else {
            item.classList.remove("completed");
            item.classList.remove("erreur");
        }
    });
}


// Affichez l'étape initiale (étape 1)
showStep(currentStep);


// Gérez le bouton "Précédent"
previousButton.forEach(button => {
    button.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// Sélectionnez les boutons radio par leur nom
const typeDonRadioButtons = document.getElementsByName("typeDon");
// Sélectionnez le span par son ID
const typeDonValueSpan = document.getElementById("typeDonValue");

// Ajoutez un écouteur d'événement pour chaque bouton radio
typeDonRadioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
        // Mettez à jour la valeur du span avec la valeur du bouton radio sélectionné
        typeDonValueSpan.textContent = radioButton.value;
    });
});

// Sélectionnez les boutons radio par leur nom
const montantDonRadioButtons = document.getElementsByName("montant");

// Sélectionnez le span par son ID
const montantDonRadioSpan = document.getElementById("montantDonValue");
const montantDonRadioInput = document.getElementById("montantDonValueConfirmation");

// Ajoutez un écouteur d'événement pour chaque bouton radio
montantDonRadioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
        // Mettez à jour la valeur du span avec la valeur du bouton radio sélectionné
        if (radioButton.value !== 'autre') {
            montantDonRadioSpan.textContent = radioButton.value;
            montantDonRadioInput.value = "Confirmer le Don de " + montantDonRadioSpan.textContent;
        }

    });
});

// Sélectionnez les boutons radio par leur nom
const provenanceDonRadioButtons = document.getElementsByName("provenance");

// Sélectionnez le span par son ID
const provenanceDonRadioSpan = document.getElementById("provenanceDonValue");

// Ajoutez un écouteur d'événement pour chaque bouton radio
provenanceDonRadioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
        // Mettez à jour la valeur du span avec la valeur du bouton radio sélectionné
        provenanceDonRadioSpan.textContent = radioButton.value;
    });
});

function formatCodePostal(input) {
    // Supprime tous les caractères non alphabétiques et non numériques
    let formattedValue = input.value.replace(/[^a-zA-Z0-9]/g, '');

    // Insère un espace après le quatrième caractère
    if (formattedValue.length >= 4) {
        formattedValue = formattedValue.slice(0, 3) + ' ' + formattedValue.slice(3);
    }

    // Met le texte en majuscules
    formattedValue = formattedValue.toUpperCase();

    // Met à jour la valeur du champ de saisie
    input.value = formattedValue;
}


function formatCarte(input) {
    // Supprime tous les espaces et caractères non numériques
    let formattedValue = input.value.replace(/[^0-9]/g, '');

    // Insère un espace après chaque groupe de 4 chiffres (sauf le dernier groupe)
    formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');

    // Met à jour la valeur du champ de saisie
    input.value = formattedValue;
}


function formatNomTitulaire(input) {
    // Obtenir la valeur du champ de saisie
    let inputValue = input.value;

    // Mettre en majuscules la première lettre de chaque mot (après un espace)
    inputValue = inputValue.toLowerCase().replace(/^(.)| (.)/g, function ($1) {
        return $1.toUpperCase();
    });

    // Mettre à jour la valeur du champ de saisie
    input.value = inputValue;
}

