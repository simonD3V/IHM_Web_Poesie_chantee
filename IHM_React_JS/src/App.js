import React, { useState } from 'react'
import clsx from 'clsx';
import { Router, Switch, Route, Link } from 'react-router-dom'
import { Box, Button, AppBar, Toolbar } from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import Airs from './components/Airs'
import Home from './components/Home'
import Exemplaires from './components/Exemplaires'
import Textes_publiés from './components/Textes_publiés'
import Thèmes from './components/Thèmes'
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Footer from './components/Footer';
import Rechercher from './components/Rechercher';
import Visualisation from './components/Visualisation';
import SingleExemplaire from './components/dataSheet/SingleExemplaire';
import References from './components/Références'
import SingleTextePublie from './components/dataSheet/SingleTextePublie';
import SingleReference from './components/dataSheet/SingleReference';
import SingleAir from './components/dataSheet/SingleAir';
import history from "./components/history";
import Results from './components/research/Results';
import TestFormeLitteraire from "./components/testFormeLitteraire/TestFormeLitteraire"

const useStyles = makeStyles((theme) => ({
    right_icons: {
        position: 'relative',
    },
    bar: {
        flexWrap: 'wrap',
        justifyContent: 'flex',
        '& a': {
            margin: '0 5px',
        },
        flexGrow: 1,
    },
    appBar: {
        position: "sticky",
        background: "#80624D", //'#C72C2C',
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'center',
    }
}));

function App() {
    const [state, setState] = useState({
        right: false,
    })
    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem>
                    <Box m="auto">
                        <Typography color="inherit" className={classes.drawerHeader} variant='body1' color='textSecondary' align="center">
                            Consulter les tables
                        </Typography>
                    </Box>
                </ListItem>
                <Divider />
                <ListItem>
                    <Button color='inherit'
                        component={Link}
                        to='/airs'
                        startIcon={<i class="fas fa-music"></i>}>
                        Airs
                    </Button>
                </ListItem>

                <ListItem>
                    <Button
                        color='inherit'
                        aria-label='home'
                        component={Link}
                        to='/exemplaires'
                        startIcon={< i class="fas fa-book" > </i>}>
                        Exemplaires
                    </Button>
                </ListItem>
                <ListItem>
                    <Button
                        color='inherit'
                        aria-label='home'
                        component={Link}
                        to='/textes_publies'
                        startIcon={< i class="fas fa-feather" > </i>}>
                        Textes publiés
                    </Button>
                </ListItem>
                <ListItem>
                    <Button
                        color='inherit'
                        aria-label='home'
                        component={Link}
                        to='/themes'
                        startIcon={< i class="fas fa-tags" > </i>}>
                        Thèmes
                    </Button>
                </ListItem>
                <ListItem>
                    <Button
                        color='inherit'
                        aria-label='home'
                        component={Link}
                        to='/references'
                        startIcon={<i class="fas fa-book-open"></i>}>
                        Références
                    </Button>
                </ListItem>
            </List>
        </div>
    );

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const classes = useStyles()
    return (
        <Router basename='/' history={history}>
            <AppBar position='fixed'
                className={classes.appBar} >
                <Toolbar>
                    <Button className={classes.right_icons}
                        color='inherit'
                        aria-label='home'
                        component={Link}
                        to='/'
                        startIcon={<HomeIcon />}>
                    </Button>
                    <Typography type="title" variant="button" color="inherit" className={classes.bar}>
                        Accueil
                    </Typography>
                    <React.Fragment>
                        <Button className={classes.right_icons}
                            color='inherit'
                            aria-label='consulter'
                            startIcon={<i class="far fa-eye"></i>}
                            onClick={toggleDrawer('right', true)} >
                            Consulter
                        </Button>
                        <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
                            {list('right')}
                        </Drawer>
                    </React.Fragment>
                    <Button className={classes.right_icons}
                        color='inherit'
                        aria-label='search'
                        component={Link}
                        to='/rechercher'
                        startIcon={<i class="fas fa-search"></i>} >
                        Rechercher
                    </Button>
                    <Button className={classes.right_icons}
                        color='inherit'
                        aria-label='visualization'
                        component={Link}
                        to='/visualisation'
                        startIcon={<i class="fas fa-chart-bar"></i>}>
                        Visualisation
                    </Button>
                    <Button className={classes.right_icons}
                        color='inherit'
                        aria-label='testFormeLitteraire'
                        component={Link}
                        to='/testFormeLitteraire'
                        startIcon={<i class="fas fa-pencil-alt"></i>}>
                        Structures poétiques
                    </Button>
                </Toolbar>
            </AppBar>
            <Box m={2} />

            <div >
                <Switch >
                    <Route exact path='/' children={Home} />
                    <Route path='/airs' children={Airs} />
                    <Route path='/exemplaires' children={Exemplaires} />
                    <Route path='/textes_publies' children={Textes_publiés} />
                    <Route path='/themes' children={Thèmes} />
                    <Route path='/references' children={References} />

                    <Route path='/single_exemplaire/:id' children={SingleExemplaire} />
                    <Route path='/single_texte_publie/:id' children={SingleTextePublie} />
                    <Route path='/single_reference/:id' children={SingleReference} />
                    <Route path='/single_air/:id' children={SingleAir} />
                    
                    <Route path='/rechercher' children={Rechercher} />
                    <Route path='/resultats' children={Results} />

                    <Route path='/visualisation' children={Visualisation} />

                    <Route path='/testFormeLitteraire' children={TestFormeLitteraire} />
                </Switch>
            </div>
            <Footer />
        </Router >


    )
}

export default App