import React, { useEffect, useState } from 'react'
import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';
import clsx from 'clsx';

import ForceAtlas2 from 'react-sigma/lib/ForceAtlas2';

const useStyles = makeStyles((theme) => ({
  paperBrown: {
    maxWidth: '80%',
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    textAlign: 'justify',
    backgroundColor: '#AC8E7A',
    color: 'white',
  },
  paperWhite: {
    maxWidth: '80%',
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '80%',
    backgroundColor: 'white',
    color: 'black',
  },
  shape_air: {
    backgroundColor: '#B1D3DD',
    width: 40,
    height: 40,
  },
  shape_textes_publies: {
    backgroundColor: '#B2DA82',
    width: 40,
    height: 40,
  },
  shape_editions: {
    backgroundColor: '#80624D',
    width: 40,
    height: 40,
  },
  shape_references: {
    backgroundColor: '#FFC300',
    width: 40,
    height: 40,
  },
  shape_themes: {
    backgroundColor: '#FF5733',
    width: 40,
    height: 40,
  },
  shapeCircle: {
    borderRadius: '50%',
  },
  legend: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}))

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
function Visualisation({ history, match }) {
  const classes = useStyles();

  // const [data, setData] = useState([])
  const [dataInter, setDataInter] = useState([])
  const [dataTransformed, setDataTransformation] = useState([])
  const [displayGraph, setDisplayGraph] = useState(false)
  const [clickedData, setClickedData] = useState([])

  const query = `{
      airs(limit: 1000) {
        id
        sources_musicales
        air_normalise
        surnom_1
        textes_publies {
            textes_publies {
                id
                titre
            }
        }
      }
      references_externes(limit: 1000) {
        id
        lien
        titre
        annee
        editeur
        auteur
      }
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
      }
      themes(limit: 1000) {
        theme
        type
        id
      }
      editions(limit: 1000) {
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
      timbres(limit: 1000) {
        id
        airs {
          id
        }
        textes_publies {
          id
        }
      }
      airs_references_externes(limit: 1000) {
        id
        airs{
          id
        }
        references_externes(limit: 1000) {
          id
        }
      }
      editions_references_externes(limit: 1000) {
        id
        editions {
          id
        }
        references_externes {
          id
        }
      }
      textes_publies_references_externes(limit: 1000) {
        id
        textes_publies {
          id
        }
        references_externes {
          id
        }
      }
      textes_publies_themes(limit: 1000) {
        id
        textes_publies {
          id
        }
        themes {
          id
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
      // setData(j)
      transformData(j)
      setDisplayGraph(true)

    })()
  }, [query])

  async function transformData(json) {
    let res = ''
    let initialStr = JSON.stringify(json)
    let finalStr = initialStr.slice(9, initialStr.length - 2)
    if (finalStr !== '') {
      var d = JSON.parse('{' + finalStr + '}')
      setDataInter(d)
      const color = ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D']
      // Les NODES sont les tables suivantes :
      // airs - textes_publies - references_externes - themes - editions
      let nodes = ['airs', 'textes_publies', 'references_externes', 'themes', 'editions']
      res = res.concat('{ "nodes" : [ ')
      for (var n = 0; n < nodes.length; n++) {
        for (var i = 0; i < d[nodes[n]].length; i++) {
          if (nodes[n] === 'airs') {
            res = res.concat('{ "id" : "airs__' + d[nodes[n]][i]['id'] + '", "label" : "' + d[nodes[n]][i]['air_normalise'] + '", "color" : "' + color[n] + '" }')
          }
          if (nodes[n] === 'textes_publies') {
            res = res.concat('{ "id" : "textes_publies__' + d[nodes[n]][i]['id'] + '", "label" : "' + d[nodes[n]][i]['titre'] + '", "color" : "' + color[n] + '" }')
          }
          if (nodes[n] === 'references_externes') {
            res = res.concat('{ "id" : "references_externes__' + d[nodes[n]][i]['id'] + '", "label" : "' + d[nodes[n]][i]['titre'] + '", "color" : "' + color[n] + '" }')
          }
          if (nodes[n] === 'themes') {
            res = res.concat('{ "id" : "themes__' + d[nodes[n]][i]['id'] + '", "label" : "' + d[nodes[n]][i]['theme'] + '", "color" : "' + color[n] + '" }')
          }
          if (nodes[n] === 'editions') {
            res = res.concat('{ "id" : "editions__' + d[nodes[n]][i]['id'] + '", "label" : "' + d[nodes[n]][i]['titre_ouvrage'] + '", "color" : "' + color[n] + '" }')
          }
          if (i !== d[nodes[n]].length) {
            res = res.concat(', ')
          }
          // console.log(d[nodes[n]][i]['id']) //affiche tous les id de toutes les tables 'nodes'
        }
      }
      res = res.substring(0, res.length - 2)
      // Les LINKS sont les
      // timbres - airs_references_externes - exemplaires_references_externes - textes_publies_references_exter - textes_publies_themes
      let links = ['timbres', 'airs_references_externes', 'editions_references_externes', 'textes_publies_references_externes', 'textes_publies_themes']
      res = res.concat('], "edges" : [')

      for (var l = 0; l < links.length; l++) {
        for (i = 0; i < d[links[l]].length; i++) {
          if (links[l] === 'timbres') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "airs__' + d[links[l]][i]['airs']['id'] + '", "target" : "textes_publies__' + d[links[l]][i]['textes_publies']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'airs_references_externes') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "airs__' + d[links[l]][i]['airs']['id'] + '", "target" : "references_externes__' + d[links[l]][i]['references_externes']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'editions_references_externes') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "editions__' + d[links[l]][i]['editions']['id'] + '", "target" : "references_externes__' + d[links[l]][i]['references_externes']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'textes_publies_references_externes') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "textes_publies__' + d[links[l]][i]['textes_publies']['id'] + '", "target" : "references_externes__' + d[links[l]][i]['references_externes']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'textes_publies_themes') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "textes_publies__' + d[links[l]][i]['textes_publies']['id'] + '", "target" : "themes__' + d[links[l]][i]['themes']['id'] + '", "color" : "#CFCFCF" }, ')
          }
        }
      }
      // Il faut maintenant relier les textes à leur exemplaire respectif, on invente une id pour ces liens 
      for (var e = 0; e < d[nodes[1]].length; e++) {
        res = res.concat('{ "id" : "' + e + '", "source" : "textes_publies__' + d[nodes[1]][e]['id'] + '", "target" : "editions__' + d[nodes[1]][e]['edition']['id'] + '", "color" : "#CFCFCF" }, ')
      }
      res = res.substring(0, res.length - 2)
      res = res.concat(']}')
      let res_json = JSON.parse(res)
      setDataTransformation(res_json)
      // console.log(res)
      // console.log(res_json)

    }
  }
  const circle_air = <div className={clsx(classes.shape_air, classes.shapeCircle)} />;
  const circle_textes_publies = <div className={clsx(classes.shape_textes_publies, classes.shapeCircle)} />;
  const circle_editions = <div className={clsx(classes.shape_editions, classes.shapeCircle)} />;
  const circle_references = <div className={clsx(classes.shape_references, classes.shapeCircle)} />;
  const circle_themes = <div className={clsx(classes.shape_themes, classes.shapeCircle)} />;

  function getRedirected() {
    let nodes = ['airs', 'textes_publies', 'references_externes', 'themes', 'editions']

    let table = clickedData[0].split('__')[0]

    switch (table) {
      case nodes[0]:
        history.push('/single_air/' + clickedData[0].split('__')[1])
        break
      case nodes[1]:
        history.push('/single_texte_publie/' + clickedData[0].split('__')[1])
        break
      case nodes[2]:
        history.push('/single_reference/' + clickedData[0].split('__')[1])
        break
      case nodes[3]:
        history.push('/single_theme/' + clickedData[0].split('__')[1])
        break
      case nodes[4]:
        history.push('/single_edition/' + clickedData[0].split('__')[1])
        break
    }
  }

  return (
    <div>
      {displayGraph ? (
        <Grid container spacing={2}
          direction="row"
          justify="center"
          alignItems="justify" >
          <Grid item xs={5}>
            <Paper elevation={3} className={classes.paperBrown}>
              Légende du graphe
            </Paper>
            <Paper elevation={3} className={classes.paperWhite}>

              <List className={classes.root}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {circle_air}
                    </Avatar>
                  </ListItemAvatar>
                  {/* {console.log(dataInter)} */}
                  <ListItemText primary="Airs" secondary={dataInter['airs'].length + " élément"} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {circle_textes_publies}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Textes publiés" secondary={dataInter['textes_publies'].length + " éléments"} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {circle_editions}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Editions" secondary={dataInter['editions'].length + " éléments"} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {circle_references}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Références" secondary={dataInter['references_externes'].length + " éléments"} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {circle_themes}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Thèmes" secondary={dataInter['themes'].length + " éléments"} />
                </ListItem>
              </List>
            </Paper>

          </Grid>
          <Grid item xs>{/* col 2 */}
            <Sigma
              graph={dataTransformed}
              settings={{ drawEdges: true, clone: false, zoomMax: 1.5 }}
              style={{
                height: '595px',
                maxWidth: 'inherit'
              }}
              onClickNode={e => {
                setClickedData([e.data.node.id, e.data.node.label])
              }
              }
            >
              <RandomizeNodePositions>
                <ForceAtlas2
                  iterationsPerRender={1}
                  linLogMode
                  timeout={1000}
                  worker
                />
                <RelativeSize initialSize={15} />
              </RandomizeNodePositions>
            </Sigma>
          </Grid>
        </Grid>
      ) : (

          <Box
            display="flex"
            width='100%'
            height='100%'
            bgcolor="white"
            alignItems="center"
            justifyContent="center"
            pt={40}
            pb={40}
          >
            <FacebookCircularProgress classes={{
              circle: classes.circle,
            }} />
          </Box>

        )}
      <Box
        pb={20}
      >
        <Grid container spacing={2}
          direction="row"
          justify="right"
          alignItems="justify" >
          <Grid item xs={5}>
            <Paper elevation={3} className={classes.paperBrown}>
              Description de l'objet sélectionné
            </Paper>
            <Paper elevation={3} className={classes.paperWhite}>
              {clickedData.length === 0 ? (
                <i>Aucune donnée sélectionnée</i>
              ) : (
                  <>
                    <Grid container spacing={2}
                      direction="row"
                      justify="right"
                      alignItems="justify" >
                      <Grid item xs={8}>
                        <Box pb={2}>
                          {clickedData[0].split('__')[0] === 'airs' && (<ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                {circle_air}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Airs"/>
                          </ListItem>
                          )}
                          {clickedData[0].split('__')[0] === 'textes_publies' && (<ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                {circle_textes_publies}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Textes publiés"/>
                          </ListItem>
                          )}
                          {clickedData[0].split('__')[0] === 'editions' && (<ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                {circle_editions}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Editions"/>
                          </ListItem>
                          )}
                          {clickedData[0].split('__')[0] === 'references_externes' && (<ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                {circle_references}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Références externes"/>
                          </ListItem>
                          )}
                          {clickedData[0].split('__')[0] === 'themes' && (<ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                {circle_themes}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Thèmes"/>
                          </ListItem>
                          )}
                        </Box>
                        <Typography variant='subtitle2' color='textSecondary' align='left'>
                          Identifiant :
                        </Typography>
                        <Typography variant='body1' color='textPrimary' align='left'>
                          {clickedData[0].split('__')[1]}
                        </Typography>
                        <Box pb={2} />
                        <Typography variant='body1' color='textPrimary' align='left'>
                          <i>{clickedData[1]}</i>
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Button variant="contained" onClick={() => getRedirected()}>Consulter</Button>
                      </Grid>
                    </Grid>
                  </>
                )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div >
  )
}

export default withRouter(Visualisation)
