import {useUserStore} from "@/store/user.store.js";
import {APISettings} from "@/api/config.js";
import Trans from "@/i18n/translation.js";

class ApiRequest {
    constructor() {
        this.options = defaultParameters();
    }

    enpoint(endpoint) {
        // Relative endpoint
        endpoint = endpoint.startsWith('/') ? endpoint : ('/' + endpoint);
        this.options.endpoint = APISettings.baseURL + endpoint;
        return this;
    }

    rawEnpoint(endpoint) {
        this.options.endpoint = endpoint;
        return this;
    }

    bodyData(data) {
        this.options.bodyData = data;
        return this;
    }

    requiresAuth() {
        this.options.requiresAuth = true;
        return this;
    }

    post() {
        return this.executeRequest('POST');
    }

    put() {
        return this.executeRequest('PUT');
    }

    get() {
        return this.executeRequest('GET');
    }

    patch() {
        return this.executeRequest('PATCH');
    }

    delete() {
        return this.executeRequest('DELETE');
    }

    resetOptions() {
        this.options = defaultParameters();
    }

    executeRequest(requestMethod) {
        const endpoint = this.options.endpoint;

        let init = {
            method: requestMethod,
            headers: preparedHeaders(this.options.requiresAuth, this.options.bodyData),
        };

        if (this.options.bodyData) {
            init.body = this.options.bodyData instanceof FormData ? this.options.bodyData : JSON.stringify(this.options.bodyData);
        }

        this.resetOptions();

        return fetch(endpoint, init);
    }
}

function defaultParameters() {
    return {
        endpoint: '',
        bodyData: null,
        requiresAuth: false,
    };
}

function preparedHeaders(requiresAuth, bodyData = null) {
    let headers = new Headers(APISettings.headers);

    if (requiresAuth) {
        const userStore = useUserStore();
        headers.append("Authorization", `Bearer ${userStore.token}`);
    }
    if (bodyData && !(bodyData instanceof FormData)) {
        headers.append('Content-Type', 'application/json');
    }
    headers.append('Accept-Language', Trans.currentLocale);


    return headers;
}


export default new ApiRequest();
