var keywordReducer = (state = {}, action) => {

    switch (action.type) {

        case 'SETKEYWORD':
            return { ...state, keyword:action.keyword};

        case 'RESETKEYWORD':
            return { ...state, keyword:null};

        default:
            return state;
    }
}

export default keywordReducer;
