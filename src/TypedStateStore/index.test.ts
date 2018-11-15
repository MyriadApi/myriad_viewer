import {  createStore, SetState } from './index';

it('StateStore Test', () => {

  const initValue = 3;
  interface TestState {
    value: number;
  }

  interface TestAction {
    doSomething(value: number): void;
  }

  const actions = (setState: SetState<TestState>) => {
    return {
      doSomething: (value) => { setState({ value }); },
    } as TestAction;
  };

  const store = createStore<TestState>({ value: initValue });
  const getState = store.getState;
  const getActions = store.bindActions<TestAction>(actions);

  const state = getState();
  if (state) {
    expect(state.value).toEqual(initValue);
  } else {
    throw new Error();
  }

  const changeValue = 5;
  getActions().doSomething(changeValue);
  const changedState = getState();
  if (changedState) {
    expect(changedState.value).toEqual(changeValue);
  } else {
    throw new Error();
  }

});

it('subscribe state', () => {
  expect.assertions(10);
  const initValue = 3;
  interface TestState {
    value: number;
    value2: string;
    value3?: number;
  }

  interface TestAction {
    doSomething(value: number): void;
  }
  const actions = (setState: SetState<TestState>) => {
    return {
      doSomething: (value) => { setState({ value }); },
    } as TestAction;
  };
  const store = createStore<TestState>({ value: initValue, value2:'ready' });
  const getActions = store.bindActions<TestAction>(actions);
  const changeValue = 5;
  store.observable.on('value').subscribe((setState, prevValue, nextValue) => {
    expect(prevValue.value).toEqual(initValue);
    expect(nextValue.value).toEqual(changeValue);
    setState({ value2: 'idle' });
  });
  store.observable.on('value2').subscribe((setState, prevState, nextState) => {
    if (prevState.value2 === 'ready') {
      expect(prevState.value2).toEqual('ready');
      expect(nextState.value2).toEqual('idle');
      setState((state) => {
        expect(state.value2).toEqual('idle');
        return { value2: 'next' };
      });
    }
  });

  store.observable
    .on(['value2', 'value3'])
    .filter((ps, ns) => ns.value2 === 'next')
    .subscribe((setState, prevValue, nextValue, name) => {
      if (name === 'value2') {
        expect(prevValue.value2).toEqual('idle');
        expect(nextValue.value2).toEqual('next');
        setState({ value3 : 6 });
      } else {
        expect(name).toEqual('value3');
      }
    });
  store.observable
    .on('value3')
    .filter((ps, ns) => ns.value2 === 'next')
    .filter((ps, ns) => ns.value2 === 'next')
    .subscribe((setState, prevValue, nextValue) => {
      expect(prevValue.value3).toBeUndefined();
      expect(nextValue.value3).toEqual(6);
      setState({ value3 : 6 });
    });
  getActions().doSomething(changeValue);
});
