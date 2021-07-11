function queryBuilder(descriptions, isItContained, and_or, fields) {

    // GraphQl query

    let query = '{ '


    // attributs des tables où seront executées les recherches (cas où aucun champs n'est sélectionné)
    const airs_cols = ['id', 'air_normalise', 'sources_musicales', 'surnom_1', 'surnom_2', 'surnom_3', 'surnom_4', 'surnom_5', 'surnom_6', 'surnom_7', 'surnom_8', 'surnom_9', 'surnom_10', 'surnom_11', 'surnom_12', 'surnom_13', 'surnom_14']
    const textes_publies_cols = ['id', 'auteur', 'auteur_source_information', 'contenu_analytique', 'contenu_texte', 'forme_poetique', 'incipit', 'incipit_normalise', 'nature_texte', 'notes_forme_poetique', 'refrain', 'refrain_normalise', 'sur_l_air_de', 'titre', 'variante', 'variante_normalise']
    const editions_cols = ['id', 'auteur', 'depot_conservation_exemplaire_1', 'editeur', 'editeur_libraire_imprimeur', 'editeur_source_information', 'editions_modernes', 'forme_editoriale', 'imprimeur', 'libraire', 'lieu_edition_indique', 'lieu_edition_reel', 'lieu_edition_source_information', 'notes_provenance', 'religion', 'titre_ouvrage', 'ville_conservation_exemplaire_1']
    const references_cols = ['id', 'auteur', 'editeur', 'titre', 'lien']
    const themes_cols = ['id', 'theme', 'type']

    // villes
    const textes_publies_villes_cols = ['id', 'titre', 'contenu_analytique', 'contenu_texte']
    const editions_villes_cols = ['id', 'depot_conservation_exemplaire_1', 'ville_conservation_exemplaire_1', 'lieu_edition_indique', 'lieu_edition_reel', 'lieu_edition_source_information', 'notes_provenance']

    // auteurs / editeurs
    const textes_publies_auteur_cols = ['id', 'auteur', 'auteur_source_information', 'contenu_analytique']
    const editions_auteur_cols = ['id', 'auteur', 'editeur', 'editeur_libraire_imprimeur', 'editeur_source_information', 'imprimeur', 'libraire',]
    const references_auteur_cols = ['id', 'auteur', 'editeur']


    function chercherDescriptionPartout(mot, isItContained) {

        let connecteur = '_or'
        let contains_str = ''
        if (isItContained) {
            contains_str = '_contains'
        }
        else {
            contains_str = '_ncontains'                     // _or devient _and 
            connecteur = '_and'
        }

        let query = ''
        query += `airs(filter: {${connecteur}: [`                     // recherche dans 'airs'
        for (let c = 0; c < airs_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${airs_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < airs_cols.length; c++) {
            query += `${airs_cols[c]} `
        }
        query += '}'
        query += `textes_publies(filter: {${connecteur}: [`                     // recherche dans 'textes_publies'
        for (let c = 0; c < textes_publies_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${textes_publies_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < textes_publies_cols.length; c++) {
            query += `${textes_publies_cols[c]} `
        }
        query += '}'
        query += `editions(filter: {${connecteur}: [`                     // recherche dans 'editions'
        for (let c = 0; c < editions_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${editions_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < editions_cols.length; c++) {
            query += `${editions_cols[c]} `
        }
        query += '}'
        query += `references_externes(filter: {${connecteur}: [`                     // recherche dans 'references_externes'
        for (let c = 0; c < references_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${references_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < references_cols.length; c++) {
            query += `${references_cols[c]} `
        }
        query += '}'
        query += `themes(filter: {${connecteur}: [`                     // recherche dans 'themes'
        for (let c = 0; c < themes_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${themes_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < themes_cols.length; c++) {
            query += `${themes_cols[c]} `
        }
        query += '}'
        return query

    }

    function chercherTextesPublies(mot, isItContained) {
        let connecteur = '_or'
        let contains_str = ''
        if (isItContained) {
            contains_str = '_contains'
        }
        else {
            contains_str = '_ncontains'                     // _or devient _and 
            connecteur = '_and'
        }

        let query = ''
        query += `textes_publies(filter: {${connecteur}: [`                     // recherche dans 'textes_publies'
        for (let c = 0; c < textes_publies_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${textes_publies_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < textes_publies_cols.length; c++) {
            query += `${textes_publies_cols[c]} `
        }
        query += '}'
        return query
    }

    function chercherEditions(mot, isItContained) {
        let connecteur = '_or'
        let contains_str = ''
        if (isItContained) {
            contains_str = '_contains'
        }
        else {
            contains_str = '_ncontains'                     // _or devient _and 
            connecteur = '_and'
        }

        let query = ''
        query += `editions(filter: {${connecteur}: [`                     // recherche dans 'editions'
        for (let c = 0; c < editions_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${editions_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < editions_cols.length; c++) {
            query += `${editions_cols[c]} `
        }
        query += '}'
        return query
    }

    function chercherAirs(mot, isItContained) {
        let connecteur = '_or'
        let contains_str = ''
        if (isItContained) {
            contains_str = '_contains'
        }
        else {
            contains_str = '_ncontains'                     // _or devient _and 
            connecteur = '_and'
        }

        let query = ''
        query += `airs(filter: {${connecteur}: [`                     // recherche dans 'airs'
        for (let c = 0; c < airs_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${airs_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < airs_cols.length; c++) {
            query += `${airs_cols[c]} `
        }
        query += '}'
        return query
    }

    function chercherVilles(mot, isItContained) {
        let connecteur = '_or'
        let contains_str = ''
        if (isItContained) {
            contains_str = '_contains'
        }
        else {
            contains_str = '_ncontains'                     // _or devient _and 
            connecteur = '_and'
        }

        let query = ''
        query += `textes_publies(filter: {${connecteur}: [`                     // recherche dans 'textes_publies'
        for (let c = 0; c < textes_publies_villes_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${textes_publies_villes_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < textes_publies_villes_cols.length; c++) {
            query += `${textes_publies_villes_cols[c]} `
        }
        query += '}'

        query += `editions(filter: {${connecteur}: [`                     // recherche dans 'editions'
        for (let c = 0; c < editions_villes_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${editions_villes_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < editions_villes_cols.length; c++) {
            query += `${editions_villes_cols[c]} `
        }
        query += '}'

        query += `themes(filter: {${connecteur}: [`                     // recherche dans 'themes'
        for (let c = 0; c < themes_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${themes_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < themes_cols.length; c++) {
            query += `${themes_cols[c]} `
        }
        query += '}'

        return query
    }

    function chercherAuteurs(mot, isItContained) {
        let connecteur = '_or'
        let contains_str = ''
        if (isItContained) {
            contains_str = '_contains'
        }
        else {
            contains_str = '_ncontains'                     // _or devient _and 
            connecteur = '_and'
        }

        let query = ''
        query += `textes_publies(filter: {${connecteur}: [`                     // recherche dans 'textes_publies'
        for (let c = 0; c < textes_publies_auteur_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${textes_publies_auteur_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < textes_publies_auteur_cols.length; c++) {
            query += `${textes_publies_auteur_cols[c]} `
        }
        query += '}'

        query += `editions(filter: {${connecteur}: [`                     // recherche dans 'editions'
        for (let c = 0; c < editions_auteur_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${editions_auteur_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < editions_auteur_cols.length; c++) {
            query += `${editions_auteur_cols[c]} `
        }
        query += '}'
        query += `references_externes(filter: {${connecteur}: [`                     // recherche dans 'references_externes'
        for (let c = 0; c < references_auteur_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${references_auteur_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < references_auteur_cols.length; c++) {
            query += `${references_auteur_cols[c]} `
        }
        query += '}'

        query += `themes(filter: {${connecteur}: [`                     // recherche dans 'themes'
        for (let c = 0; c < themes_cols.length; c++) {
            if (airs_cols[c] !== 'id') {
                query += `{${themes_cols[c]}: {${contains_str}: "${mot}"}},`
            }
        }
        query = query.substr(0, query.length - 1)
        query += ']}) { '
        for (let c = 0; c < themes_cols.length; c++) {
            query += `${themes_cols[c]} `
        }
        query += '}'

        return query
    }

    switch (fields.fieldA) {

        case 'tous':                               // aucun champs sélectionné          
            if (isItContained.checkedA) {
                if (descriptions.descriptionA) {    // chercher 'descriptionA' dans tous les champs textes de toutes les tables -> informations principales
                    query += chercherDescriptionPartout(descriptions.descriptionA, true)
                }
                else {                              // on cherche partout
                    query += chercherDescriptionPartout('', true)
                }
            }
            else {
                if (descriptions.descriptionA) {    // exclure 'descriptionA' de tous les champs textes de toutes les tables -> informations principales
                    query += chercherDescriptionPartout(descriptions.descriptionA, false)
                }
                else {                              // on exclue tout
                    query += chercherDescriptionPartout('', false)
                }

            }
            break

        case 'texte_publie':
            if (isItContained.checkedA) {
                if (descriptions.descriptionA) {    // chercher 'descriptionA' dans tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherTextesPublies(descriptions.descriptionA, true)
                }
                else {                              // on cherche partout
                    query += chercherTextesPublies('', true)
                }
            }
            else {
                if (descriptions.descriptionA) {    // exclure 'descriptionA' de tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherTextesPublies(descriptions.descriptionA, false)
                }
                else {                              // on exclue tout
                    query += chercherTextesPublies('', false)
                }

            }
            break

        case 'edition':
            if (isItContained.checkedA) {
                if (descriptions.descriptionA) {    // chercher 'descriptionA' dans tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherEditions(descriptions.descriptionA, true)
                }
                else {                              // on cherche partout
                    query += chercherEditions('', true)
                }
            }
            else {
                if (descriptions.descriptionA) {    // exclure 'descriptionA' de tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherEditions(descriptions.descriptionA, false)
                }
                else {                              // on exclue tout
                    query += chercherEditions('', false)
                }
            }
            break

        case 'air':
            if (isItContained.checkedA) {
                if (descriptions.descriptionA) {    // chercher 'descriptionA' dans tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherAirs(descriptions.descriptionA, true)
                }
                else {                              // on cherche partout
                    query += chercherAirs('', true)
                }
            }
            else {
                if (descriptions.descriptionA) {    // exclure 'descriptionA' de tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherAirs(descriptions.descriptionA, false)
                }
                else {                              // on exclue tout
                    query += chercherAirs('', false)
                }
            }
            break

        case 'ville':
            if (isItContained.checkedA) {
                if (descriptions.descriptionA) {    // chercher 'descriptionA' dans tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherVilles(descriptions.descriptionA, true)
                }
                else {                              // on cherche partout
                    query += chercherVilles('', true)
                }
            }
            else {
                if (descriptions.descriptionA) {    // exclure 'descriptionA' de tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherVilles(descriptions.descriptionA, false)
                }
                else {                              // on exclue tout
                    query += chercherVilles('', false)
                }
            }
            break

        case 'auteur':
            if (isItContained.checkedA) {
                if (descriptions.descriptionA) {    // chercher 'descriptionA' dans tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherAuteurs(descriptions.descriptionA, true)
                }
                else {                              // on cherche partout
                    query += chercherAuteurs('', true)
                }
            }
            else {
                if (descriptions.descriptionA) {    // exclure 'descriptionA' de tous les champs textes de la table sélectionnée -> informations principales
                    query += chercherAuteurs(descriptions.descriptionA, false)
                }
                else {                              // on exclue tout
                    query += chercherAuteurs('', false)
                }
            }
            break

        default :
            break
            
    }
    query += '}'
    // console.log(query)
    return `${query}`
}


export default queryBuilder;
