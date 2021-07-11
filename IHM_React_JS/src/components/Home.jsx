import { Avatar, Chip } from '@material-ui/core'
import { Box } from '@material-ui/core'
import { Container } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { List } from '@material-ui/core'
import { ListItem } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'
import { ListItemAvatar } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles'
import { DeveloperMode as DeveloperModeIcon } from '@material-ui/icons'
import React from 'react'
import { withRouter } from 'react-router'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexGrow: 1,
  },
  list: {
    margin: 0,
    padding: 0,
    '& li': {
      margin: 0,
      marginLeft: theme.spacing(5),
      padding: 0
    },
  },
  list1: {
    margin: 0,
    padding: 0,
    '& li': {
      margin: 0,
      marginLeft: theme.spacing(30),
      padding: 0
    },
  },
  référence: {
    // borderBottom: '1px solid gray',
    // borderLeft: 'none',
    // borderRight: 'none',
    // borderTop: '1px solid gray',
    margin: 'auto',
    textAlign: 'justify',
    width: '50%'
  },
  exemple: {
    margin: 'auto',
    textAlign: 'center',
    width: '70%',
    padding: 20,
  },
  definition: {
    borderBottom: '1px solid gray',
    // borderLeft: '1px solid gray',
    // borderRight: '1px solid gray',
    // borderTop: '1px solid gray',
    margin: 'auto',
    textAlign: 'center',
    width: '70%',
    padding: 20,
  },
  CNRTL: {
    margin: 'auto',
    textAlign: 'right',
    width: '70%',
  },
  img: {
    position: 'relative',
    maxWidth: '100%',
  },
  font: {
    position: "absolute",
    top: "1%",
    width: "100%",
    textAlign: "left",
    margin: 15,
    color: "white",
    backgroundColor: "none",
    fontFamily: "Segoe UI",
  },
  legend: {
    position: "absolute",
    top: "87%",
    width: "100%",
    textAlign: "right",
    color: "white",
    backgroundColor: "none",
    fontFamily: "Segoe UI",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  cards: {
    marginLeft: 10,
  },
  chipA: {
    color: "white",
    backgroundColor: "#80624D",
  },
  chipB: {
    color: "white",
    backgroundColor: "#CFAB92",
  },
  chipC: {
    color: "white",
    backgroundColor: "#AC8E7A",
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    padding: 20,
  },
}))

const theme = createMuiTheme({
  typography: {
    citation: {
      fontFamily: '"Helvetica Neue"',
    },
  }
})
function Home() {
  const classes = useStyles()
  return (
    <Container maxWidth='lg'>
      <Box pt={5} pb={5}>
        <Card className={classes.img}>
          <CardMedia
            component="img"
            alt="painting"
            height="700"
            image="/images/luth_chanteur2.jpg"
            title="« Joueur de luth » par Caravaggio"
          />
          <Typography className={classes.font} gutterBottom variant="h1" component="h2">
            <i>Sur l'air de ...</i>
          </Typography>
          <Typography className={classes.legend} variant="body2" color="textSecondary" component="p">
            “Joueur de luth,” huile sur toile par Caravaggio 1595-1596, The new Hermitage, Russie.
          </Typography>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              Base de données de timbres du XVIe siècle
            </Typography>
          </CardContent>

        </Card>
      </Box>
      <Box pt={0} pb={10}>
        <ThemeProvider theme={theme}>
          <Typography variant='h4' color='textSecondary' className={classes.exemple}>
            <i>
              Il trouvait des motifs d'un style franc, facile, naïf, que l'on a popularisés en en faisant des « timbres ».
          </i>
          </Typography>
        </ThemeProvider>
        <Typography color='textSecondary' className={classes.CNRTL}>
          <i>
            Pesquidoux, Le Livre de raison, 1925, p. 127
          </i>
        </Typography>
      </Box>
      <Box pt={0} pb={10}>
        <Typography variant='h6' pb={5} color='inherit' component='h5' align='center' className={classes.definition}>
          <b>Timbre</b> : Motif ou air connu sur lequel on ajoute un texte, pour créer une nouvelle chanson.
        </Typography>
        <Typography color='textSecondary' className={classes.CNRTL}>
          <i>
            Définition CNRTL
          </i>
        </Typography>
      </Box>
      <Box pt={0} pb={0}>
        <Typography variant='subtitle1'>
          Suggestions de recherche
        </Typography>
      </Box>
      <Box pt={0} pb={5}>
        <Typography variant='h6' padding={3}>
          Par villes :
        </Typography>
      </Box>
      <Box pt={0} pb={5}>
        <Grid
          container
          spacing={4}
          className={classes.gridContainer}
          justify="center"
        >
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.cards} variant="outlined">
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="painting"
                  height="200"
                  image="/images/paris.jpg"
                  title="Paris"
                />
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Paris
                    </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.cards} variant="outlined">
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="painting"
                  height="200"
                  image="/images/lyon.jpg"
                  title="Lyon"
                />
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Lyon
                    </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.cards} variant="outlined">
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="painting"
                  height="200"
                  image="/images/bordeaux.jpg"
                  title="Bordeaux"
                />
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Bordeaux
                    </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card />
          </Grid>
        </Grid>
        <Typography variant='h6'>
          Par thèmes :
        </Typography>
        <div className={classes.chips}>
          <Chip className={classes.chipA} label="Amour" />
          <Chip className={classes.chipB} label="Guerre" />
          <Chip className={classes.chipC} label="Fête" />
          <Chip className={classes.chipA} label="Siège" />
          <Chip className={classes.chipB} label="Duc d'Anjou" />
          <Chip className={classes.chipC} label="Crime" />
          <Chip className={classes.chipA} label="Issoire" />
          <Chip className={classes.chipB} label="Lettre" />
          <Chip className={classes.chipC} label="Fleur" />
          <Chip className={classes.chipA} label="Mignonne" />
          <Chip className={classes.chipB} label="Belle" />
        </div>
      </Box>
      <Grid container className={classes.gridContainer} spacing={10} alignContent='center'>
        <Grid item xs={true}>
          <List className={classes.list1}>
            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <SearchIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Responsable scientifique' secondary='Alice TACAILLE' />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={true}>
          <List className={classes.list}>
            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <DeveloperModeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Modélisation & développement logiciel'
                secondary='Simon DEVAUCHELLE + Thomas BOTTINI'
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <Box pt={10} pb={10}>
        <Typography variant='h5' component='h2' align='center'>
          Citer cette base
        </Typography>
        <Typography color='textSecondary' className={classes.référence}>
          Tacaille, A (2020, Juillet). Timbres [Base
          de données]. Consultée le {new Date().toLocaleDateString('fr-FR')}. Institut de Recherche
          en Musicologie — IReMus UMR 8223 CNRS. http://data-iremus.huma-num.fr/musrad30/
        </Typography>
      </Box>
    </Container>
  )
}

export default withRouter(Home)
