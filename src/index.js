import React from 'react'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js'
import { StyleButton, BlockStyleControls } from './StyleButton'
import './editor.css'

class MyEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.initEditorState()

    this.onChange = e => this._onChange(e)
    this.focus = () => this.refs.editor.focus()
    this.onTab = e => this._onTab(e)
    this.toggleBlockType = type => this._toggleBlockType(type)
    this.getContent = () => this._getContent(this.state.editorState.getCurrentContent())
  }

  componentDidMount() {
    const content = window.localStorage.getItem('content')
    if (!content) {
      this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'))
    }
  }

  initEditorState() {
    const content = window.localStorage.getItem('content')

    if (content) {
      this.state.editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
    } else {
      this.state.editorState = EditorState.createEmpty()
    }
  }

  _onChange(editorState) {
    this.setState({ editorState })
  }

  saveContent = content => {
    window.localStorage.setItem('content', content)
  }

  _onTab(e) {
    const maxDepth = 3
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  _getContent(content) {
    const rawDraftContentState = JSON.stringify(convertToRaw(content))
    this.saveContent(rawDraftContentState)
    this.props.getRawData(rawDraftContentState)

    const titleList = content.getBlockMap().filter(x => x.depth === 0 && x.text)
    titleList.size === 0 && alert('请至少输入一个一级标题')
  }

  render() {
    const { editorState } = this.state

    let className = 'RichEditor-editor'

    return (
      <div>
        <div className="RichEditor-root">
          {/* 如果不需要切换状态, 可以删掉这个, componentDidMount 里设置初始状态就行 */}
          <BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} />
          <div className={className} onClick={this.focus}>
            <Editor ref="editor" onTab={this.onTab} editorState={editorState} onChange={this.onChange} />
          </div>
        </div>
        <div onClick={this.getContent}>{this.props.submit || <button>提交</button>}</div>
      </div>
    )
  }
}

export default MyEditor
