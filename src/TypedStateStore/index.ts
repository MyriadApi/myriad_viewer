export type SetState<S> =  (st: S|{}| CallbackState<S>) => void;
type CallbackState<S> =  (st: S) => S|{};

class CEventDispatcher extends Object {

  private stateListener: (() => void)[] = [];

  notifyChanged = () => {
    this.stateListener.forEach((listener) => {
      (async () => {
        try {
          listener();
        } catch (e) {
          throw new Error('fail to notify state changed');
        }
      })();
    });
  }

  addListener = (listener: () => void) => {
    this.stateListener.push(listener);
  }

  removeListener = (listener: () => void) => {
    const index = this.stateListener.indexOf(listener);
    this.stateListener.splice(index, 1);
  }

}

const eventDispatcher = new CEventDispatcher();

export const storeObserver = {
  addListener: eventDispatcher.addListener,
  removeListener: eventDispatcher.removeListener,
};

class ObservableFunc<S, K extends keyof S> {

  private registerSubscription: (cb: StateSubscriber<S>) => void;
  private keys: K[] = [];
  private  filterCallbackList: FilterCallback<S>[] = [];

  constructor(key:K|K[],
              registerSubscription: (cb: StateSubscriber<S>) => void,
              filters?: FilterCallback<S>[]) {
    this.registerSubscription = registerSubscription;
    if (filters) {
      this.filterCallbackList = filters;
    }
    if (typeof key  === 'string') {
      this.keys.push(key as K);
    } else {
      this.keys = key as K[];
    }
  }

  subscribe(callback: SubscribeCallback<S, K>) {
    this.registerSubscription({
      callback,
      keys: this.keys,
      filters: this.filterCallbackList,
    });
  }

  filter(callback: FilterCallback<S>): ObservableFunc<S, K> {
    this.filterCallbackList.push(callback);
    return new ObservableFunc(this.keys, this.registerSubscription, this.filterCallbackList);
  }

}

interface Observable<S> {
  on<K extends keyof S>(stateName: K|K[]):  ObservableFunc<S, K> ;
}

type SubscribeCallback<S, K extends keyof S>
         = (setState: SetState<S>, prevState: S, nextState: S, name: K) => void;
type FilterCallback<S> = (prevValue: S, nextValue: S) => boolean;

const isPlainObject = (obj: any) => {
  if (obj && typeof obj === 'object') {
    if (typeof Object.getPrototypeOf === 'function') {
      const proto = Object.getPrototypeOf(obj);
      return proto === Object.prototype || proto === null;
    }
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  return false;
};

interface StateSubscriber<S> {
  keys: (keyof S)[];
  callback(setState: SetState<S>, prevState: S, nextState: S , name: keyof S): void;
  filters: ((prevState: S, nextState: S) => boolean)[];
}

class Store<S> {

  private state: S;
  private onStateChangedListeners: StateSubscriber<S>[] = [];

  constructor(initState: S) {
    this.state = initState;
  }

  public getState = (): Readonly<S> => {
    return Object.freeze(Object.assign({},  this.state));
  }

  private notifyIfStateChanged(prevState: S, nextState: S) {
    const setState = this.setState;
    const notify = <K extends keyof S>(key: K) => {
      this.onStateChangedListeners.forEach((listener) => {
        const doFiltering = (index: number = 0):boolean => {
          const filter = listener.filters[index];
          if (filter === undefined || index >= listener.filters.length) {
            return true;
          }
          if (filter && filter(prevState, nextState)) {
            return doFiltering(1 + index);
          }
          return false;
        };
        if (listener.keys.indexOf(key) >= 0) {
          if (doFiltering()) {
            listener.callback(setState, prevState, nextState, key);
          }
        }
      });
    };
    const prevKeys = Object.keys(prevState);
    const pst = prevState as any;
    const nst = nextState as any;
    for (const pkey of prevKeys) {
      const prevValue = pst[pkey] ;
      const nextValue = nst[pkey];
      if (prevValue !== nextValue) {
        notify(pkey as keyof S);
      }
    }

    // when prev state key is not exist.
    const nextKeys = Object.keys(nextState);
    for (const nkey of nextKeys) {
      if (prevKeys.indexOf(nkey) === -1) {
        notify(nkey as keyof S);
      }
    }
  }

  public setState = (st: ({}|S|CallbackState<S>)) => {
    const state = Object.freeze(Object.assign({}, this.state));
    if (!isPlainObject(st)) {
      const callable = st as CallbackState<S>;
      this.setState(callable(state));
    } else {
      const newState = Object.freeze(Object.assign({}, this.state, st));
      this.state = Object.assign({}, this.state, st);
      this.notifyIfStateChanged(state, newState);
      eventDispatcher.notifyChanged();
    }
  }

  public createObservable = (): Observable<S> => {
    const onStateChangedListeners = this.onStateChangedListeners;
    const addListener = (scriber: StateSubscriber<S>) => {
      onStateChangedListeners.push(scriber);
    };
    const on = <K extends keyof S> (key: K|K[]) => {
      return new ObservableFunc(key, addListener);
    };
    return {
      on,
    };
  }
}

export abstract class StateStore<A, S> extends Store<S> {
  public abstract getActions(setState: SetState<S>): A;
}

type GetActions<A, S> =  (setState: SetState<S>) => A;
export interface IStore<S> {
  observable: Observable<S>;
  getState(): S;
  bindActions<A>(actions: GetActions<A, S>): (() => A);
}

export const createStore = function<S>(initState: S):IStore<S> {
  const store = new Store<S>(initState);
  const bindActions = function<A> (actions: GetActions<A, S>) {
    return () => {
      return actions(store.setState) as A;
    };
  };
  return {
    bindActions,
    observable: store.createObservable(),
    getState: store.getState,
  } as IStore<S>;
};
