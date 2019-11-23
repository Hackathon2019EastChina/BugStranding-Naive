import React from 'react'
import {withRouter} from "react-router-dom";
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import {showSignIn,setOnCancel,cancelModal} from '../redux/actions/action';
import {notification} from 'antd';

const mapStateToProps = state => ({
    user_redux: state.identityReducer.user,
    admin: state.identityReducer.admin,
    sales: state.identityReducer.sales,
})

const PrivateRoute = ({
    component: Component, 
    user,//传入观察值
    user_redux,
    sales,
    admin,
    location,
    history,
    dispatch,
    path,//路径
    role,//如果需要授权，需要的权限等级
    auth,//是否需要授权
    ...props}) => {
    // 解构赋值 将 props 里面的 component 赋值给 Component
    
    const jumpBack=(_user)=>{   
        if(!_user||!_user.id)
            history.replace('/user/home')
        dispatch(cancelModal())
    }

    const pushNotification = ( kind, reason ) => {
        notification.config({
            placement: 'topRight',
            top: 80,
            duration: 4,
        });
        if(kind=='danger')
            notification.warning({
                message:reason,
                description:"失败!",
            })
        else if(kind=='success')
            notification.success({
                message:reason,
                description:"成功"
            })
        else
            notification.open({
                message:reason,
                description:""
            })
    }
    
    let login=false
    switch(role){
        case 0:
            login=user_redux
            path="/user"+path
            break
        case 1:
            login=sales
            path="/sales"+path
            break
        case 2:
            login=admin
            path="/admin"+path
    }

    return <Route {...props} path={path}
        render={(p) => {
                if (user||login||!auth){ 
                    return <Component />
                } else { 
                    pushNotification("danger","请先登录再进行操作")
                    dispatch(showSignIn())
                    dispatch(setOnCancel(jumpBack))
                    return null
                }
            }
        }
    />
}

PrivateRoute.defaultProps ={
    user:null,
    role:0
}

export default connect(mapStateToProps)(withRouter(PrivateRoute))