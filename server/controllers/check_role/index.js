const preventAccess = (usrRole, minRole) => {
	// List of available roles
	const roles = [
		'user',
		'editor',
		'admin',
		'superadmin',
	];

	// Ensure user has a role
	if (!usrRole) return false;

	// Get index
	const userIndex = roles.indexOf(usrRole);
	const chckIndex = roles.indexOf(minRole);
	if (chckIndex === -1) return false;

	// Compares user role to hierarchy of role list
	return userIndex < chckIndex;
};

module.exports = preventAccess;