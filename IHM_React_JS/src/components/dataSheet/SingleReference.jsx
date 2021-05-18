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

function SingleReference({ history, match }) {
    const classes = useStyles();
    const id = match.params.id;
    // const [data, setData] = useState([])

    const [dataReference, setDataReference] = useState([])          // contient les informations de la référence sélectionnée
    const [dataTextes, setDataTextes] = useState([])                // contient des textes référencés par la réf sélectionnée
    const [dataExemplaires, setDataExemplaires] = useState([])      // contient des exemplaires référencés par la réf sélectionnée

    const [openExemplaires, setOpenExemplaires] = useState(false)
    const handleClickExemplaires = () => {
        setOpenExemplaires(!openExemplaires);
    };

    const [openTextes, setOpenTextes] = useState(false)
    const handleClickTextes = () => {
        setOpenTextes(!openTextes);
    };

    const query = `{
          references_externes(filter: {id: {_eq: "${id}"}}){
            id
            lien
            titre
            annee
            editeur
            auteur
          }
          editions_references_externes (filter: {references_externes: {id: {_eq: "${id}"}}}){
            references_externes {
              id
            }
            editions {
              id
              titre_ouvrage
              auteur
              ville_conservation_exemplaire_1
              depot_conservation_exemplaire_1
              annee_estimee
              annee_indiquee
              format
            }
          }
          textes_publies_references_externes (filter: {references_externes: {id: {_eq: "${id}"}}}){
            references_externes {
              id
            }
            textes_publies {
              id
              titre
              auteur
              sur_l_air_de
              incipit
              incipit_normalise
              provenance
              themes {
                themes {
                  theme
                }
              }
            }
            description_reference
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
            // setData(j)
            transformData(j)
        })()
    }, [query])

    function transformData(j) {
        let res_tmp = []
        let res_textes = []
        let res_exemplaires = []

        let initialStr = JSON.stringify(j)
        let finalStr = initialStr.slice(8, initialStr.length - 1)

        if (finalStr !== '') {
            console.log(finalStr)
            res_tmp = JSON.parse(finalStr)
            if (res_tmp['references_externes'].length) {
                // update les informations de la référence sélectionnée
                // on suppose qu'une seule réf peut être sélectionnée dans le résultat de la query et donc que les uuid sont uniques 
                setDataReference(res_tmp['references_externes'][0])
            }
            if (res_tmp['editions_references_externes'].length) {

                for (let i = 0; i < res_tmp['editions_references_externes'].length; i++) {
                    res_exemplaires.push(res_tmp['editions_references_externes'][i]['editions'])
                }
                setDataExemplaires(res_exemplaires)
            }

            if (res_tmp['textes_publies_references_externes'].length) {

                let tmpStr = '['
                // on incorpore 'description_référence' directement à dataTextes 
                for (let i = 0; i < res_tmp['textes_publies_references_externes'].length; i++) {
                    tmpStr = tmpStr.concat(JSON.stringify(res_tmp['textes_publies_references_externes'][i]['textes_publies']))
                    tmpStr = tmpStr.substr(0, tmpStr.length - 1)
                    tmpStr = tmpStr.concat(', "description_reference" : ' + JSON.stringify(res_tmp['textes_publies_references_externes'][i]['description_reference']))
                    tmpStr = tmpStr.concat('}, ')
                }   
                tmpStr = tmpStr.substr(0, tmpStr.length - 2)
                tmpStr = tmpStr.concat(']')
                res_textes = JSON.parse(tmpStr)
                setDataTextes(res_textes)
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
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            Alice Tacaille <br />
                            Tatiana Debbagi Baranova
                        </Typography>
                    </>
                )
            case ('A/T'):
                return (
                    <>
                        <Typography variant='subtitle2' color='inherit' align='justify'>
                            Alice Tacaille <br />
                            Tatiana Debbagi Baranova
                         </Typography>
                    </>
                )
            default:
                return rowData['provenance']
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
                    Table des références
                </Typography>
                <Typography color='inherit' variant='h6' align='justify'>
                    {dataReference['id']}
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
                            <i>{dataReference['titre']}</i>
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin}>
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Année de publication
                    </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataReference['annee']}
                            {dataReference['annee'] === "" && 'Sans date'}
                            {dataReference['annee'] === "s.d." && 'Sans date'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Auteur
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataReference['auteur'] ? dataReference["auteur"] : 'Champs manquant'}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Editeur
                            </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataReference['editeur'] ? dataReference["editeur"] : 'Champs manquant'}
                        </Typography>
                    </Grid>

                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Lien
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            <i>{dataReference['lien'] ? dataReference["lien"] : 'Champs manquant'}</i>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs> {/* col 2*/}

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
                            Nom des tables en relation avec cette référence
                        </ListSubheader>
                    }
                >
                    <ListItem
                        button
                        onClick={handleClickExemplaires}
                        selected={false}
                    >
                        <ListItemIcon>
                            <Icon class="fas fa-book" />
                        </ListItemIcon>
                        <ListItemText primary="Editions référencées " />
                        {openExemplaires ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openExemplaires} timeout="auto" unmountOnExit>

                        {dataExemplaires ? (
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
                                data={dataExemplaires}
                                title={dataExemplaires ? ("Exemplaires(s) correspondant(s) - " + dataExemplaires.length + " résultat") : ('Exemplaires')}
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
                        onClick={handleClickTextes}
                        selected={false}
                    >
                        <ListItemIcon>
                            <Icon class="fas fa-feather" />
                        </ListItemIcon>
                        <ListItemText primary="Textes référencés " />
                        {openTextes ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={openTextes} timeout="auto" unmountOnExit>
                        {console.log(dataTextes)}
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
                                    { title: 'Description référence', field: 'description_reference' },
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
                                title={dataTextes ? ("Texte(s) correspondant(s) - " + dataTextes.length + " résultat") : ('Textes')}
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
                </List>
            </Box>
        </div>
    )
}




export default withRouter(SingleReference)



