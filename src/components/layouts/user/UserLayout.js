import React,{Component, Children} from "react";
import { Router, Route,withRouter } from "react-router-dom";
import { BackTop, Row, Layout} from 'antd';
import {loginAsUser,logout,setOnCancel,showSignIn,showSignUp,cancelModal} from '../../../redux/actions/action';
import mainRoutes from "../../../routes/routes";
import PrivateRoute from "../../PrivateRoute"
import BaseHeader from "./BaseHeader"
import BaseComponent from "../../BaseComponent"
import AuthModal from "../../auth/authModal"
import BaseDrawer from "../../BaseDrawer"

import { connect } from 'react-redux';

const {Header,Content}=Layout;
const mapStateToProps = state => ({
    user: state.identityReducer.user,
    signInVisible:state.modalReducer.signInVisible,
    signUpVisible:state.modalReducer.signUpVisible,
})
class UserLayout extends BaseComponent {
    
    constructor(props){
        super(props);
        this.state = {
            items:[
                {key:"/user/home",name:"Homepage",icon:"home"},
                {key:"/user/list",name:"QA Lists",icon:"unordered-list"},
                {key:"/user/my",name:"My QA",icon:"user"}
            ],
        }
    }
    
    componentWillMount(){
        if(localStorage.getItem("user")!=null){
            const user=localStorage.getItem("user")
            this.props.dispatch(loginAsUser(user))
        }else{
            this.props.dispatch(logout())
            localStorage.clear()
        }
        this.props.dispatch(setOnCancel(this.onCancel))
    }

    createRoutes = (routes) => {
        return (
            routes.map((prop, key) => {
                    return <PrivateRoute 
                    role={0}
                    auth={prop.auth}
                    path={prop.path} 
                    component={prop.component} 
                    key={key} 
                    user={this.props.user}/>;
            })
        )
    };

    switch=()=>{
        if(this.props.signInVisible){
            this.props.dispatch(showSignUp())
        }
        else
            this.props.dispatch(showSignIn())
    }

    onCancel=()=>{
        this.props.dispatch(cancelModal())
    }

    render(){
        return (
            <Layout>
                <BackTop visibilityHeight={200} style={{zIndex:10}}/>
                    <BaseHeader 
                    items={this.state.items}/>
                <Content style={{backgroundColor:"white"}}>
                    <Router history={this.props.history}>
                        {this.createRoutes(mainRoutes[0].children)}
                    </Router>
                </Content>
                <AuthModal 
                switch={this.switch}/>
                <BaseDrawer />
            </Layout>
            );
    }
}



export default connect(mapStateToProps)(withRouter(UserLayout))