import { Theme,
         withStyles,
         createStyles,
         WithStyles,
        } from '@material-ui/core/styles';
import * as React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { inject } from 'src/TypedStateStore/inject';
import { getState,  IStore, IActions, getActions } from '../../store';
import { Card, CardHeader, Avatar, Typography, CardContent } from '@material-ui/core';
import { sensorViewList, SensorView, createTimeStamp } from './constants';
import { BaseParam, Sensors } from 'src/store/store';

interface AppStyles {
  container: CSSProperties;
  root: CSSProperties;
  card: CSSProperties;
  status: CSSProperties;
  statusText: CSSProperties;
}

const styles = (theme: Theme) => createStyles({
  container: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 300px)',
    gridGap: '0.8em',
    justifyContent: 'center',
  },
  card: {
    minWidth: 200,
    margin: theme.spacing.unit * 2,
  },
  status: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  statusText: {
    margin: theme.spacing.unit * 3,
  },
  root: {
    width: '100%',
  },
} as AppStyles);

interface SensorPorps {
  state: IStore;
  actions: IActions;
}

class Sensor extends React.Component<SensorPorps & WithStyles<keyof AppStyles>> {

  componentDidMount() {
    this.props.actions.startMonitaringSensorData();
  }

  createStatusText() {
    const { state, classes } = this.props;
    if (state.connected) {
      return (
          <Typography variant="display1" color="secondary" className={classes.statusText}>
            Connected to smartphone!
          </Typography>
      );
    }
    return (
        <Typography variant="display1" style={{ color: 'pink' }}  className={classes.statusText}>
          Disconnected to smartphone. please check your myriad app is launched.
        </Typography>
    );
  }

  public render() {
    const { classes, state } = this.props;
    const { sensors } = state;
    return (
        <div className={classes.root}>
          <div className={classes.status}>
            {this.createStatusText()}
          </div>
        <div className={classes.container}>
          {
            Object.keys(sensors).map((key: keyof Sensors) => {
              const param = sensors[key] as BaseParam;
              const view = sensorViewList.find((s: SensorView) => s.key === key) as SensorView;
              return <Card key={key} className={classes.card}>
                      <CardHeader
                        avatar={<Avatar src={view.img} />}
                        title={view.label}
                        subheader={param.enabled ? 'active' : 'inactive'}
                      />
                      <CardContent>
                        <Typography>
                          {createTimeStamp(param.timeStamp)}
                        </Typography>
                      </CardContent>
                      {
                        view.createDetailComponent(sensors[key])
                      }
                     </Card>;
            })
          }
        </div>
        </div>
    );
  }
}
const styled = withStyles(styles)(Sensor);
export default inject<SensorPorps, {}>(styled, () => {
  return {
    state: getState(),
    actions: getActions(),
  };
});
