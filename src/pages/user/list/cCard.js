import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import copy from 'copy-to-clipboard';
import {Card, Row, Col, Typography,Button,Icon, Table,Divider,Descriptions,Input } from 'antd';
import User from '../../../components/auth/user'
const { TextArea } = Input;
const { Title,Paragraph } = Typography;
const test={
}

var columns = [];
export default class CCard extends BaseComponent {

    constructor(props){
        super(props);
        this.state={
            desp:1,
        }
    };

    componentWillMount(){
    }

    renderTitle=(title,desp,user,time)=>{
        return(
            <Row type="flex" justify="start" align="middle">
                <Col span={24}>
                    <Title level={2}>{title}</Title>
                </Col>
                <Col span={24}>
                    <Row type="flex" justify="start" align="middle">
                        <User user={user}/>
                    </Row>
                </Col>
                <Col span={24}>
                    <Paragraph style={{fontSize:18,marginBottom:5}}>{time}</Paragraph> 
                </Col>
                <Row type="flex" justify="start" align="middle" style={{width: '100%'}}>  
                    <Paragraph style={{fontSize:18,marginBottom:5}}>{desp}</Paragraph>
                </Row>
            </Row>
        )
    }

    render(){
        const {title,desp,user,time}=this.props.data
        return (
            this.renderTitle(title,desp,user,time)
        );
    }
}

const styles = {
    container:{
        marginBottom:"20px",
        fontSize:22
    },
    btn:{
        padding:5,
        marginRight:10
    },
    btn2:{
        padding:0,
        marginLeft:5
    }
}

