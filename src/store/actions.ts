import { SetState } from 'src/TypedStateStore';
import { IStore, GyroParam, AccParam, LightParam, MagParam, ProxParam } from './store';

const fetchInterval = 200;
export interface IActions {
  startMonitaringSensorData(): void;
  stopMonitaringSensorData(): void;
}

interface ResoponseData {
  accelerometer: AccParam;
  gyroscope: GyroParam;
  light: LightParam;
  magnetometer: MagParam;
  proximity: ProxParam;
}

const actionCreator = (setState: SetState<IStore>) => {
  let intervalId: NodeJS.Timeout;
  return {
    startMonitaringSensorData: () => {
      intervalId = setInterval(
        () => {
          fetch('/sensor')
            .then((response) => {
              return response.json();
            })
            .then((data: ResoponseData) => {
              setState({
                connected: true,
                sensors: {
                  mag: data.magnetometer,
                  acc: data.accelerometer,
                  gyro: data.gyroscope,
                  light: data.light,
                  prox: data.proximity,
                },
              });
            })
            .catch(() => {
              setState({
                connected: false,
              });
            });
        },
        fetchInterval);
    },
    stopMonitaringSensorData: () => {
      clearInterval(intervalId);
    },
  } as IActions;
};

export default actionCreator;
