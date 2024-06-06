/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENTRA_CLIENTID: string;
  readonly VITE_ENTRA_AUTHORITY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
