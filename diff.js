'use strict'

const diff = (a, b) => {
	const changes = []

	// The following code is taken from gulf-textarea:
	// https://github.com/marcelklehr/gulf-textarea/blob/f6a9455/index.js#L52-L73

	if (a === b) return changes

	let start = 0
	while (a.charAt(start) === b.charAt(start)) start++

	let end = 0
	while (
		a.charAt(a.length - 1 - end) === b.charAt(b.length - 1 - end)
		&& end + start < a.length && end + start < b.length
	) end++

	if (a.length !== start + end) {
		if(start) changes.push(start)
		changes.push({d: a.length - start - end})
	}
	if (b.length !== start + end) {
		if(start && !changes.length) changes.push(start)
		changes.push(b.slice(start, b.length - end))
	}

	return changes
}

module.exports = diff
