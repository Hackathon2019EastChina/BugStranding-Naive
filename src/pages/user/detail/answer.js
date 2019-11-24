import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import copy from 'copy-to-clipboard';
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import Description from '../../../components/markd/Description'
import {Avatar,Collapse,Typography,Card, Row, Col, AutoComplete,Button,Icon, Table,Divider,Descriptions,Input } from 'antd';
import User from '../../../components/auth/user'
import { Diff2Html } from "diff2html";
import "./resource/diff.css";
const { Title,Paragraph } = Typography;
const {Panel}=Collapse;

var columns = [];
class Answer extends BaseComponent {

    constructor(props){
        super(props);
        this.state={
            desp:1,
        }
    };

    componentWillMount(){
       
    }

    handleCopy=(dockerId)=>{
        if(copy(dockerId+""))
            this.pushNotification("success","Docker-"+dockerId+" has been copied. Please open it in VS Code")
        else
            this.pushNotification("danger","Copy Failed")
    }
    
    renderUser(user,time){
        return (
            <Row type="flex" style={{width:"100%"}}>
                <Row type="flex" align='middle' justify="start">
                    <Avatar shape="square" style={{marginRight:8,fontSize:25}} size={44}>
                        {user.toUpperCase()[0]}
                    </Avatar>
                </Row>
                <Col span={18} style={{padding:2}}>
                    <Row type="flex" align='middle' justify="start" style={{width:"80%",fontSize:16}}>
                        {user}
                    </Row>
                    <Row type="flex" align='middle' justify="start" style={{width:"80%",fontSize:14}}>
                        {time}
                    </Row>
                </Col>
            </Row>
        )
    }

    render(){
        const {aid,desp,diff,status,time,user,dockerId}=this.props.data
        return (
            <Card style={{marginBottom:15}}>
                <Row style={{width:"100%"}}>
                    {this.renderUser(user,time)}
                </Row>
                <Paragraph style={{fontSize:22}}>
                    <Description desp={desp}/>
                </Paragraph>
                <Collapse defaultActiveKey={['1']} >
                    <Panel header="Show me the code" key="1">
                        {this.renderDiff(diff)}
                    </Panel>
                </Collapse>
            </Card>
        )
    }

    renderDiff=(diff)=>{
        var html=Diff2Html.getPrettyHtml(diff, {
            inputFormat: "diff",
            showFiles: true,
            matching: "lines",
            outputFormat: "side-by-side"
        });
        html=html.replace(/href/g,"file")
        return(
            <div dangerouslySetInnerHTML={{__html: html}} />
        )
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

export default withRouter(Answer);
