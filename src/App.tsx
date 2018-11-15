import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { green, indigo } from '@material-ui/core/colors';
import { createMuiTheme,
         MuiThemeProvider,
         Theme,
         withStyles,
         createStyles,
         WithStyles,
        } from '@material-ui/core/styles';
import * as React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import Sensors from './container/Sensors';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: green,
    type: 'dark',
  },
});

interface AppStyles {
  container: CSSProperties;
  status: CSSProperties;
}

const styles = (theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  status: {
    width: '100%',
    margin: theme.spacing.unit,
  },
} as AppStyles);

class App extends React.Component<WithStyles<keyof AppStyles>> {
  public render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
          <Typography variant="h6" color="inherit" >
            Myriad viewer
          </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          <Sensors />
        </div>
      </MuiThemeProvider>
    );
  }
}
export default withStyles(styles)(App);
