import React,{Component} from "react";
import {Icon,Row} from 'antd';
import {withRouter } from "react-router-dom";
import {connect} from "react-redux"
import BaseComponent from '../BaseComponent'
import { Grid, Avatar, Typography} from '@material-ui/core';


class User extends BaseComponent{
    constructor(props){
        super(props);
    }
    
    renderAvatar = () => {
        if (this.props.user === null) 
            return null;
        return (
            <Avatar size="small" shape="square" style={styles.avatar}>{this.props.user[0]}</Avatar>
        )
    }
    /* <Avatar style={styles.avatar} src={this.getImagePath(this.props.user.avatarId)}/> */

    render(){
        if (this.props.user == null) {
            return null;
        }

        return (
            <Row type="flex" align='middle' justify="start" style={styles.container}>
                {this.renderAvatar()}
                <Typography style={styles.title2}>{this.props.user}</Typography>
            </Row>
        )
    }
}

const styles = {
    container:{
        backgroundColor:"rgba(0,0,0,0)",
        marginBottom:10,
        marginTop:10
    },
    title1:{
        color:"black",
        fontSize: '20px',
    },
    title2:{
        color:"black",
        fontSize: '22px',
        marginLeft:5
    },
    avatar: {
        marginRight:20,
        width:30,
        height:30,
        borderRadius:2
    },

};


export default withRouter(User);