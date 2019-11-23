import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Icon,Row, Col, AutoComplete,Tabs,Button,Typography,Input,Divider } from 'antd';
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
            edit:false
        }
    }

    onChangeDesp = ({ target: { value } }) => {
        var q=this.state.question
        q.desp=value
        this.setState({
            question:q
        })
    };

    componentWillMount(){
        if(this.props.state&&this.props.state.qid){
            const {qid,user,completed}=this.props.state
            this.state.submit=completed
            var successAction = (result) => {
                if(result.status=="ok"){
                    this.setState({question:result.question,found:true,submit:result.question.status})
                }else{
                    this.pushNotification("danger", JSON.stringify(result));
                }
            }

            var errorAction = (result) => {
                this.pushNotification("danger", "Question Not Found");
            }

            if(this.state.question==0)
                this.getWithErrorAction('/question/get?user='+user+"&qid="+qid, successAction,errorAction);

        }
    }
    
    handleCopy=(dockerId)=>{
        if(copy(dockerId+""))
            this.pushNotification("success","Docker-"+dockerId+" has been copied. Please open it in VS Code")
        else
            this.pushNotification("danger","Copy Failed")
    }

    renderTitle=(title,desp)=>{
        const {edit,submit}=this.state
        const {time,dockerId}=this.state.question
        return(
            <Row type="flex" justify="start" align="middle">
                <Col span={24}>
                    <Title level={2}>{title}</Title>
                </Col>
                <Col span={24}>
                    <Row type="flex" justify="start" align="middle">
                        <Paragraph style={{fontSize:20,marginBottom:10,marginRight:10}}>By：</Paragraph> 
                        <User user={this.state.question.user}/>
                    </Row>
                </Col>
                <Col span={24}>
                    <Paragraph style={{fontSize:18,marginBottom:5}}>{time}</Paragraph> 
                </Col>
                <Row type="flex" justify="start" align="middle" style={{width: '100%'}}>  
                    {!edit?(<Paragraph style={{fontSize:18,marginBottom:5}}>{desp}</Paragraph>):
                    <TextArea 
                    style={{fontSize:18}}
                    onChange={this.onChangeDesp}
                    defaultValue={this.state.question.desp}
                    placeholder="(Optional) Add more detail to your Question to attract more helper"
                    autosize={{ minRows: 2, maxRows: 5 }}
                    />}
                </Row>
                {!submit?<Row type="flex" justify="start" align="middle">
                    <Icon type="loading" style={{marginRight:10}}/>
                    <Typography style={{fontSize:18}}>Source Docker: {dockerId?dockerId:"empty"}</Typography> 
                    <Button
                    style={styles.btn2}
                    type="link"
                    onClick={()=>{this.handleCopy(dockerId?dockerId:"empty")}}
                    ><Icon type="copy"/></Button> 
                </Row>:null}
            </Row>
        )
    }

    renderConfirm=()=>{
        if(this.state.submit)
            return null;
        return(
            <Row type="flex" justify="start" align="middle">
                
                <Divider style={{margin:0}}/>
                {this.state.edit?(
                    <Button
                    style={{ marginTop:10,marginLeft:10  }}
                    size="large"
                    type="primary"
                    onClick={this.save}
                    >Update</Button>  
                ):(
                    <Button
                    style={{ marginTop:10 }}
                    size="large"
                    type="primary"
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
        if(this.state.found){
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
        }else{
            return(
                <Row style={styles.container} >
                    <Col lg={6} xs={1}/>
                    {/* <Col lg={12} xs={22}>
                        Sorry, answer not found. 
                    </Col> */}
                    <Col lg={6} xs={1}/>
                </Row>
            )
        }
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
                this.setState({submit:true})
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

