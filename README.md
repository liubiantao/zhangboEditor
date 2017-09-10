# Editor

online demo: http://atmg.al/zhangboEditor/dist

local demo: 
```
$ yarn (npm install)
$ yarn start (npm start)
```


## API

| 参数       | 说明                                      | 类型       | 默认值 |
|-----------|------------------------------------------|------------|--------|
|getRawData	| 获取编辑器 Raw data	| (content: json) => void	| - |
| submit | 提交按钮组件 | JSX.Element | `<button>提交</button>` |

## DEMO

```
import Editor from '../src/index'

const demo = () => {
  const getRawData = content => console.log('您提交的内容是:', content)
  return <Editor submit={<button>提交</button>} getRawData={getRawData} />
}
```