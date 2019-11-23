import React from 'react';
import {withRouter} from "react-router-dom";
import { loginAsUser} from '../../redux/actions/action';
import { Row, Col, Divider, Button, Icon, Form, Upload, Avatar,Modal } from 'antd';
import { BaseComponent } from '../BaseComponent';
import {FormButton, FormText} from '../../components/forms';
import { connect } from 'react-redux';
import md5 from "md5";

const mapStateToProps = state => ({
    user: state.identityReducer.user
})

class SignIn extends BaseComponent {

    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (values.usrname === '' ) {
                this.pushNotification("danger","Username Empty",this.props.dispatch);
                return;
            }
            if(values.pwd === ''){
                this.pushNotification("danger","Password Empty",this.props.dispatch);
                return;
            }

            // let form = new FormData();
            // form.append('username', values.username);
            // form.append('password', md5(values.password));

            var successAction = (result) => {
                if(result.status=="ok"){
                    this.handleSuccess(values.usrname);
                }else{
                    this.pushNotification("danger", JSON.stringify(result));
                }
            }

            var errorAction = (result) => {
                this.pushNotification("danger", "Username or Password Wrong");
            }
            
            this.getWithErrorAction('/login?username='+values.usrname+"&password="+values.pwd, successAction,errorAction);

        });
    }

    handleSuccess=(username)=>{
        this.props.dispatch(loginAsUser(username));
        localStorage.setItem('user', username);
        this.props.onCancel()
        this.pushNotification("success", "Sign In Successfully As "+username);
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
                        <div style={styles.welcome}>Welcome to Bug Stranding</div>
                        <div style={styles.welcome2}>Sign In</div>
                        <Form onSubmit={this.handleSubmit} type='flex' justify='center'>
                            <Row justify='center'>
                                <FormText  form={this.props.form}
                                    label='Username' name='usrname' required={true} icon="user"/>

                                <FormText form={this.props.form}
                                    label='Password' name='pwd' required={true} icon="lock"
                                    inputType="password"/>
                            </Row>
                            <Row type='flex' justify='center'>
                                <Col>
                                    <FormButton form={this.props.form} label="SignIn" style={styles.button}/>
                                    <Button style={styles.button2} onClick={this.props.onCancel}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <Row type='flex' justify='center'>
                            <Col>
                                Not a member yet? <Button onClick={this.props.switch} type="link">Sign Up</Button>
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
        width:'300px',
        height:'40px',
    },

    button2:{
        width:'300px',
        height:'40px',
        color:'white',
        backgroundColor: '#CCCCCC',
        marginBottom:'20px'
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

export default Form.create()(connect(mapStateToProps)(withRouter(SignIn)))

