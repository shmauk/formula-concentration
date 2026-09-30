interface ImportMetaEnv {
  /** Cloudflare Web Analytics site token. Unset means no beacon. */
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
