import React,{Component} from "react";
import * as Pages from "../pages";
import UserLayout from '../components/layouts/user/UserLayout'
import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Form } from 'antd';

const mapStateToProps = state => ({
    user: state.identityReducer.user,
})

var wrap = (component) => {
    return Form.create()(connect(mapStateToProps)(withRouter(component)))
}

const mainRoutes = [//默认路由（其实是第二层，第一层在隔壁index.jsx用来加载外层layout
    {
        path: "/user",
        icon: 'user',
        component: UserLayout,
        children:[
            {
                path: "/home",
                icon: 'home',
                component: wrap(Pages.User.Home),
            },
            {
                path: "/my",
                icon: 'my',
                component: wrap(Pages.User.My),
            },
            {
                path: "/list",
                icon: 'list',
                component: wrap(Pages.User.List),
            },
            {
                path: "/search",
                icon: 'search',
                component: wrap(Pages.User.Search)
            },
            {
                path: "/detail",
                icon: 'detail',
                component: wrap(Pages.User.Detail)
            },
        ]
    }
    // {
    //     path: "/signin",
    //     icon: 'signin',
    //     component: wrap(Pages.SignIn),
    // },
    // use Drawer Instead
];

export default mainRoutes;