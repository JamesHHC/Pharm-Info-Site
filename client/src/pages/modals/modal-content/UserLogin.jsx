import React, { useState } from 'react';
import { register, login, fetchUser } from '../../../auth/auth';

// Assets
import logo from '../../../assets/logo_bluegray.svg';
import LoadingIcon from '../../../assets/icons/LoadingIcon';

export default function UserLogin({ onClose, setUser }) {
	// Indicates if new account is being created
	const [newAccount, setNewAccount] = useState(false);
	const [loadingLogin, setLoadingLogin] = useState(false);

	// Clears usr/pwd from login form
	const clearSignIn = async () => {
		document.querySelector('input[name="usr"]').value = '';
		document.querySelector('input[name="pwd"]').value = '';
	};

	// Makes sure password meets requirements
	const passwordCheck = (password) => {
		const issues = [];
		if (password.length < 8) issues.push("Too short (minimum 8 characters)");
		if (!/[A-Z]/.test(password)) issues.push("Missing uppercase letter");
		if (!/[a-z]/.test(password)) issues.push("Missing lowercase letter");
		if (!/[0-9]/.test(password)) issues.push("Missing number");
		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) issues.push("Missing special character");
		return issues;
	};

	// Submit credentials
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Form info
		const formData = new FormData(e.target);
		const usr = formData.get('usr')?.trim();
		const pwd = formData.get('pwd')?.trim();
		const pwd_c = formData.get('pwd_conf')?.trim();
		// Form messages
		const newAccError = document.getElementById('newAccError');
		const loginError = document.getElementById('loginError');
		// Validate inputs
		if (usr === '' || pwd === '') {
			if (newAccount) return newAccError.textContent = "Your username/password cannot be blank!";
			else return loginError.textContent = "Your username/password cannot be blank!";
		}
		// Account creation
		if (newAccount) {
			// Validate password
			if (pwd !== pwd_c) return newAccError.textContent = "Your passwords don't match!";
			const issues = passwordCheck(pwd);
			if (issues.length > 0) {
				newAccError.textContent = "Your password isn't strong enough:";
				issues.map(issue => newAccError.textContent += `\n• ${issue}`);
				return;
			}
			try {
				setLoadingLogin(true);
				const newAcc = await register(usr, pwd);
				if (newAcc.error) {
					setLoadingLogin(false);
					return newAccError.textContent = newAcc.error;
				}
				clearSignIn();
				setNewAccount(false);
				setLoadingLogin(false);
				return alert('Account successfully created!');
			}
			catch (err) {
				setLoadingLogin(false);
				newAccError.textContent = 'Login error!';
				return console.error(err);
			}
		}
		// Sign in
		else {
			try {
				setLoadingLogin(true);
				const usrAcc = await login(usr, pwd);
				if (usrAcc.error) {
					setLoadingLogin(false);
					return loginError.textContent = usrAcc.error;
				}
				const userData = await fetchUser();
				setUser(userData);
				return onClose(true);
			}
			catch (err) {
				setLoadingLogin(false);
				loginError.textContent = 'Login error!';
				return console.error(err);
			}
		}
	};

	return (
		<div className="w-68">
			{/* Header */}
			<img src={logo} alt="HHC Logo" className="h-24 m-auto mb-6"/>
			<p className="text-center text-2xl font-light text-[RGB(99,99,115)]">Log in to Edit</p>
			{/* User login form */}
			<form onSubmit={handleSubmit}>
				{/* Username input */}
				<div className="mt-3">
					<label htmlFor="usr" className="font-bold block text-[RGB(99,99,115)]">Username</label>
					<input
						required
						id="usr"
						name="usr"
						type="text"
						placeholder="Enter your username..."
						className="w-full border border-gray-300 p-2 rounded"
						autoComplete="off"
					/>
				</div>
				{/* Password input */}
				<div className="mt-3">
					<label htmlFor="pwd" className="font-bold block text-[RGB(99,99,115)]">Password</label>
					<input
						required
						id="pwd"
						name="pwd"
						type="password"
						placeholder="Enter your password..."
						className="w-full border border-gray-300 p-2 rounded"
						autoComplete="off"
					/>
				</div>
				{/* Password confirmation input */}
				{newAccount && <div className="mt-1.5">
					<input
						required
						id="pwd_conf"
						name="pwd_conf"
						type="password"
						placeholder="Re-enter your password..."
						className="w-full border border-gray-300 p-2 rounded"
						autoComplete="off"
					/>
					<p id="newAccError" className="text-sm text-red-500 font-light"></p>
				</div>}
				{!newAccount && <div>
					<p id="loginError" className="text-sm text-red-500 font-light"></p>
				</div>}
				{/* Cancel/Submit/Register Buttons */}
				<div className="mt-9 flex-block w-full">
					<button
						type="submit"
						className="block text-lg m-auto mb-2 cursor-pointer py-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded"
					>
						<div className="flex w-full">
							<div className="flex mx-auto">
								<div hidden={!loadingLogin} className="my-auto">
									<LoadingIcon fill="fill-cyan-400" text="text-cyan-700"/>
								</div>
								<p className="">{newAccount ? 'Register' : 'Sign in'}</p>
							</div>
						</div>
					</button>
					<button 
						type="button"
						onClick={() => onClose(false)}
						className="block text-lg m-auto cursor-pointer p-2 w-full bg-gray-200 text-gray-400 hover:bg-gray-300 rounded"
					>
						Cancel
					</button>
					<div className="block text-center mt-2">
						<a onClick={() => setNewAccount(!newAccount)} className="cursor-pointer font-light text-sm text-blue-900 hover:text-blue-900/50">
							{newAccount ? 'Use existing account' : 'New account'}
						</a>
					</div>
				</div>
			</form>
		</div>
	);
}