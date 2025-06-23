import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUser, refreshToken, logout as doLogout } from './auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Load user
	useEffect(() => {
		async function loadUser() {
			const userData = await fetchUser();
			setUser(userData);
			setLoading(false);
		}
		loadUser();
	}, []);

	// Refresh token periodically
	useEffect(() => {
		const interval = setInterval(async () => {
			const success = await refreshToken();
			if (!success) logout();
			else {
				const userData = await fetchUser();
				setUser(userData);
			}
		}, 10 * 60 * 1000); // every 12 min

		return () => clearInterval(interval);
	}, []);

	const logout = () => {
		doLogout();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);