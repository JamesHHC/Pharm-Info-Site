// Content
import UserLogin from './modal-content/UserLogin';
import UserInfo from './modal-content/UserInfo';

// Styles
import './ModalStyles.css'

export default function UserModal({ isOpen, user, setUser, onClose }) {
	if (!isOpen) return null;

	return(
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-40">
			<div className="bg-white p-6 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
				{user ? 
					<UserInfo onClose={onClose} user={user} setUser={setUser}/> :
					<UserLogin onClose={onClose} setUser={setUser}/>
				}
			</div>
		</div>
	);
}