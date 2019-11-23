var modalReducer = (state = {}, action) => {

    switch (action.type) {

        case 'SHOWSIGNIN':
            return { ...state, signInVisible:true,signUpVisible:false};

        case 'SHOWSIGNUP':
            return { ...state, signInVisible:false,signUpVisible:true};

        case 'CANCELMODAL':
            return { ...state,  signInVisible:false,signUpVisible:false};

        case 'SETONCANCEL':
            return { ...state, onCancel:action.onCancel};

        case 'SHOWSIGNINCANCEL':
            return { ...state, onCancel:action.onCancel, signInVisible:true,signUpVisible:false};

        default:
            return state;
    }
}

export default modalReducer;
