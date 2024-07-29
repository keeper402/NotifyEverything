<template>
  <div class="parent">
    <div id="editor" class="code-editor"></div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import * as monaco from 'monaco-editor';

export default {
  name: 'TOMLEditor',
  setup() {
    const editor = ref(null);

    onMounted(() => {
      registerTomlForEditor();
      // 初始化 Monaco Editor
      editor.value = monaco.editor.create(document.getElementById('editor'), {
        value: '# Sample TOML\n[person]\nage = 10\nname = "tom"\n# This is a comment',
        language: 'toml',
        theme: 'vs-dark',
      });
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
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: flex-start; /* 垂直顶部对齐 */
  box-sizing: border-box; /* 确保padding不影响宽高 */
  height: auto; /* 使容器填满整个视口 */
  min-height: 100%;
  width: 100%; /* 确保容器宽度为100% */
}

.code-editor {
  width: 1000px; /* 默认宽度 */
  height: auto; /* 高度自动调整 */
  max-width: calc(100% - 40px); /* 保留边距 */
  min-height: 1000px; /* 最小高度 */
  padding: 0; /* 盒子内部边距 */
  box-sizing: border-box; /* 确保padding不影响宽高 */
  overflow: hidden; /* 不显示外部滚动条 */
}

/* 响应式样式 */
@media (max-width: 1000px) {
  .code-editor {
    width: calc(100% - 40px); /* 当宽度小于1000px时，盒子跟随缩小 */
  }
}
</style>
