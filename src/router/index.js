import {createRouter, createWebHistory} from '@ionic/vue-router';
import {useUserStore} from '@/store/user.store.js';
import routes from '@/router/routes.js';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Then run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware});
    };
}

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    await userStore.fetchUserFromStore();
    if (!to.meta.middleware) {
        return next();
    }

    const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];

    const context = {
        from,
        next,
        to,
        router,
        userStore
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({...context, next: nextMiddleware});
});

export default router;
