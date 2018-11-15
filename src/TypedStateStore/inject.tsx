import { storeObserver } from '.';
import * as React from 'react';

export const inject = function<P, S>(COMPONENT: React.ComponentType<P&any>,
                                     propsCreator: () => P) {
  return (class InjectedComponent extends React.Component<S, P> {
    constructor(props: any) {
      super(props);
      this.state = propsCreator();
      storeObserver.addListener(this.stateListener);
    }

    stateListener = () => {
      const newProps = propsCreator();
      if (this.state !== newProps) {
        this.setState(newProps);
      }
    }

    componentWillUnmount() {
      storeObserver.removeListener(this.stateListener);
    }

    render() {
      return  <COMPONENT {...this.props} {...this.state} />;
    }
  });
};
