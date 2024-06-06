import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// import slices
import pcoSliceReducer from '@/redux/slice/pcoSlice';
import userSliceReducer from '@/redux/slice/userSlice';
import signUpSlice from '@/redux/slice/signUpSlice';

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
