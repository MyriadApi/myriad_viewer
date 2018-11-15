import store, { IStore, Sensors } from './store';
import actions, { IActions } from './actions';

export const getState = store.getState;
export const getActions = store.bindActions(actions);
export type IStore = IStore;
export type ISensors = Sensors;
export type IActions = IActions;
