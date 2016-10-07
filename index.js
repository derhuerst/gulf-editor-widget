'use strict'

const ot = require('ot-text').type

const diff = require('./diff')
const noop = () => {}



const connect = (doc, editor) => {
	let oldContent = editor.textBuf.getText()
	let expectFeedback = false

	doc._setContents = (newContent, cb) => {
		oldContent = newContent
		editor.textBuf.setText(newContent)
		cb()
	}

	doc._change = (changes, cb) => {
		const newContent = ot.apply(oldContent, changes)
		editor.textBuf.setText(newContent)
		expectFeedback = true
		// todo: transform selection
		cb()
	}

	doc._collectChanges = (cb) => {
		const newContent = editor.textBuf.getText()
		doc.update(diff(oldContent, newContent))
		oldContent = newContent
		cb()
	}

	editor.textBuf.onDidChange(() => {
		if (expectFeedback) {
		  expectFeedback = false
		  return
		}
		doc._collectChanges(noop)
	})
}

module.exports = connect
