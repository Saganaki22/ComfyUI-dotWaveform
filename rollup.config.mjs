export default {
    input: 'js-src/DotWaveformUI.js',
    output: {
        file: 'js/dotwaveform.js',
        format: 'es',
        sourcemap: false
    },
    external: (id) => id.includes('/scripts/')
};
