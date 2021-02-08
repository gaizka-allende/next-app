import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {InView} from 'react-intersection-observer';

import { fetchTracks, selectResults  } from "./searchSlice";
//import styles from "./Search.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '100px 0px',
    flexGrow: 1,
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '700px'
  },
  table: {
    minWidth: 650,
  }
}));


export function Search() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const results = useSelector(selectResults);
  const [partialResults, setPartialResults] = useState<number | undefined>(undefined);
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    if (results) {
      if (!partialResults) {
        setPartialResults(results.length / 5); 
      }
    }
  },[results, partialResults]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              id="standard-full-width"
              style={{ margin: 8 }}
              placeholder="Search for an artist, album or song"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {setSearchValue(e.target.value)}}
              value={searchValue}
            />
          </Grid>
          <Grid item xs={4}>
          <Button 
            onClick={() => dispatch(fetchTracks(searchValue))}
            variant="contained" 
            color="primary" 
            disabled={searchValue === ''}>
              Search
            </Button>
          </Grid>
          {
            !!(partialResults !== undefined && partialResults === 0) && (
              <Typography variant="h5" gutterBottom>
                No results
              </Typography>
            )
          }
          { !!(partialResults !== undefined  && partialResults > 0) && (
            <>
              <Grid item xs={12}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Kind</TableCell>
                      <TableCell align="right">Artist name</TableCell>
                      <TableCell align="right">Track name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { results !== undefined && results.slice(0, partialResults).map((row) => (
                      <TableRow key={row.trackId}>
                        <TableCell component="th" scope="row">
                          {row.kind}
                        </TableCell>
                        <TableCell align="right">{row.artistName}</TableCell>
                        <TableCell align="right">{row.trackName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12}>
                <InView onChange={(inView: boolean) => {
                  if (inView) {
                    setPartialResults(partialResults + partialResults);
                  }
                }}><div/></InView>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </div>
  );
}
