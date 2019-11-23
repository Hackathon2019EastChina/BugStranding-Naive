import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Avatar, Icon,Row, Col, AutoComplete,Tabs,Button,Typography,Input,Divider } from 'antd';
import User from '../../../components/auth/user'
import copy from 'copy-to-clipboard';
import Answer from './answer'

const { TabPane } = Tabs;
const { Title,Paragraph } = Typography;
const { TextArea } = Input;

export default class QDetail extends BaseComponent {
    constructor(props){
        super(props);
        this.state={
            found:false,
            question:0,
            submit:false,
            edit:true
        }
    }

    componentWillMount(){
        this.state.question=this.props.data
        this.state.submit=this.props.data.status
        this.state.edit=!this.props.data.status
    }

    onChangeDesp = ({ target: { value } }) => {
        var q=this.state.question
        q.desp=value
        this.setState({
            question:q
        })
    };

    renderTitle=(title,desp)=>{
        const {edit}=this.state
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
                    {!edit?(<Paragraph style={{fontSize:18,marginVertical:5}}>{desp}</Paragraph>):
                    <TextArea 
                    style={{fontSize:18}}
                    onChange={this.onChangeDesp}
                    defaultValue={this.state.question.desp}
                    placeholder="(Optional) Add more detail to your Question to attract more helper"
                    autosize={{ minRows: 2, maxRows: 5 }}
                    />}
                </Row>
                
            </Row>
        )
    }
    
    redirectDocker=()=>{
        var win = window.open(
            this.ip+"/dockerId/in?user="+this.loadStorage("user")+"&dockerId="+this.state.dockerId, '_blank');
        win.focus()
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

    renderConfirm=()=>{
        if(this.state.submit)
            return null;
        else{
        return(
            <Row type="flex" justify="start" align="middle">
                <Divider style={{width:"100%",marginBottom:3}}/>
                {!this.state.submit?
                <Row type="flex" justify="start" align="middle" style={{width:"100%"}}>
                    <Typography style={{fontSize:18}}>Docker-{this.state.question.dockerId} is running</Typography> 
                    <Icon type="loading" style={{marginLeft:10}}/>
                </Row>:null}
                <Button
                style={{marginTop:10}}
                size="large"
                type="primary"
                onClick={this.redirectDocker}
                >Enter Docker</Button>  
                {this.state.edit?(
                    <Button
                    style={{ marginTop:10,marginLeft:10}}
                    size="large"
                    type="default"
                    onClick={this.save}
                    >Save Desc</Button>  
                ):(
                    <Button
                    style={{ marginTop:10,marginLeft:10}}
                    size="large"
                    type="default"
                    onClick={()=>{this.setState({edit:true})}}
                    >Edit Desc</Button>  
                )}
                <Button
                style={{ marginTop:10,marginLeft:10 }}
                size="large"
                type="danger"
                onClick={this.submit}
                >Submit Question</Button>  
            </Row>
        )
        }
    }

    renderAnswer=(data)=>{
        return(
            <Answer data={data}/>
        )
    }

    renderAnswers=()=>{
        if(this.state.submit){
            const {answer}=this.state.question
            if(answer.length==0){
                return(
                <Row style={{marginTop:100}} type="flex" justify="center">
                    <Paragraph style={{fontSize:24}}>Kept you waiting, huh?</Paragraph>
                </Row>)
            }else{
                return(
                    <Row>
                        {answer.map(this.renderAnswer)}
                    </Row>
                )
            }
        }else{
            return(
                <Row style={{marginTop:100}} type="flex" justify="center">
                    <Paragraph style={{fontSize:24}}>Submit the question to make it visible online</Paragraph>
                </Row>
            )
        }
    }

    render(){
        const {desp,time,title,user,answer}=this.state.question
        return (
            <Row style={styles.container} >
                <Col lg={4} xs={1}/>
                <Col lg={15} xs={22}>
                    {this.renderTitle(title,desp)}
                    {this.renderConfirm()}
                    <Row type="flex" justify="start" style={{marginTop:20}}>
                        <Divider><Title level={3}>{answer.length+" Answers"}</Title></Divider>
                    </Row>
                    {this.renderAnswers()}
                </Col>
                <Col lg={5} xs={1}/>
            </Row>
        )
    }

    save=()=>{
        const {qid,title,desp}=this.state.question
        const user=this.loadStorage("user")
        var successAction = (result) => {
            if(result.status=="ok"){
                this.pushNotification("success","Update Succeeded")
                this.setState({edit:false})
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Update Failed");
        }

        this.getWithErrorAction("/question/save?qid="+qid+"&title="+title+"&desp="+desp,successAction,errorAction)
    }

    
    submit=()=>{
        const {qid,title,desp}=this.state.question
        const user=this.loadStorage("user")
        var successAction = (result) => {
            if(result.status=="ok"){
                this.pushNotification("success","Submit Succeeded")
                this.setState({submit:true,edit:false})
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Submit Failed");
        }

        this.getWithErrorAction("/question/submit?qid="+qid+"&title="+title+"&desp="+desp,successAction,errorAction)
    }
}

const styles = {
    container:{
        marginTop:"50px"
    }
}

