import middleware from "@/router/middleware/index.js";
import {RouterView} from "vue-router";
import Translation from "@/i18n/translation";

export default [
    {
        path: "/:locale?",
        component: RouterView,
        beforeEnter: Translation.routeMiddleware,
        children: [
            {
                name: 'home',
                path: '',
                component: () => import('@/views/HomePage.vue'),
            },
            {
                name: 'login',
                path: 'login',
                component: () => import ('@/views/LoginPage.vue'),
                meta: {
                    middleware: middleware.guest,
                },
            },
            {
                name: 'forgot-password',
                path: 'forgot-password',
                component: () => import ('@/views/ForgotPasswordPage.vue'),
                meta: {
                    middleware: middleware.guest,
                },
            },
            {
                name: 'reset-password',
                path: 'reset-password/:token',
                component: () => import ('@/views/ResetPasswordPage.vue'),
                meta: {
                    middleware: middleware.guest,
                },
            },
            {
                name: 'register',
                path: 'register',
                component: () => import ('@/views/RegisterPage.vue'),
                meta: {
                    middleware: middleware.guest,
                },
            },
            {
                name: 'help',
                path: 'help',
                component: () => import ('@/views/HelpPage.vue'),
            },
            {
                name: 'contact',
                path: 'contact',
                component: () => import ('@/views/ContactPage.vue'),
            },
            {
                name: 'profile',
                path: 'profile',
                component: () => import ('@/views/ProfilePage.vue'),
                meta: {
                    middleware: [middleware.auth, middleware.companyHasEvaluationDate]
                },
            },
            {
                name: 'account',
                path: 'account',
                component: () => import ('@/views/AccountPage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            },
            {
                name: 'evaluation-date',
                path: 'evaluation-date',
                component: () => import ('@/views/EvaluationDatePage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            },
            {
                name: 'company',
                path: 'company',
                component: () => import ('@/views/CompanyPage.vue'),
                meta: {
                    middleware: [middleware.auth, middleware.companyHasEvaluationDate, middleware.companyData, middleware.companyHasSectors],
                },
            },
            {
                name: 'sectors',
                path: 'sectors',
                component: () => import ('@/views/SectorsPage.vue'),
                meta: {
                    middleware: [middleware.auth, middleware.companyHasEvaluationDate, middleware.companyData]
                },
            },
            {
                name: 'sector',
                path: 'sectors/:sectorId',
                component: () => import ('@/views/SectorPage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            },
            {
                name: 'products',
                path: 'products',
                component: () => import ('@/views/ProductsPage.vue'),
                meta: {
                    middleware: [middleware.auth, middleware.companyHasEvaluationDate, middleware.companyData, middleware.companyHasSectors]
                },
            },
            {
                name: 'product-evaluation',
                path: 'product-evaluation/:productId',
                component: () => import ('@/views/ProductEvaluationPage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            },
            {
                name: 'product',
                path: 'product/:productId?',
                component: () => import ('@/views/ProductPage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            },
            {
                name: 'indicator',
                path: ':evaluableModelType/indicator-evaluation/:indicatorId/:evaluableModelId',
                component: () => import ('@/views/IndicatorPage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            },
            {
                name: 'legal-documents',
                path: 'legal-documents',
                component: () => import ('@/views/LegalDocumentsPage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            },
            {
                name: 'audit-reports',
                path: 'audit-reports',
                component: () => import ('@/views/AuditReportsPage.vue'),
                meta: {
                    middleware: middleware.auth,
                },
            }
        ]
    }
];
