const LANG_COLORS = {
    javascript: '#f1e05a',
    typescript: '#3178c6',
    python: '#3572a5',
    go: '#00add8',
    java: '#b07219',
    ruby: '#701516',
    php: '#4f5d95',
    rust: '#dea584',
    kotlin: '#a97bff',
    swift: '#f05138',
    html: '#e34c26',
    css: '#563d7c',
    shell: '#89e051',
    powershell: '#012456',
    elixir: '#6e4a7e',
    c: '#555555',
    cpp: '#f34b7d',
    csharp: '#178600',
    fsharp: '#b845fc',
    dart: '#00b4ab',
    lua: '#000080',
    vue: '#41b883',
    svelte: '#ff3e00',
    dockerfile: '#384d54',
    'jupyter-notebook': '#da5b0b',
};
export function slugLang(lang) {
    const raw = String(lang || '').toLowerCase().trim();
    if (raw === 'c#')
        return 'csharp';
    if (raw === 'c++')
        return 'cpp';
    if (raw === 'f#')
        return 'fsharp';
    return raw
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/(^-|-$)/g, '');
}
function hashHue(s) {
    let h = 0;
    for (let i = 0; i < s.length; i += 1) {
        h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h % 360;
}
export function langColor(lang) {
    const slug = slugLang(lang);
    if (slug && LANG_COLORS[slug])
        return LANG_COLORS[slug];
    const hue = hashHue(slug || String(lang || 'unknown'));
    return `hsl(${hue} 65% 52%)`;
}
//# sourceMappingURL=lang.js.map