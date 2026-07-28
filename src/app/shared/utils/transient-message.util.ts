export type TransientMessageTimeoutId = number;

export function showTransientMessage(
    message: string,
    setMessage: (message: string) => void,
    durationMs: number,
    currentTimeoutId: TransientMessageTimeoutId | null = null
): TransientMessageTimeoutId {
    clearTransientMessage(currentTimeoutId);
    setMessage(message);

    return window.setTimeout(() => {
        setMessage('');
    }, durationMs);
}

export function clearTransientMessage(timeoutId: TransientMessageTimeoutId | null): void {
    if (timeoutId) {
        window.clearTimeout(timeoutId);
    }
}
