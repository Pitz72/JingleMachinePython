# 🌐 Runtime Radio Live Machine - Product Portal

Il sito web ufficiale e documentazione online per **Runtime Radio Live Machine Pro**.
Costruito con React 19, TypeScript, Vite e Tailwind CSS.

## 🚀 Setup & Sviluppo

Il progetto è configurato per essere servito dal path `/sw/rlm/`.

### Installazione
```bash
npm install
```

### Server di Sviluppo
```bash
npm run dev
# Accessibile a: http://localhost:5173/sw/rlm/
```

### Build per Produzione
```bash
npm run build
```
L'output sarà generato in `dist/`. Caricare il contenuto di questa cartella in `simonepizzi.runtimeradio.it/sw/rlm/`.

## 📂 Struttura

*   **`src/pages`**: Pagine principali (Home, Wiki, Tech Specs).
*   **`src/layouts`**: Layout globale (Header, Footer).
*   **`public`**: Asset statici non processati (Favicon, ZIP Download).

## 📦 Versioning
*   **v0.0.4**: Espansione Wiki (FAQ, Settings) e Info Public Beta in Home.
*   **v0.0.3**: Branding completo, link download attivi, base path `/sw/rlm/`.
*   **v0.0.2**: Aggiunta Wiki e Tech Specs.
*   **v0.0.1**: Setup iniziale template.
