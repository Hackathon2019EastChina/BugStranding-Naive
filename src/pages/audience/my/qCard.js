import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import copy from 'copy-to-clipboard';
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import User from '../../../components/auth/user'
import {Card,Typography, Row, Col, AutoComplete,Button,Icon, Table,Divider,Descriptions } from 'antd';
const { Title,Paragraph } = Typography;

var columns = [];
class QCard extends BaseComponent {

    renderTitle=(title,desp,user,time,qid)=>{
        return (
            <Card style={{marginTop:8}} bodyStyle={{paddingTop:12,paddingBottom:12,margin:0}}>
                <Row style={{fontSize:14,marginBottom:5}} type="flex" justify="start" align="middle">
                    <Row style={{width:"50%"}}>
                        <User user={user} small/>
                    </Row>
                    <Row style={{width:"50%"}} type="flex" justify="end">
                        {time}
                    </Row>
                </Row>
                <Row type="flex" justify="start" align="middle" style={{fontSize:18,width:"100%",marginBottom:3}}>
                    <a onClick={()=>{this.props.history.push({
                    pathname:"/user/detail",
                    state:{qid,user,completed:true}
                    })}}>
                    {title} 
                    </a>
                </Row>
                <Paragraph style={{marginBottom:0}}>
                    {desp}
                </Paragraph>
            </Card>
        );
    }

    componentWillMount(){
    }

    render(){
        const {desp,title,user,qid,time}=this.props.data
        return (
            this.renderTitle(title,desp,user,time,qid)  //title,desp,user,time,qid
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

export default withRouter(QCard);
