import React from 'react'
import { storiesOf } from '@storybook/react'
import Editor from '../src/index'

const demo = () => {
  const getRawData = content => console.log('您提交的内容是:', content)
  return <Editor submit={<button>提交</button>} getRawData={getRawData} />
}

storiesOf('demo', module).add('demo', demo)
