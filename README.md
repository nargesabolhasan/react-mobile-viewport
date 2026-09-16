# react-mobile-viewport

SSR-safe React hooks that tell you whether the viewport is mobile, tablet, or desktop. Built for **React 18+** and **Next.js App Router**.

It uses CSS `matchMedia` (not user-agent sniffing) and React’s `useSyncExternalStore`, so server HTML and the first client render stay in sync.

## Why this approach

| Approach | Use it? | Why |
| --- | --- | --- |
| `window.matchMedia('(max-width: 767px)')` | Yes | Same source of truth as CSS. Updates only when the breakpoint is crossed. |
| `window.innerWidth` on every resize | Only if you need exact pixels | Extra renders. Still fine behind `useViewportSize`. |
| User-Agent parsing | Avoid as the primary signal | Tablets, “Request Desktop Site”, and privacy features make it unreliable. |
| CSS `@media` only | Best for layout | JS should switch *behavior*, not duplicate your entire layout. |

**Hydration rule:** the value rendered on the server must match the first client render. This package does that with `useSyncExternalStore` and an explicit SSR fallback (`false` / `"desktop"` unless you pass a cookie-based hint).

## Install (after you publish)

```bash
npm install react-mobile-viewport
```

Peer dependencies: `react` and `react-dom` >= 18.

## Usage

### React (client)

```tsx
import { useIsMobile } from "react-mobile-viewport";

export function Nav() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileMenu /> : <DesktopMenu />;
}
```

Custom breakpoint (widths **below** 1024px count as mobile):

```tsx
const isMobile = useIsMobile({ breakpoint: 1024 });
```

### Breakpoints

Default: mobile `< 768`, tablet `768–1023`, desktop `>= 1024`.

```tsx
import { useBreakpoint } from "react-mobile-viewport";

export function LayoutSwitch() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint();
  return <p>{breakpoint}</p>;
}
```

### Arbitrary media queries

```tsx
import { useMediaQuery } from "react-mobile-viewport";

const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
const isPortrait = useMediaQuery("(orientation: portrait)");
```

### Viewport size (only when you need pixels)

```tsx
import { useViewportSize } from "react-mobile-viewport";

const { width, height } = useViewportSize();
```

Prefer `useIsMobile` / `useBreakpoint` for UI branching. Size updates on every resize.

### Next.js App Router

Hooks use the DOM, so call them from a **Client Component**:

```tsx
"use client";

import { useIsMobile } from "react-mobile-viewport";

export function DeviceLabel() {
  const isMobile = useIsMobile();
  return <span>{isMobile ? "Mobile" : "Desktop"}</span>;
}
```

You can import that component from a Server Component. Do **not** import the hooks directly in a Server Component.

### Optional: avoid a desktop flash on mobile

Without a hint, SSR assumes desktop (`false`). Mobile users may see desktop UI for one frame.

1. Set a cookie before paint with the server-safe helper.
2. Read it in the root layout and pass it into `ViewportProvider`.

`app/layout.tsx`:

```tsx
import { cookies } from "next/headers";
import {
  getViewportCookieScript,
  parseViewportCookie,
} from "react-mobile-viewport/script";
import { ViewportProvider } from "react-mobile-viewport";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const ssrIsMobile = parseViewportCookie(
    cookieStore.get("viewport")?.value,
  );

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getViewportCookieScript() }}
        />
      </head>
      <body>
        <ViewportProvider ssrIsMobile={ssrIsMobile ?? false}>
          {children}
        </ViewportProvider>
      </body>
    </html>
  );
}
```

Import `getViewportCookieScript` from `react-mobile-viewport/script`, not the root entry. The root entry is marked `"use client"`.

## API

| Export | Returns | Notes |
| --- | --- | --- |
| `useIsMobile({ breakpoint, ssrIsMobile })` | `boolean` | Default breakpoint `768`. |
| `useBreakpoint({ mobileMaxWidth, tabletMaxWidth, ssrBreakpoint })` | `{ isMobile, isTablet, isDesktop, breakpoint }` | |
| `useMediaQuery(query, { ssrMatch })` | `boolean` | Primitive hook. |
| `useViewportSize({ ssrWidth, ssrHeight })` | `{ width, height }` | Resize listener, rAF-batched. |
| `ViewportProvider` | context | Share breakpoint + SSR defaults. |
| `getViewportCookieScript()` | `string` | From `/script`. Inline in `<head>`. |
| `parseViewportCookie(value)` | `boolean \| undefined` | From `/script`. |

Hooks work **without** a provider. The provider is only for shared defaults.

## Local development

```bash
npm install
npm test
npm run build
```

## Publish to npm — step by step

### 1. Create an npm account

Sign up at [https://www.npmjs.com/signup](https://www.npmjs.com/signup) and enable 2FA.

### 2. Pick a unique name

```bash
npm view react-mobile-viewport
```

If that prints package info, the name is taken. Change `"name"` in `package.json`. Scoped names are safer:

```json
{
  "name": "@your-name/react-mobile-viewport"
}
```

Fill in `"author"`, `"repository"`, and `"homepage"` before you publish.

### 3. Log in

```bash
npm login
```

Confirm with:

```bash
npm whoami
```

### 4. Verify the tarball

```bash
npm run build
npm pack --dry-run
```

You should see `dist/`, `package.json`, `README.md`, and `LICENSE` — not `src/` or `node_modules/`.

### 5. Publish

Unscoped public package:

```bash
npm publish --access public
```

Scoped package (`@your-name/...`) must use `--access public` unless you have a paid org.

`prepublishOnly` already runs typecheck, tests, and build.

### 6. First-time checklist

- [ ] Package name is unique
- [ ] Version is `0.1.0` (or `1.0.0` when you are ready)
- [ ] README install command matches the name
- [ ] `npm pack --dry-run` looks right
- [ ] You are logged in (`npm whoami`)
- [ ] 2FA code is ready

### 7. Later versions

Follow [semver](https://semver.org/):

- Bug fix → `0.1.1`
- New compatible API → `0.2.0`
- Breaking change → `1.0.0`

```bash
npm version patch
npm publish --access public
```

### 8. Use it in a Next.js app

```bash
npm install react-mobile-viewport
```

If you test locally before publishing:

```bash
npm pack
# copies a .tgz next to package.json
cd /path/to/your-next-app
npm install /path/to/react-mobile-viewport-0.1.0.tgz
```

## Project layout

```
src/index.ts              Client entry (hooks + provider)
src/script.ts             Server-safe cookie helpers
src/use-is-mobile.ts
src/use-breakpoint.ts
src/use-media-query.ts
src/use-viewport-size.ts
src/provider.tsx
tsup.config.ts            Dual ESM + CJS build, "use client" banner
```

## License

MIT
