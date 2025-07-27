import {
	Container,
	Box,
	CircularProgress,
	Card,
	CardContent,
	Typography,
	IconButton,
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Fab,
	useMediaQuery,
} from '@mui/material';
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import type { IContact } from '@/interfaces/contact.interface';
import React from 'react';

interface ContactsTableProps {
	contactsInfo: {
		contacts: IContact[];
		searchTerm: string;
	};
	loading: boolean;
	handleOpenForm: (contact: IContact | null) => void;
	handleDelete: (contactId: string) => void;
}
const ContactsTable: React.FC<ContactsTableProps> = ({
	contactsInfo,
	loading,
	handleOpenForm,
	handleDelete,
}) => {
	const filteredContacts = contactsInfo.contacts.filter((contact) =>
		contact.name.toLowerCase().includes(contactsInfo.searchTerm.toLowerCase()),
	);

	const isTablet = useMediaQuery('(max-width:900px)');
	return (
		<Container maxWidth="lg" sx={{ py: 3 }}>
			{loading ? (
				<Box display="flex" justifyContent="center" py={4}>
					<CircularProgress size={60} />
				</Box>
			) : (
				<>
					{isTablet ? (
						<Box>
							{filteredContacts.map((contact) => (
								<Card key={contact.id} sx={{ mb: 2 }}>
									<CardContent>
										<Typography variant="h6">{contact.name}</Typography>
										<Typography>Телефон: {contact.phone}</Typography>
										<Typography>Email: {contact.email}</Typography>
										<Typography>Теги: {contact.tags}</Typography>
										<Typography color="text.secondary" sx={{ mt: 1 }}>
											Последний контакт:{' '}
											{contact.lastInteraction
												? new Date(contact.lastInteraction).toLocaleDateString()
												: 'Нет данных'}
										</Typography>
										<Box sx={{ mt: 2 }}>
											<IconButton onClick={() => handleOpenForm(contact)}>
												<EditIcon color="primary" />
											</IconButton>
											<IconButton onClick={() => handleDelete(contact.id)}>
												<DeleteIcon color="error" />
											</IconButton>
										</Box>
									</CardContent>
								</Card>
							))}
						</Box>
					) : (
						<Paper sx={{ width: '100%', overflow: 'hidden' }}>
							<TableContainer>
								<Table stickyHeader>
									<TableHead>
										<TableRow>
											<TableCell>Имя</TableCell>
											<TableCell>Телефон</TableCell>
											<TableCell>Email</TableCell>
											<TableCell>Теги</TableCell>
											<TableCell>Последний контакт</TableCell>
											<TableCell>Действия</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{filteredContacts.map((contact) => (
											<TableRow key={contact.id}>
												<TableCell>{contact.name}</TableCell>
												<TableCell>{contact.phone}</TableCell>
												<TableCell>{contact.email}</TableCell>
												<TableCell>{contact.tags}</TableCell>
												<TableCell>
													{contact.lastInteraction
														? new Date(
																contact.lastInteraction,
															).toLocaleDateString()
														: 'Нет данных'}
												</TableCell>
												<TableCell>
													<IconButton onClick={() => handleOpenForm(contact)}>
														<EditIcon color="primary" />
													</IconButton>
													<IconButton onClick={() => handleDelete(contact.id)}>
														<DeleteIcon color="error" />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					)}

					<Fab
						color="primary"
						aria-label="add"
						onClick={() => handleOpenForm(null)}
						sx={{
							position: 'fixed',
							bottom: 16,
							right: 16,
						}}
					>
						<AddIcon />
					</Fab>
				</>
			)}
		</Container>
	);
};

export default ContactsTable;
