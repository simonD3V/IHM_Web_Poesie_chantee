import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import CircularProgress from '@material-ui/core/CircularProgress';
import { forwardRef } from 'react';
import history from "./history";

//icons
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

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

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    table: {
        minWidth: 700,
    }
});


function Textes_publies() {
    const classes = useStyles();

    const [data, setData] = useState([])

    const query = `
    {
        textes_publies(limit: 1000) {
            id
            titre
            sur_l_air_de
            incipit
            incipit_normalise
            provenance
            auteur
            auteur_statut_source
            auteur_source_information
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
            }
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
        })()
    }, [query])

    function dataTextes_publies() {
        let res = []
        let initialStr = JSON.stringify(data)
        let finalStr = initialStr.slice(26, initialStr.length - 2)
        if (finalStr !== '') {
            res = JSON.parse(finalStr)
            return res
        }
    }

    function getAuteurEdition(rowData) {
        if (rowData['edition']) {
            return rowData['edition']['auteur']
        }
    }

    function getExemplaireTitle(rowData) {
        if (rowData['edition']) {
            let titre_exemplaire = rowData["edition"]["titre_ouvrage"]
            return (titre_exemplaire)
        }
    }

    function getThemesNames(rowData) {
        if (rowData['themes']) {
            let l = rowData['themes'].length
            let liste_themes_names = []
            for (var i = 0; i < l; i++) {
                liste_themes_names.push((rowData["themes"][i]['theme']))
            }
            return String(liste_themes_names)
        }
    };

    function getSearchersNames(rowData) {
        switch (rowData['provenance']) {
            case 'A':
                return 'Alice Tacaille'
            case 'T':
                return 'Tatiana Debbagi Baranova'
            case ('A/T'):
                return (
                    <>
                        <p>
                            Alice Tacaille
                        </p>
                        <p>
                            Tatiana Debbagi Baranova
                        </p>
                    </>
                )
            default:
                return rowData['provenance']
        }
    }


    return (
        <Grid container spacing={2}
            direction="row"
            justify="center"
            alignItems="center">
            <Grid item xs={12} >
                <Typography variant='h5' align='center'>
                    Projet Timbres : 'Textes publiés'
                </Typography>
                <Typography variant='body1' color='textSecondary' align='center'>
                    Description de la table des textes publiés
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <div style={{ maxWidth: '100%' }}>
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
                            { title: 'Sur l\' air de ...', field: 'sur_l_air_de' },
                            { title: 'Incipit', field: 'incipit' },
                            { title: 'Incipit normalisé', field: 'incipit_normalise' },
                            { title: 'Auteur', field: 'auteur', render: rowData => getAuteurEdition(rowData)},
                            { title: 'Titre exemplaire', field: 'titre_ouvrage', render: rowData => getExemplaireTitle(rowData) },
                            { title: 'Entrée par ', field: 'provenance', render: rowData => getSearchersNames(rowData) },
                            { title: 'Thèmes', field: 'theme', render: rowData => getThemesNames(rowData) }
                        ]}
                        data={dataTextes_publies()}
                        title={dataTextes_publies() ? ("Textes publiés - " + dataTextes_publies().length + " résultats") : ('Textes publiés ')}
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
                </div>
            </Grid>
        </Grid>
    )
}

export default withRouter(Textes_publies)
