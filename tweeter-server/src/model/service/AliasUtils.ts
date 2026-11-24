// AI-assisted: see AI-ATTRIBUTION.md

// Aliases are stored with a leading "@" (the client finds aliases in links
// by searching for "@"). Adds it when missing; otherwise returns the alias unchanged.
export const normalizeAlias = (alias: string): string =>
    alias.startsWith("@") ? alias : `@${alias}`;
