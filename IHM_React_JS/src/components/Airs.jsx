import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import CircularProgress from '@material-ui/core/CircularProgress';
import history from './history'

//icons
import { forwardRef } from 'react';

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


function Airs() {
    const classes = useStyles();

    const [data, setData] = useState([])

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

    function dataAirs() {
        let res = []
        let initialStr = JSON.stringify(data)
        let finalStr = initialStr.slice(16, initialStr.length - 2)
        if (finalStr !== '') {
            res = JSON.parse(finalStr)
            console.log(res)
            return res
        }
    }

    function getTheTextUUID(rowData) {
        let l = rowData["textes_publies"].length
        let liste_name_textes = []
        for (var i = 0; i < l; i++) {
            if (rowData['textes_publies'][i].hasOwnProperty('textes_publies')) {
                if ((rowData['textes_publies'][i]['textes_publies'] !== null)) {
                    if (rowData['textes_publies'][i]['textes_publies']['titre'] !== "") {
                        liste_name_textes.push(rowData["textes_publies"][i]["textes_publies"]["titre"])
                    }
                    else {
                        liste_name_textes.push("Sans titre")
                    }
                }
            }
        }
        return String(liste_name_textes)
    };


    return (
        <Grid container spacing={2}
            direction="row"
            justify="center"
            alignItems="center">
            <Grid item xs={12} >
                <Typography variant='h5' align='center'>
                    Projet Timbres : 'Airs'
                </Typography>
                <Typography variant='body1' color='textSecondary' align='center'>
                    Description de la table des airs
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
                            { title: 'Sources musicales', field: 'sources_musicales' },
                            { title: 'Nom air', field: 'air_normalise' },
                            { title: 'Surnom', field: 'surnom_1' },
                            { title: 'Titre des textes liés', field: 'textes_publies', render: rowData => getTheTextUUID(rowData) }
                        ]}
                        data={dataAirs()}
                        title={dataAirs() ? ("Airs - " + dataAirs().length + " résultats") : ('Airs')}
                        onRowClick={((evt, selectedRow) => {
                            if (evt.target.nodeName === 'TD') {
                                const selected_id = selectedRow['id']
                                history.push('/single_air/' + selected_id)
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

export default withRouter(Airs)
