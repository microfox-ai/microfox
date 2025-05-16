export const languageMap = {
    javascript: ['javascript', 'js'],
    python: ['python', 'py'],
    java: ['java'],
    cpp: ['c++', 'cpp'],
    typescript: ['typescript', 'ts'],
    go: ['go', 'golang'],
    rust: ['rust'],
    bash: ['bash', 'shell'],
    ruby: ['ruby', 'rb'],
    php: ['php'],
    csharp: ['c#', 'csharp'],
    swift: ['swift'],
    kotlin: ['kotlin']
};

export const languageMapRun = {
    javascript: {
      extensions: ['.js'],
      commands: ['node'],
      indicators: ['console.', 'function', '=>', 'const ', 'let ', 'var ', 'export ', 'require('],
      shebang: '#!/usr/bin/env node'
    },
    python: {
      extensions: ['.py'],
      commands: ['python', 'python3'],
      indicators: ['def ', 'import ', 'print(', 'lambda ', '#!/usr/bin/env python'],
      shebang: '#!/usr/bin/env python'
    },
    java: {
      extensions: ['.java'],
      commands: ['javac', 'java'],
      indicators: ['public class', 'void main', 'System.out.', 'import java.'],
      shebang: null,
      compile: true
    },
    cpp: {
      extensions: ['.cpp'],
      commands: ['g++'],
      indicators: ['#include', 'using namespace', 'cout <<', 'std::'],
      shebang: null,
      compile: true
    },
    typescript: {
      extensions: ['.ts'],
      commands: ['ts-node'],
      indicators: ['interface ', 'type ', 'const ', 'let ', 'import '],
      shebang: '#!/usr/bin/env ts-node'
    },
    go: {
      extensions: ['.go'],
      commands: ['go run'],
      indicators: ['package main', 'func main()', 'import "', 'var ', ':= '],
      shebang: '#!/usr/bin/env go run'
    },
    rust: {
      extensions: ['.rs'],
      commands: ['rustc'],
      indicators: ['fn main()', 'println!', 'use ', 'let '],
      shebang: null,
      compile: true
    },
    bash: {
      extensions: ['.sh'],
      commands: ['bash'],
      indicators: ['#!/bin/bash', 'echo ', 'if [ ', 'for ', 'while '],
      shebang: '#!/bin/bash'
    },
    ruby: {
      extensions: ['.rb'],
      commands: ['ruby'],
      indicators: ['puts ', 'def ', 'class ', 'require '],
      shebang: '#!/usr/bin/env ruby'
    },
    php: {
      extensions: ['.php'],
      commands: ['php'],
      indicators: ['<?php', 'echo ', 'function ', '$'],
      shebang: '#!/usr/bin/env php'
    },
    csharp: {
      extensions: ['.cs'],
      commands: ['dotnet run'],
      indicators: ['using ', 'namespace ', 'Console.WriteLine', 'class '],
      shebang: null,
      needsProject: true
    },
    swift: {
      extensions: ['.swift'],
      commands: ['swift'],
      indicators: ['import ', 'print(', 'func ', 'let '],
      shebang: '#!/usr/bin/env swift'
    },
    kotlin: {
      extensions: ['.kt'],
      commands: ['kotlinc'],
      indicators: ['fun main()', 'println(', 'import ', 'val '],
      shebang: null,
      compile: true
    }
}