import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// import slices
import pcoSliceReducer from './slices/pcoSlice';
import userSliceReducer from './slices/userSlice';
import signUpSlice from './slices/signUpSlice';

const rootReducer = combineReducers({
  pco: pcoSliceReducer,
  user: userSliceReducer,
  signUp: signUpSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['pco', 'user'],
};

export default persistReducer(persistConfig, rootReducer);