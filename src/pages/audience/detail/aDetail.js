import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import {Avatar, Icon,Row, Col, AutoComplete,Tabs,Button,Typography,Input,Divider } from 'antd';
import User from '../../../components/auth/user'
import copy from 'copy-to-clipboard';
import Answer from './answer'

const { TabPane } = Tabs;
const { Title,Paragraph } = Typography;
const { TextArea } = Input;

export default class ADetail extends BaseComponent {
    constructor(props){
        super(props);
        this.state={
            found:false,
            question:0,
            edit:false,
            desp:"",
            dockerId:"",
            aid:"",
            time:"",
            loading:false
        }
    }

    onChangeDesp = ({ target: { value } }) => {
        this.setState({
            desp:value
        })
    };

    componentWillMount(){
        //get my answer
        if(this.state.question==0)
            this.setState({
                question:this.props.data
            })
    }

    renderTitle=(title,desp)=>{
        const {time,dockerId}=this.state.question
        return(
            <Row type="flex" justify="start" align="middle">
                <Col span={24}>
                    <Title level={2}>{title}</Title>
                </Col>
                <Col span={24}>
                    <Row type="flex" justify="start" align="middle">
                        {this.renderUser(this.state.question.user,time)}
                    </Row>
                </Col>
                <Row type="flex" justify="start" align="middle" style={{width: '100%'}}>  
                    <Paragraph style={{fontSize:18,marginBottom:5}}>{desp}</Paragraph>
                </Row>
            </Row>
        )
    }

    renderAnswer=(data)=>{
        if(data.status!=0)
            return(
                <Answer data={data}/>
            )
        else{
            if(!this.state.edit){
                this.setState({edit:true,desp:data.desp,aid:data.aid,time:data.time})
            }
        }
        return null
    }

    renderAnswers=()=>{
        const {answer}=this.state.question
        if(answer.length==0){
            return(
            <Row style={{marginTop:100}} type="flex" justify="center">
                <Paragraph style={{fontSize:24}}>Be the first hero.</Paragraph>
            </Row>)
        }else{
            return(
                <Row>
                    {answer.map(this.renderAnswer)}
                </Row>
            )
        }
    }

    renderNew(){
        //get prev answer of user
        if(!this.state.edit)
            return(
                <Row type="flex" justify="start" align="middle" 
                style={{ marginTop:10,width:"100%"}}>
                    <Divider style={{marginBottom:10}}/>
                    <Row style={{width:"100%",marginLeft:5,fontSize:18}}>
                        You have no idea yet.
                    </Row>
                    <Button
                    loading={this.state.loading}
                    size="large"
                    type="primary"
                    onClick={this.offer}
                    >Try out the problem! ></Button>  
                </Row>  
            )
        else{
        return(
            <Row type="flex" justify="start" align="middle" 
            style={{ marginTop:10,width:"100%"}}>
                <Divider style={{margin:0}}direction="left">
                    <Title level={4}>My Answer</Title>
                </Divider>
                <Row style={{width:"100%",marginLeft:5,fontSize:18}}>
                    Solution Brief:
                </Row>
                <TextArea
                onChange={this.onChangeDesp}
                defaultValue={this.state.desp}
                placeholder="(Must) Describe your solution"
                autosize={{ minRows: 2, maxRows: 5 }}
                />
                <Row style={{marginLeft:5,width:"100%",marginBottom:10}} type="flex">
                    <Row style={{width:"50%",fontSize:16}}>
                        Last copy of answer recovered.
                    </Row>
                    <Row style={{width:"50%",fontSize:16}} type="flex" justify="end">
                        {this.state.time}
                    </Row>
                </Row>
                <Button
                size="large"
                type="primary"
                onClick={this.redirectDocker}
                >Enter Docker</Button>  
                <Button
                style={{marginLeft:10}}
                size="large"
                type="default"
                onClick={this.save}
                >Update Desc</Button>  
                <Button
                style={{marginLeft:10}}
                size="large"
                type="danger"
                onClick={this.submit}
                >Submit</Button>   
            </Row>  
        )
        }
    }

    renderUser(user,time){
        return (
            <Row type="flex" style={{width:"100%"}}>
                <Row type="flex" align='middle' justify="start">
                    <Avatar shape="square" style={{marginRight:8,fontSize:30}} size={50}>
                        {user.toUpperCase()[0]}
                    </Avatar>
                </Row>
                <Col span={18} style={{padding:2}}>
                    <Row type="flex" align='middle' justify="start" style={{width:"80%",fontSize:20}}>
                        {user}
                    </Row>
                    <Row type="flex" align='middle' justify="start" style={{width:"80%",fontSize:16}}>
                        {time}
                    </Row>
                </Col>
            </Row>
        )
    }

    render(){
        this.state.question=this.props.data
        const {desp,time,title,user,answer}=this.state.question
        return (
            <Row style={styles.container} >
                <Col lg={4} xs={1}/>
                <Col lg={15} xs={22}>
                    {this.renderTitle(title,desp)}
                    <Row type="flex" justify="start" style={{marginTop:20}}>
                        <Divider><Title level={3}>{answer.length+" Answers"}</Title></Divider>
                    </Row>
                    {this.renderAnswers()}
                    {this.renderNew()}
                </Col>
                <Col lg={5} xs={1}/>
            </Row>
        )
    }

    offer=()=>{
        this.setState({loading:true})
        const {qid,title,desp}=this.state.question
        const user=this.loadStorage("user")
        var s1 = (result) => {
            if(result.status=="ok"){
                this.setState({edit:true,loading:false,dockerId:result.dockerId,aid:result.aid})
                this.pushNotification("success","Docker has been setup, redirecting!")
                this.timeout(2000).then(()=>this.redirectDocker()) 
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var e1 = (result) => {
            this.pushNotification("danger", "Request Failed");
        }

        this.getWithErrorAction(
            "/answer/create?user="+user+"&qid="+qid
            ,s1,e1)
    }

    save=()=>{
        if(this.state.desp==null||this.state.desp==""){
            this.pushNotification("danger","Describe your solution, less or more")
            return null;
        }
        const {aid,desp}=this.state
        var successAction = (result) => {
            if(result.status=="ok"){
                this.pushNotification("success","Update Succeeded")
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Update Failed");
        }

        this.getWithErrorAction("/answer/save?aid="+aid+"&desp="+desp,successAction,errorAction)
    }
    
    submit=()=>{
        if(this.state.desp==null||this.state.desp==""){
            this.pushNotification("danger","Describe your solution, less or more")
            return null;
        }
        const {aid,desp}=this.state
        var successAction = (result) => {
            if(result.status=="ok"){
                this.pushNotification("success","Submit Succeeded")
                this.setState({edit:false})
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Submit Failed");
        }

        this.getWithErrorAction("/answer/submit?aid="+aid+"&desp="+desp,successAction,errorAction)
    }

    redirectDocker=()=>{
        var win = window.open(
            this.ip+"/dockerId/in?user="+this.loadStorage("user")+"&dockerId="+this.state.dockerId, '_blank');
        win.focus()
    }
}

const styles = {
    container:{
        marginTop:"50px",
        paddingBottom:"50px"
    }
}

