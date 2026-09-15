import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js';

CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "bar",
            position: "bottom",
            equalWeightButtons: false,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: false,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            readOnly: true
        },
        analytics: {
            // Remove the GA cookies if a visitor accepts then later rejects.
            autoClear: {
                cookies: [
                    { name: /^_ga/ },
                    { name: '_gid' }
                ]
            }
        }
    },
    language: {
        default: "en",
        autoDetect: "document",
        translations: {
            en: {
                consentModal: {
                    title: "We use cookies",
                    description: "Our website uses essential cookies for its basic functionality and analytics cookies to understand how visitors interact with our site. By clicking 'Accept all', you consent to the use of both necessary and analytics cookies. You can manage your preferences or decline analytics cookies by clicking 'Manage preferences' or 'Reject all'.",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    showPreferencesBtn: "Manage preferences",
                    footer: "<a href=\"https://app.bazam.ai/pages/legals/privacy-policy/\">Privacy Policy</a>\n<a href=\"https://app.bazam.ai/pages/legals/terms/\">Terms and conditions</a>"
                },
                preferencesModal: {
                    title: "Consent Preferences Center",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    savePreferencesBtn: "Save preferences",
                    closeIconLabel: "Close modal",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Your Privacy",
                            description: "When you visit our website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer."
                        },
                        {
                            title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                            description: "These cookies are essential for the website to function properly and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Analytics Cookies",
                            description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "More information",
                            description: "For any query in relation to our policy on cookies and your choices, please visit our <a class=\"cc__link\" href=\"https://app.bazam.ai/pages/legals/privacy-policy/\">Privacy Policy</a> or <a class=\"cc__link\" href=\"https://app.bazam.ai/pages/legals/terms/\">Terms and Conditions</a> page."
                        }
                    ]
                }
            },
            es: {
                consentModal: {
                    title: "Usamos cookies",
                    description: "Nuestro sitio utiliza cookies esenciales para funcionar y cookies analíticas para entender cómo se usa. Puedes aceptar todas, rechazar las analíticas o gestionar tus preferencias.",
                    acceptAllBtn: "Aceptar todas",
                    acceptNecessaryBtn: "Rechazar analíticas",
                    showPreferencesBtn: "Gestionar preferencias",
                    footer: "<a href=\"https://app.bazam.ai/pages/legals/privacy-policy/\">Política de privacidad</a>\n<a href=\"https://app.bazam.ai/pages/legals/terms/\">Términos y condiciones</a>"
                },
                preferencesModal: {
                    title: "Centro de preferencias de consentimiento",
                    acceptAllBtn: "Aceptar todas",
                    acceptNecessaryBtn: "Rechazar analíticas",
                    savePreferencesBtn: "Guardar preferencias",
                    closeIconLabel: "Cerrar",
                    serviceCounterLabel: "Servicio|Servicios",
                    sections: [
                        {
                            title: "Tu privacidad",
                            description: "Cuando visitas nuestro sitio, este puede guardar o recuperar información en tu navegador, principalmente mediante cookies. Puedes decidir qué categorías permites; bloquear algunas puede afectar al funcionamiento del sitio."
                        },
                        {
                            title: "Cookies estrictamente necesarias <span class=\"pm__badge\">Siempre activas</span>",
                            description: "Estas cookies son esenciales para que el sitio funcione y no pueden desactivarse. Se establecen al solicitar servicios como guardar preferencias, iniciar sesión o completar formularios.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Cookies analíticas",
                            description: "Estas cookies nos permiten medir visitas y fuentes de tráfico para mejorar el sitio. La información se agrega y es anónima.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Más información",
                            description: "Si tienes dudas sobre las cookies o tus opciones, consulta nuestra <a class=\"cc__link\" href=\"https://app.bazam.ai/pages/legals/privacy-policy/\">Política de privacidad</a> o los <a class=\"cc__link\" href=\"https://app.bazam.ai/pages/legals/terms/\">Términos y condiciones</a>."
                        }
                    ]
                }
            }
        }
    }
});
