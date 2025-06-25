// React
import { useState } from 'react';

// Content
import UserInfoDisplay from './UserInfoDisplay';
import UserManagement from './UserManagement';

// Assets
import logo from '../../../assets/logo_bluegray.svg';

export default function UserInfo({ onClose, user, setUser }) {
	const [userManager, setUserManager] = useState(false);

	return (
		<div className="min-w-70 max-w-150 text-[RGB(99,99,115)]">
			{/* Header */}
			<img src={logo} alt="HHC Logo" className="h-24 m-auto mb-6"/>
			{userManager ? 
				<UserManagement onClose={onClose} user={user} setUserManager={setUserManager}/> :
				<UserInfoDisplay onClose={onClose} user={user} setUser={setUser} setUserManager={setUserManager}/>
			}
		</div>
	);
}