import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src'],
    format: 'esm',
    external: ['eludris-api-types'],
    target: 'node18',
    sourcemap: true,
    dts: true,
});
