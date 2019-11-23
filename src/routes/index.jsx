import React,{Component} from "react";
import { connect } from 'react-redux';
import BaseLayout from "../components/layouts/BaseLayout"
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Form } from 'antd';

const mapStateToProps = state => ({
    user: state.identityReducer.user,
    admin: state.identityReducer.admin,
    signInVisible:state.modalReducer.signInVisible,
    signUpVisible:state.modalReducer.signUpVisible,
    keyword: state.keywordReducer.keyword,
})

var wrap = (component) => {
    return connect(mapStateToProps)(withRouter(component))
}
const indexRoutes = [
    { path: '/', component: wrap(BaseLayout) },//以后可以改为/user来默认访问用户界面
];

export default indexRoutes;
