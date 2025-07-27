import './index.css';
import MainPage from '@/pages/MainPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages';
import { RegisterPage } from '@/pages';
import { ProtectedRoute } from '@/features';
import { useEffect } from 'react';
import { useCheckAuthQuery } from '@/features/auth/authApi';
const AppEnter = () => {
	const { refetch } = useCheckAuthQuery();

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<MainPage />
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Routes>
		</Router>
	);
};

export default AppEnter;
