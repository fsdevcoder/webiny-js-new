// @flow
import { applyMiddleware, createStore, compose } from "redux";
import _ from "lodash";
import invariant from "invariant";
import createRootReducer from "./createRootReducer";
import createMiddleware from "./createMiddleware";
import type {
    MiddlewareFunction,
    ReducerFactory,
    Reducer,
    Action,
    ActionCreator,
    ActionOptions,
    StatePath,
    Store
} from "webiny-app/types";

export class Redux {
    store: Store;
    middleware: Array<{ actions: Array<string>, middleware: MiddlewareFunction }>;
    reducers: Array<{ statePath: StatePath, reducer: Reducer, actions: Array<string> }>;
    higherOrderReducers: Array<{
        statePath: StatePath,
        reducer: Reducer,
        actions: Array<string>
    }>;

    constructor() {
        this.reducers = [];
        this.higherOrderReducers = [];
        this.middleware = [];
    }

    createAction(type: string, options?: ActionOptions = {}): ActionCreator {
        return (payload?: Object = {}) => {
            return { type, payload, meta: { log: options.log || true } };
        };
    }

    addReducer(actions: Array<string>, statePath: StatePath, reducer: Reducer) {
        invariant(reducer, "Must pass a valid reducer function!");

        this.reducers.push({ actions, statePath, reducer });
    }

    addHigherOrderReducer(actions: Array<string>, statePath: StatePath, factory: ReducerFactory) {
        this.higherOrderReducers.push({ actions, statePath, reducer: factory() });
    }

    addMiddleware(actions: Array<string>, middleware: MiddlewareFunction) {
        this.middleware.push({ actions, middleware });
    }

    initStore(INIT_STATE: Object = {}, middleware: Array<Function> = []) {
        // dev tool
        const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        const composeEnhancers =
            (reduxDevTools &&
                reduxDevTools({
                    predicate: (state, action) => _.get(action, "meta.log", true)
                })) ||
            compose;

        this.store = createStore(
            createRootReducer(INIT_STATE, this),
            composeEnhancers(applyMiddleware(...middleware, ...createMiddleware(this)))
        );

        this.store.dispatch({ type: "INIT" });

        return this.store;
    }
}

const redux = new Redux();

export { redux };

export const createAction = (type: string, options?: ActionOptions) => {
    return redux.createAction(type, options);
};

export const addReducer = (actions: Array<string>, statePath: StatePath, reducer: Reducer) => {
    redux.addReducer(actions, statePath, reducer);
};

export const addHigherOrderReducer = (
    actions: Array<string>,
    statePath: StatePath,
    factory: ReducerFactory
) => {
    redux.addHigherOrderReducer(actions, statePath, factory);
};

export const addMiddleware = (actions: Array<string>, middleware: MiddlewareFunction) => {
    redux.addMiddleware(actions, middleware);
};

export const dispatch = (action: Action) => {
    return redux.store.dispatch(action);
};

export const selectUi = (state: Object) => state.ui || {};
export const selectApp = (state: Object) => state.app || {};