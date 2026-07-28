export type TransientMessageTimeoutId = ReturnType<typeof setTimeout>;

export function showTransientMessage(
    message: string,
    setMessage: (message: string) => void,
    durationMs: number,
    currentTimeoutId: TransientMessageTimeoutId | null = null
): TransientMessageTimeoutId {
    clearTransientMessage(currentTimeoutId);
    setMessage(message);

    return setTimeout(() => {
        setMessage('');
    }, durationMs);
}

export function clearTransientMessage(timeoutId: TransientMessageTimeoutId | null): void {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
}
