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


function SingleEdition({ history, match }) {
    const classes = useStyles();
    const id = match.params.id;
    const [data, setData] = useState([])

    const [dataExemplaire, setDataExemplaire] = useState([])       // contient les informations du texte sélectionné
    const [dataTextes, setDataTextes] = useState([])               // contient des textes contenus dans l'exemplaire sélectionné

    const [openTextes, setOpenTextes] = useState(false)
    const handleClickTextes = () => {
        setOpenTextes(!openTextes);
    };

    const [openReference, setOpenReference] = useState(false)
    const handleClickRef = () => {
        setOpenReference(!openReference);
    };

    const query = `{
        editions(filter: {id: {_eq: "${id}"}}) {
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
            references_externes {
                references_externes {
                    id
                    lien
                    titre
                    annee
                    editeur
                    auteur
                }
            }
        }
        textes_publies(filter: {edition: {id: {_eq: "${id}"}}}) {
            id
            titre
            auteur
            sur_l_air_de
            incipit
            incipit_normalise
            provenance
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
            setData(j)
            transformData(j)
        })()
    }, [query])

    function transformData(j) {
        let res_tmp = []
        let res_textes = []

        let initialStr = JSON.stringify(j)
        let finalStr = initialStr.slice(8, initialStr.length - 1)

        let lengthData = 0
        // // aller chercher les textes de l'edition sélectionnée
        if (finalStr !== '') {
            res_tmp = JSON.parse(finalStr)
            if (res_tmp['editions'].length) {
                // update les informations du texte sélectionné
                // on suppose qu'un seul texte peut être sélectionné dans le résultat de la query et donc que les uuid sont uniques 
                setDataExemplaire(res_tmp['editions'][0])
            }
            if (res_tmp['textes_publies'].length) {
                // update les informations des timbres liés au texte sélectionné
                lengthData = res_tmp['textes_publies'].length
                if (lengthData === 1) {
                    // un seul timbre -> on renvoie directement l'objet
                    setDataTextes(res_tmp['textes_publies'][0])
                }
                else {
                    // sinon on renvoie un renvoie un tableau de timbres
                    for (let i = 0; i < lengthData; i++) {
                        res_textes.push(res_tmp['textes_publies'][i])
                    }
                    setDataTextes(res_textes)
                }
            }
        }
    }

    function getSearchersNames(rowData) {                                // renvoie le nom complet du champs provenance
        switch (rowData['provenance']) {
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
            case (null) :
                return (
                    <>
                    <Typography color='inherit' align='justify'>
                        Pas d'information <br/>
                    </Typography>
                </>
                )
            default:
                return rowData['provenance']
        }
    }


    function getReference() {
        if (dataExemplaire['references_externes'].length !== 0) {
            let l = dataExemplaire['references_externes'].length
            let res = '['
            for (var i = 0; i < l; i++) {
                res = res.concat(JSON.stringify(dataExemplaire['references_externes'][i]['references_externes']))
                res = res.concat(',')
            }
            res = res.substring(0, res.length - 1)
            res = res.concat(']')
            console.log(JSON.parse(res))
            return (JSON.parse(res))
        }
    }

    function dislayEditeurLibraireImprimeur() {
        let name = dataExemplaire['editeur_libraire_imprimeur']
        if (name) {
            switch (name) {
                case dataExemplaire['imprimeur']:
                    return (
                        <>
                            <Typography variant='body1' color='textSecondary' align='justify'>
                                Imprimeur
                        </Typography>
                            <Typography variant='h6' color='inherit' align='justify'>
                                {name}
                            </Typography>

                        </>)
                case dataExemplaire['editeur']:
                    return (
                        <>
                            <Typography variant='body1' color='textSecondary' align='justify'>
                                Editeur
                        </Typography>
                            <Typography variant='h6' color='inherit' align='justify'>
                                {name}
                            </Typography>

                        </>)
                case dataExemplaire['libraire']:
                    return (
                        <>
                            <Typography variant='body1' color='textSecondary' align='justify'>
                                Libraire
                        </Typography>
                            <Typography variant='h6' color='inherit' align='justify'>
                                {name}
                            </Typography>

                        </>)
                default:
                    return (
                        <>
                            <Typography variant='body1' color='textSecondary' align='justify'>
                                Editeur / Imprimeur / Libraire
                            </Typography>
                            <Typography variant='h6' color='inherit' align='justify'>
                                {name}
                            </Typography>

                        </>)
            }
        }
        else {
            return (
                <>
                    <Typography variant='body1' color='textSecondary' align='justify'>
                        Editeur / Imprimeur / Libraire
                    </Typography>
                    <Typography variant='h6' color='inherit' align='justify'>
                        Champs manquant
                    </Typography>
                </>
            )
        }
    }

    function getThemesNames(rowData) {
        if (rowData['theme']) {
            let l = rowData['theme'].length
            let liste_themes_names = []
            for (var i = 0; i < l; i++) {
                liste_themes_names.push((rowData["theme"][i]["themes_id"]['theme']))
            }
            return String(liste_themes_names)
        }
    };

    return (
        <div className={classes.root} >
            <Box className={classes.marginTitle}>
                <Typography variant='h6' color='textSecondary' align='justify'  >
                    {console.log(dataExemplaire)}
                    Table des éditions
                </Typography>
                <Typography color='inherit' variant='h6' align='justify'>
                    {dataExemplaire['id']}
                </Typography>
            </Box>
            <Grid container spacing={2}
                direction="row"
                justify="center"
                alignItems="justify" >

                <Grid item xs>{/* col 1*/}
                    <Grid item xs className={classes.margin} >
                        <Typography variant='h6' color='textSecondary' align='justify'>
                            Titre de l'ouvrage
                        </Typography>
                        <Typography variant='h3' color='inherit' align='justify'>
                            <i>{dataExemplaire['titre_ouvrage']}</i>
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Forme éditoriale
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['forme_editoriale'] ? (dataExemplaire["forme_editoriale"] + ' - ') : ''}
                            {dataExemplaire['manuscrit_imprime'] === 'i' && 'imprimés'}
                            {dataExemplaire['manuscrit_imprime'] === 'm' && 'manuscrit'}
                            {dataExemplaire['forme_editoriale'] === "" && (dataExemplaire['manuscrit_imprime'] === "" && ('Champs manquant'))}

                        </Typography>
                        <Typography variant='body1' color='inherit' align='justify'>
                            {dataExemplaire['format'] && ('format ' + dataExemplaire['format'])}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Ville de conservation
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['ville_conservation_exemplaire_1'] ? dataExemplaire["ville_conservation_exemplaire_1"] : 'Pas de ville'}
                            {/* rajouter les autres villes */}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Depôt de conservation
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['depot_conservation_exemplaire_1'] ? dataExemplaire["depot_conservation_exemplaire_1"] : 'Pas de lieu'}
                            {/* rajouter les autres lieux */}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Auteur de l'ouvrage
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['auteur'] ? dataExemplaire["auteur"] : 'Pas d\'auteur'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        {dislayEditeurLibraireImprimeur()}
                    </Grid>
                </Grid>
                <Grid item xs> {/* col 2*/}
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Donnée entrée par
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {getSearchersNames(dataExemplaire)}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Informations cote
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['prefixe_cote'] !== "" ? dataExemplaire["prefixe_cote"] : ''} {dataExemplaire['numero_cote'] !== "" ? dataExemplaire["numero_cote"] : ''}
                            {dataExemplaire['prefixe_cote'] === "" && (dataExemplaire['numero_cote'] === "" && ('Champs manquant'))}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Année(s) indiquée(s)
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['annee_indiquee']}
                            {dataExemplaire['annee_indiquee'] === "" && 'Sans date'}
                            {dataExemplaire['annee_indiquee'] === "s.d." && 'Sans date'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Année(s) estimée(s)
                                </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['annee_estimee']}
                            {dataExemplaire['annee_estimee'] === "" && 'Sans date'}
                            {dataExemplaire['annee_estimee'] === "s.d." && 'Sans date'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Lieu de publication
                                </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            Lieu indiqué : {dataExemplaire['lieu_edition_indique'] ? dataExemplaire['lieu_edition_indique'] : 'Pas d\'indication'}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            Lieu réel : {dataExemplaire['lieu_edition_reel'] ? dataExemplaire['lieu_edition_reel'] : 'Pas d\'indication'}
                        </Typography>
                    </Grid>
                </Grid>
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
                            Nom des tables en relation avec cette édition
                        </ListSubheader>
                    }
                >
                    <ListItem
                        button
                        onClick={handleClickTextes}
                        selected={false}
                    >
                        <ListItemIcon>
                            <Icon class="fas fa-feather" />
                        </ListItemIcon>
                        <ListItemText primary="Textes de l'édition"/>
                        {openTextes ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openTextes} timeout="auto" unmountOnExit>
                        {dataTextes ? (
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
                                    { title: 'Auteur', field: 'auteur' },
                                    { title: 'Sur l\' air de ...', field: 'sur_l_air_de' },
                                    { title: 'Incipit', field: 'incipit' },
                                    { title: 'Incipit normalisé', field: 'incipit_normalise' },
                                    { title: 'Entrée par ', field: 'provenance', render: rowData => getSearchersNames(rowData) },
                                    { title: 'Thèmes', field: 'theme', render: rowData => getThemesNames(rowData) }
                                ]}
                                data={dataTextes}
                                title={dataTextes ? ("Textes correspondant(s) - " + dataTextes.length + " résultat") : ('Textes')}
                                onRowClick={((evt, selectedRow) => {
                                    if (evt.target.nodeName === 'TD') {
                                        const selected_id = selectedRow['id']
                                        console.log(selected_id)
                                        history.push('/single_texte_publie/' + selected_id)
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
                                    Aucun texte
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
                        {openReference ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openReference} timeout="auto" unmountOnExit>
                        {dataExemplaire['references_externes'] ? (
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
                                    { title: 'Numéro référence', field: 'description_reference' }
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

export default withRouter(SingleEdition)
