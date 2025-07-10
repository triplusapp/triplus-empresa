import {useUserStore} from "@/store/user.store.js";
import {APISettings} from './config.js';
import ApiRequest from "@/api/ApiRequest.js";
import ApiResponse from "@/api/ApiResponse.js";

export default {
    // User
    login(email, password) {
        return ApiRequest
            .enpoint('login')
            .bodyData({email, password})
            .post()
            .then(ApiResponse.handleJsonResponse);
    },
    logout() {
        return ApiRequest
            .enpoint('logout')
            .requiresAuth()
            .post()
            .then(ApiResponse.handleJsonResponse)
            .catch((errorResponse) => console.log(errorResponse));
    },
    forgotPassword(email) {
        return ApiRequest
            .enpoint('forgot-password')
            .bodyData({email})
            .post()
            .then(ApiResponse.handleJsonResponse);
    },
    resetPassword(token, email, password, password_confirmation) {
        return ApiRequest
            .enpoint('reset-password')
            .bodyData({token, email, password, password_confirmation})
            .post()
            .then(ApiResponse.handleJsonResponseWithDetailedErrors);
    },
    register(company_name, name, email, password, locale) {
        return ApiRequest
            .enpoint('register')
            .bodyData({company_name, name, email, password, locale})
            .post()
            .then(ApiResponse.handleJsonResponseWithDetailedErrors);
    },

    updateUserLocale(locale) {
        return ApiRequest
            .enpoint('locale')
            .requiresAuth()
            .bodyData({locale})
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    updateUserEmail(email) {
        return ApiRequest
            .enpoint('user/email')
            .requiresAuth()
            .bodyData({email})
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    updateUserPassword(old_password, password, password_confirmation) {
        return ApiRequest
            .enpoint('user/password')
            .requiresAuth()
            .bodyData({old_password, password, password_confirmation})
            .put()
            .then(ApiResponse.handleJsonResponseWithDetailedErrors);
    },
    // Company
    fetchCompany() {
        return ApiRequest
            .enpoint('company')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    updateCompanyIndicatorsData(data) {
        return ApiRequest
            .enpoint('company/indicators-data')
            .bodyData(data)
            .requiresAuth()
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    updateCompanyValidationDate(evaluations_open_at) {
        return ApiRequest
            .enpoint('company/evaluations-date')
            .bodyData({
                evaluations_open_at: evaluations_open_at
            })
            .requiresAuth()
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    setEvaluationsAsFinished() {
        return ApiRequest
            .enpoint('company/finished-evaluations')
            .requiresAuth()
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    checkEvaluationsCanBeFinished() {
        return ApiRequest
            .enpoint('company/check-can-finish-evaluations')
            .requiresAuth()
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    updateCompanyPublicData(data) {
        return ApiRequest
            .enpoint('company/public-data')
            .bodyData(data)
            .requiresAuth()
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    updateCompanySectors(data) {
        return ApiRequest
            .enpoint('company/sectors')
            .bodyData(data)
            .requiresAuth()
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchAllSectors() {
        return ApiRequest
            .enpoint('sectors')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    companyHadAnsweredNumWorkersRelatedIndicadors() {
        return ApiRequest
            .enpoint('company/had-answered-num-workers-related-indicadors')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },

    // Indicators
    fetchCompanyIndicators() {
        return ApiRequest
            .enpoint('company-indicators')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchCompanyIndicatorsInformation() {
        return ApiRequest
            .enpoint('company-information')
            .requiresAuth()
            .post()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchSectorIndicators(sectorId) {
        return ApiRequest
            .enpoint('sector-indicators/' + sectorId)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchSectorsIndicatorsInformation(sectorsIds) {
        return ApiRequest
            .enpoint('sectors-information')
            .bodyData({
                sectors_ids: sectorsIds
            })
            .requiresAuth()
            .post()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchProductIndicators(productId) {
        return ApiRequest
            .enpoint('product-indicators/' + productId)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchProductsIndicatorsInformation(productsIds) {
        return ApiRequest
            .enpoint('products-information')
            .bodyData({
                products_ids: productsIds
            })
            .requiresAuth()
            .post()
            .then(ApiResponse.handleJsonResponse);
    },

    fetchScores(productId) {
        return ApiRequest
            .enpoint('scores/' + productId)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchIndicatorWithAnwser(indicatorId, evaluableModelId) {
        return ApiRequest
            .enpoint('indicator-evaluation/' + indicatorId + '/' + evaluableModelId)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    replicateIndicatorAnswer(indicatorId, evaluableModelId, data) {
        return ApiRequest
            .enpoint('replicate-indicator-evaluation/' + indicatorId + '/' + evaluableModelId)
            .requiresAuth()
            .bodyData(data)
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    saveIndicatorAnswer(indicatorId, evaluableModelId, data) {
        return ApiRequest
            .enpoint('indicator-evaluation/' + indicatorId + '/' + evaluableModelId)
            .requiresAuth()
            .bodyData(data)
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    deleteIndicatorAnswer(indicatorId, evaluableModelId) {
        return ApiRequest
            .enpoint('indicator-evaluation/' + indicatorId + '/' + evaluableModelId)
            .requiresAuth()
            .delete()
            .then(ApiResponse.handleJsonResponse);
    },
    toggleDismissIndicatorAnswer(indicatorId, evaluableModelId) {
        return ApiRequest
            .enpoint(`indicator-evaluation/${indicatorId}/${evaluableModelId}/toggle-dismiss`)
            .requiresAuth()
            .patch()
            .then(ApiResponse.handleJsonResponse);
    },

    // Indicator Files
    uploadEvaluationFile(formData) {
        return ApiRequest
            .enpoint('evaluations-files/upload-file')
            .requiresAuth()
            .bodyData(formData)
            .post()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchEvaluationFile(fileUrl) {
        return ApiRequest
            .rawEnpoint(fileUrl)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleBlobResponse);
    },

    // Products
    createProduct(data) {
        return ApiRequest
            .enpoint('products')
            .bodyData(data)
            .requiresAuth()
            .post()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchProducts(pageNumber = 1, perPage = 15, selectedBrandId = '') {
        return ApiRequest
            .enpoint('products?page=' + pageNumber + '&perPage=' + perPage + '&brandId=' + selectedBrandId)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchProduct(productId) {
        return ApiRequest
            .enpoint('products/' + productId)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    deleteProduct(productId) {
        return ApiRequest
            .enpoint('products/' + productId)
            .requiresAuth()
            .delete()
            .then(ApiResponse.handleJsonResponse);
    },
    updateProduct(productId, data) {
        return ApiRequest
            .enpoint('products/' + productId)
            .requiresAuth()
            .bodyData(data)
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchProductCategories(countryCode, regionCode) {
        return ApiRequest
            .enpoint('product-categories')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    // Location
    fetchCountries() {
        return ApiRequest
            .enpoint('countries')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchRegions(countryCode) {
        return ApiRequest
            .enpoint('regions/' + countryCode)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchCities(countryCode, regionCode) {
        return ApiRequest
            .enpoint('cities/' + countryCode + '/' + regionCode)
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },

    // Formulas
    fetchFormulaSalariDigne() {
        return ApiRequest
            .enpoint('formula/salari-digne')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchFormulaHeterogeneitatEspacialExplotacio() {
        return ApiRequest
            .enpoint('formula/heterogeneitat-espacial-explotacio')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchCompanyUsers() {
        return ApiRequest
            .enpoint('company/users')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    addCompanyUser(name, email) {
        return ApiRequest
            .enpoint('company/users')
            .requiresAuth()
            .bodyData({name, email})
            .post()
            .then(ApiResponse.handleJsonResponseWithDetailedErrors);
    },
    deleteCompanyUser(userId) {
        return ApiRequest
            .enpoint('company/users/' + userId)
            .requiresAuth()
            .delete()
            .then(ApiResponse.handleJsonResponse);
    },
    setMainCompanyUser(userId) {
        return ApiRequest
            .enpoint('company/users/main-user')
            .requiresAuth()
            .bodyData({user_id: userId})
            .put()
            .then(ApiResponse.handleJsonResponse);
    },
    deleteAccount() {
        return ApiRequest
            .enpoint('user')
            .requiresAuth()
            .delete()
            .then(ApiResponse.handleJsonResponse);
    },
    contact(email, phone, message) {
        return ApiRequest
            .enpoint('contact')
            .bodyData({email, phone, message})
            .post()
            .then(ApiResponse.handleJsonResponseWithDetailedErrors);
    },
    fetchEdificacionsTypes() {
        return ApiRequest
            .enpoint('edificacio-types')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchEdificacions() {
        return ApiRequest
            .enpoint('edificacions')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchObradors() {
        return ApiRequest
            .enpoint('obradors')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    deleteEdificacio(edificacioId) {
        return ApiRequest
            .enpoint('edificacions/' + edificacioId)
            .requiresAuth()
            .delete()
            .then(ApiResponse.handleJsonResponse);
    },
    addEdificacio(edificacio_type, name, location, latitude, longitude, address_components) {
        return ApiRequest
            .enpoint('edificacions')
            .requiresAuth()
            .bodyData({edificacio_type, name, location, latitude, longitude, address_components})
            .post()
            .then(ApiResponse.handleJsonResponseWithDetailedErrors);
    },
    updateEdificacio(edificacioId, edificacio_type, name, location, latitude, longitude, address_components) {
        return ApiRequest
            .enpoint('edificacions/'+edificacioId)
            .requiresAuth()
            .bodyData({edificacio_type, name, location, latitude, longitude, address_components})
            .put()
            .then(ApiResponse.handleJsonResponseWithDetailedErrors);
    },
    uploadCompanyDunFile(formData) {
        return ApiRequest
            .enpoint('company/dun-file')
            .requiresAuth()
            .bodyData(formData)
            .post()
            .then(ApiResponse.handleJsonResponse);
    },
    deleteCompanyDunFile() {
        return ApiRequest
            .enpoint('company/dun-file')
            .requiresAuth()
            .delete()
            .then(ApiResponse.handleJsonResponse);
    },
    downloadDunFile() {
        return ApiRequest
            .enpoint('company/dun-file')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleBlobResponse);
    },
    downloadEvaluationPdf(productId) {
        return ApiRequest
            .enpoint('evaluations/' + productId + '/download-pdf-scores')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleBlobResponse);
    },
    fetchLegalDocuments() {
        return ApiRequest
            .enpoint('documents')
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchFaqs() {
        return ApiRequest
            .enpoint('faqs')
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    fetchCompanyLegalDocuments() {
        return ApiRequest
            .enpoint('company-legal-documents')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    downloadCompanyLegalDocument(documentId) {
        return ApiRequest
            .enpoint('company-legal-documents/' + documentId + '/download')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleBlobResponse);
    },
    fetchCompanyAuditReports() {
        return ApiRequest
            .enpoint('company-audit-reports')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleJsonResponse);
    },
    downloadCompanyAuditReport(reportId) {
        return ApiRequest
            .enpoint('company-audit-reports/' + reportId + '/download')
            .requiresAuth()
            .get()
            .then(ApiResponse.handleBlobResponse);
    }
};
