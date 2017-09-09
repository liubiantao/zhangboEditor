import React from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
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
    this.state = { editorState: EditorState.createEmpty() }
    this.onChange = editorState => this.setState({ editorState })
    this.focus = () => this.refs.editor.focus()
    this.onTab = e => this._onTab(e)
    this.handleKeyCommand = command => this._handleKeyCommand(command, this.state.editorState)
    this.toggleBlockType = type => this._toggleBlockType(type)
  }

  componentDidMount() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'))
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
    console.warn('tab', e)
    // 最高四层, 所以这里 maxDepth= 3 不用改
    const maxDepth = 3
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  render() {
    const { editorState } = this.state

    let className = 'RichEditor-editor'

    return (
      <div className="RichEditor-root">
        {/* 如果不需要切换状态, 可以删掉这个, componentDidMount 里设置初始状态就行 */}
        <BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} />
        <div className={className} onClick={this.focus}>
          <Editor ref="editor" onTab={this.onTab} editorState={editorState} onChange={this.onChange} />
        </div>
      </div>
    )
  }
}

export default MyEditor
