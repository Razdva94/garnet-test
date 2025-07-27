import {
	AppBar,
	IconButton,
	TextField,
	Toolbar,
	Typography,
	useMediaQuery,
} from '@mui/material';

import {
	Search as SearchIcon,
	Logout as LogoutIcon,
} from '@mui/icons-material';
import { useLogoutMutation } from '@/features/auth/authApi';
import { useNavigate } from 'react-router';

interface HeaderProps {
	setSearchTerm: (value: string) => void;
}
const AppHeader: React.FC<HeaderProps> = ({ setSearchTerm }) => {
	const navigate = useNavigate();
	const [logout, { error }] = useLogoutMutation();
	const handleLogout = async () => {
		try {
			await logout().unwrap();
			localStorage.removeItem('accessToken');
			navigate('/login');
		} catch (err) {
			console.error('Ошибка при выходе:', error);
		}
	};
	const isMobile = useMediaQuery('(max-width:600px)');
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant={isMobile ? 'h6' : 'h5'} sx={{ flexGrow: 1 }}>
					TrustContacts
				</Typography>

				{/* Поиск */}
				<TextField
					size="small"
					placeholder="Поиск..."
					variant="outlined"
					InputProps={{
						startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
					}}
					sx={{
						bgcolor: 'background.paper',
						borderRadius: 1,
						mr: 2,
						width: isMobile ? 150 : 250,
					}}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<IconButton
					color="inherit"
					onClick={handleLogout}
					aria-label="выход"
					sx={{ ml: 1 }}
				>
					<LogoutIcon />
					{!isMobile && <Typography sx={{ ml: 1 }}>Выход</Typography>}
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;
