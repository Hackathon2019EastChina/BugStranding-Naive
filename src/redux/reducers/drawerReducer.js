var drawerReducer = (state = {}, action) => {

    switch (action.type) {

        case 'SHOWDRAWER':
            return { ...state, title:action.title,content: action.content, loading: true,closing:false};

        case 'RESETDRAWER':
            return { ...state, loading:false,closing:false};

        case 'CLOSEDRAWER':
            return { ...state, loading:false,closing:true };

        default:
            return state;
    }
}

export default drawerReducer;
