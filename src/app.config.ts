const address = {
  city: '34117 Kassel',
  name: 'Frank Flipdot',
  street: 'Schillerstraße 25',
}

export default defineAppConfig({
  vio: {
    pages: {
      legalNotice: {
        contact: {
          email: 'com@flipdot.org',
        },
        responsibility: {
          address,
        },
        tmg: {
          address,
        },
      },
      privacyPolicy: {
        hostingCdn: {
          external: {
            address: {
              city: '91710 Gunzenhausen, Deutschland',
              name: 'Hetzner Online GmbH',
              street: 'Industriestr. 25',
            },
          },
        },
        mandatoryInfo: {
          responsible: {
            address: {
              ...address,
              email: 'com@flipdot.org',
            },
          },
        },
      },
    },
    themeColor: '#f5c600',
  },
})
