import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import copy from 'copy-to-clipboard';
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import {Card, Row, Col, AutoComplete,Button,Icon, Table,Divider,Descriptions } from 'antd';
const test={
    "answer":[{
        "desp":"222",
        "dockerId":"A Docker",
        "user":"nyako",
        "diff":""
    },{
        "desp":"333",
        "dockerId":"as",
        "user":"asd",
        "diff":""
    }],
    "desp":"A Large Prob",
    "dockerId":"Q Docker",
    "qid":"sadasdasfd",
    "title":"Question 1",
    "user":"Questioner"
}

var columns = [];
class QCard extends BaseComponent {
    
    renderAnswer=(data)=>{
        return(
            <Table pagination={false} columns={columns} dataSource={data}  />
        )
    }

    handleCopy=(dockerId)=>{
        if(copy(dockerId+""))
            this.pushNotification("success","Docker-"+dockerId+" has been copied. Please open it in VS Code")
        else
            this.pushNotification("danger","Copy Failed")
    }

    componentWillMount(){
        columns=[{
            title: 'Solution Brief',
            dataIndex: 'desp',
          },
          {
            title: 'Answerer',
            dataIndex: 'user',
          },
          {
            title: 'Docker Id',
            dataIndex: 'dockerId',
          },
          {
            title: 'Action',
            dataIndex: 'dockerId',
            render: dockerId => (
              <Row type="flex" justify='start' >
                  <Button
                  style={styles.btn}
                  size="large"
                  type="link"
                  onClick={()=>{this.handleCopy(dockerId)}}
                  ><Icon type="copy"/></Button>  
                  <Button
                  type="link"
                  size="large"
                  style={styles.btn}
                  onClick={()=>{this.handleCopy(dockerId)}}
                  ><Icon type="check"/></Button> 
                  {/* 采纳和删除docker */}
                  <Button
                  type="link"
                  size="large"
                  style={styles.btn}
                  onClick={()=>{this.handleCopy(dockerId)}}
                  ><Icon type="stop"/></Button>  
              </Row>
            ),
          }]
    }
    
    getDetail=(qid,user)=>{
        this.props.history.push({pathname:'/user/detail',state:{qid,user}})
    }

    render(){
        const {desp,dockerId,title,user,qid}=test
        const {Item}=Descriptions
        return (
        <Card title={"Title: "+title} 
            extra={
                <Button type="link" onClick={
                    ()=>this.getDetail(qid,user)
                }>Question Detail</Button>} 
            style={styles.container}>
            <Descriptions  bordered>
                <Item span={3} label="Description">
                    {desp}
                </Item>
                <Item label="Source Docker" >
                    <Row style={{height:30}} type="flex" align='middle'>
                    {dockerId}
                    <Button
                    style={styles.btn2}
                    type="link"
                    onClick={()=>{this.handleCopy(dockerId)}}
                    ><Icon type="copy"/></Button> 
                    </Row>
                </Item>
                <Item label="Questioner">
                    
                    <Row style={{height:30}} type="flex" align='middle'>
                   {user}
                    </Row>
                </Item>
                </Descriptions>
                {this.renderAnswer(test.answer)}
            </Card>
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
