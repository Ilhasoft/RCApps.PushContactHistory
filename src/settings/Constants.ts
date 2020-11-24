import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export const RC_SERVER_URL = 'Site_Url';

export const CONFIG_RAPIDPRO_AUTH_TOKEN = 'config_rapidpro_auth_token';
export const CONFIG_RAPIDPRO_URL = 'config_rapidpro_url';
export const CONFIG_REQUEST_TIMEOUT = 'config_request_timeout';
export const CONFIG_HISTORY_TIME = 'condif_history_time';

export const APP_SETTINGS: Array<ISetting> = [
    {
        id: CONFIG_RAPIDPRO_AUTH_TOKEN,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false,
        i18nLabel: CONFIG_RAPIDPRO_AUTH_TOKEN,
    },
    {
        id: CONFIG_RAPIDPRO_URL,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false,
        i18nLabel: CONFIG_RAPIDPRO_URL,
    },
    {
        id: CONFIG_HISTORY_TIME,
        type: SettingType.NUMBER,
        packageValue: 6,
        required: false,
        public: false,
        i18nLabel: CONFIG_HISTORY_TIME,
    },
    {
        id: CONFIG_REQUEST_TIMEOUT,
        type: SettingType.NUMBER,
        packageValue: 15,
        required: true,
        public: false,
        i18nLabel: CONFIG_REQUEST_TIMEOUT,
    },
];
