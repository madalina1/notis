export const BaseFetch = (endpoint: string, queryParams?: { key: string, value: string | number }[]): Promise<any> => {
    let basePath: string = `https://localhost:44357/api/${endpoint}`;

    if (queryParams && queryParams.length) {
        basePath += '?';
        queryParams.forEach((param) => {
            basePath += `${param.key}=${param.value}&`;
        });
        basePath = basePath.slice(0, -1);
    }

    return fetch(basePath).then(response => response.json());
}
