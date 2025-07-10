import {useUserStore} from "@/store/user.store.js";
import SharedMethods from "@/shared/SharedMethods.js";
import {useI18n} from "vue-i18n";

function handleJsonResponse(response, includeAllErrors = false) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (response.ok) {
            return data;
        }

        const userStore = useUserStore();
        const errorMessage = (data && data.message) || response.statusText;

        if (
            errorMessage != 'platform_closed' && [401, 403].includes(response.status) && userStore.isLoggedIn
        ) {
            userStore.logout();
        }
        if (!includeAllErrors) {
            return Promise.reject(errorMessage);
        }
        const errors = (data && data.errors) || [];
        return Promise.reject({
            message: errorMessage,
            errors: errors
        });
    });
}

function handleBlobResponse(response) {
    return response.blob();
}

export default {
    handleJsonResponse: (response) => handleJsonResponse(response, false),
    handleJsonResponseWithDetailedErrors: (response) => handleJsonResponse(response, true),
    handleBlobResponse: (response) => handleBlobResponse(response),
};
