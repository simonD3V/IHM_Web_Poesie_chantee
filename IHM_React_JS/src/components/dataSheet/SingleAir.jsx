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

function SingleAir({ history, match }) {
    const classes = useStyles();
    const id = match.params.id;
    // const [data, setData] = useState([])

    const [dataAir, setDataAir] = useState([])          // contient les informations de l'air sélectionné
    const [dataTextes, setDataTextes] = useState([])    // contient des textes qui se chantent sur l'air sélectionné

    const [openTextes, setOpenTextes] = useState(false)
    const handleClickTextes = () => {
        setOpenTextes(!openTextes);
    };

    const query = `{
          airs(filter: {id: {_eq: "${id}"}}) {
            id
            sources_musicales
            air_normalise
            surnom_1
            surnom_2
            surnom_3
            surnom_4
            surnom_5
            surnom_6
            surnom_7
            surnom_8
            surnom_9
            surnom_10
            surnom_11
            surnom_12
            surnom_13
            surnom_14
            enregistrement_air
            textes_publies(filter: {airs: {id: {_eq: "${id}"}}}) {
                textes_publies {
                  id
                  titre
                  auteur
                  sur_l_air_de
                  incipit
                  incipit_normalise
                  provenance
                }
                enregistrement_web
                enregistrement_sherlock
              }
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
            transformData(j)
        })()
    }, [query])

    function transformData(j) {
        let res_tmp = []
        let res_timbres = []

        let initialStr = JSON.stringify(j)
        let finalStr = initialStr.slice(17, initialStr.length - 3)
        if (finalStr !== '') {
            res_tmp = JSON.parse(finalStr)
            setDataAir(JSON.parse(finalStr))

            if (res_tmp['textes_publies'].length) {
                // update les informations des timbres liés à l'air sélectionné
                let tmpStr = '['
                // on incorpore 'enregistrement_web' et 'enregistrement_sherlock' directement à dataTextes
                for (let i = 0; i < res_tmp['textes_publies'].length; i++) {
                    tmpStr = tmpStr.concat(JSON.stringify(res_tmp['textes_publies'][i]['textes_publies']))
                    tmpStr = tmpStr.substr(0, tmpStr.length - 1)
                    tmpStr = tmpStr.concat(', "enregistrement_web" : ' + JSON.stringify(res_tmp['textes_publies'][i]['enregistrement_web']))
                    tmpStr = tmpStr.concat(', "enregistrement_sherlock" : ' + JSON.stringify(res_tmp['textes_publies'][i]['enregistrement_sherlock']))
                    tmpStr = tmpStr.concat('}, ')
                }
                tmpStr = tmpStr.substr(0, tmpStr.length - 2)
                tmpStr = tmpStr.concat(']')
                res_timbres = JSON.parse(tmpStr)
                console.log(res_timbres)
                setDataTextes(res_timbres)
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

    return (
        <div className={classes.root} >
            <Box className={classes.marginTitle}>
                <Typography variant='h6' color='textSecondary' align='justify'  >
                    Table des airs
                    {console.log(dataAir)}
                </Typography>
                <Typography color='inherit' variant='h6' align='justify'>
                    {dataAir['id']}
                </Typography>
            </Box>
            <Grid container spacing={2}
                direction="row"
                justify="center"
                alignItems="justify" >

                <Grid item xs>{/* col 1*/}
                    <Grid item xs className={classes.margin} >
                        <Typography variant='h6' color='textSecondary' align='justify'>
                            Air normalisé
                        </Typography>
                        <Typography variant='h3' color='inherit' align='justify'>
                            <i>{dataAir['air_normalise']}</i>
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Surnom(s)
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataAir['surnom_1'] ? (dataAir["surnom_1"]) : 'Champs manquant'}
                            {dataAir['surnom_2'] && ('- ' + dataAir["surnom_2"])}
                            {dataAir['surnom_3'] && ('- ' + dataAir["surnom_3"])}
                            {dataAir['surnom_4'] && ('- ' + dataAir["surnom_4"])}
                            {dataAir['surnom_5'] && ('- ' + dataAir["surnom_5"])}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Enregistrement
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            module pour écouter
                           {dataAir['enregistrement_air']}
                        </Typography>
                    </Grid>
                    <Grid item xs className={classes.margin} >
                        <Typography variant='body1' color='textSecondary' align='justify'>
                            Sources musicales
                        </Typography>
                        <Typography variant='h6' color='inherit' align='justify'>
                            {dataAir['sources_musicales']}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs>{/* col 2*/}

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
                            Nom des tables en relation avec cet air
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
                        <ListItemText primary="Paroles (textes)" />
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
                                    { title: 'Enregistrement web', field: 'enregistrement_web' },
                                    { title: 'Enregistrement sherlock', field: 'enregistrement_sherlock' },
                                    // { title: 'Entrée par ', field: 'provenance', render: rowData => getSearchersNames(rowData) },
                                ]}
                                data={dataTextes}
                                title={dataTextes ? ("Texte(s) correspondant(s) - " + dataTextes.length + " résultat(s)") : ('Textes')}
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
        </div >
    )
}

export default withRouter(SingleAir)
