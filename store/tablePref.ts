import { getData, setData } from 'nuxt-storage/local-storage';

export function get(table: string): any {

    const data = getData(table + '::preferences');
    if (data) {
        return JSON.parse(data);
    }
    return {};

}

export function set(table: string, preferences: { [key: string]: any }): any {
    setData(table + '::preferences', JSON.stringify(preferences), 365, 'd');
}