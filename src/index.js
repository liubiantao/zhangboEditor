import React from 'react'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js'
import './editor.css'

class StyleButton extends React.Component {
  constructor() {
    super()
    this.onToggle = e => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render() {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }
}

const BLOCK_TYPES = [{ label: '层级', style: 'unordered-list-item' }]

const BlockStyleControls = props => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()
  console.log(blockType)

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

class MyEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    const content = window.localStorage.getItem('content')

    if (content) {
      this.state.editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
    } else {
      this.state.editorState = EditorState.createEmpty()
    }
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

  _onChange(editorState) {
    this.setState({ editorState })
  }

  saveContent = content => {
    window.localStorage.setItem('content', content)
  }

  _handleKeyCommand(command, editorState) {
    console.warn('key', command)
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
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
