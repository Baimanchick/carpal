 delete mode 100644 src/app/page.tsx
 delete mode 100644 src/app/signup/page.tsx
 delete mode 100644 src/components/guide/quiz-flow.tsx
 delete mode 100644 src/components/guide/road-ready-badge.tsx
 delete mode 100644 src/components/home/cta-host.tsx
 delete mode 100644 src/components/home/featured-cars.tsx
 delete mode 100644 src/components/home/testimonials.tsx
 create mode 100644 src/components/layout/site-header-actions.tsx
 create mode 100644 src/features/leads/components/lead-forms.tsx
 create mode 100644 src/features/leads/components/lead-success.tsx
 create mode 100644 src/features/leads/hooks/use-leads.ts
 create mode 100644 src/features/leads/model/leads.types.ts
 create mode 100644 src/features/leads/model/utm.ts
 delete mode 100644 src/i18n/actions.ts
 rename src/i18n/{client.ts => client.tsx} (69%)
 create mode 100644 src/i18n/error-handling.ts
 create mode 100644 src/i18n/navigation.ts
 create mode 100644 src/i18n/routing.ts
 create mode 100644 src/lib/contacts.ts
 delete mode 100644 src/lib/guide-content.ts
 create mode 100644 src/proxy.ts
 create mode 100644 src/services/leads/leads.service.ts
baimurat@MacBookAir frontend % git push 
Enumerating objects: 112, done.
Counting objects: 100% (112/112), done.
Delta compression using up to 8 threads
Compressing objects: 100% (69/69), done.
Writing objects: 100% (74/74), 33.08 KiB | 3.67 MiB/s, done.
Total 74 (delta 25), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (25/25), completed with 25 local objects.
To github.com:Baimanchick/carpal.git
   7019c09..772837d  main -> main
baimurat@MacBookAir frontend % clear

baimurat@MacBookAir frontend % 
































baimurat@MacBookAir frontend % npm run build 

> frontend@0.1.0 build
> next build

▲ Next.js 16.2.4 (Turbopack)
- Environments: .env

  Creating an optimized production build ...
✓ Compiled successfully in 3.8s
✓ Finished TypeScript in 3.1s    
✓ Collecting page data using 7 workers in 551ms    
Error: ENVIRONMENT_FALLBACK
    at <unknown> (.next/server/chunks/ssr/_0e9-z88._.js:1:33142)
    at <unknown> (.next/server/chunks/ssr/_0e9-z88._.js:1:33922)
    at <unknown> (.next/server/chunks/ssr/src_0utd.dl._.js:1:2870) {
  code: 'ENVIRONMENT_FALLBACK'
}
⨯ useSearchParams() should be wrapped in a suspense boundary at page "/[locale]/login". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    at S (/Users/baimurat/Work/carpal/frontend/.next/server/chunks/ssr/node_modules_0mynt8d._.js:2:2692)
    at r (/Users/baimurat/Work/carpal/frontend/.next/server/chunks/ssr/node_modules_0mynt8d._.js:4:6760)
    at /Users/baimurat/Work/carpal/frontend/.next/server/chunks/ssr/src_0utd.dl._.js:1:2916
    at an (/Users/baimurat/Work/carpal/frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:84267)
    at ai (/Users/baimurat/Work/carpal/frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:86086)
    at ai (/Users/baimurat/Work/carpal/frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:104615)
    at al (/Users/baimurat/Work/carpal/frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:107860)
    at ao (/Users/baimurat/Work/carpal/frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:105275)
    at am (/Users/baimurat/Work/carpal/frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:112789)
    at au (/Users/baimurat/Work/carpal/frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:109892)
Error occurred prerendering page "/ru/login". Read more: https://nextjs.org/docs/messages/prerender-error
Export encountered an error on /[locale]/login/page: /ru/login, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
baimurat@MacBookAir frontend % 
