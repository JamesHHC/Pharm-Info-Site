function parseDelta(str) {
	try {
		const delta = JSON.parse(str);
		if (!Array.isArray(delta.ops)) return str;
		return delta.ops
		.map(op => typeof op.insert === 'string' ? op.insert : '')
		.join('')
		.replace(/[\n\r]/g, '')
		.trim();
	}
	catch { return str; }
}

function areEqual(a, b) {
	if (Array.isArray(a) && Array.isArray(b))
		return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
	else return a === b;
}

const getChanges = (body, item) => {
	const changes = {};
	for (const key in body) {
		const newVal = typeof body[key] === 'string' ? parseDelta(body[key]) : body[key];
		const oldVal = typeof item[key] === 'string' ? parseDelta(item[key]) : item[key];
		if (!areEqual(newVal, oldVal)) {
			changes[key] = {
				from: oldVal,
				to: newVal,
			};
		}
	}
	return changes;
};

module.exports = getChanges;