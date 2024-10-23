export const parseNavLinks = (rawNavLinks) => {
	const regex = /<!-- wp:navigation-link\s*{([^}]*)}\s*\/-->/g;
	let matches;
	const links = [];

	while ((matches = regex.exec(rawNavLinks)) !== null) {
		const jsonString = `{${matches[1]}}`; // Create a JSON string from the captured group
		const linkData = JSON.parse(jsonString); // Parse the JSON string
		links.push({
			label: linkData.label,
			type: linkData.type,
			id: linkData.id,
			url: linkData.url,
			kind: linkData.kind,
		}); // Store the properties in the links array
	}
	return links;
};
