import { createStore } from '../TypedStateStore';

export interface BaseParam {
  enabled: boolean;
  timeStamp: number;
}

export interface GyroParam extends BaseParam {
  x: number;
  y: number;
  z: number;
}

export interface AccParam  extends BaseParam {
  x: number;
  y: number;
  z: number;
}

export interface MagParam  extends BaseParam {
  x: number;
  y: number;
  z: number;
}

export interface ProxParam  extends BaseParam {
  maxRange: number;
  value: number;
  isNear: boolean;
}

export interface LightParam  extends BaseParam {
  value: number;
}

export interface Sensors {
  gyro: GyroParam;
  light: LightParam;
  mag: MagParam;
  prox: ProxParam;
  acc: AccParam;
}

export interface IStore {
  connected: boolean;
  sensors: Sensors;
}

const store = createStore<IStore>(
  {
    connected: true,
    sensors: {
      gyro: { enabled: false, timeStamp: 0, x: 0, y:0, z:0 },
      acc: { enabled: false, timeStamp: 0, x: 0, y:0, z:0 },
      mag: { enabled: false, timeStamp: 0, x: 0, y:0, z:0 },
      prox: { enabled: false, timeStamp: 0, isNear: false, maxRange:0, value:0 },
      light: { enabled: false, timeStamp: 0, value:0 },
    },
  },
);

export default store;
