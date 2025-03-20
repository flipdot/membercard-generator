import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/shared/utils/nuxt'
import { defu } from 'defu'

import { SITE_NAME, STAGING_HOST } from '../shared/utils/constants'

export default defineNuxtConfig(
  defu(
    {
      css: ['~/assets/css/member-card-generator.css'],
      extends: ['@dargmuesli/nuxt-vio'],
      future: {
        compatibilityVersion: 4,
      },
      runtimeConfig: {
        public: {
          flipdot: {
            memberCardGenerator: {
              paybackCode: '2403586643568',
            },
          },
        },
      },
      vite: {
        optimizeDeps: {
          include: [
            '@intlify/core-base',
            '@vuelidate/core',
            '@vuelidate/validators',
          ],
        },
      },
    },
    VIO_NUXT_BASE_CONFIG({
      siteName: SITE_NAME,
      stagingHost: STAGING_HOST,
    }),
  ),
)
