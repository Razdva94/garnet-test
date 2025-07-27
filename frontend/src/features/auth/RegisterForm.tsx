import React, { useState } from 'react';
import {
	Box,
	Button,
	TextField,
	Typography,
	Link as MuiLink,
	Snackbar,
	Alert,
} from '@mui/material';
import { useRegisterMutation } from './authApi';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [register, { isLoading, error }] = useRegisterMutation();
	const [successOpen, setSuccessOpen] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await register(form).unwrap();
			setSuccessOpen(true);

			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (err) {
			console.error('Ошибка регистрации:', err);
		}
	};

	return (
		<Box maxWidth={400} mx="auto" mt={8}>
			<Typography variant="h4" mb={2} textAlign="center">
				Регистрация
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Имя"
					fullWidth
					margin="normal"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
				/>
				<TextField
					label="Email"
					type="email"
					fullWidth
					margin="normal"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
				/>
				<TextField
					label="Пароль"
					type="password"
					fullWidth
					margin="normal"
					value={form.password}
					onChange={(e) => setForm({ ...form, password: e.target.value })}
				/>
				<Button
					type="submit"
					variant="contained"
					fullWidth
					disabled={isLoading}
					sx={{ mt: 2 }}
				>
					Зарегистрироваться
				</Button>
				{error && (
					<Typography color="error" mt={2}>
						Ошибка регистрации
					</Typography>
				)}
			</form>

			<Typography mt={2} textAlign="center">
				Уже есть аккаунт?{' '}
				<MuiLink component={Link} to="/login">
					Войти
				</MuiLink>
			</Typography>
			<Snackbar
				open={successOpen}
				autoHideDuration={2000}
				onClose={() => setSuccessOpen(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setSuccessOpen(false)}
					severity="success"
					sx={{ width: '100%' }}
				>
					Регистрация успешна! Переход к входу...
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default RegisterForm;
