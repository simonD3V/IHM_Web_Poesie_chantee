import React, { useEffect, useState } from 'react'
import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
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
  shape_exemplaires: {
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
function Visualisation() {
  const classes = useStyles();

  // const [data, setData] = useState([])
  const [dataInter, setDataInter] = useState([])
  const [dataTransformed, setDataTransformation] = useState([])
  const [displayGraph, setDisplayGraph] = useState(false)

  const query = `{
    items {
      airs {
        id
      }
      references_externes {
        id
      }
      textes_publies {
        id
        exemplaires_id {
          id
        }
      }
      themes {
        id
      }
      exemplaires {
        id
      }
      timbres {
        id
        airs_id {
          id
        }
        textes_publies_id {
          id
        }
      }
      airs_references_externes {
        id
        airs_id {
          id
        }
        references_externes_id {
          id
        }
      }
      exemplaires_references_externes {
        id
        exemplaires_id {
          id
        }
        references_externes_id {
          id
        }
      }
      textes_publies_references_exter {
        id
        textes_publies_id {
          id
        }
        references_externes_id {
          id
        }
      }
      textes_publies_themes {
        id
        textes_publies_id {
          id
        }
        themes_id {
          id
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
      // setData(j)
      transformData(j)
      setDisplayGraph(true)

    })()
  }, [query])

  async function transformData(json) {
    let res = ''
    let initialStr = JSON.stringify(json)
    let finalStr = initialStr.slice(17, initialStr.length - 2)
    if (finalStr !== '') {
      var d = JSON.parse(finalStr)
      setDataInter(d)
      const color = ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D']
      // Les NODES sont les tables suivantes :
      // airs - textes_publies - references_externes - themes - exemplaires
      let nodes = ['airs', 'textes_publies', 'references_externes', 'themes', 'exemplaires']
      res = res.concat('{ "nodes" : [ ')
      for (var n = 0; n < nodes.length; n++) {
        for (var i = 0; i < d[nodes[n]].length; i++) {
          res = res.concat('{ "id" : "' + d[nodes[n]][i]['id'] + '", "label" : "' + d[nodes[n]][i]['id'] + '", "color" : "' + color[n] + '" }')
          if (i !== d[nodes[n]].length) {
            res = res.concat(', ')
          }
          // console.log(d[nodes[n]][i]['id']) //affiche tous les id de toutes les tables 'nodes'
        }
      }
      res = res.substring(0, res.length - 2)

      // Les LINKS sont les
      // timbres - airs_references_externes - exemplaires_references_externes - textes_publies_references_exter - textes_publies_themes
      let links = ['timbres', 'airs_references_externes', 'exemplaires_references_externes', 'textes_publies_references_exter', 'textes_publies_themes']
      res = res.concat('], "edges" : [')
      for (var l = 0; l < links.length; l++) {
        for (i = 0; i < d[links[l]].length; i++) {
          if (links[l] === 'timbres') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "' + d[links[l]][i]['airs_id']['id'] + '", "target" : "' + d[links[l]][i]['textes_publies_id']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'airs_references_externes') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "' + d[links[l]][i]['airs_id']['id'] + '", "target" : "' + d[links[l]][i]['references_externes_id']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'exemplaires_references_externes') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "' + d[links[l]][i]['exemplaires_id']['id'] + '", "target" : "' + d[links[l]][i]['references_externes_id']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'textes_publies_references_exter') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "' + d[links[l]][i]['textes_publies_id']['id'] + '", "target" : "' + d[links[l]][i]['references_externes_id']['id'] + '", "color" : "#CFCFCF" }, ')
          }
          if (links[l] === 'textes_publies_themes') {
            res = res.concat('{ "id" : "' + d[links[l]][i]['id'] + '", "source" : "' + d[links[l]][i]['textes_publies_id']['id'] + '", "target" : "' + d[links[l]][i]['themes_id']['id'] + '", "color" : "#CFCFCF" }, ')
          }
        }
      }
      // Il faut maintenant relier les textes à leur exemplaire respectif, on invente une id pour ces liens 
      for (var e = 0; e < d[nodes[1]].length; e++) {
        res = res.concat('{ "id" : "' + e + '", "source" : "' + d[nodes[1]][e]['id'] + '", "target" : "' + d[nodes[1]][e]['exemplaires_id']['id'] + '", "color" : "#CFCFCF" }, ')
      }
      res = res.substring(0, res.length - 2)
      res = res.concat(']}')
      let res_json = JSON.parse(res)
      setDataTransformation(res_json)
      console.log(res)
      console.log(res_json)

    }
  }
  const circle_air = <div className={clsx(classes.shape_air, classes.shapeCircle)} />;
  const circle_textes_publies = <div className={clsx(classes.shape_textes_publies, classes.shapeCircle)} />;
  const circle_exemplaires = <div className={clsx(classes.shape_exemplaires, classes.shapeCircle)} />;
  const circle_references = <div className={clsx(classes.shape_references, classes.shapeCircle)} />;
  const circle_themes = <div className={clsx(classes.shape_themes, classes.shapeCircle)} />;

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
                  {console.log(dataInter)}
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
                      {circle_exemplaires}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Exemplaires" secondary={dataInter['exemplaires'].length + " éléments"} />
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
              settings={{ drawEdges: true, clone: false }}
              style={{
                height: '595px',
                maxWidth: 'inherit'
              }}
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
    </div >
  )
}

export default withRouter(Visualisation)
