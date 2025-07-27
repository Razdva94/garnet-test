import { useState, useEffect } from 'react';
import type { IContact } from '@/interfaces/contact.interface';
import { AppHeader } from '@/entities';
import { ContactsTable, ManageContactsPopup } from '@/widgets';
import { Box } from '@mui/material';
import {
	useCreateMutation,
	useDeleteMutation,
	useGetQuery,
	useUpdateMutation,
} from '@/widgets/contacts-table/contactApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export default function MainPage() {
	const [contacts, setContacts] = useState<IContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [openDialog, setOpenDialog] = useState(false);
	const [currentContact, setCurrentContact] = useState<IContact | null>(null);
	const [formData, setFormData] = useState<IContact>({
		id: '',
		name: '',
		phone: '',
		email: '',
		tags: '',
		lastInteraction: new Date(),
	});

	const [create] = useCreateMutation();
	const [update] = useUpdateMutation();
	const [deleteContact] = useDeleteMutation();
	const { data, isError, error } = useGetQuery();
	useEffect(() => {
		if (data) {
			const formattedContacts = data.map((contact) => ({
				...contact,
				tags: contact?.tags?.join(', '),
			}));
			setContacts(formattedContacts);
			setLoading(false);
		}
	}, [data]);

	if (isError) {
		console.log(getErrorMessage(error));
	}

	function getErrorMessage(error: unknown): string {
		if (typeof error === 'string') return error;
		if (error instanceof Error) return error.message;
		if (isFetchBaseQueryError(error)) {
			return typeof error.data === 'string'
				? error.data
				: JSON.stringify(error.data);
		}
		return 'Неизвестная ошибка';
	}

	function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
		return typeof error === 'object' && error != null && 'status' in error;
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (currentContact) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { id, ...formDataWithoutId } = formData;
				const requestFormData = {
					...formDataWithoutId,
					tags:
						typeof formData?.tags === 'string'
							? formData.tags
									.split(',')
									.map((tag) => tag.trim())
									.filter(Boolean)
							: undefined,
				};
				const responseData = await update({
					id: currentContact.id,
					data: requestFormData,
				}).unwrap();

				setContacts(
					contacts.map((c) =>
						c.id === currentContact.id ? { ...c, ...responseData } : c,
					),
				);
			} catch (err) {
				console.error('Ошибка', err);
			}
		} else {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { id, ...formDataWithoutId } = formData;
				const requestFormData = {
					...formDataWithoutId,
					tags:
						typeof formData?.tags === 'string'
							? formData.tags
									.split(',')
									.map((tag) => tag.trim())
									.filter(Boolean)
							: undefined,
				};
				const responseData = await create({
					...requestFormData,
				}).unwrap();

				setContacts([
					...contacts,
					{
						...responseData,
						tags: responseData.tags?.join(','),
					},
				]);
			} catch (err) {
				console.error('Ошибка', err);
			}
		}
		setOpenDialog(false);
		setFormData({
			id: '',
			name: '',
			phone: '',
			email: '',
			tags: '',
			lastInteraction: new Date(),
		});
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteContact(id).unwrap();
			setContacts(contacts.filter((c) => c.id !== id));
		} catch (err) {
			console.error('Ошибка', err);
		}
	};

	const handleOpenForm = (contact: IContact | null = null) => {
		setCurrentContact(contact);
		setFormData(
			contact || {
				id: '',
				name: '',
				phone: '',
				email: '',
				tags: '',
				lastInteraction: new Date(),
			},
		);
		setOpenDialog(true);
	};

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
			<AppHeader setSearchTerm={setSearchTerm} />
			<ContactsTable
				contactsInfo={{
					contacts: contacts,
					searchTerm: searchTerm,
				}}
				loading={loading}
				handleOpenForm={handleOpenForm}
				handleDelete={handleDelete}
			/>
			<ManageContactsPopup
				openDialog={openDialog}
				setOpenDialog={setOpenDialog}
				handleInputChange={handleInputChange}
				handleSubmit={(e: React.FormEvent) => handleSubmit(e)}
				currentContact={currentContact}
				formData={formData}
			/>
		</Box>
	);
}
