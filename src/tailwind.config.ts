import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        vio: {
          primary: {
            bg: '#f5c600',
          },
        },
      },
    },
  },
}
