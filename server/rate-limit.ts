/** Best-effort per-process protection. Configure edge rate limiting for a distributed limit. */
export function createRateLimiter(limit: number, windowMs: number) {
  const clients = new Map<string, { count: number; expires: number }>();
  return (key: string, now = Date.now()) => {
    const current = clients.get(key);
    if (current && current.expires > now) {
      if (current.count >= limit) return false;
      current.count++;
      return true;
    }
    if (clients.size >= 5000) {
      for (const [id, value] of clients) {
        if (value.expires <= now) clients.delete(id);
      }
      if (clients.size >= 5000) clients.delete(clients.keys().next().value!);
    }
    clients.set(key, { count: 1, expires: now + windowMs });
    return true;
  };
}
