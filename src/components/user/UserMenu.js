import React,{Component} from "react";
import {Icon,Row} from 'antd';
import {withRouter } from "react-router-dom";
import {connect} from "react-redux"
import BaseComponent from "../BaseComponent"
import { Grid, Avatar, Typography} from '@material-ui/core';

const mapStateToProps = state => ({
    user: state.identityReducer.user
})

class UserMenu extends BaseComponent{
    constructor(props){
        super(props);
    }

    handleClose = name => () => {
        this.setState({
            [name]: null,
        });
    };
    
    renderAvatar = () => {
        if (this.props.user === null) 
            return null;
        return (
            <Avatar style={styles.avatar}>{this.props.user[0]}</Avatar>
        )
    }
    /* <Avatar style={styles.avatar} src={this.getImagePath(this.props.user.avatarId)}/> */

    render(){
        if (this.props.user == null) {
            return null;
        }

        return (
            <Row type="flex" align='middle' justify="center" style={styles.container}>
                {this.renderAvatar()}
                <Typography style={styles.title1}>Welcome,</Typography>
                <Typography style={styles.title2}>{this.props.user}</Typography>
            </Row>
        )
    }
}

const styles = {
    container:{
        backgroundColor:"rgba(0,0,0,0)",
    },
    title1:{
        color:"white",
        fontSize: '20px',
    },
    title2:{
        color:"white",
        fontSize: '22px',
        marginLeft:5
    },
    avatar: {
        marginRight:20,
    },

};


export default withRouter(connect(mapStateToProps)(UserMenu));