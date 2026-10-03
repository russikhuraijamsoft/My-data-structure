import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app.name": "TalkOS",
      "app.loading": "Loading TalkOS...",
      "auth.login": "Sign In",
    }
  },
  es: {
    translation: {
      "app.name": "TalkOS",
      "app.loading": "Cargando TalkOS...",
      "auth.login": "Iniciar Sesión",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
