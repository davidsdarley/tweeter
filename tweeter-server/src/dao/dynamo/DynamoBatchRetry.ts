// AI-assisted: see AI-ATTRIBUTION.md

const MAX_UNPROCESSED_RETRIES = 5;
const RETRY_BASE_DELAY_MS = 50;

// Runs a batch operation until nothing is left unprocessed, backing off
// exponentially between retries (50ms, 100ms, 200ms, ...).
//
// `send` performs one attempt on the pending entries and returns whichever
// entries DynamoDB left unprocessed. `describeFailure` builds the error message
// (without the [internal-server-error] prefix) when retries run out.
export async function retryUnprocessed<T>(
    initial: T[],
    send: (pending: T[]) => Promise<T[]>,
    describeFailure: (remaining: number) => string
): Promise<void> {
    let pending = initial;
    let attempt = 0;

    while (pending.length > 0) {
        if (attempt > MAX_UNPROCESSED_RETRIES) {
            throw new Error(
                `[internal-server-error] ${describeFailure(pending.length)}`
            );
        }
        if (attempt > 0) {
            await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
        }

        pending = await send(pending);
        attempt++;
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
