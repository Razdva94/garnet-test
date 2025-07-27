import React, { useState } from 'react';
import {
	Box,
	Button,
	TextField,
	Typography,
	Link as MuiLink,
} from '@mui/material';
import { useCheckAuthQuery, useLoginMutation } from './authApi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
	const navigate = useNavigate();
	const { refetch } = useCheckAuthQuery();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login, { isLoading, error }] = useLoginMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response: { accessToken: string } = await login({
				email,
				password,
			}).unwrap();

			const accessToken: string = response.accessToken;
			if (accessToken) {
				localStorage.setItem('accessToken', accessToken);
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
			await refetch();
			navigate('/');
		} catch (err) {
			console.error('Ошибка входа:', err);
		}
	};

	return (
		<Box maxWidth={400} mx="auto" mt={8}>
			<Typography variant="h4" mb={2} textAlign="center">
				Вход
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Email"
					type="email"
					fullWidth
					margin="normal"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<TextField
					label="Пароль"
					type="password"
					fullWidth
					margin="normal"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button
					type="submit"
					variant="contained"
					fullWidth
					disabled={isLoading}
					sx={{ mt: 2 }}
				>
					Войти
				</Button>
				{error && (
					<Typography color="error" mt={2}>
						Ошибка входа
					</Typography>
				)}
			</form>

			<Typography mt={2} textAlign="center">
				Нет аккаунта?{' '}
				<MuiLink component={Link} to="/register">
					Зарегистрироваться
				</MuiLink>
			</Typography>
		</Box>
	);
};

export default LoginForm;
