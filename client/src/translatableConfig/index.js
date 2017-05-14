function translatableConfig(i18n) {
  return {
    recalbox: {
      // Audio
      audio: {
        devices: [
          { id: '', text: '–' },
          { id: 'auto', text: i18n.t('Automatique') },
          { id: 'hdmi', text: i18n.t('Prise HDMI') },
          { id: 'jack', text: i18n.t('Prise Jack') },
        ]
      },

      // Controllers
      controllers: {
        ps3drivers: [
          { id: '', text: '–' },
          { id: 'official', text: i18n.t('Officiel') },
          { id: 'shanwan', text: i18n.t('Shanwan') },
          { id: 'bluez', text: i18n.t('Bluez 5') },
        ]
      },

      // Configuration
      configuration: {
        updatesTypes: [
          { id: '', text: '–' },
          { id: 'stable', text: i18n.t('Stable') },
          { id: 'beta', text: i18n.t('Bêta') },
          { id: 'unstable', text: i18n.t('Instable') },
        ],
      },

      // Systems
      systems: {
        ratio: [
          { id: '', text: '–' },
          { id: 'auto', text: i18n.t('Automatique') },
          { id: '4/3', text: '4/3' },
          { id: '16/9', text: '16/9' },
          { id: '16/10', text: '16/10' },
          { id: 'custom', text: i18n.t('Personnalisé') },
        ],

        shaderset: [
          { id: '', text: '–' },
          { id: 'none', text: i18n.t('Aucun') },
          { id: 'retro', text: i18n.t('Retro') },
          { id: 'scanlines', text: i18n.t('Scanlines') },
        ],
      },
    },
  };
}

module.exports = translatableConfig;
