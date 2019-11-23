var identityReducer = (state = {}, action) => {

    switch (action.type) {

        case 'LOGINASUSER':
            return { ...state, user: action.user, admin: null,sales:null};

        case 'LOGINASADMIN':
            return { ...state, user: null, admin: action.admin,sales:null};

        case 'LOGINASSALES':
            return { ...state, user: null, admin: null,sales:action.sales};

        case 'LOGOUT':
            return { ...state, user: null, admin:null,sales:null};

        default:
            return state;
    }
}

export default identityReducer;
