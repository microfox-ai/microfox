// examples/coding-agent/test.js
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
        module: 'commonjs'
    }
});

require('./src/test-agent.ts');