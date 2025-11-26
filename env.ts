import {
    defineConfig,
    Schema,
} from '@julr/vite-plugin-validate-env';

export default defineConfig({
    APP_TITLE: Schema.string(),
    APP_UNIFIED_API_ENDPOINT: Schema.string({ format: 'url', protocol: true, tld: false }),
});
