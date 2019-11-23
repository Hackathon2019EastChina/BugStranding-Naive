import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Icon,Row, Col, AutoComplete,Tabs,Button,Typography,Input,Divider } from 'antd';
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
        if(this.state.question==0)
            this.setState({
                question:this.props.data
            })
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
                    <Paragraph style={{fontSize:18,marginBottom:5}}>{desp}</Paragraph>
                </Row>
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
        return(
            <Row type="flex" justify="start" align="middle">
            </Row>
        )
    }

    render(){
        this.state.question=this.props.data
        this.state.submit=this.props.data.status
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
                    {this.renderNew()}
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

