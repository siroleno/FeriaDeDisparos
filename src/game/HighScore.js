const STORAGE_KEY = 'feria-disparos-highscore';

function canUseStorage ()
{
    try {
        return typeof window !== 'undefined' && !!window.localStorage;
    } catch (e) {
        return false;
    }
}

export function getHighScore ()
{
    if (!canUseStorage()) return 0;
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
}

export function saveHighScore (score)
{
    const current = getHighScore();
    if (score > current) {
        if (canUseStorage()) {
            window.localStorage.setItem(STORAGE_KEY, String(score));
        }
        return score;
    }
    return current;
}
