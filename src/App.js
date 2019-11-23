
import React,{Component} from "react"
import {BrowserRouter as Router,Route} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';
import indexRoutes from "./routes/index.jsx";
import {createBrowserHistory} from 'history'
//由于browserHistory的采用，部署时注意配置服务器端
//https://www.thinktxt.com/react/2017/02/26/react-router-browserHistory-refresh-404-solution.html

const hist = createBrowserHistory()
var routesToRoutes = (prop) => {
    return <Route path={prop.path} component={prop.component} />;
}

class App extends Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <Provider store={store}>
                <Router history={hist}>    
                    <div>
                        {indexRoutes.map(routesToRoutes)}
                    </div> 
                </Router>
            </Provider>
        );
    }
}

export default App