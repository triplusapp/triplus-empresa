import {defineStore} from 'pinia';

import router from '../router';
import TraceabilityApiMethods from "@/api/TraceabilityApiMethods.js";
import {Preferences} from '@capacitor/preferences';
import Translation from "@/i18n/translation.js";

export const useUserStore = defineStore({
    id: 'auth',
    state: () => ({
        isLoggedIn: false,
        user: {
            name: null,
            email: null,
            isMainUser: false,
        },
        company: {
            id: null,
            name: null,
        },
        token: null,
        returnUrl: null
    }),
    actions: {
        async fetchUserFromStore() {
            if (this.isLoggedIn) {
                return;
            }
            const serializedUserData = await Preferences.get({key: 'user'});
            const tokenData = await Preferences.get({key: 'user_api_token'});
            const responseData = JSON.parse(serializedUserData.value);
            const token = tokenData.value;

            if (token === null) {
                return;
            }

            this.user.email = responseData.email;
            this.user.name = responseData.name;
            if (!responseData.company || !responseData.company.main_user_id) {
                this.logout();
                return;
            }
            this.company.id = responseData.company.id;
            this.company.name = responseData.company.name;
            this.user.isMainUser = responseData.company.main_user_id === responseData.id;
            this.token = token;
            this.isLoggedIn = true;
        },
        async login(email, password) {
            const responseData = await TraceabilityApiMethods.login(email, password);

            // update pinia state
            this.user = responseData.user;
            this.token = responseData.token;

            // store the user data
            await Preferences.set({
                key: 'user',
                value: JSON.stringify(this.user),
            });

            // store the user api token
            await Preferences.set({
                key: 'user_api_token',
                value: this.token,
            });

            // Set user stored locale
            if (responseData.user.locale) {
                Translation.switchLanguage(responseData.user.locale);
            }

            // redirect to previous url or default to home page
            await router.push(this.returnUrl || '/');
        },
        async register(company_name, name, email, password, locale) {
            const responseData = await TraceabilityApiMethods.register(company_name, name, email, password, locale);

            // update pinia state
            this.user = responseData.user;
            this.token = responseData.token;

            // store the user data
            await Preferences.set({
                key: 'user',
                value: JSON.stringify(this.user),
            });

            // store the user api token
            await Preferences.set({
                key: 'user_api_token',
                value: this.token,
            });

            // redirect to home page
            await router.push('/');
        },
        async logout() {
            await TraceabilityApiMethods.logout();

            this.user = null;
            this.token = null;
            this.isLoggedIn = false;

            await Preferences.remove({key: 'user'});
            await Preferences.remove({key: 'user_api_token'});

            await router.push(Translation.i18nRoute({name: 'login'}));
        },
        async clearAll() {
            await Preferences.clear();
            this.isLoggedIn = false;
            this.user = {
                name: null,
                email: null,
                isMainUser: null,
            };
            this.company = {
                id: null,
                name: null,
            };
            this.token = null;
            this.returnUrl = null;
        },

        async updateEmail(email) {
            // update pinia state
            this.user.email = email;

            // Get the current stored user data
            const serializedUserData = await Preferences.get({key: 'user'});
            const userData = JSON.parse(serializedUserData.value);

            await Preferences.set({
                key: 'user',
                value: JSON.stringify({
                    ...userData,
                    email: email
                }),
            });
        },

        async setCompanyMainUser(userId) {
            this.user.isMainUser = false;

            // Get the current stored user data
            const serializedUserData = await Preferences.get({key: 'user'});
            const userData = JSON.parse(serializedUserData.value);

            // Update the main_user_id of the company object
            userData.company.main_user_id = userId;

            // Store the complete user data with company information
            await Preferences.set({
                key: 'user',
                value: JSON.stringify(userData),
            });

            // Navigate to the current route to refresh the components
            const currentRoute = router.currentRoute.value;
            await router.push({...currentRoute, force: true});
        },
    }
});
