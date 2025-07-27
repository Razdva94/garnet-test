import {
	createApi,
	fetchBaseQuery,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type {
	IContactRequestPost,
	IContact,
	IContactRequestUpdate,
	IContactResponsePost,
	IContactResponseGet,
} from '@/interfaces/contact.interface';

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:3000/',
	credentials: 'include',
	prepareHeaders: (headers) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error?.status === 401) {
		const errorMessage =
			typeof result.error.data === 'object'
				? (result.error.data as { message?: string })?.message
				: result.error.data;

		if (errorMessage === 'Access token expired') {
			const refreshResult = await baseQuery(
				{
					url: 'api/auth/refresh',
					method: 'GET',
					credentials: 'include',
				},
				api,
				extraOptions,
			);
			if (refreshResult.data) {
				const { accessToken } = refreshResult.data as { accessToken: string };
				localStorage.setItem('accessToken', accessToken);
				result = await baseQuery(args, api, extraOptions);
			}
		} else {
			localStorage.removeItem('accessToken');
			return { error: { status: 401, data: 'Session expired' } };
		}
	}

	return result;
};

export const contactApi = createApi({
	reducerPath: 'contactApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Contact'],
	endpoints: (builder) => ({
		create: builder.mutation<IContactResponsePost, IContactRequestPost>({
			query: (body) => ({
				url: '/contacts',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Contact'],
		}),
		update: builder.mutation<
			IContact,
			{ id: string; data: IContactRequestUpdate }
		>({
			query: ({ id, data }) => ({
				url: `/contacts/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Contact'],
		}),
		get: builder.query<IContactResponseGet, void>({
			query: () => '/contacts',
			providesTags: ['Contact'],
		}),
		delete: builder.mutation<{ success: boolean; id: string }, string>({
			query: (id) => ({
				url: `/contacts/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Contact'],
			transformResponse: (response: unknown) => {
				if (typeof response === 'string') {
					return { success: true, id: response.match(/\d+/)?.toString() || '' };
				}
				return response as { success: boolean; id: string };
			},
		}),
	}),
});

export const {
	useCreateMutation,
	useUpdateMutation,
	useGetQuery,
	useDeleteMutation,
} = contactApi;
