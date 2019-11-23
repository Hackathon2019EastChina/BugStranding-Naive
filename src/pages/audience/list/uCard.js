import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import copy from 'copy-to-clipboard';
import {Card, Row, Col, AutoComplete,Button,Icon, Table,Divider,Descriptions,Input } from 'antd';
const { TextArea } = Input;
const test={
        "answer":[{
            "desp":"222",
            "dockerId":"A Docker",
            "username":"nyako",
            "diff":""
        },{
            "desp":"333",
            "dockerId":"as",
            "username":"asd",
            "diff":""
        }],
        "desp":"A Large Prob",
        "dockerId":"Q Docker",
        "qId":"sadasdasfd",
        "title":"Question 1",
        "username":"Questioner"
}

var columns = [];
export default class UCard extends BaseComponent {

    constructor(props){
        super(props);
        this.state={
            desp:1,
        }
    };
    
    getAnswer=(data)=>{
        for(var i=0;i<data.length;i++){
            const item=data[i]
            if(item.username==this.loadStorage("user")){
                return item
            }
        }
    }

    onChangeDesp = ({ target: { value } }) => {
        this.setState({
            desp:value
        })
    };

    update=()=>{
        this.pushNotification("",this.state.desp)
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
            dataIndex: 'username',
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

    render(){
        const {desp,title,username}=test
        const {Item}=Descriptions
        const my=this.getAnswer(test.answer)
        if(!my||!my.dockerId){
            return null
        }
        if(this.state.desp==1)
            this.state.desp=my.desp
        return (
            <Card title={"Title: "+title} extra={<a href="#">More</a>} style={styles.container}>
                <Descriptions  bordered>
                <Item span={3} label="Description">
                    {desp}
                </Item>
                <Item span={1} label="Questioner">
                    <Row style={{height:30}} type="flex" align='middle'>
                   {username}
                    </Row>
                </Item>
                <Item span={2}  label="Answer Docker" >
                    <Row style={{height:30}} type="flex" align='middle'>
                    {my.dockerId}
                    <Button
                    style={styles.btn2}
                    type="link"
                    onClick={()=>{this.handleCopy(my.dockerId)}}
                    ><Icon type="copy"/></Button> 
                    </Row>
                </Item>
                <Item span={3} label="Solution Brief" style={{padding:5}}>
                    <TextArea
                    onChange={this.onChangeDesp}
                    defaultValue={my.desp}
                    placeholder="(Optional) Add more detail to your Question to attract more helper"
                    autosize={{ minRows: 2, maxRows: 5 }}
                    />
                </Item>
                </Descriptions>
                <Row type="flex" justify="end">
                    <Button
                    style={{ marginTop:10 }}
                    size="large"
                    type="primary"
                    onClick={this.update}
                    >Update</Button>  
                    <Button
                    style={{ marginTop:10,marginLeft:10 }}
                    size="large"
                    type="danger"
                    onClick={this.end}
                    >Submit Solution</Button>  
                </Row>
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

