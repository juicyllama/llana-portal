export enum AuthType {
    JWT = 'JWT',
    API_KEY = 'API_KEY',
    HOST = 'HOST'
}

export type AuthCredentials = {
    username?: string,
    password?: string,
    api_key?: string
}