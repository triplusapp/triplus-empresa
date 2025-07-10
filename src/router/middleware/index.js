import guestMiddleware from "@/router/middleware/guest.js";
import authMiddleware from "@/router/middleware/auth.js";
import companyDataMiddleware from "@/router/middleware/has-company-data.js";
import companyHasEvaluationDateSetMiddleware from "@/router/middleware/has-evaluation-date-set.js";
import companyHasSectorsMiddleware from "@/router/middleware/has-selected-sectors.js";

export default {
    guest: guestMiddleware,
    auth: authMiddleware,
    companyData: companyDataMiddleware,
    companyHasEvaluationDate: companyHasEvaluationDateSetMiddleware,
    companyHasSectors: companyHasSectorsMiddleware,
};
