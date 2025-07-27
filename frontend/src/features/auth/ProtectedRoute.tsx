import { useCheckAuthQuery } from './authApi';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { data, isLoading, isError } = useCheckAuthQuery();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data?.user) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
