
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'AddDatasetModal': typeof import("../components/AddDatasetModal.vue")['default']
    'DatasetCard': typeof import("../components/DatasetCard.vue")['default']
    'DatasetCardNew': typeof import("../components/DatasetCardNew.vue")['default']
    'EditGithub': typeof import("../components/EditGithub.vue")['default']
    'EditGithubSimple': typeof import("../components/EditGithubSimple.vue")['default']
    'FloatingAIChat': typeof import("../components/FloatingAIChat.vue")['default']
    'Footer': typeof import("../components/Footer.vue")['default']
    'MobileSidebar': typeof import("../components/MobileSidebar.vue")['default']
    'ProfileManagerStandard': typeof import("../components/ProfileManagerStandard.vue")['default']
    'SupabaseOperationsDemo': typeof import("../components/SupabaseOperationsDemo.vue")['default']
    'ThreadsBackground': typeof import("../components/ThreadsBackground.vue")['default']
    'ExamplesEditGithubUsage': typeof import("../components/examples/EditGithubUsage.vue")['default']
    'ExamplesProfileGithubExamples': typeof import("../components/examples/ProfileGithubExamples.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ColorScheme': typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'NuxtPage': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyAddDatasetModal': LazyComponent<typeof import("../components/AddDatasetModal.vue")['default']>
    'LazyDatasetCard': LazyComponent<typeof import("../components/DatasetCard.vue")['default']>
    'LazyDatasetCardNew': LazyComponent<typeof import("../components/DatasetCardNew.vue")['default']>
    'LazyEditGithub': LazyComponent<typeof import("../components/EditGithub.vue")['default']>
    'LazyEditGithubSimple': LazyComponent<typeof import("../components/EditGithubSimple.vue")['default']>
    'LazyFloatingAIChat': LazyComponent<typeof import("../components/FloatingAIChat.vue")['default']>
    'LazyFooter': LazyComponent<typeof import("../components/Footer.vue")['default']>
    'LazyMobileSidebar': LazyComponent<typeof import("../components/MobileSidebar.vue")['default']>
    'LazyProfileManagerStandard': LazyComponent<typeof import("../components/ProfileManagerStandard.vue")['default']>
    'LazySupabaseOperationsDemo': LazyComponent<typeof import("../components/SupabaseOperationsDemo.vue")['default']>
    'LazyThreadsBackground': LazyComponent<typeof import("../components/ThreadsBackground.vue")['default']>
    'LazyExamplesEditGithubUsage': LazyComponent<typeof import("../components/examples/EditGithubUsage.vue")['default']>
    'LazyExamplesProfileGithubExamples': LazyComponent<typeof import("../components/examples/ProfileGithubExamples.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyColorScheme': LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const AddDatasetModal: typeof import("../components/AddDatasetModal.vue")['default']
export const DatasetCard: typeof import("../components/DatasetCard.vue")['default']
export const DatasetCardNew: typeof import("../components/DatasetCardNew.vue")['default']
export const EditGithub: typeof import("../components/EditGithub.vue")['default']
export const EditGithubSimple: typeof import("../components/EditGithubSimple.vue")['default']
export const FloatingAIChat: typeof import("../components/FloatingAIChat.vue")['default']
export const Footer: typeof import("../components/Footer.vue")['default']
export const MobileSidebar: typeof import("../components/MobileSidebar.vue")['default']
export const ProfileManagerStandard: typeof import("../components/ProfileManagerStandard.vue")['default']
export const SupabaseOperationsDemo: typeof import("../components/SupabaseOperationsDemo.vue")['default']
export const ThreadsBackground: typeof import("../components/ThreadsBackground.vue")['default']
export const ExamplesEditGithubUsage: typeof import("../components/examples/EditGithubUsage.vue")['default']
export const ExamplesProfileGithubExamples: typeof import("../components/examples/ProfileGithubExamples.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ColorScheme: typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const NuxtPage: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyAddDatasetModal: LazyComponent<typeof import("../components/AddDatasetModal.vue")['default']>
export const LazyDatasetCard: LazyComponent<typeof import("../components/DatasetCard.vue")['default']>
export const LazyDatasetCardNew: LazyComponent<typeof import("../components/DatasetCardNew.vue")['default']>
export const LazyEditGithub: LazyComponent<typeof import("../components/EditGithub.vue")['default']>
export const LazyEditGithubSimple: LazyComponent<typeof import("../components/EditGithubSimple.vue")['default']>
export const LazyFloatingAIChat: LazyComponent<typeof import("../components/FloatingAIChat.vue")['default']>
export const LazyFooter: LazyComponent<typeof import("../components/Footer.vue")['default']>
export const LazyMobileSidebar: LazyComponent<typeof import("../components/MobileSidebar.vue")['default']>
export const LazyProfileManagerStandard: LazyComponent<typeof import("../components/ProfileManagerStandard.vue")['default']>
export const LazySupabaseOperationsDemo: LazyComponent<typeof import("../components/SupabaseOperationsDemo.vue")['default']>
export const LazyThreadsBackground: LazyComponent<typeof import("../components/ThreadsBackground.vue")['default']>
export const LazyExamplesEditGithubUsage: LazyComponent<typeof import("../components/examples/EditGithubUsage.vue")['default']>
export const LazyExamplesProfileGithubExamples: LazyComponent<typeof import("../components/examples/ProfileGithubExamples.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f7cbb1c9e18e35a242b62a0f59b6e286/node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
