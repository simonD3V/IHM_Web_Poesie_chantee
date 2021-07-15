import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect, Fragment } from 'react'
import Canvas from './Canvas'
import { withRouter } from 'react-router-dom'
import { Box, Grid, IconButton, ListSubheader, makeStyles, Paper, Button, FormControl, TextField, withStyles } from '@material-ui/core'
import AnnouncementIcon from '@material-ui/icons/Announcement';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';


const useStyles = makeStyles((theme) => ({
    title: {
        width: 500,
        margin: 'auto',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        spacing: 10,
    },
    liste: {
        width: 500,
        textAlign: 'center',
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
        spacing: 10,
    },
    card: {
        width: 800
    },
    paperResultGreen: {
        maxWidth: '100%',
        height: '50%',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        textAlign: 'justify',
        backgroundColor: '#BDE4A0',
    },
    paperResultRed: {
        maxWidth: '100%',
        height: '50%',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        textAlign: 'justify',
        backgroundColor: '#F04D4D',
    },
    description: {
        width: 500,
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        spacing: 10,
    },
    variables: {
        width: 500,
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        spacing: 10,
    },
    codage: {
        width: 750,
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        spacing: 10,
    },
    paperWhite: {
        maxWidth: '70%',
        margin: `auto`,
        padding: 10,
        height: 'auto',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        textAlign: 'center',
    },
    paperBrown: {
        maxWidth: '70%',
        margin: `auto`,
        padding: 10,
        height: 'auto',
        backgroundColor: '#80624D',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
    },
    formControlText: {
        minWidth: 400,
    }
}));

const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#AC8E7A',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#AC8E7A',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#80624D',
            },
            '&:hover fieldset': {
                borderColor: '#AC8E7A',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#AC8E7A',
            },
        },
    },
})(TextField);
const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText('#AC8E7A'),
        backgroundColor: '#AC8E7A',
        '&:hover': {
            backgroundColor: '#80624D',
        },
    },
}))(Button);


function TestFormeLitteraire() {

    const classes = useStyles();

    // Liste de textes et de leur forme poétique

    const [textes, setTextes] = useState([])

    const query = `{
        textes_publies(
            filter: {forme_poetique: { _nin:"" }}
          )
          {
            titre
            id
            auteur
            forme_poetique
          }
      }`

    useEffect(() => {
        (async () => {
            let d = await fetch('http://bases-iremus.huma-num.fr/directus-tcf/graphql/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query
                })
            })
            let j = await d.json()
            setTextes(j)
        })()
    }, [query])

    // Code forme littéraire

    const [codeString, setCodeString] = useState('')
    const handleChangeCodeString = (event) => {
        setCodeString(event.target.value);
    };

    const codeCouleurLettre = [         // même couleur pour a et A
        ['A', '#907963'],                 // A -> marron foncé
        ['B', '#5E7F5B'],                 // B -> vert foncé
        ['C', '#638E9B'],                 // C -> bleu clair
        ['D', '#8C667C'],                 // D -> violet
        ['E', '#E3D895'],                 // E -> jaune 
        ['G', '#A94040'],                 // F -> rouge
        ['H', '#900C3F'],
        ['X', '#CECECE'],
        ['Y', '#949494'],
        ['Z', '#616161'],
        ['M', '#FF0A0A'],
        ['F', '#FFFFFF'],
        ['a', '#907963'],                 // idem pour les rimes féminines
        ['b', '#5E7F5B'],
        ['c', '#638E9B'],
        ['d', '#8C667C'],
        ['e', '#E3D895'],
        ['g', '#A94040'],
        ['h', '#900C3F'],
        ['x', '#CECECE'],
        ['y', '#949494'],
        ['z', '#616161'],
        ['m', '#FF0A0A'],
        ['f', '#FFFFFF'],
    ]

    const [refrain, setRefrain] = useState({
        structureRimes: ''
    })

    const [couplet, setCouplet] = useState({
        stropheNumber: null,
        versNumber: null,
        structureRimes: ''
    })

    let data = []

    const lettres_autorisée = ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'G', 'H', 'X', 'Y', 'Z', 'm', 'M', 'f', 'F']
    const nbrVersMax = 11
    const nbrStropheMax = 100
    function isLetter(c) {
        return c.toLowerCase() != c.toUpperCase();
    }

    function isItCorrect() {

        if (codeString.indexOf('|') > -1) {
            // il y a une '|' -> mention d'un refrain avant

            // déterminer où est le début du refrain et le début du couplet 

            let debutCouplet = 0

            var char = codeString[0]

            while (char !== '|') {
                debutCouplet += 1
                char = codeString[debutCouplet]
            }
            debutCouplet += 1

            // code avec refrain et couplet

            // let nombreLettres = 0
            let tmpStructureRimes = ''
            let erreurs = 0

            for (var m = 0; m < debutCouplet - 1; m++) {

                if (parseInt(codeString[m]) !== 'NaN' && parseInt(codeString[m]) < 10) {

                    // Il s'agit de l'indication d'un metre
                    let tmpMetre = codeString[m]

                    if (parseInt(codeString[m + 1]) !== 'NaN' && parseInt(codeString[m + 1]) < 10) {
                        // pour les vers dont le metre dépasserait 2 digits
                        m += 1
                        tmpMetre += codeString[m]
                        if (parseInt(tmpMetre) > 15) {
                            console.log('Nombre de syllabes trop important')
                            erreurs += 1
                        }
                    }
                    tmpStructureRimes += tmpMetre
                }
                else {

                    // Il s'agit de l'indication d'une rime (et potentiellement de son genre)
                    let tmpLettre = codeString[m]

                    // lettre bissée 
                    if (tmpLettre === '[') {

                        if (codeString[m + 1] === codeString[m - 1]) {
                            if (codeString[m + 2] === ']') {
                                // on avance de deux 
                                tmpStructureRimes += '[' + codeString[m + 1] + ']'
                                m += 2
                            }
                            else {
                                console.log('Fermer les crochets')
                                erreurs += 1
                            }
                        }
                        else {
                            console.log('Le bis doit s\'effectuer sur la dernière lettre')
                            erreurs += 1
                        }
                    }
                    else {
                        for (var l = 0; l < lettres_autorisée.length; l++) {
                            if (tmpLettre === lettres_autorisée[l]) {
                                // nombreLettres += 1
                                tmpStructureRimes += tmpLettre
                            }
                        }


                    }
                }
            }
            if (erreurs === 0) {
                console.log('Structure du refrain correcte')
                console.log(tmpStructureRimes)
                setRefrain({ structureRimes: tmpStructureRimes })
            }
            else {
                console.log('Nombre d\'erreur dans la description du refrain : ' + erreurs)
            }

            // code du couplet qui suit le refrain

            var i = debutCouplet
            let tmpNbrStrophe = ''
            while (i < (debutCouplet + 2) && codeString[i] !== '*') {
                tmpNbrStrophe += codeString[i]
                i += 1
            }
            if (parseInt(tmpNbrStrophe) !== 'NaN' && parseInt(tmpNbrStrophe) < 100 && parseInt(tmpNbrStrophe) > 0 && codeString[i] === '*') {
                setCouplet({ stropheNumber: tmpNbrStrophe, versNumber: '', structureRimes: '' })
                console.log('Nombre de strophe : ' + tmpNbrStrophe)

                // Nombre de vers
                var j = i + 1
                let tmpNbrVers = ''
                while (j < i + 3 && codeString[j] !== '*') {
                    tmpNbrVers += codeString[j]
                    j += 1
                }
                if (parseInt(tmpNbrVers) !== 'NaN' && parseInt(tmpNbrVers) < 11 && parseInt(tmpNbrVers) > 0 && codeString[j] === '*') {
                    setCouplet({ stropheNumber: tmpNbrStrophe, versNumber: tmpNbrVers, structureRimes: '' })
                    console.log('Nombre de vers : ' + tmpNbrVers)

                    // Nombre de syllabes par rime et structure de rimes

                    let nombreLettres = 0
                    let tmpStructureRimes = ''
                    for (var k = j + 1; k < codeString.length; k++) {

                        if (parseInt(codeString[k]) !== 'NaN' && parseInt(codeString[k]) < 10) {

                            // Il s'agit de l'indication d'un metre
                            let tmpMetre = codeString[k]

                            if (parseInt(codeString[k + 1]) !== 'NaN' && parseInt(codeString[k + 1]) < 10) {
                                // pour les vers dont le metre dépasserait 2 digits
                                k += 1
                                tmpMetre += codeString[k]
                                if (parseInt(tmpMetre) > 15) {
                                    console.log('Nombre de syllabes trop important')
                                }
                            }
                            tmpStructureRimes += tmpMetre
                        }
                        else {

                            // Il s'agit de l'indication d'une rime (et potentiellement de son genre)
                            let tmpLettre = codeString[k]

                            // lettre bissée 
                            if (tmpLettre === '[') {

                                if (codeString[k + 1] === codeString[k - 1]) {
                                    if (codeString[k + 2] === ']') {
                                        // on avance de deux 
                                        tmpStructureRimes += '[' + codeString[k + 1] + ']'
                                        k += 2
                                    }
                                    else {
                                        console.log('Fermer les crochets')
                                    }
                                }
                                else {
                                    console.log('Le bis doit s\'effectuer sur la dernière lettre')
                                }
                            }
                            else {
                                for (l = 0; l < lettres_autorisée.length; l++) {
                                    if (tmpLettre === lettres_autorisée[l]) {
                                        nombreLettres += 1
                                        tmpStructureRimes += tmpLettre
                                    }
                                }


                            }
                        }
                    }
                    // console.log('Nombre de lettres lues : ' + nombreLettres)

                    if (nombreLettres === parseInt(tmpNbrVers)) {
                        console.log('Structure du couplet correcte')
                        console.log(tmpStructureRimes)
                        setCouplet({ stropheNumber: tmpNbrStrophe, versNumber: tmpNbrVers, structureRimes: tmpStructureRimes })
                    }
                    else {
                        console.log('Veuillez choisir le même nombre de lettres que de vers indiqués')
                        setCouplet({ stropheNumber: '', versNumber: '', structureRimes: '' })
                    }
                }
                else {
                    console.log('Choisissez un nombre de vers entre 1 et 10')
                    setCouplet({ stropheNumber: '', versNumber: '', structureRimes: '' })
                }
            }
            else {
                console.log('Choisissez un nombre de strophe entre 1 et 99')
                setCouplet({ stropheNumber: '', versNumber: '', structureRimes: '' })
            }


        }
        else {
            // il n'y a pas de '|'
            // on commence par le codage classique

            // code d'un couplet seulement 

            // on efface le refrain
            setRefrain({ structureRimes: '' })

            // Nombre de strophe
            i = 0
            let tmpNbrStrophe = ''
            while (i < 2 && codeString[i] !== '*') {
                tmpNbrStrophe += codeString[i]
                i += 1
            }
            if (parseInt(tmpNbrStrophe) !== 'NaN' && parseInt(tmpNbrStrophe) < 100 && parseInt(tmpNbrStrophe) > 0 && codeString[i] === '*') {
                setCouplet({ stropheNumber: tmpNbrStrophe, versNumber: '', structureRimes: '' })
                console.log('Nombre de strophe : ' + tmpNbrStrophe)

                // Nombre de vers
                j = i + 1
                let tmpNbrVers = ''
                while (j < i + 3 && codeString[j] !== '*') {
                    tmpNbrVers += codeString[j]
                    j += 1
                }
                if (parseInt(tmpNbrVers) !== 'NaN' && parseInt(tmpNbrVers) < 11 && parseInt(tmpNbrVers) > 0 && codeString[j] === '*') {
                    setCouplet({ stropheNumber: tmpNbrStrophe, versNumber: tmpNbrVers, structureRimes: '' })
                    console.log('Nombre de vers : ' + tmpNbrVers)

                    // Nombre de syllabes par rime et structure de rimes

                    let nombreLettres = 0
                    let tmpStructureRimes = ''
                    for (k = j + 1; k < codeString.length; k++) {

                        if (parseInt(codeString[k]) !== 'NaN' && parseInt(codeString[k]) < 10) {

                            // Il s'agit de l'indication d'un metre
                            let tmpMetre = codeString[k]

                            if (parseInt(codeString[k + 1]) !== 'NaN' && parseInt(codeString[k + 1]) < 10) {
                                // pour les vers dont le metre dépasserait 2 digits
                                k += 1
                                tmpMetre += codeString[k]
                                if (parseInt(tmpMetre) > 15) {
                                    console.log('Nombre de syllabes trop important')
                                }
                            }
                            tmpStructureRimes += tmpMetre
                        }
                        else {

                            // Il s'agit de l'indication d'une rime (et potentiellement de son genre)
                            let tmpLettre = codeString[k]

                            // lettre bissée 
                            if (tmpLettre === '[') {

                                if (codeString[k + 1] === codeString[k - 1]) {
                                    if (codeString[k + 2] === ']') {
                                        // on avance de deux
                                        tmpStructureRimes += '[' + codeString[k + 1] + ']'
                                        k += 2
                                    }
                                    else {
                                        console.log('Fermer les crochets')
                                    }
                                }
                                else {
                                    console.log('Le bis doit s\'effectuer sur la dernière lettre')
                                }
                            }
                            else {
                                for (l = 0; l < lettres_autorisée.length; l++) {
                                    if (tmpLettre === lettres_autorisée[l]) {
                                        nombreLettres += 1
                                        tmpStructureRimes += tmpLettre
                                    }
                                }


                            }
                        }
                    }
                    console.log('Nombre de lettres lues : ' + nombreLettres)

                    if (nombreLettres === parseInt(tmpNbrVers)) {
                        console.log('Structure du couplet correcte')
                        console.log(tmpStructureRimes)
                        setCouplet({ stropheNumber: tmpNbrStrophe, versNumber: tmpNbrVers, structureRimes: tmpStructureRimes })
                    }
                    else {
                        console.log('Veuillez choisir le même nombre de lettres que de vers indiqués')
                        setCouplet({ stropheNumber: '', versNumber: '', structureRimes: '' })
                    }
                }
                else {
                    console.log('Choisissez un nombre de vers entre 1 et 10')
                    setCouplet({ stropheNumber: '', versNumber: '', structureRimes: '' })
                }
            }
            else {
                console.log('Choisissez un nombre de strophe entre 1 et 99')
                setCouplet({ stropheNumber: '', versNumber: '', structureRimes: '' })
            }
        }
    }

    function isTheCodeCorrect_list(code_str) {

        if (code_str.indexOf('|') > -1) {
            // il y a une '|' -> mention d'un refrain avant
            // déterminer où est le début du refrain et le début du couplet 
            // partie code refrain : pas besoin d'indication de strophe et du nombre de vers par strophe

            let debutCouplet = 0

            var char = code_str[0]

            while (char !== '|') {
                debutCouplet += 1
                char = code_str[debutCouplet]
            }
            debutCouplet += 1

            // code avec refrain et couplet

            // let nombreLettres = 0
            let tmpStructureRimes = ''
            let erreurs = 0
            let messages_erreurs = []

            if (code_str.split('*').length - 1 < 2 ) {
                messages_erreurs.push('Une indication est manquante : le nombre de strophe ou le nombre de vers par strophe ou la structure du vers')
                erreurs += 1 
            }
 
            for (var m = 0; m < debutCouplet - 1; m++) {

                if (parseInt(code_str[m]) !== 'NaN' && parseInt(code_str[m]) < 10) {

                    // Il s'agit de l'indication d'un metre
                    let tmpMetre = code_str[m]

                    if (parseInt(code_str[m + 1]) !== 'NaN' && parseInt(code_str[m + 1]) < 10) {
                        // pour les vers dont le metre dépasserait 2 digits
                        m += 1
                        tmpMetre += code_str[m]
                        if (parseInt(tmpMetre) > 15) {
                            messages_erreurs.push('Nombre de syllabes trop important')
                            erreurs += 1
                        }
                    }
                    tmpStructureRimes += tmpMetre
                }
                else {

                    // Il s'agit de l'indication d'une rime (et potentiellement de son genre)
                    let tmpLettre = code_str[m]

                    // lettre bissée 
                    if (tmpLettre === '[') {

                        if (code_str[m + 1] === code_str[m - 1]) {
                            if (code_str[m + 2] === ']') {
                                // on avance de deux 
                                tmpStructureRimes += '[' + code_str[m + 1] + ']'
                                m += 2
                            }
                            else {
                                messages_erreurs.push('Un crochet a été mal fermé')
                                erreurs += 1
                            }
                        }
                        else {
                            messages_erreurs.push('Le bis doit s\'effectuer sur la dernière lettre')
                            erreurs += 1
                        }
                    }
                    else {
                        for (var l = 0; l < lettres_autorisée.length; l++) {
                            if (tmpLettre === lettres_autorisée[l]) {
                                // nombreLettres += 1
                                tmpStructureRimes += tmpLettre
                            }
                        }
                        if ((lettres_autorisée.includes(tmpLettre)) === false) {
                            messages_erreurs.push('Présence d\'une lettre incorrecte')
                            erreurs += 1
                        }
                    }
                }
            }
            if (erreurs !== 0) {
                return (['Structure incorrecte', messages_erreurs, false])
            }
            else {
                return (['Structure correcte', messages_erreurs, true])
            }
        }
        else {
            // il n'y a pas de '|'
            // on commence par le codage classique

            // code d'un couplet seulement 

            // on efface le refrain

            // Nombre de strophe
            let erreurs = 0
            let messages_erreurs = []
            let i = 0
            let k = 0
            let j = 0

            if (code_str.split('*').length - 1  < 2 ) {
                messages_erreurs.push('Une indication est manquante : le nombre de strophe ou le nombre de vers par strophe ou la structure du vers')
                erreurs += 1 
            }

            let tmpNbrStrophe = ''
            while (i < 2 && code_str[i] !== '*') {
                tmpNbrStrophe += code_str[i]
                i += 1
            }
            if (parseInt(tmpNbrStrophe) !== 'NaN' && parseInt(tmpNbrStrophe) < nbrStropheMax && parseInt(tmpNbrStrophe) > 0 && code_str[i] === '*') {

                // Nombre de vers
                j = i + 1
                let tmpNbrVers = ''
                while (j < i + 3 && code_str[j] !== '*') {
                    tmpNbrVers += code_str[j]
                    j += 1
                }
                if (parseInt(tmpNbrVers) !== 'NaN' && parseInt(tmpNbrVers) < nbrVersMax && parseInt(tmpNbrVers) > 0 && code_str[j] === '*') {

                    // Nombre de syllabes par rime et structure de rimes
                    let nombreLettres = 0
                    let tmpStructureRimes = ''
                    for (k = j + 1; k < code_str.length; k++) {
                        let tmpLettre = code_str[k]
                        let tmpMetre = code_str[k]

                        if (parseInt(code_str[k]) !== 'NaN' && parseInt(code_str[k]) < 10) {

                            // Il s'agit de l'indication d'un metre

                            if (parseInt(code_str[k + 1]) !== 'NaN' && parseInt(code_str[k + 1]) < 10) {
                                // pour les vers dont le metre dépasserait 2 digits
                                k += 1
                                tmpMetre += code_str[k]
                                if (parseInt(tmpMetre) > 15) {
                                    messages_erreurs.push('Nombre de syllabes trop important')
                                    erreurs += 1
                                }
                            }
                            tmpStructureRimes += tmpMetre
                        }
                        else {

                            // Il s'agit de l'indication d'une rime (et potentiellement de son genre)                          

                            // lettre bissée 
                            if (tmpLettre === '[') {

                                if (code_str[k + 1] === code_str[k - 1]) {
                                    if (code_str[k + 2] === ']') {
                                        // on avance de deux
                                        tmpStructureRimes += '[' + code_str[k + 1] + ']'
                                        k += 2
                                    }
                                    else {
                                        messages_erreurs.push('Fermer les crochets')
                                        erreurs += 1
                                    }
                                }
                                else {
                                    messages_erreurs.push('Le bis doit s\'effectuer sur la dernière lettre')
                                    erreurs += 1
                                }
                            }
                            else {
                                for (l = 0; l < lettres_autorisée.length; l++) {
                                    if (tmpLettre === lettres_autorisée[l]) {
                                        nombreLettres += 1
                                        tmpStructureRimes += tmpLettre
                                    }
                                }
                            }
                        }
                        if (isLetter(tmpLettre)) {
                            if (lettres_autorisée.includes(tmpLettre) === false) {
                                messages_erreurs.push('Présence d\'une lettre incorrecte')
                                erreurs += 1
                            }
                        }

                    }

                    if (nombreLettres !== parseInt(tmpNbrVers) && erreurs === 0) {
                        messages_erreurs.push('Veuillez choisir le même nombre de lettres que de vers indiqués')
                        erreurs += 1
                    }
                }
                else {
                    messages_erreurs.push('Choisissez un nombre de vers entre 1 et 10')
                    erreurs += 1
                }
            }
            else {
                messages_erreurs.push('Choisissez un nombre de strophe entre 1 et 99')
                erreurs += 1
            }
            if (erreurs !== 0) {
                return (['Structure incorrecte', messages_erreurs, false])
            }
            else {
                return (['Structure correcte', messages_erreurs, true])
            }
        }
    }

    function genererJSON() {
        let jsonString = '{'

        let metre = ''
        let lettre = ''
        let bis = false
        let color = ''
        let genre = ''

        if (refrain.structureRimes !== '') {
            // s'il y a un refrain

            jsonString += '"refrain" : ['

            for (var i = 0; i < refrain.structureRimes.length; i++) {

                if (parseInt(refrain.structureRimes[i]) !== 'NaN' && parseInt(refrain.structureRimes[i]) < 10) {
                    // indication d'un metre

                    metre = refrain.structureRimes[i]
                    if (parseInt(refrain.structureRimes[i + 1]) !== 'NaN' && parseInt(refrain.structureRimes[i + 1]) < 10) {
                        // pour les vers dont le metre dépasserait 2 digits
                        i += 1
                        metre += refrain.structureRimes[i]
                    }
                }
                else {
                    // indication d'une lettre

                    lettre = refrain.structureRimes[i]
                    if (refrain.structureRimes[i + 1] === '[') {
                        // dernière lettre bissée
                        i += 3
                        bis = true
                    }
                    else {
                        bis = false
                    }
                    for (var j = 0; j < codeCouleurLettre.length; j++) {
                        if (codeCouleurLettre[j][0] === lettre) {
                            color = codeCouleurLettre[j][1]
                        }
                    }
                    if (lettre === lettre.toLocaleLowerCase()) {
                        // rime féminine
                        genre = 'f'
                    }
                    if (lettre === lettre.toUpperCase()) {
                        // rime masculine
                        genre = 'm'
                    }
                    jsonString += '{ "metre" : "' + metre + '", "lettre" : "' + lettre + '", "couleur" : "' + color + '", "genre" : "' + genre + '", "bis" : "' + bis + '"},'
                }
            }
            jsonString = jsonString.substring(0, jsonString.length - 1)
            jsonString += ']'
        }
        else {
            jsonString += '"refrain" : null'
        }
        if (couplet.stropheNumber !== '' || couplet.versNumber !== '' || couplet.structureRimes !== '') {
            // s'il y a un couplet

            jsonString += ', "couplet" : ['
            metre = ''
            lettre = ''
            bis = false
            color = ''
            genre = ''

            for (i = 0; i < couplet.structureRimes.length; i++) {

                if (parseInt(couplet.structureRimes[i]) !== 'NaN' && parseInt(couplet.structureRimes[i]) < 10) {
                    // indication d'un metre

                    metre = couplet.structureRimes[i]
                    if (parseInt(couplet.structureRimes[i + 1]) !== 'NaN' && parseInt(couplet.structureRimes[i + 1]) < 10) {
                        // pour les vers dont le metre dépasserait 2 digits
                        i += 1
                        metre += couplet.structureRimes[i]
                    }
                }
                else {
                    // indication d'une lettre

                    lettre = couplet.structureRimes[i]
                    if (couplet.structureRimes[i + 1] === '[') {
                        // dernière lettre bissée
                        i += 3
                        bis = true
                    }
                    else {
                        bis = false
                    }
                    for (j = 0; j < codeCouleurLettre.length; j++) {
                        if (codeCouleurLettre[j][0] === lettre) {
                            color = codeCouleurLettre[j][1]
                        }
                    }
                    if (lettre === lettre.toLocaleLowerCase()) {
                        // rime féminine
                        genre = 'f'
                    }
                    if (lettre === lettre.toUpperCase()) {
                        // rime masculine
                        genre = 'm'
                    }
                    jsonString += '{ "metre" : "' + metre + '", "lettre" : "' + lettre + '", "couleur" : "' + color + '", "genre" : "' + genre + '", "bis" : "' + bis + '"},'
                }
            }
            jsonString = jsonString.substring(0, jsonString.length - 1)
            jsonString += ']'
        }
        else {
            jsonString += '"couplet" : null}'
        }
        jsonString += '}'

        data = JSON.parse(jsonString)
        console.log(data)
    }

    // Affichage des erreurs

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

    const displayErrors = (list_errors) => {
        setOpen(true);
        setSelectedValue(list_errors[1])
    };

    const handleCloseErrors = (value) => {
        setOpen(false);
    };

    function SimpleDialog(props) {
        const { onClose, selectedValue, open } = props;

        const handleClose = () => {
            onClose(selectedValue);
        };

        return (
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Liste d'erreurs</DialogTitle>
                <List>
                    <ListItem>
                        <Typography variant='subtitle2' style={{ color: 'red' }} align='justify'>
                            Nombre d'erreurs : {selectedValue.length}
                        </Typography>
                    </ListItem>
                    {selectedValue.map((erreur) => (
                        <ListItem key={erreur}>
                            <Typography variant='subtitle1' style={{ color: 'black' }} align='justify'>
                                {erreur}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        );
    }

    SimpleDialog.propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        selectedValue: PropTypes.string.isRequired,
    };


    return (
        <>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={5}
            >
                <Grid item xs={6}>
                    <Box className={classes.title} pb={5} pt={5}>
                        <Typography variant='h4'>
                            Structures poétiques
                        </Typography>
                        <Typography variant='h5'>
                            Testez votre code de <i>pattern</i>
                        </Typography>
                    </Box>
                    <Paper elevation={3} className={classes.paperBrown}>
                        <Box className={classes.title} pb={2} pt={2}>
                            <Typography variant='body1'>
                                Cet outil permet d'une part, de vous familiariser avec le codage des formes litérraires des textes (ou structures poétiques).
                            </Typography>
                            <Typography variant='body1'>
                                D'autre part, il vous permet de tester votre propre codage avant l'insertion de vos données.
                            </Typography>
                            <Typography variant='body1'>
                                La procédure pour coder la structure des textes est détaillée dans le fichier pdf ci-dessous.
                            </Typography>
                        </Box>
                    </Paper>


                    <Box className={classes.codage} pt={5}>
                        <Typography variant='body1' align='center' className={classes.descriptionTitle} >
                            Veuillez entrer une forme littéraire codée
                            </Typography>
                        <FormControl className={classes.formControlText}>
                            <CssTextField
                                value={codeString}
                                name="descriptionC"
                                id="custom-css-standard-input"
                                type="search"
                                variant="outlined"
                                onChange={handleChangeCodeString}
                            />
                        </FormControl>
                        <Box pt={2}>
                            <ColorButton
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<i class="fas fa-search" />}
                                onClick={() => isItCorrect()}
                            >
                                Générer
                                </ColorButton>
                        </Box>
                    </Box>
                    <Box pt={10} className={classes.description} >
                        <Typography variant='h6'>

                            {console.log('Couplet : ' + couplet.stropheNumber + ' ' + couplet.versNumber + ' ' + couplet.structureRimes)}
                            {console.log('Refrain : ' + refrain.structureRimes)}

                            {couplet.stropheNumber !== '' && (couplet.versNumber !== '' && (couplet.structureRimes !== '' &&
                                (
                                    'Code correct'
                                )))
                            }

                            {couplet.stropheNumber !== '' && (couplet.versNumber !== '' && (couplet.structureRimes !== '' && (genererJSON())))}

                        </Typography>

                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box className={classes.title} pt={5}>
                        <Canvas couplet={couplet} refrain={refrain} json={data} />
                    </Box>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={5}
            >
                <Grid item xs={5}>
                    <Box className={classes.liste} pb={5} pt={5}>
                        <Typography variant='h4'>
                            Liste des formes poétiques
                        </Typography>

                        {textes.length !== 0 && (
                            <Fragment>
                                <Box className={classes.card} pt={0} pb={5}>
                                    {textes['data']['textes_publies'].map(({ id, titre, forme_poetique }, index) => (
                                        <div key={index}>

                                            {isTheCodeCorrect_list(forme_poetique)[2] ? (
                                                <Paper elevation={3} className={classes.paperResultGreen} >
                                                    <Grid container spacing={2}
                                                        direction="row"
                                                        justify="center"
                                                        alignItems="center" >
                                                        <Grid item xs={7}>
                                                            <Typography variant='subtitle2' style={{ color: 'white' }} align='justify'>
                                                                Titre : {titre === "" ? ('Champ manquant'): titre}
                                                            </Typography>
                                                            <Typography variant='h6' style={{ color: 'white' }} align='justify'>
                                                                {forme_poetique}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <Typography variant='subtitle2' color='textSecondary' align='right'>
                                                                {id}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>) : (
                                                <Paper elevation={3} className={classes.paperResultRed} >
                                                        <Grid container spacing={2}
                                                            direction="row"
                                                            justify="center"
                                                            alignItems="center" >
                                                            <Grid item xs={1}>
                                                                <IconButton onClick={() => displayErrors(isTheCodeCorrect_list(forme_poetique))}>
                                                                    <AnnouncementIcon fontSize="large" />
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={7}>
                                                                <Typography variant='subtitle2' style={{ color: 'white' }} align='justify'>
                                                                    Titre : {titre === "" ? ('Champ manquant'): titre}
                                                                </Typography>
                                                                <Typography variant='h6' style={{ color: 'white' }} align='justify'>
                                                                    {forme_poetique}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs>
                                                                <Typography variant='subtitle2' color='textSecondary' align='right'>
                                                                    {id}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                )}
                                        </div>
                                    ))}
                                    <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleCloseErrors} />
                                </Box>
                            </Fragment>
                        )}
                    </Box>
                </Grid>

            </Grid>

        </>
    );
}

export default withRouter(TestFormeLitteraire);
