import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/app-shell";

function NotFoundComponent() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found.</p>
        <a href="/" className="inline-block mt-6 px-5 py-2.5 rounded-md font-medium text-white"
          style={{ background: "var(--gradient-primary)" }}>Back home</a>
      </div>
    </AppShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 px-5 py-2.5 rounded-md font-medium text-white"
          style={{ background: "var(--gradient-primary)" }}
        >Try again</button>
      </div>
    </AppShell>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Detectra AI — Detect. Analyze. Protect." },
      { name: "description", content: "AI-powered digital public safety platform for fraud, scam and counterfeit currency detection." },
      { name: "author", content: "Detectra AI" },
      { property: "og:title", content: "Detectra AI — Detect. Analyze. Protect." },
      { property: "og:description", content: "AI-powered digital public safety platform for fraud, scam and counterfeit currency detection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Detectra AI — Detect. Analyze. Protect." },
      { name: "twitter:description", content: "AI-powered digital public safety platform for fraud, scam and counterfeit currency detection." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0f5399aa-5e2d-4dd1-a4a0-fea0b65b9082" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0f5399aa-5e2d-4dd1-a4a0-fea0b65b9082" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell><Outlet /></AppShell>
    </QueryClientProvider>
  );
}
