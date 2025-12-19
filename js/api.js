const CACHE_VERSION = 1;
const CACHE_TTL_MS = 10 * 60 * 1000;
function cacheKey(user) {
    return `gh_repos_cache_v${CACHE_VERSION}:${user}`;
}
function loadCache(user) {
    try {
        const raw = localStorage.getItem(cacheKey(user));
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.data))
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
function saveCache(user, { etag, data }) {
    try {
        localStorage.setItem(cacheKey(user), JSON.stringify({ ts: Date.now(), etag: etag || '', data }));
    }
    catch {
        // ignore storage failures
    }
}
function rateLimitMessage(res) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    const reset = res.headers.get('x-ratelimit-reset');
    if (remaining === '0' && reset) {
        const resetMs = Number(reset) * 1000;
        if (Number.isFinite(resetMs)) {
            const when = new Date(resetMs);
            const hh = String(when.getHours()).padStart(2, '0');
            const mm = String(when.getMinutes()).padStart(2, '0');
            return `GitHub API rate limit reached. Try again after ${hh}:${mm}.`;
        }
        return 'GitHub API rate limit reached. Try again later.';
    }
    return '';
}
export async function fetchAllRepos({ user, perPage, signal }) {
    try {
        const cached = loadCache(user);
        const isFresh = cached && typeof cached.ts === 'number' && (Date.now() - cached.ts) < CACHE_TTL_MS;
        if (isFresh) {
            return { repos: cached.data, error: '' };
        }
        let page = 1;
        const out = [];
        let etag = cached?.etag || '';
        while (true) {
            const url = `https://api.github.com/users/${user}/repos?per_page=${perPage}&page=${page}&type=public&sort=updated`;
            const headers = { 'Accept': 'application/vnd.github+json' };
            if (etag)
                headers['If-None-Match'] = etag;
            const res = await fetch(url, { headers, signal });
            if (res.status === 304 && cached && Array.isArray(cached.data)) {
                saveCache(user, { etag, data: cached.data });
                return { repos: cached.data, error: '' };
            }
            if (!res.ok) {
                const rl = rateLimitMessage(res);
                if (rl)
                    return { repos: [], error: rl };
                const txt = await res.text().catch(() => '');
                return { repos: [], error: `GitHub API ${res.status}${txt ? `: ${txt}` : ''}` };
            }
            const nextEtag = res.headers.get('etag');
            if (nextEtag)
                etag = nextEtag;
            const batch = (await res.json());
            if (!Array.isArray(batch) || batch.length === 0)
                break;
            out.push(...batch);
            if (batch.length < perPage)
                break;
            page += 1;
            if (page > 100)
                break;
        }
        saveCache(user, { etag, data: out });
        return { repos: out, error: '' };
    }
    catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') {
            return { repos: [], error: '' };
        }
        throw e;
    }
}
//# sourceMappingURL=api.js.map