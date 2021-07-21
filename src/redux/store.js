import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootSaga from './rootSaga';
import rootReducers from './rootReducer';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];
const enhancer = composeWithDevTools(applyMiddleware(...middleware));

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'roles'],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };
