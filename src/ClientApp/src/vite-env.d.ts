/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENTRA_CLIENTID: string;
  readonly VITE_ENTRA_AUTHORITY: string;
  readonly VITE_API_BASE_AUTH: string;
  readonly VITE_API_BASE_MANAGER: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
