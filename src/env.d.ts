interface ImportMetaEnv {
  /** Cloudflare Web Analytics site token. Unset means no beacon. */
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
  /** AdSense publisher ID (`ca-pub-…`). Unset means ad placeholder mode. */
  readonly PUBLIC_ADSENSE_CLIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
