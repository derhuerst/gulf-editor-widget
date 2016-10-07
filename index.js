'use strict'

const ot = require('ot-text').type

const diff = require('./diff')
const noop = () => {}



const connect = (doc, editor) => {
	let oldContent = editor.textBuf.getText()

	doc._setContents = (newContent, cb) => {
		oldContent = newContent
		editor.textBuf.setText(newContent)
		cb()
	}

	doc._change = (changes, cb) => {
		const newContent = ot.apply(oldContent, changes)
		editor.textBuf.setText(newContent)
		// todo: transform selection
		cb()
	}

	doc._collectChanges = (cb) => {
		const newContent = editor.textBuf.getText()
		const changes = diff(oldContent, newContent)
		if (changes.length) {
		  doc.update(changes)
		  oldContent = newContent
		}
		cb()
	}

	editor.textBuf.onDidChange(() => {
		doc._collectChanges(noop)
	})
}

module.exports = connect
