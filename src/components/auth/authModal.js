import React from 'react';
import {withRouter} from "react-router-dom";
import { Modal } from 'antd';
import { BaseComponent } from '../BaseComponent';
import SignIn from './signIn'
import SignUp from './signUp'
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    signInVisible:state.modalReducer.signInVisible,
    signUpVisible:state.modalReducer.signUpVisible,
    onCancel:state.modalReducer.onCancel,
})

class authModal extends BaseComponent {

    constructor(props) {
        super(props);
    }

    renderContent=(signInVisible,signUpVisible)=>{
        if(signInVisible)
        return(
            <SignIn 
            onCancel={this.props.onCancel}
            switch={this.props.switch}/>
            );
        else if(signUpVisible)
        return(
            <SignUp 
            onCancel={this.props.onCancel}
            switch={this.props.switch}/>
        )
    }

    render() {
        const {signInVisible,signUpVisible}=this.props
        const visible=signUpVisible||signInVisible
        return (
        <Modal
        title={null}
        visible={visible}
        closable={false}
        footer={null}
        destroyOnClose={true}
        >
            {this.renderContent(signInVisible,signUpVisible)}
        </Modal>
        );
    }

}


const styles={

};

export default (connect(mapStateToProps)(withRouter(authModal)))

