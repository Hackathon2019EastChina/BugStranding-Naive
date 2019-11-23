import React from 'react';
import {withRouter} from "react-router-dom";
import { loginAsUser} from '../../redux/actions/action';
import { Row, Col, Divider, Button, Icon, Form, Upload, Avatar,Modal } from 'antd';
import { BaseComponent } from '../BaseComponent';
import {FormButton, FormText, FormAvatar, FormSelector} from '../../components/forms';
import md5 from "md5";

import { connect } from 'react-redux';
const mapStateToProps = state => ({
    user: state.identityReducer.user,
    admin: state.identityReducer.admin,
})

class SignUp extends BaseComponent {

    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (values.username === '' ) {
                this.pushNotification("danger","用户名不能为空",this.props.dispatch);
                return;
            }
            if(values.password === ''){
                this.pushNotification("danger","密码不能为空",this.props.dispatch);
                return;
            }
        if(values.passwordAgain !== values.password){
            this.pushNotification("danger","密码不一致！",this.props.dispatch);
            return;
        }
            if(values.name===''){
                this.pushNotification("danger","姓名不能为空",this.props.dispatch);
            }
            if (!err) {
                console.log("hey");
                console.log('Received values of form: ', values);
            }

            let form = new FormData();
            form.append('username', values.username);
            form.append('password', md5(values.password));
            form.append('name',values.name);

            var successAction = (result) => {
                localStorage.setItem('user', JSON.stringify(result.content));
                this.props.switch()
                this.pushNotification("success", "用户注册成功，请登录");
            }

            var unsuccessAction = (result) => {
                this.pushNotification("danger", result.message);
            }

            this.post('/register', form, successAction,unsuccessAction);

        });
    }

    renderLogo=()=>{
        return(
            <Row type="flex" justify='center'>
                <img style={styles.logo} src={require("./resource/logo.png")} />
            </Row>
        )
    }

    renderContent=()=>{
        return(
            <Row type='flex' 
            justify='center' 
            align="middle" 
            style={{borderRadius:'20px'}}>
                <Col>
                    <Row
                    style={styles.cardContainer}>
                        <div style={styles.welcome}>欢迎使用Seec影院系统</div>
                        <div style={styles.welcome2}>注册</div>
                        <Form onSubmit={this.handleSubmit} type='flex' justify='center'>
                            <Row justify='center'>
                                <FormText form={this.props.form}
                                    label='用户名' name='username' required={true} icon="user"/>

                                <FormText form={this.props.form}
                                    label='密码' name='password' required={true} icon="lock"
                                    inputType="password"/>
                                <FormText form={this.props.form}
                                    label='重复密码' name="passwordAgain" required={true} icon='lock'
                                    inputType='password'/>
                                <FormText form={this.props.form}
                                    label='姓名' name="name" required={true} icon="user"/>


                            </Row>
                            <Row type='flex' justify='center'>
                                <Col>
                                    <FormButton form={this.props.form} label="注册" style={styles.button}/>
                                    <Button style={styles.button2} onClick={this.props.onCancel}>
                                        返回
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <Row type='flex' justify='center'>
                            <Col>
                                已有账号? <Button onClick={this.props.switch} type="link">立即登录</Button>
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>
            );
    }

    render() {
        return (
        <Row>
            {this.renderLogo()}
            {this.renderContent()}
        </Row>
        );
    }

}



const styles={
    
    logo: {
        height:'64px',
        width:'192px'
    },

    cardContainer:{
        width:'500px',
        marginTop:'10px'
    },

    button:{
        width:'350px',
        height:'40px',
    },

    button2:{
        width:'350px',
        height:'40px',
        color:'white',
        backgroundColor: '#CCCCCC',
        marginBottom:'20px',
    },

    welcome:{
        fontSize:25,
        marginLeft: '30px',
        marginRight: '10px',
        marginBottom: '3px',
    },
    welcome2:{
        fontSize:17,
        color:'#AAAAAA',
        marginLeft: '30px',
        marginRight: '10px',
        marginBottom: '10px',
    },

};

export default Form.create()(connect(mapStateToProps)(withRouter(SignUp)))

