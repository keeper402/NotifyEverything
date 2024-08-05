<template>
  <div class="editor-container">
    <div id="editor" class="code-editor"></div>
  </div>
</template>

<script>
import {onMounted, watch} from 'vue';
import * as monaco from 'monaco-editor';
import * as _ from 'lodash'

export default {
  name: 'TOMLEditor',
  props: {
    config: String,
  },
  emits: ['update:config'], // 定义事件
  setup(props, {emit}) {

    onMounted(() => {
      registerTomlForEditor();
      // 初始化 Monaco Editor
      const editorCtx = monaco.editor.create(document.getElementById('editor'), {
        value: '# Sample TOML\n[WaitLoading]\nminTime = 1\nmaxTime = "infinite"\n# This is a comment',
        language: 'toml',
        theme: 'vs-dark',
        automaticLayout: true
      });

      // 监听编辑器内容变化
      editorCtx.onDidChangeModelContent(() => {
        const newValue = editorCtx.getValue();
        debouncedUpdate(newValue);
      });

      const debouncedUpdate = _.debounce((newValue) => {
        // 更新逻辑
        emit('update:config', newValue); // 发出更新事件
      }, 10); // 10毫秒的防抖

      watch(
          () => props.config,
          (newConfig) => {
            if (newConfig !== editorCtx.getValue()) {
              editorCtx.setValue(newConfig);
            }
          }
      );
    });

    //注册toml 规则
    function registerTomlForEditor() {
      // 注册 TOML 语言
      monaco.languages.register({id: 'toml'});

      // 定义 TOML 语言的词法规则
      monaco.languages.setMonarchTokensProvider('toml', {
        tokenizer: {
          root: [
            [/^#.*$/, 'comment'], // 注释
            [/\b(true|false)\b/, 'keyword'], // 布尔值
            [/\b\d+(\.\d+)?/, 'number'], // 数字
            [/"/, {token: 'string.quote', next: '@string'}], // 字符串开始
            [/'/, {token: 'string.quote', next: '@stringSingle'}], // 单引号字符串
            [/\b[a-zA-Z_][\w_]*/, 'identifier'], // 标识符
            [/=/, 'delimiter'], // 等号
            [/\[/, {token: 'delimiter.bracket', next: '@arrayOrTable'}], // 开始方括号
          ],
          string: [
            [/[^"]+/, 'string'],
            [/"/, {token: 'string.quote', next: '@pop'}]
          ],
          stringSingle: [
            [/[^']+/, 'string'],
            [/'/, {token: 'string.quote', next: '@pop'}]
          ],
          arrayOrTable: [
            [/\]/, {token: 'delimiter.bracket', next: '@pop'}], // 结束方括号
            [/\s+/, 'white'], // 空白
            [/\b[a-zA-Z_][\w_]*\b/, 'type.identifier'], // 表名高亮
            [/,/, 'delimiter'], // 逗号
          ]
        }
      });
    }

  }
};
</script>

<style>

.code-editor {
  display: flex;
  width: 1400px;
  height: 100%; /* 高度自动调整 */
  min-height: 350px; /* 最小高度 */
  padding: 0; /* 盒子内部边距 */
  box-sizing: border-box; /* 确保padding不影响宽高 */
  overflow: hidden; /* 不显示外部滚动条 */
  flex-grow: 1; /* 允许编辑器容器扩展以占满剩余空间 */
  border-radius: 10px;
  resize: both; /* 可调整大小 */
}

.editor-container {
  display: flex;
  height: 80vh;
  width: 100%;
}
</style>
