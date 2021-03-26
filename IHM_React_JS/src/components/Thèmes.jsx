import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table'
import CircularProgress from '@material-ui/core/CircularProgress';

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


function Themes() {
    const classes = useStyles();
    const [data, setData] = useState([])

    const query = `{
        items {
          themes {
            id
            theme
            type
          }
        }
      }
      `

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
            setData(j)
        })()
    }, [query])

    function dataThemes() {
        let res = []
        let initialStr = JSON.stringify(data)
        let finalStr = initialStr.slice(27, initialStr.length - 3)
        console.log(finalStr)
        console.log(finalStr)
        if (finalStr !== '') {
            res = JSON.parse(finalStr)
            return res
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
                            { title: 'Description', field: 'theme' },
                            { title: 'Catégorie', field: 'type' },
                        ]}
                        data={dataThemes()}
                        title={dataThemes() ? ("Thèmes - " + dataThemes().length + " résultats") : ('Thèmes')}
                        options={{
                            filtering: true,
                            rowStyle: rowData => ({
                                filtering: true,
                            }),
                            headerStyle: {
                                backgroundColor: '#AC8E7A',
                                color: '#FFF'
                            },
                        }}
                    />
                </div>
            </Grid>
        </Grid>
    )
}

export default withRouter(Themes)
