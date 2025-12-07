/* export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const MEDIA_URL = process.env.PROVIDER_AND_MEDIA_URL
export const API_FILE = process.env.API_FILE

// Auth endpoints
export const LOGIN_URL = `${API_URL}/auth/signin`
export const AUTH_URL = `${API_URL}/verify-token`
export const GET_ACTIONNAIRES_URL= `${API_URL}/users/my-actions`;

export const INITIATE_WITHDRAWAL_URL= `${API_URL}/dividends/withdraw/initiate`;
export const CONFIRM_WITHDRAWAL_URL= `${API_URL}/dividends/withdraw/confirm`;
export const REGISTER_URL = `${API_URL}/auth/signUp` */


export const API_URL = process.env.NEXT_PUBLIC_API_URL


// Auth endpoints
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL_FOR_ACTIONNAIRE = `${API_URL}/signupForActionnaire`
export const AUTH_URL = `${API_URL}/verify-token`
export const GET_ACTIONNAIRES_URL= `${API_URL}/getAllActionnaire`;
export const GET_BENEFICES_URL= `${API_URL}/actionnaire/benefices-entreprise`;
export const GET_ACTIONNAIRES_URL_2= `${API_URL}/getMyProfile`;
export const INITIATE_WITHDRAWAL_URL= `${API_URL}/dividends/withdraw/initiate`;
export const CONFIRM_WITHDRAWAL_URL= `${API_URL}/dividends/withdraw/confirm`;
export const REGISTER_URL = `${API_URL}/auth/signUp`//okk
export const REGISTER_INITIATE_URL = `${API_URL}/createAccount`;
export const REGISTER_VERIFY_OTP_URL = `${API_URL}/createAccount/verify-otp`;
export const REGISTER_RESEND_OTP_URL = `${API_URL}/api/auth/signup/resend-otp`;
export const USERSBYID_URL = `${API_URL}/get-user`
export const CHANGE_PASSWORD_URL = `${API_URL}/change-password`
export const GET_TRANSACTIONS_URL = `${API_URL}/getransactionbyuser`
export const GET_TRANSACTIONS_ACTIONS_SELL_BY_USER_URL = `${API_URL}/actions/sellActionsBetweenUser`
export const GET_TRANSACTIONS_PURCHASE_URL = `${API_URL}/actions/admin/transactions`
export const GET_MY_OWN_TRANSACTIONS_PURCHASE_URL = `${API_URL}/myRequestToSellAction`
export const GET_TRANSACTIONS_PURCHASE_URL_FOR_ACTIONNAIRE = `${API_URL}/getransactionbyuser`
export const GET_TRANSACTIONS_PURCHASE_URL_FOR_ADMIN = `${API_URL}/getAllTransactions`
export const VERIFYOTP_URL = `${API_URL}/auth/verify-otp`
export const GET_MY_ACTIONS_URL = `${API_URL}/api/my-actions`;
export const TOGGLE_ACTIONNAIRE_STATUS_URL = `${API_URL}/admin/actionnaires/toggle-status`;
export const RECALCULATE_DIVIDENDES_URL = `${API_URL}/actionnaires/recalculate-dividendes`;////
export const  UPDATE_USER_URL  = `${API_URL}/admin/users`;
export const  CREATE_ACTIONNAIRE_URL  = `${API_URL}/createActionnaire`;
export const    ADD_NEW_YEAR_URL   = `${API_URL}/entreprises/new-year`;
export const  REQUEST_PASSWORD_RESET_URL  = `${API_URL}/request-password-reset`;
export const  VERIFY_RESET_OTP_URL  = `${API_URL}/verify-reset-otp`;
export const  RESEND_RESET_OTP_URL  = `${API_URL}/resend-reset-otp`;
export const  DELETE_USER_URL  = `${API_URL}/deteleUser`;
export const  DELETE_MULTIPLE_URL  = `${API_URL}/deleteMultipleUsers/batch`;
export const  INITIATE_ACTIONS_PURCHASE_URL  = `${API_URL}/actions/acheter`;
export const  PURCHASE_ACTIONS_WITH_DIVIDENDS_URL  = `${API_URL}/actions/acheter-dividendes`;
//Events PURCHASE_ACTIONS_WITH_DIVIDENDS_URL
export const ADD_PROJECTION_URL = `${API_URL}/projections/addPrevision`;
export const GET_OWNER_URL = `${API_URL}/getTheOwner`;
export const GET_STATISTIQUE_PROJECT = `${API_URL}/getTransactionsByProcess`;
export const GET_PROJECTIONS_URL = `${API_URL}/projections/getPrevision`;
export const PROJECT_FUTURE_URL = `${API_URL}/projections/project-future`;
export const UPDATE_PROJECTION_URL = `${API_URL}/projections`;
export const DELETE_PROJECTION_URL = `${API_URL}/projections`;
export const INITIATE_ACTIONS_SALE_URL = `${API_URL}/create`;
export const SELL_ACTIONS_BETWEEN_USERS_URL = `${API_URL}/sellActionsBetweenUser`;
// Dans le fichier endpoint.ts, ajoutez :
export const VERIFY_OTP_URL = `${API_URL}/verify-otp`;
export const RESEND_OTP_URL = `${API_URL}/resend-otp`;
export const GET_MY_SALE_REQUESTS_URL = `${API_URL}/my-requests`;  
export const GET_ALL_SALE_REQUESTS_URL = `${API_URL}/GetallActionToSell`;
export const APPROVE_SALE_URL = `${API_URL}/approve`;
export const REJECT_SALE_URL = `${API_URL}/reject`;;
export const PARTICIPATE_PROJECT_URL = `${API_URL}/participeToProject`;;
export const GET_ALL_PROJECTS_URL = `${API_URL}/getAllProject`;
export const GET_ALL_PROJECTS_BYUSER_URL = `${API_URL}/getProjectByUser`;
export const PAY_PROJECT_PARTICIPATION_URL = `${API_URL}/giveYourDividendToTheProject`;
export const GET_PROJECT_PARTICIPANTS_URL = `${API_URL}/projects`;
export const DECREASE_PARTICIPANT_PACKS_URL = `${API_URL}/projects/:projectId/participants/:userId/decrease`;
export const INCREASE_PARTICIPANT_PACKS_URL = `${API_URL}/projects/:projectId/participants/:userId/increase`;
export const BUY_ACTIONS_URL = `${API_URL}/buyActions`;
export const DEDUCT_FEES_URL = `${API_URL}/deduceFees`;
export const GET_MY_ACTIONS_PURCHASES_URL = `${API_URL}/buyActions`;
export const ADD_PROJECT_URL = `${API_URL}/createAnProject`;
export const GET_ACTION_PRICE_URL = `${API_URL}/action/getPrice`;
export const UPDATE_ACTION_PRICE_URL = `${API_URL}/action/price`;
export const WITHDRAW_INITIATE_URL = `${API_URL}/dividends/withdraw/initiate`;
export const WITHDRAW_CONFIRM_URL = `${API_URL}/dividends/withdraw/confirm`;
export const GET_ADMIN_BALANCE_URL = `${API_URL}/get-admin`; // Utiliser l'endpoint existant
export const UPDATE_PROFILE_URL = `${API_URL}/updateProfile`;

export const UPDATE_PROJECT_URL = `${API_URL}/updateProject`;
export const DELETE_PROJECT_URL = `${API_URL}/deleteProject`;
