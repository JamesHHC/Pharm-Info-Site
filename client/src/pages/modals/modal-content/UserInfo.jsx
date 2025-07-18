// React
import { useState } from 'react';

// Content
import UserInfoDisplay from './user-content/UserInfoDisplay';
import UserManagement from './user-content/UserManagement';
import AuditLog from './user-content/AuditLog';

// Assets
import logo from '@/assets/logo_bluegray.svg';

export default function UserInfo({ onClose, user, setUser }) {
	const [infoScreen, setInfoScreen] = useState('');

	return (
		<div className="min-w-70 text-[RGB(99,99,115)]">
			{/* Header */}
			<img src={logo} alt="HHC Logo" className="h-24 m-auto mb-6"/>
			{{
				userManager: <UserManagement onClose={onClose} user={user} setInfoScreen={setInfoScreen}/>,
				auditLog: <AuditLog onClose={onClose} user={user} setInfoScreen={setInfoScreen}/>
			}[infoScreen] || <UserInfoDisplay onClose={onClose} user={user} setUser={setUser} setInfoScreen={setInfoScreen}/>}
		</div>
	);
}