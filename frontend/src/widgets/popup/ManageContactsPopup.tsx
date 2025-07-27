import { IContact } from '@/interfaces/contact.interface';
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
} from '@mui/material';
import React from 'react';
interface ManageContactsPopupProps {
	openDialog: boolean;
	setOpenDialog: (arg: boolean) => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: React.FormEvent) => void;
	currentContact: IContact | null;
	formData: Omit<IContact, 'id'>;
}
const ManageContactsPopup: React.FC<ManageContactsPopupProps> = ({
	openDialog,
	setOpenDialog,
	handleInputChange,
	handleSubmit,
	currentContact,
	formData,
}) => {
	return (
		<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
			<DialogTitle>
				{currentContact ? 'Редактировать контакт' : 'Добавить контакт'}
			</DialogTitle>
			<DialogContent>
				<Box sx={{ py: 2 }}>
					<TextField
						fullWidth
						label="Имя"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label="Телефон"
						name="phone"
						value={formData.phone}
						onChange={handleInputChange}
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label="Email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label="Теги"
						name="tags"
						value={formData.tags}
						onChange={handleInputChange}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpenDialog(false)}>Отмена</Button>
				<Button
					onClick={handleSubmit}
					variant="contained"
					disabled={!formData.name || !formData.email || !formData.phone}
				>
					Сохранить
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ManageContactsPopup;
