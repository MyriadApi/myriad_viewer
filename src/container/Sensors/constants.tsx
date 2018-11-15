import * as React from 'react';
import { ISensors } from '../../store';
import { AccParam, GyroParam, LightParam, MagParam, ProxParam } from 'src/store/store';
import { CardContent, Typography } from '@material-ui/core';

export interface SensorView {
  key: keyof ISensors;
  label: string;
  img: string;
  createDetailComponent: (param: any) => JSX.Element;
}

export const createTimeStamp = (time: number) => {
  const date = new Date(time);
  return 'aaa';
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getHours()}/
          :${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
};

const acc =  {
  key: 'acc',
  label: 'Accelerometer',
  img: require('../../images/acc.png'),
  createDetailComponent: (param: AccParam) => {
    return (
    <CardContent>
      <Typography>
        x: {param.x}
      </Typography>
      <Typography>
        y: {param.y}
      </Typography>
      <Typography>
        z: {param.z}
      </Typography>
    </CardContent>
    );
  },
} as SensorView;

const gyro =  {
  key: 'gyro',
  label: 'Gyroscope',
  img: require('../../images/gyro.png'),
  createDetailComponent: (param: GyroParam) => {
    return (
    <CardContent>
      <Typography>
        x: {param.x}
      </Typography>
      <Typography>
        y: {param.y}
      </Typography>
      <Typography>
        z: {param.z}
      </Typography>
    </CardContent>
    );
  },
} as SensorView;

const light =  {
  key: 'light',
  label: 'Light sensor',
  img: require('../../images/light.png'),
  createDetailComponent: (param: LightParam) => {
    return (
    <CardContent>
      <Typography>
        value: {param.value}
      </Typography>
    </CardContent>);
  },
} as SensorView;

const mag =  {
  key: 'mag',
  label: 'Magnetmetor',
  img: require('../../images/mag.png'),
  createDetailComponent: (param: MagParam) => {
    return (
    <CardContent>
      <Typography>
        x: {param.x}
      </Typography>
      <Typography>
        y: {param.y}
      </Typography>
      <Typography>
        z: {param.z}
      </Typography>
    </CardContent>
    );
  },
} as SensorView;

const prox =  {
  key: 'prox',
  label: 'Proximity',
  img: require('../../images/prox.png'),
  createDetailComponent: (param: ProxParam) => {
    return (
    <CardContent>
      <Typography>
        near: {param.isNear}
      </Typography>
      <Typography>
        value: {param.value}
      </Typography>
      <Typography>
        max range: {param.maxRange}
      </Typography>
    </CardContent>
    );
  },
} as SensorView;

export const sensorViewList: SensorView[] = [
  acc,
  gyro,
  light,
  mag,
  prox,
];
