import { Box, Collapse, Grid, Icon, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles, Paper, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router'
import history from '../history'
import Donut from './Donut';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

const colors = ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D']

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    paper: {
        maxWidth: '92%',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        textAlign: 'justify',
        color: theme.palette.text.secondary,
    },
    paperResult: {
        maxWidth: '90%',
        height: '50%',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        textAlign: 'justify',
    },
    researchBox: {
        margin: 'auto',
        justifyContent: 'center',
        width: '50%',
    },
    borderBot: {
        margin: 'auto',
        borderBottom: '4px solid gray',
        width: '50%',
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
        },
        justifyContent: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    formControlSwitch: {
        margin: theme.spacing(4),
        minWidth: 150,
    },
    formControlText: {
        margin: theme.spacing(3),
        minWidth: 520,
    },
    formControlAndoR: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        width: 400,
    },
    linearProgress: {
        width: '30%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        margin: 'auto',
        justifyContent: 'center',
    },
}));

function Results({ res }) {
    const classes = useStyles()

    function getSeries() {
        let length_textes_publies = 0
        let length_airs = 0
        let length_editions = 0
        let length_references_externes = 0
        let length_themes = 0
        if (res) {
            if (res['data']['items']['airs']) {
                length_airs = res['data']['items']['airs'].length
            }
            if (res['data']['items']['textes_publies']) {
                length_textes_publies = res['data']['items']['textes_publies'].length
            }
            if (res['data']['items']['editions']) {
                length_editions = res['data']['items']['editions'].length
            }
            if (res['data']['items']['references_externes']) {
                length_references_externes = res['data']['items']['references_externes'].length
            }
            if (res['data']['items']['themes']) {
                length_themes = res['data']['items']['themes'].length
            }
            return [length_airs, length_textes_publies, length_references_externes, length_themes, length_editions]

        }
    }

    function getLabel() {
        return ['Airs', 'Textes publiés', 'Références', 'Thèmes', 'Editions']
    }

    const [openAirs, setOpenAirs] = useState(false)
    const handleClickAirs = () => {
        setOpenAirs(!openAirs);
    };

    const [openTextes, setOpenTextes] = useState(false)
    const handleClickTextes = () => {
        setOpenTextes(!openTextes);
    };

    const [openExemplaires, setOpenExemplaires] = useState(false)
    const handleClickExemplaires = () => {
        setOpenExemplaires(!openExemplaires);
    };

    const [openReferences, setOpenReferences] = useState(false)
    const handleClickReferences = () => {
        setOpenReferences(!openReferences);
    };

    const [openThemes, setOpenThemes] = useState(false)
    const handleClickThemes = () => {
        setOpenThemes(!openThemes);
    };

    function renderCards() {                //différencier l'affichage des textes, airs, exemplaires, thèmes et références
        let _res = res['data']['items']

        function displaySingleAir(selected_id) {
            history.push('/single_air/' + selected_id)
        }
        function displaySingleTexte(selected_id) {
            history.push('/single_texte_publie/' + selected_id)
        }
        function displaySingleExemplaire(selected_id) {
            history.push('/single_edition/' + selected_id)
        }
        function displaySingleReference(selected_id) {
            history.push('/single_reference/' + selected_id)
        }


        return (
            <List
                className={classes.paperResult}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        {getSeries()[0] + getSeries()[1] + getSeries()[2] + getSeries()[3] + getSeries()[4]} résultats trouvés
                    </ListSubheader>
                }
            >
                {/* affichage airs */}
                {getSeries()[0] !== 0 && (
                    <>
                        <ListItem
                            style={{
                                backgroundColor: colors[0],
                                color: 'white'
                            }}
                            button
                            onClick={handleClickAirs}
                            selected={false}
                        >
                            <ListItemIcon>
                                <Icon class="fas fa-music" style={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary="Airs" />
                            {openAirs ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>

                        <Collapse in={openAirs} timeout="auto" unmountOnExit>
                            {<Fragment>
                                <Box pt={0} pb={2}>
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        {getSeries()[0] !== 1 ? getSeries()[0] + ' résultats trouvés' : getSeries()[0] + ' résultat trouvé'}
                                    </ListSubheader>
                                    {_res['airs'].map(({ id, air_normalise, surnom_1 }, index) => (
                                        <div key={index}>
                                            <Paper elevation={3} className={classes.paperResult} >
                                                <Grid container spacing={2}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="justify" >
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => displaySingleAir(id)}>
                                                            <RemoveRedEyeIcon fontSize="large" />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <Typography variant='h6' color='inherit' align='justify'>
                                                            {air_normalise}
                                                        </Typography>
                                                        <Typography variant='subtitle2' color='textSecondary' align='justify'>
                                                            {surnom_1}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Typography variant='subtitle2' color='textSecondary' align='right'>
                                                            {id}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </div>
                                    ))}
                                </Box>
                            </Fragment>}
                        </Collapse>
                    </>
                )}
                {/* affichage textes_publies */}
                {getSeries()[1] !== 0 && (
                    <>
                        <ListItem
                            style={{
                                backgroundColor: colors[1],
                                color: 'white'
                            }}
                            button
                            onClick={handleClickTextes}
                            selected={false}
                        >
                            <ListItemIcon>
                                <Icon class="fas fa-feather" style={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary="Textes publiés" />
                            {openTextes ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>

                        <Collapse in={openTextes} timeout="auto" unmountOnExit>
                            <Box pt={0} pb={2}>
                                <ListSubheader component="div" id="nested-list-subheader">
                                    {getSeries()[1] !== 1 ? getSeries()[1] + ' résultats trouvés' : getSeries()[1] + ' résultat trouvé'}
                                </ListSubheader>
                                <Fragment>

                                    {_res['textes_publies'].map(({ id, titre, auteur }, index) => (
                                        <div key={index}>
                                            <Paper elevation={3} className={classes.paperResult}>
                                                <Grid container spacing={2}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="justify" >
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => displaySingleTexte(id)}>
                                                            <RemoveRedEyeIcon fontSize="large" />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <Typography variant='h6' color='inherit' align='justify'>
                                                            {titre ? titre : 'Aucun titre'}
                                                        </Typography>
                                                        <Typography variant='subtitle2' color='textSecondary' align='justify'>
                                                            {auteur ? auteur : 'Champ manquant'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Typography variant='subtitle2' color='textSecondary' align='right'>
                                                            {id}
                                                        </Typography>
                                                    </Grid>

                                                </Grid>
                                            </Paper>
                                        </div>
                                    ))}
                                </Fragment>
                            </Box>
                        </Collapse>
                    </>
                )}
                {/* affichage editions */}
                {getSeries()[4] !== 0 && (
                    <>
                        <ListItem
                            style={{
                                backgroundColor: colors[4],
                                color: 'white'
                            }}
                            button
                            onClick={handleClickExemplaires}
                            selected={false}
                        >
                            <ListItemIcon>
                                <Icon class="fas fa-book" style={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary="Editions" />
                            {openExemplaires ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>

                        <Collapse in={openExemplaires} timeout="auto" unmountOnExit>
                            <Box pt={0} pb={2}>
                                <ListSubheader component="div" id="nested-list-subheader">
                                    {getSeries()[4] !== 1 ? getSeries()[4] + ' résultats trouvés' : getSeries()[4] + ' résultat trouvé'}
                                </ListSubheader>
                                <Fragment>
                                    {_res['editions'].map(({ id, titre_ouvrage, auteur }, index) => (
                                        <div key={index}>
                                            <Paper elevation={3} className={classes.paperResult}>
                                                <Grid container spacing={2}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="justify" >
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => displaySingleExemplaire(id)}>
                                                            <RemoveRedEyeIcon fontSize="large" />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <Typography variant='h6' color='inherit' align='justify'>
                                                            {titre_ouvrage ? titre_ouvrage : 'Aucun titre'}
                                                        </Typography>
                                                        <Typography variant='subtitle2' color='textSecondary' align='justify'>
                                                            {auteur ? auteur : 'Champ manquant'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Typography variant='subtitle2' color='textSecondary' align='right'>
                                                            {id}
                                                        </Typography>
                                                    </Grid>

                                                </Grid>
                                            </Paper>
                                        </div>
                                    ))}

                                </Fragment>
                            </Box>
                        </Collapse>
                    </>
                )}
                {/* affichage référence */}
                {getSeries()[2] !== 0 && (
                    <>
                        <ListItem
                            style={{
                                backgroundColor: colors[2],
                                color: 'white'
                            }}
                            button
                            onClick={handleClickReferences}
                            selected={false}
                        >
                            <ListItemIcon>
                                <Icon class="fas fa-book-open" style={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary="Références" />
                            {openReferences ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>

                        <Collapse in={openReferences} timeout="auto" unmountOnExit>
                            <Box pt={0} pb={2}>
                                <ListSubheader component="div" id="nested-list-subheader">
                                    {getSeries()[2] !== 1 ? getSeries()[2] + ' résultats trouvés' : getSeries()[2] + ' résultat trouvé'}
                                </ListSubheader>
                                <Fragment>
                                    {_res['references_externes'].map(({ id, titre, auteur }, index) => (
                                        <div key={index}>
                                            <Paper elevation={3} className={classes.paperResult}>
                                                <Grid container spacing={2}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="justify" >
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => displaySingleReference(id)}>
                                                            <RemoveRedEyeIcon fontSize="large" />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <Typography variant='h6' color='inherit' align='justify'>
                                                            {titre ? titre : 'Aucun titre'}
                                                        </Typography>
                                                        <Typography variant='subtitle2' color='textSecondary' align='justify'>
                                                            {auteur ? auteur : 'Champs manquant'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Typography variant='subtitle2' color='textSecondary' align='right'>
                                                            {id}
                                                        </Typography>
                                                    </Grid>

                                                </Grid>
                                            </Paper>
                                        </div>
                                    ))}
                                </Fragment>
                            </Box>
                        </Collapse>
                    </>
                )}
                {getSeries()[3] !== 0 && (
                    <>
                        <ListItem
                            style={{
                                backgroundColor: colors[3],
                                color: 'white'
                            }}
                            button
                            onClick={handleClickThemes}
                            selected={false}
                        >
                            <ListItemIcon>
                                <Icon class="fas fa-tags" style={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary="Thèmes" />
                            {openThemes ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>

                        <Collapse in={openThemes} timeout="auto" unmountOnExit>
                            <Box pt={0} pb={2}>
                                <ListSubheader component="div" id="nested-list-subheader">
                                    {getSeries()[3] !== 1 ? getSeries()[3] + ' résultats trouvés' : getSeries()[3] + ' résultat trouvé'}
                                </ListSubheader>
                                <Fragment>
                                    {_res['themes'].map(({ id, theme, type }, index) => (
                                        <div key={index}>
                                            <Paper elevation={3} className={classes.paperResult}>
                                                <Grid container spacing={2}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="justify" >
                                                    <Grid item xs={7}>
                                                        <Typography variant='h6' color='inherit' align='justify'>
                                                            {theme ? theme : 'Champs manquant'}
                                                        </Typography>
                                                        <Typography variant='subtitle2' color='textSecondary' align='justify'>
                                                            {type ? type : 'Champs manquant'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Typography variant='subtitle2' color='textSecondary' align='right'>
                                                            {id}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </div>
                                    ))}

                                </Fragment>
                            </Box>
                        </Collapse>
                    </>
                )}
            </List>

        )
    }

    return (
        <>
            <Box pt={10} pb={0} className={classes.borderBot} />
            <Box pt={5}>
                <Typography variant='h4' color='textPrimary' align='justify' className={classes.paper} >
                    Résultats {console.log(res)}
                </Typography>
            </Box>
            <Grid container spacing={2}
                direction="row"
                justify="center"
                alignItems="justify" >
                <Grid item xs={8} >
                    {renderCards()}
                </Grid>
                {res.length !== 0 && (
                    <Grid item xs>
                        <Paper elevation={0} className={classes.paperGraph}>
                            {console.log(getSeries())}
                            <Donut series={getSeries()} labels={getLabel()} />
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </>)
}

export default withRouter(Results)
