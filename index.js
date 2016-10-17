'use strict'

const ot = require('ot-text').type

const diff = require('./diff')



const connect = (doc, editor) => {
	let oldContent = editor.textBuf.getText()
	let expectFeedback = false

	doc._setContent = (newContent) => {
		oldContent = newContent
		editor.textBuf.setText(newContent)
		return Promise.resolve()
	}

	doc._onChange = (changes) => {
		const newContent = ot.apply(oldContent, changes)
		oldContent = newContent
		editor.textBuf.setText(newContent)
		expectFeedback = true
		// todo: transform selection
		return Promise.resolve()
	}

	doc._onBeforeChange = () => {
		const newContent = editor.textBuf.getText()
		const changes = diff(oldContent, newContent)
		if (changes.length) {
		  doc.update(changes)
		  oldContent = newContent
		}
		return Promise.resolve()
	}

	editor.textBuf.onDidChange(() => {
		if (expectFeedback) {
		  expectFeedback = false
		  return
		}
		doc._onBeforeChange()
	})
}

module.exports = connect
