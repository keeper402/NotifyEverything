<template>
  <div>
    <h2>TOML Editor</h2>
    <div id="editor" style="height: 500px; width: 600px;"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import * as monaco from 'monaco-editor';

export default {
  name: 'TOMLEditor',
  setup() {
    onMounted(() => {
      // 注册 TOML 语言
      monaco.languages.register({ id: 'toml' });

      // 定义 TOML 语言的词法规则
      monaco.languages.setMonarchTokensProvider('toml', {
        tokenizer: {
          root: [
            [/^#.*$/, 'comment'], // 注释
            [/\b(true|false)\b/, 'keyword'], // 布尔值
            [/\b\d+(\.\d+)?/, 'number'], // 数字
            [/"/, { token: 'string.quote', next: '@string' }], // 字符串开始
            [/'/, { token: 'string.quote', next: '@stringSingle' }], // 单引号字符串
            [/\b[a-zA-Z_][\w_]*/, 'identifier'], // 标识符
            [/=/, 'delimiter'], // 等号
            [/\[/, { token: 'delimiter.bracket', next: '@arrayOrTable' }], // 开始方括号
          ],
          string: [
            [/[^"]+/, 'string'],
            [/"/, { token: 'string.quote', next: '@pop' }]
          ],
          stringSingle: [
            [/[^']+/, 'string'],
            [/'/, { token: 'string.quote', next: '@pop' }]
          ],
          arrayOrTable: [
            [/\]/, { token: 'delimiter.bracket', next: '@pop' }], // 结束方括号
            [/\s+/, 'white'], // 空白
            [/\b[a-zA-Z_][\w_]*\b/, 'type.identifier'], // 表名高亮
            [/,/, 'delimiter'], // 逗号
          ]
        }
      });

      // 初始化 Monaco Editor
      monaco.editor.create(document.getElementById('editor'), {
        value: '# Sample TOML\n[person]\nage = 10\nname = "tom"\n# This is a comment',
        language: 'toml',
        theme: 'vs-dark',
      });
    });
  }
};
</script>

<style>
/* 可以在这里添加样式 */
</style>
