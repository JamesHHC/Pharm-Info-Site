export function hasMinPermission(user, minRole) {
	// List of available roles
	const roles = [
		'user',
		'editor',
		'admin',
		'superadmin',
	];

	// Ensure user has a role
	const usrRole = user?.role;
	if (!usrRole) return false;

	// Get index
	const userIndex = roles.indexOf(usrRole);
	const chckIndex = roles.indexOf(minRole);
	if (chckIndex === -1) return false;

	// Compares user role to hierarchy of role list
	return userIndex >= chckIndex;
}

export function userAccessString(role) {
	if (!role) return 'Role null';
	switch (role) {
		case 'editor': return 'General edit access';
		case 'admin': return 'Full edit access';
		case 'superadmin': return 'Total access';
		default: return 'No edit access';
	}
};