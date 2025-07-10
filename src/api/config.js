export const APISettings = {
    headers: new Headers({
        'Accept': 'application/json'
    }),
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
};
