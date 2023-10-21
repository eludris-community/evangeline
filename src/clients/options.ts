import { RESTClient } from './rest';

/* The base class for all client options. */
interface BaseClientOptions {
    authorizationToken: string
}

/* The options to be passed in for GatewayClient. */
export interface GatewayClientOptions extends BaseClientOptions {
    /**
     * The Pandemoium (Gateway) URL.
     * Remember to not add a forward-slash at the end of your URL.
     * @default wss://ws.eludris.gay/
     */
    pandemoniumURL?: string;
}

/** The options to be passed in for {@link RESTClient} */
export interface RESTClientOptions extends BaseClientOptions{
    /**
     * The Oprish (REST) URL.
     * Remember to not add a forward-slash at the end of your URL.
     * @default https://api.eludris.gay/
     */
    oprishURL?: string;
    /**
     * The Effis (CDN) URL.
     * Remember to not add a forward-slash at the end of your URL.
     * @default https://cdn.eludris.gay/
     */
    effisURL?: string;
}

/* The options to be passed for both RESTClient and GatewayClient. */
export interface ClientOptions extends RESTClientOptions, GatewayClientOptions {}
