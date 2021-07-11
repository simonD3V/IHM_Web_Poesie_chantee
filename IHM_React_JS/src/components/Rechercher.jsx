import React, { useState } from 'react'
import { Box, Button, Collapse, FormControl, FormControlLabel, Icon, LinearProgress, List, ListItem, ListItemText, ListSubheader, MenuItem, Select, Switch, TextField, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { withRouter } from 'react-router-dom';
import Results from './research/Results'
import queryBuilder from './research/queryBuilder'
import SearchBar from "material-ui-search-bar";
import { ExpandLess, ExpandMore } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    advancedsearchpaper: {
        maxWidth: '100%',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        textAlign: 'justify',
        color: theme.palette.text.secondary,
    },
    descriptionTitle: {
        maxWidth: '70%',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    paper: {
        maxWidth: '70%',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        textAlign: 'justify',
        color: theme.palette.text.secondary,
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
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "25ch"
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
        margin: theme.spacing(3),
        minWidth: 90,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        width: 400,
    },
    selectEmptyAndOr: {
        marginTop: theme.spacing(2),
        width: 100,
    },
    linearProgress: {
        width: '30%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        margin: 'auto',
        justifyContent: 'center',
    }
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText('#AC8E7A'),
        backgroundColor: '#AC8E7A',
        '&:hover': {
            backgroundColor: '#80624D',
        },
    },
}))(Button);

const ColorSwitch = withStyles({
    switchBase: {
        color: '#80624D',
        '&$checked': {
            color: '#AC8E7A',
        },
        '&$checked + $track': {
            backgroundColor: '#AC8E7A',
        },
    },
    checked: {},
    track: {},
})(Switch);

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

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#AC8E7A',
    },
}))(LinearProgress);

function Rechercher() {
    const classes = useStyles();

    // Liste de champs
    const [fields, setFields] = useState({
        fieldA: 'tous',
        fieldB: 'tous',
        fieldC: 'tous',
    });
    const handleChangeFields = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    // Et / Ou
    const [and_or, set_and_or] = useState('Et')
    const handleChange_and_or = (event) => {
        set_and_or(event.target.value);
    };

    // Descriptions
    const [descriptions, setDescriptions] = useState({
        descriptionA: '',
        descriptionB: '',
        descriptionC: '',
    });
    const handleChangeDescriptions = (event) => {
        setDescriptions({ ...descriptions, [event.target.name]: event.target.value });
    };

    // Contient / Ne contient pas 
    const [isItContained, setIsItContained] = useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
    });
    const [labelA, setLabelA] = useState('Contient');
    const [labelB, setLabelB] = useState('Contient');
    const [labelC, setLabelC] = useState('Contient');

    const handleChangeStateA = (event) => {
        setIsItContained({ ...isItContained, [event.target.name]: event.target.checked });
        if (event.target.checked) {
            setLabelA('Contient')
        } else {
            setLabelA('Ne contient pas')
        }
    };
    const handleChangeStateB = (event) => {
        setIsItContained({ ...isItContained, [event.target.name]: event.target.checked });
        if (event.target.checked) {
            setLabelB('Contient')
        } else {
            setLabelB('Ne contient pas')
        }
    };
    const handleChangeStateC = (event) => {
        setIsItContained({ ...isItContained, [event.target.name]: event.target.checked });
        if (event.target.checked) {
            setLabelC('Contient')
        } else {
            setLabelC('Ne contient pas')
        }
    };

    // Recherche

    // const [query, setQuery] = useState('')
    const [displayOn, setDisplayOn] = useState(false)
    const [clickSearch, setClickSearch] = useState(false)
    const [data, setData] = useState([])

    const [basicSearch, setBasicSearch] = useState()
    const handleChangeBasicSearch = (event) => {
        setBasicSearch(event);
    };

    function handleClickSearch() {
        setClickSearch(!clickSearch)
    }

    async function fetchDataAdvancedResearch(q) {
        let d = await fetch('http://bases-iremus.huma-num.fr/directus-tcf/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: q
            })
        })
        let j = await d.json()
        setData(j)
        console.log(j)
        setDisplayOn(false)
    }

    async function fetchBasicSearch(word) {
        let fetchAirs = await fetch(`http://bases-iremus.huma-num.fr/directus-tcf/items/airs?search=${word}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        let fetchTextesPublies = await fetch(`http://bases-iremus.huma-num.fr/directus-tcf/items/textes_publies?search=${word}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        let fetchEditions = await fetch(`http://bases-iremus.huma-num.fr/directus-tcf/items/editions?search=${word}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        let fetchReferences = await fetch(`http://bases-iremus.huma-num.fr/directus-tcf/items/references_externes?search=${word}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        let fetchThemes = await fetch(`http://bases-iremus.huma-num.fr/directus-tcf/items/themes?search=${word}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        let airs_json = await fetchAirs.json()
        let textes_publies_json = await fetchTextesPublies.json()
        let editions_json = await fetchEditions.json()
        let references_externes_json = await fetchReferences.json()
        let themes_json = await fetchThemes.json()

        return [airs_json, textes_publies_json, editions_json, references_externes_json, themes_json]

    }
    async function research() {
        {console.log(basicSearch)}
        if (!basicSearch) {
            // setQuery(queryBuilder(descriptions, isItContained, and_or, fields))
            if (queryBuilder(descriptions, isItContained, and_or, fields) !== '') {
                setDisplayOn(true)
                console.log(queryBuilder(descriptions, isItContained, and_or, fields))
                fetchDataAdvancedResearch(queryBuilder(descriptions, isItContained, and_or, fields))
            }
        } else {
            // promesses en parallèle

            // convertir les majuscules en minuscules
            let word = basicSearch.toLowerCase()
            console.log('word : ' + word)

            // fetch dans toutes les tables 
            // ordre : airs - textes - editions - references - themes
            const tablesName = ['"airs"', '"textes_publies"', '"editions"', '"references_externes"', '"themes"']
            let tmp = await fetchBasicSearch(word)

            //redéfinir la structure des données
            let dataStructure = '{ "data" : { "items" : {'
            // console.log(tmp[0]['data'])
            for (var i = 0; i < tmp.length; i++) {
                dataStructure += tablesName[i] + ': '
                dataStructure += JSON.stringify(tmp[i]['data'])
                dataStructure += ','
            }
            dataStructure = dataStructure.substring(0, dataStructure.length - 1)
            dataStructure += '}}}'
            setData(JSON.parse(dataStructure))
            setDisplayOn(false)

        }
    }

    return (
        <div className={classes.root}>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={5}
            >
                <Grid item xs={12}>
                    <Typography variant='h4' align='center' className={classes.descriptionTitle} >
                        Entrez un mot que vous souhaitez rechercher.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={0}>
                        <SearchBar
                            value={basicSearch}
                            onChange={handleChangeBasicSearch}
                            style={{
                                margin: '0 auto',
                                maxWidth: 600,
                                // width: "100%",
                                height: "100%"
                            }}
                            placeholder="Rechercher"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6' color='textPrimary' align='center' className={classes.descriptionTitle} >
                        Vous pouvez également réaliser une recherche plus complexe dans le formulaire ci-dessous.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <List
                        className={classes.paper}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={<ListSubheader component="div" id="nested-list-subheader"></ListSubheader>}
                    >
                        <ListItem
                            style={{
                                backgroundColor: 'white',
                                color: 'inherit'
                            }}
                            button
                            onClick={handleClickSearch}
                            selected={false}
                        >
                            <ListItemIcon>
                                <Icon class="fas fa-binoculars" style={{ color: 'inherit' }} />
                            </ListItemIcon>
                            <ListItemText primary="Recherche avancée" />
                            {clickSearch ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>

                        <Collapse in={clickSearch} timeout="auto" unmountOnExit>
                            <Paper className={classes.advancedsearchpaper}>
                                <Typography variant='h6' color='textSecondary' align='justify' style={{ maxWidth: '30%', margin: 10 }}>
                                    Recherche avancée
                                    </Typography>

                                <Box>
                                    <FormControl className={classes.formControl} variant="outlined">    {/* LIGNE DE RECHERCHE 1 */}
                                        <Select
                                            name="fieldA"
                                            value={fields.fieldA}
                                            onChange={handleChangeFields}
                                            defaultValue={'tous'}
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={'tous'}>
                                                <em>N'importe quel champ</em>
                                            </MenuItem>
                                            <MenuItem value={'texte_publie'}>Texte publié</MenuItem>
                                            <MenuItem value={'edition'}>Editions</MenuItem>
                                            <MenuItem value={'air'}>Air</MenuItem>
                                            <MenuItem value={'auteur'}>Auteur</MenuItem>
                                            <MenuItem value={'ville'}>Ville</MenuItem>

                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControlSwitch}>
                                        <FormControlLabel
                                            control={<ColorSwitch checked={isItContained.checkedA} onChange={handleChangeStateA} name="checkedA" />}
                                            label={labelA}
                                        />
                                    </FormControl>
                                    <FormControl className={classes.formControlText}>
                                        <CssTextField
                                            value={descriptions.descriptionA}
                                            name="descriptionA"
                                            id="custom-css-standard-input"
                                            type="search"
                                            variant="outlined"
                                            onChange={handleChangeDescriptions}
                                        />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl className={classes.formControl} variant="outlined">    {/* LIGNE DE RECHERCHE 2 */}
                                        <Select
                                            name="fieldB"
                                            value={fields.fieldB}
                                            onChange={handleChangeFields}
                                            defaultValue={'tous'}
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={'tous'}>
                                                <em>N'importe quel champs</em>
                                            </MenuItem>
                                            <MenuItem value={'texte_publie'}>Texte publié</MenuItem>
                                            <MenuItem value={'edition'}>Editions</MenuItem>
                                            <MenuItem value={'air'}>Air</MenuItem>
                                            <MenuItem value={'auteur'}>Auteur</MenuItem>
                                            <MenuItem value={'ville'}>Ville</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControlSwitch}>
                                        <FormControlLabel
                                            control={<ColorSwitch checked={isItContained.checkedB} onChange={handleChangeStateB} name="checkedB" />}
                                            label={labelB}
                                        />
                                    </FormControl>
                                    <FormControl className={classes.formControlText}>
                                        <CssTextField
                                            value={descriptions.descriptionB}
                                            name="descriptionB"
                                            id="custom-css-standard-input"
                                            type="search"
                                            variant="outlined"
                                            onChange={handleChangeDescriptions}
                                        />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl className={classes.formControl} variant="outlined">    {/* LIGNE DE RECHERCHE 3 */}
                                        <Select
                                            name="fieldC"
                                            value={fields.fieldC}
                                            onChange={handleChangeFields}
                                            defaultValue={'tous'}
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={'tous'}>
                                                <em>N'importe quel champs</em>
                                            </MenuItem>
                                            <MenuItem value={'texte_publie'}>Texte publié</MenuItem>
                                            <MenuItem value={'edition'}>Editions</MenuItem>
                                            <MenuItem value={'air'}>Air</MenuItem>
                                            <MenuItem value={'auteur'}>Auteur</MenuItem>
                                            <MenuItem value={'ville'}>Ville</MenuItem>

                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControlSwitch}>
                                        <FormControlLabel
                                            control={<ColorSwitch checked={isItContained.checkedC} onChange={handleChangeStateC} name="checkedC" />}
                                            label={labelC}
                                        />
                                    </FormControl>
                                    <FormControl className={classes.formControlText}>
                                        <CssTextField
                                            value={descriptions.descriptionC}
                                            name="descriptionC"
                                            id="custom-css-standard-input"
                                            type="search"
                                            variant="outlined"
                                            onChange={handleChangeDescriptions}
                                        />
                                    </FormControl>
                                </Box>
                                <Box align="justify">
                                    <FormControl className={classes.formControlAndoR} variant="outlined">
                                        <Select
                                            value={and_or}
                                            onChange={handleChange_and_or}
                                            name="and_or"
                                            className={classes.selectEmptyAndOr}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={'Et'}>Et</MenuItem>
                                            <MenuItem value={'Ou'}>Ou</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography variant='subtitle2' color='textSecondary' align='justify' style={{ maxWidth: '30%', margin: 10 }}>
                                        (Choisir entre une adjonction 'Et' ou une conjonction 'Ou')
                                    </Typography>
                                </Box>
                            </Paper>
                        </Collapse>
                    </List>
                </Grid>
            </Grid>

            {!displayOn ? (
                <Box pt={5} pb={5} textAlign='center' className={classes.researchBox}>
                    <ColorButton
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<i class="fas fa-search" />}
                        onClick={() => research()}
                    >
                        Rechercher
                        </ColorButton>
                </Box>

            ) : (
                    <Box textAlign='center' pt={5} pb={5} >
                        <BorderLinearProgress className={classes.linearProgress} />
                    </Box>
                )}
            {
                data.length !== 0 && (
                    // <Link to={{
                    //     pathname: '/resultats',
                    //     state: {
                    //         res : data
                    //     }
                    // }}
                    // >
                    // </Link>
                    < Results res={data} />

                )}
        </div >
    )
}

export default withRouter(Rechercher)
