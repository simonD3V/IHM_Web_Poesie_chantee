import { Box, CircularProgress, Collapse, Grid, Icon, List, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles, Typography } from '@material-ui/core'
import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, ExpandLess, ExpandMore, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn } from '@material-ui/icons';
import MaterialTable from 'material-table';
import React, { forwardRef, useEffect, useState } from 'react'
import { withRouter } from 'react-router'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const useStyles = makeStyles((theme) => ({
    icon: {
        margin: 'auto',
        spacing: 1,
        padding: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    margin: {
        margin: 'auto',
        width: '90%',
        spacing: 1,
        padding: theme.spacing(2)
    },
    marginTitle: {
        margin: 'auto',
        width: '95%',
        spacing: 1,
        padding: theme.spacing(2)
    },
    root: {
        flexGrow: 1,
    },
    borderTop: {
        margin: 'auto',
        borderTop: '4px solid gray',
        width: '50%',
    },
    borderBot: {
        margin: 'auto',
        borderBottom: '4px solid gray',
        width: '50%',
    },
    tablesRelation: {
        margin: 'auto',
        width: '95%',
    },
    active: {
        backgroundColor: "red"
    },
}));

const useStylesFacebook = makeStyles((theme) => ({
    root: {
        position: 'center',
    },
    bottom: {
        color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    top: {
        color: '#CFAB92',
        animationDuration: '550ms',
        position: 'center',
        left: 0,
    },
    circle: {
        strokeLinecap: 'round',
    },
    eyecolor: {
        color: '#CFAB92',
    },
}));

function FacebookCircularProgress(props) {
    const classes = useStylesFacebook();

    return (
        <div className={classes.root}>
            <CircularProgress
                variant="indeterminate"
                disableShrink
                className={classes.top}
                classes={{
                    circle: classes.circle,
                }}
                size={100}
                thickness={4}
                {...props}
            />
        </div>
    );
}

function SingleTextePublie({ history, match }) {
    const classes = useStyles();
    const id = match.params.id;
    const [data, setData] = useState([])

    const [dataTexte, setDataTexte] = useState([])       // contient les informations du texte sélectionné
    const [dataTimbres, setDataTimbres] = useState([])  // contient des timbres liés au texte sélectionné

    const [openAirs, setOpenAirs] = useState(false)
    const handleClickAirs = () => {
        setOpenAirs(!openAirs);
    };

    const [openExemplaires, setOpenExemplaires] = useState(false)
    const handleClickEx = () => {
        setOpenExemplaires(!openExemplaires);
    };

    const [openReference, setOpenReference] = useState(false)
    const handleClickRef = () => {
        setOpenReference(!openReference);
    };
    const query = `
    {
        textes_publies(filter: {id: {_eq: "${id}"}}) {
            id
            titre
            sur_l_air_de
            incipit
            incipit_normalise
            provenance
            auteur
            auteur_statut_source
            auteur_source_information
            nature_texte
            themes {
                themes {
                    id
                    theme
                }
            }
            edition {
                id
                editeur_source_information
                libraire
                imprimeur
                editeur
                religion
                notes_provenance
                numero_cote
                prefixe_cote
                groupe_ouvrage
                nombre_pieces
                provenance
                editions_modernes
                titre_ouvrage
                auteur
                ville_conservation_exemplaire_1
                depot_conservation_exemplaire_1
                annee_indiquee
                annee_estimee
                format
                manuscrit_imprime
                forme_editoriale
                lieu_edition_reel
                lieu_edition_indique
                lieu_edition_source_information
                editeur_libraire_imprimeur
            }
            variante
            variante_normalise
            page
            contenu_texte
            numero_d_ordre
            lien_web_visualisation
            contenu_analytique
            forme_poetique
            notes_forme_poetique
            references_externes {
                references_externes {
                    id
                    lien
                    titre
                    annee
                    editeur
                    auteur
                }
                description_reference
            }
        }
        timbres(filter: {textes_publies: {id: {_eq: "${id}"}}}) {
            textes_publies {
              id
            }
            airs {
              id
              sources_musicales
              air_normalise
              surnom_1
            }
            enregistrement_web
            enregistrement_sherlock
        }
    }      
    `

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
            setData(j)
            transformData(j)
        })()
    }, [query])

    function transformData(j) {
        let res_tmp = []
        let res_timbres = []

        let initialStr = JSON.stringify(j)
        let finalStr = initialStr.slice(8, initialStr.length - 1)

        let lengthData = 0
        // // aller chercher les textes de l'exemplaire sélectionné
        if (finalStr !== '') {
            res_tmp = JSON.parse(finalStr)
            if (res_tmp['textes_publies'].length) {
                // update les informations du texte sélectionné
                // on suppose qu'un seul texte peut être sélectionné dans le résultat de la query et donc que les uuid sont uniques 
                setDataTexte(res_tmp['textes_publies'][0])
            }
            if (res_tmp['timbres'].length) {
                // update les informations des timbres liés au texte sélectionné
                lengthData = res_tmp['timbres'].length
                if (lengthData === 1) {
                    // un seul timbre -> on renvoie directement l'objet
                    setDataTimbres(res_tmp['timbres'][0])
                }
                else {
                    // sinon on renvoie un renvoie un tableau de timbres

                    for (let i = 0; i < lengthData; i++) {
                        res_timbres.push(res_tmp['timbres'][i])
                    }
                    setDataTimbres(res_timbres)
                }
            }
        }
    }

    function getSearchersNames() {                                // renvoie le nom complet du champ provenance
        switch (dataTexte['provenance']) {
            case 'A':
                return 'Alice Tacaille'
            case 'T':
                return 'Tatiana Debbagi Baranova'
            case ('AT'):
                return (
                    <>
                        <Typography variant='h6' color='inherit' align='justify'>
                            Alice Tacaille <br />
                            Tatiana Debbagi Baranova
                        </Typography>
                    </>
                )
            case ('A/T'):
                return (
                    <>
                        <Typography variant='h6' color='inherit' align='justify'>
                            Alice Tacaille <br />
                            Tatiana Debbagi Baranova
                         </Typography>
                    </>
                )
            case (null):
                return (
                    <>
                        <Typography color='inherit' align='justify'>
                            Pas d'information <br />
                        </Typography>
                    </>
                )
            default:
                return dataTexte['provenance']
        }
    }

    function getInformationFromFormePoetiqueCodage() {
        function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }


        let code = dataTexte['forme_poetique']
        let stropheNumber, versNumber, syllabeNumber = -1
        let schemaRimes = ''
        // lorsque la structure est répétitive

        // séparation des informations marquée par '*'
        code = code.split('*')
        stropheNumber = code[0]
        versNumber = code[1]

        let syllabeNumberStr = ''
        for (let c = 0; c < code[2].length; c++) {
            if (isNumber(code[2][c])) {
                syllabeNumberStr += code[2][c]
            }
            else {
                schemaRimes += code[2][c]
            }
        }
        syllabeNumber = parseInt(syllabeNumberStr)
        switch (syllabeNumber) {
            case 6:
                return [stropheNumber, versNumber, 'hexasyllabe', schemaRimes]
            case 7:
                return [stropheNumber, versNumber, 'heptasyllabe', schemaRimes]
            case 8:
                return [stropheNumber, versNumber, 'octosyllabe', schemaRimes]
            case 9:
                return [stropheNumber, versNumber, 'ennéasyllabe', schemaRimes]
            case 10:
                return [stropheNumber, versNumber, 'décasyllabe', schemaRimes]
            case 11:
                return [stropheNumber, versNumber, 'hendécasyllabe', schemaRimes]
            case 12:
                return [stropheNumber, versNumber, 'alexandrin', schemaRimes]
            default:
                return [stropheNumber, versNumber, syllabeNumber, schemaRimes]
        }
    }

    function getTypeIncipit() {
        switch (dataTexte['incipit']) {
            case dataTexte['refrain']:
                return (
                    <>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Type incipit
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            Refrain
                        </Typography>
                    </>

                )
            case dataTexte['deux_premiers_vers_premier_couplet']:
                return (
                    <>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Type incipit
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            Premiers vers du premier couplet
                        </Typography>
                    </>

                )

            default:
                return (<></>)
        }

    }

    function getReference() {
        if (dataTexte['references_externes'].length !== 0) {
            let l = dataTexte['references_externes'].length
            let res = '['
            for (var i = 0; i < l; i++) {
                res = res.concat(JSON.stringify(dataTexte['references_externes'][i]['references_externes']))
                res = res.substr(0, res.length - 1)
                res = res.concat(', "description_reference" : ')
                res = res.concat(JSON.stringify(dataTexte['references_externes'][i]['description_reference']))
                res = res.concat('},')
            }
            res = res.substring(0, res.length - 1)
            res = res.concat(']')
            return (JSON.parse(res))
        }
    }

    return (
        <div className={classes.root} >

            <Box className={classes.marginTitle}>
                <Typography variant='h6' color='textSecondary' align='justify'  >
                    Table des textes
                    {console.log(dataTexte)}
                </Typography>
                <Typography color='inherit' variant='subtitle2' align='justify'>
                    {dataTexte['id']}
                </Typography>
            </Box>
            <Grid container spacing={2}
                direction="row"
                justify="center"
                alignItems="justify" >

                <Grid item xs>{/* col 1*/}
                    <Grid item xs className={classes.margin} >
                        <Typography variant='h  6' color='textSecondary' align='justify'>
                            Titre du texte
                        </Typography>
                        <Typography variant='h3' color='inherit' align='justify'>
                            <i>{dataTexte['titre']}</i>
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Incipit
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['incipit'] ? dataTexte['incipit'] : 'Pas d\'incipit'}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            {dataTexte['incipit_normalise'] ? '(' + dataTexte['incipit_normalise'] + ')' : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Sur l'air de
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['sur_l_air_de'] ? dataTexte['sur_l_air_de'] : 'Champ manquant    '}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Visualisation (lien web)
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['lien_web_visualisation'] ? dataTexte['lien_web_visualisation'] : 'Champ manquant'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Auteur du texte
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['auteur'] ? dataTexte["auteur"] : 'Pas d\'auteur'}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            {dataTexte['auteur_statut_source'] === 'H' ? '( Hypothèse )' : ''}
                            {dataTexte['auteur_statut_source'] === 'S' ? '( Présence d\'une signature  )' : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Donnée entrée par
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {getSearchersNames()}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Lieu de publication de l'exemplaire « contenant »
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            Lieu indiqué : {dataTexte['edition'] ? (dataTexte['edition']['lieu_edition_indique'] ? dataTexte['edition']['lieu_edition_indique'] : 'Pas d\'indication') : 'Pas d\'exemplaire'}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            Lieu réel : {dataTexte['edition'] ? (dataTexte['edition']['lieu_edition_reel'] ? dataTexte['edition']['lieu_edition_reel'] : 'Pas d\'indication') : 'Pas d\'exemplaire'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Source information sur l'auteur
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['auteur_source_information'] ? dataTexte["auteur_source_information"] : 'Pas d\'indication'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Nature texte
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['nature_texte'] ? dataTexte["nature_texte"] : ('Champ manquant')}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Refrain
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['refrain'] && dataTexte["refrain"]}
                            {dataTexte['refrain'] === "" && (dataTexte['refrain_normalise'] === "" && ('Champ manquant'))}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            {dataTexte['refrain_normalise'] ? '(' + dataTexte['refrain_normalise'] + ')' : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Deux premiers vers (premier couplet)
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['deux_premiers_vers_premier_couplet'] && dataTexte["deux_premiers_vers_premier_couplet"]}
                            {dataTexte['deux_premiers_vers_premier_couplet'] === "" && (dataTexte['deux_premiers_vers_premier_couplet_normalises'] === "" && ('Champ manquant'))}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            {dataTexte['deux_premiers_vers_premier_couplet_normalises'] ? '(' + dataTexte['deux_premiers_vers_premier_couplet_normalises'] + ')' : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        {getTypeIncipit()}
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Page(s)
                                </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataTexte['page'] ? dataTexte['page'] : 'Champ manquant'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs> {/* col 2*/}
                    <Grid item xs className={classes.margin}>
                        <Typography variant='h4' color='textPrimary' align='center'>
                            Forme littéraire
                            </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='center'>
                            Codage
                            </Typography>
                        <Typography variant='h6' color='inherit' align='center'>
                            {dataTexte['forme_poetique'] ? dataTexte["forme_poetique"] : ('Champ manquant')}
                        </Typography>
                        <Grid item xs className={classes.margin}>
                            {dataTexte['forme_poetique'] && (
                                <>
                                    <Typography variant='subtitle2' color='inherit' align='center'>
                                        {getInformationFromFormePoetiqueCodage()[0] && ('Nombre de strophes : ' + getInformationFromFormePoetiqueCodage()[0])}
                                    </Typography>
                                    <Typography variant='subtitle2' color='inherit' align='center'>
                                        {getInformationFromFormePoetiqueCodage()[1] && ('Nombre de vers par strophe : ' + getInformationFromFormePoetiqueCodage()[1])}
                                    </Typography>
                                    <Typography variant='subtitle2' color='inherit' align='center'>
                                        {getInformationFromFormePoetiqueCodage()[2] && ('Nombre de syllabes par vers : ' + getInformationFromFormePoetiqueCodage()[2])}
                                    </Typography>
                                    <Typography variant='subtitle2' color='inherit' align='center'>
                                        {getInformationFromFormePoetiqueCodage()[3] && ('Schéma de rime : ' + getInformationFromFormePoetiqueCodage()[3])}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid>
                        {/* Canvas */}
                        <Typography variant='subtitle2' color='inherit' align='center'>
                            forme littéraire dessinée
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Box pt={0} pb={5} className={classes.borderTop} />
            <Grid item xs className={classes.margin} >
                <Typography variant='body1' color='textPrimary' align='center'>
                    Contenu du texte (retranscription)
                        </Typography>
                <Typography variant='h6' color='inherit' align='center'>
                    {data['contenu_texte'] ? data['contenu_texte'] : 'Champ manquant'}
                </Typography>
            </Grid>
            <Box pt={0} pb={5} className={classes.borderBot} />
            <Box pt={0} pb={10} className={classes.tablesRelation}>
                <Typography variant='h6' color='inherit' align='justify'>
                    Données liées :
                </Typography>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Nom des tables en relation avec ce texte
                        </ListSubheader>
                    }
                >
                    <ListItem
                        button
                        onClick={handleClickAirs}
                        selected={false}
                    >
                        <ListItemIcon>
                            <Icon class="fas fa-music" />
                        </ListItemIcon>
                        <ListItemText primary="Airs « supports » " />
                        {openAirs ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openAirs} timeout="auto" unmountOnExit>
                        {dataTimbres['airs'] ? (
                            <MaterialTable
                                localization={{
                                    body: {
                                        emptyDataSourceMessage:
                                            <div className={classes.root}>
                                                <FacebookCircularProgress classes={{
                                                    circle: classes.circle,
                                                }} />
                                            </div>
                                    }
                                }}
                                icons={tableIcons}
                                columns={[
                                    { title: 'UUID', field: 'id' },
                                    { title: 'Sources musicales', field: 'sources_musicales' },
                                    { title: 'Nom air', field: 'air_normalise' },
                                    { title: 'Surnom', field: 'surnom_1' },
                                ]}
                                data={[dataTimbres['airs']]}
                                title={[dataTimbres['airs']] ? ("Air(s) correspondant(s) - " + [dataTimbres['airs']].length + " résultat") : ('Airs')}
                                onRowClick={((evt, selectedRow) => {
                                    if (evt.target.nodeName === 'TD') {
                                        const selected_id = selectedRow['id']
                                        console.log(selected_id)
                                        history.push('/single_air/' + selected_id)
                                    }
                                })}
                                options={{
                                    rowStyle: rowData => ({
                                        filtering: true,
                                    }),
                                    headerStyle: {
                                        backgroundColor: '#AC8E7A',
                                        color: '#FFF'
                                    },
                                    filtering: true,
                                }}
                            />
                        ) : (
                                <Typography variant='h6' color='inherit' align='center'>
                                    Aucun air
                                </Typography>
                            )}
                    </Collapse>
                    <ListItem
                        button
                        onClick={handleClickEx}
                        selected={false}
                    >
                        <ListItemIcon>
                            <Icon class="fas fa-book" />
                        </ListItemIcon>
                        <ListItemText primary="Editions « contenantes »" />
                        {openExemplaires ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openExemplaires} timeout="auto" unmountOnExit>
                        {[dataTexte['edition']] ? (
                            <MaterialTable
                                localization={{
                                    body: {
                                        emptyDataSourceMessage:
                                            <div className={classes.root}>
                                                <FacebookCircularProgress classes={{
                                                    circle: classes.circle,
                                                }} />
                                            </div>
                                    }
                                }}
                                icons={tableIcons}
                                columns={[
                                    { title: 'UUID', field: 'id' },
                                    { title: 'Titre', field: 'titre_ouvrage' },
                                    { title: 'Auteur', field: 'auteur' },
                                    { title: 'Conservation', field: 'ville_conservation' },
                                    { title: 'Lieu de dépôt', field: 'depot_conservation' },
                                    { title: 'Année indiquée', field: 'annee_indiquee' },
                                    { title: 'Année estimée', field: 'annee_estimee' },
                                    { title: 'Format', field: 'format' },
                                ]}
                                data={[dataTexte['edition']]}
                                title={[dataTexte['edition']] ? ("Exemplaire correspondant - " + [dataTexte['edition']].length + " résultat") : ('Exemplaire')}
                                onRowClick={((evt, selectedRow) => {
                                    if (evt.target.nodeName === 'TD') {
                                        const selected_id = selectedRow['id']
                                        console.log(selected_id)
                                        history.push('/single_exemplaire/' + selected_id)
                                    }
                                })}
                                options={{
                                    rowStyle: rowData => ({
                                        filtering: true,
                                    }),
                                    headerStyle: {
                                        backgroundColor: '#AC8E7A',
                                        color: '#FFF'
                                    },
                                    filtering: true,
                                }}
                            />
                        ) : (
                                <Typography variant='h6' color='inherit' align='center'>
                                    Aucun exemplaire
                                </Typography>
                            )}
                    </Collapse>
                    <ListItem
                        button
                        onClick={handleClickRef}
                        selected={false}
                    >
                        <ListItemIcon>
                            <Icon class="fas fa-book-open" />
                        </ListItemIcon>
                        <ListItemText primary="Références" />
                        {console.log(getReference())}
                        {openReference ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openReference} timeout="auto" unmountOnExit>
                        {dataTexte['references_externes'] ? (
                            <MaterialTable
                                localization={{
                                    body: {
                                        emptyDataSourceMessage:
                                            <div className={classes.root}>
                                                <FacebookCircularProgress classes={{
                                                    circle: classes.circle,
                                                }} />
                                            </div>
                                    }
                                }}
                                icons={tableIcons}
                                columns={[
                                    { title: 'UUID', field: 'id' },
                                    { title: 'Titre', field: 'titre' },
                                    { title: 'Nom auteur', field: 'auteur' },
                                    { title: 'Nom Editeur', field: 'editeur' },
                                    { title: 'Lien web', field: 'lien' },
                                    { title: 'Description référence', field: 'description_reference' }
                                ]}
                                data={getReference()}
                                title={getReference() ? ("Références correspondantes - " + getReference().length + " résultats") : ('Références')}
                                onRowClick={((evt, selectedRow) => {
                                    if (evt.target.nodeName === 'TD') {
                                        const selected_id = selectedRow['id']
                                        console.log(selected_id)
                                        history.push('/single_reference/' + selected_id)
                                    }
                                })}
                                options={{
                                    rowStyle: rowData => ({
                                        filtering: true,
                                    }),
                                    headerStyle: {
                                        backgroundColor: '#AC8E7A',
                                        color: '#FFF'
                                    },
                                    filtering: true,
                                }}

                            />
                        ) : (
                                <Typography variant='h6' color='inherit' align='center'>
                                    Aucune référence
                                </Typography>
                            )}
                    </Collapse>
                </List>
            </Box>
        </div >
    )
}

export default withRouter(SingleTextePublie)
