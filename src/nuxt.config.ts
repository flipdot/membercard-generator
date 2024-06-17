import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/utils/nuxt'
import { defu } from 'defu'

import { SITE_NAME, STAGING_HOST } from './utils/constants'

export default defineNuxtConfig(
  defu(
    {
      extends: ['@dargmuesli/nuxt-vio'],
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
          include: ['@vuelidate/core', '@vuelidate/validators'],
        },
      },
    },
    VIO_NUXT_BASE_CONFIG({
      siteName: SITE_NAME,
      stagingHost: STAGING_HOST,
    }),
  ),
)
