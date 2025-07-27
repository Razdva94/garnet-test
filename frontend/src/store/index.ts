import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth';
import { contactApi } from '@/widgets';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[contactApi.reducerPath]: contactApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware, contactApi.middleware),
});

export {};
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
