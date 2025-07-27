import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginRequest {
	email: string;
	password: string;
}

interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

interface AuthResponse {
	accessToken: string;
	user: {
		userId: string;
		email: string;
	};
}

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3000/api',
		credentials: 'include',
	}),
	endpoints: (builder) => ({
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: (data) => ({
				url: '/auth/login',
				method: 'POST',
				body: data,
			}),
		}),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: '/auth/logout',
				method: 'POST',
				credentials: 'include',
			}),
		}),
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: (data) => ({
				url: '/auth/register',
				method: 'POST',
				body: data,
			}),
		}),
		checkAuth: builder.query<AuthResponse, void>({
			query: () => ({
				url: '/auth/check',
				method: 'GET',
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useCheckAuthQuery,
	useLogoutMutation,
} = authApi;
