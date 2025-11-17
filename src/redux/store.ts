import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';
import rootReducer from './rootReducer';

// ----------------------------------------------------------------------

// rootReducer의 함수의 반환 타입을 추출
export type RootState = ReturnType<typeof rootReducer>;

// Define the type for dispatching actions from the store
export type AppDispatch = typeof store.dispatch;

// 리덕스 스토어 설정
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Extract the dispatch function from the store for convenience
const { dispatch } = store;

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

// Create a custom useDispatch hook with typed dispatch
const useDispatch = () => useAppDispatch<AppDispatch>();

// Export the Redux store, dispatch, useSelector, and useDispatch for use in components
export { store, dispatch, useSelector, useDispatch };

// https://medium.com/inforwaves-blogs/how-to-setup-redux-toolkit-in-next-js-app-router-82bde47fb863
