interface ImportMetaEnv {
  /** AdSense publisher ID (`ca-pub-…`). Unset means ad placeholder mode. */
  readonly PUBLIC_ADSENSE_CLIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
