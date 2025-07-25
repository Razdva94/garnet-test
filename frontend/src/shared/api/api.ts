import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_URL}` }),
	endpoints: (builder) => ({
		getMatches: builder.query<unknown, void>({
			query: () => '/some-path',
		}),
	}),
});

export const { useGetMatchesQuery, useLazyGetMatchesQuery } = api;
