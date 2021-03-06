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


function SingleExemplaire({ history, match }) {
    const classes = useStyles();
    const id = match.params.id;
    const [data, setData] = useState([])

    const [dataExemplaire, setDataExemplaire] = useState([])       // contient les informations du texte s??lectionn??
    const [dataTextes, setDataTextes] = useState([])               // contient des textes contenus dans l'exemplaire s??lectionn??

    const [openTextes, setOpenTextes] = useState(false)
    const handleClickTextes = () => {
        setOpenTextes(!openTextes);
    };

    const [openReference, setOpenReference] = useState(false)
    const handleClickRef = () => {
        setOpenReference(!openReference);
    };

    const query = `{
        items {
            exemplaires(filter: {id: {_eq: "${id}"}}) {
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
              status
              titre_ouvrage
              auteur
              ville_conservation
              depot_conservation
              annee_indiquee
              annee_estimee
              format
              manuscrit_imprime
              forme_editoriale
              lieu_edition_reel
              lieu_edition_indique
              lieu_edition_source_information
              editeur_libraire_imprimeur
              reference {
                references_externes_id {
                  id
                  lien
                  titre
                  annee
                  editeur
                  auteur
                }
              }
            }
            textes_publies(filter: {exemplaires_id: {id: {_eq: "${id}"}}}) {
              id
              titre
              auteur
              sur_l_air_de
              incipit
              incipit_normalise
              provenance
              theme {
                themes_id {
                  theme
                }
              }
            }
          }
      }`

    useEffect(() => {
        (async () => {
            let d = await fetch('http://localhost:8055/graphql/', {
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
        let finalStr = initialStr.slice(17, initialStr.length - 2)

        let lengthData = 0
        // // aller chercher les textes de l'exemplaire s??lectionn??
        if (finalStr !== '') {
            res_tmp = JSON.parse(finalStr)
            if (res_tmp['exemplaires'].length) {
                // update les informations du texte s??lectionn??
                // on suppose qu'un seul texte peut ??tre s??lectionn?? dans le r??sultat de la query et donc que les uuid sont uniques 
                setDataExemplaire(res_tmp['exemplaires'][0])
            }
            if (res_tmp['textes_publies'].length) {
                // update les informations des timbres li??s au texte s??lectionn??
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
            default:
                return rowData['provenance']
        }
    }


    function getReference() {
        if (dataExemplaire['reference'].length !== 0) {
            let l = dataExemplaire['reference'].length
            let res = '['
            for (var i = 0; i < l; i++) {
                res = res.concat(JSON.stringify(dataExemplaire['reference'][i]['references_externes_id']))
                res = res.concat(',')
            }
            res = res.substring(0, res.length - 1)
            res = res.concat(']')
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
                    Table des exemplaires
                </Typography>
                <Typography color='inherit' variant='h3' align='justify'>
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
                        <Typography variant='h6' color='inherit' align='justify'>
                            <i>{dataExemplaire['titre_ouvrage']}</i>
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Forme ??ditoriale
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['forme_editoriale'] ? (dataExemplaire["forme_editoriale"] + ' - ') : ''}
                            {dataExemplaire['manuscrit_imprime'] === 'i' && 'imprim??s'}
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
                            {dataExemplaire['ville_conservation'] ? dataExemplaire["ville_conservation"] : 'Pas de ville'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Dep??t de conservation
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['depot_conservation'] ? dataExemplaire["depot_conservation"] : 'Pas de lieu'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Auteur de l'ouvrage
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {data['auteur'] ? data["auteur"] : 'Pas d\'auteur'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        {dislayEditeurLibraireImprimeur()}
                    </Grid>
                </Grid>
                <Grid item xs> {/* col 2*/}
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Donn??e entr??e par
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
                            Ann??e(s) indiqu??e(s)
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataExemplaire['annee_indiquee']}
                            {dataExemplaire['annee_indiquee'] === "" && 'Sans date'}
                            {dataExemplaire['annee_indiquee'] === "s.d." && 'Sans date'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Ann??e(s) estim??e(s)
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
                            Lieu indiqu?? : {dataExemplaire['lieu_edition_indique'] ? dataExemplaire['lieu_edition_indique'] : 'Pas d\'indication'}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            Lieu r??el : {dataExemplaire['lieu_edition_reel'] ? dataExemplaire['lieu_edition_reel'] : 'Pas d\'indication'}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Box pt={0} pb={5} className={classes.borderBot} />
            <Box pt={0} pb={10} className={classes.tablesRelation}>
                <Typography variant='h6' color='inherit' align='justify'>
                    Donn??es li??es :
                </Typography>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Nom des tables en relation avec cet exemplaire
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
                        <ListItemText primary="Textes de l'exemplaire" />
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
                                    { title: 'Incipit normalis??', field: 'incipit_normalise' },
                                    { title: 'Entr??e par ', field: 'provenance', render: rowData => getSearchersNames(rowData) },
                                    { title: 'Th??mes', field: 'theme', render: rowData => getThemesNames(rowData) }
                                ]}
                                data={dataTextes}
                                title={dataTextes ? ("Textes correspondant(s) - " + dataTextes.length + " r??sultat") : ('Textes')}
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
                        <ListItemText primary="R??f??rences" />
                        {openReference ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openReference} timeout="auto" unmountOnExit>
                        {dataExemplaire['reference'] ? (
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
                                    { title: 'Num??ro r??f??rence', field: 'description_reference' }
                                ]}
                                data={getReference()}
                                title={getReference() ? ("R??f??rences correspondantes - " + getReference().length + " r??sultats") : ('R??f??rences')}
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
                                    Aucune r??f??rence
                                </Typography>
                            )}
                    </Collapse>
                </List>
            </Box>
        </div >
    )
}

export default withRouter(SingleExemplaire)
