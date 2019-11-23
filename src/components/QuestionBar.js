import React,{Component} from "react";
import {Skeleton,Row,Card,AutoComplete,Input, Button,Icon} from 'antd';
import BaseComponent from './BaseComponent'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';

const { TextArea } = Input;
const mapStateToProps = state => ({
    keyword: state.keywordReducer.keyword,
})
class QuestionBar extends BaseComponent {
    
    constructor(props){
        super(props);
        this.state={
            isEnter:false,
            title:"",
            desp:"",
            loading: false,
            loading2: true,
            caption:"Submit",
            dockerId:"",
            qid:0,
        }
    };

    timeout(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, ms, 'done');
        });
      }

    request=()=>{
        const title=this.state.title
        if(title==""){
            this.pushNotification("danger","Title Shouldn't Be Empty")
            return null;
        }
        this.setState({loading:true})
        //request
        var successAction = (result) => {
            if(result.status=="ok"){
                this.setState({loading:false,dockerId:result.dockerId,qid:result.qid})
                this.pushNotification("success","Docker is now being setup!")
                this.timeout(600).then(()=>
                    this.setState({loading2:false})
                )
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Request Failed");
        }
        this.getWithErrorAction("/question/create?user="+this.loadStorage("user")+"&title="+title,successAction,errorAction)
        
    }

    redirectDocker=()=>{
        var win = window.open(
            this.ip+"/dockerId/in?user="+this.loadStorage("user")+"&dockerId="+this.state.dockerId, '_blank');
        win.focus()
    }

    submit=()=>{
        const {qid,title,desp}=this.state
        const user=this.loadStorage("user")
        var successAction = (result) => {
            if(result.status=="ok"){
                this.setState({loading:false,dockerId:result.dockerId,qid:result.qid})
                this.pushNotification("success","Question saved.")
                this.timeout(600).then(()=>
                    this.props.history.push({pathname:"/user/detail",state:{qid,user,completed:false}})
                )
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Submit Failed");
        }

        this.getWithErrorAction("/question/save?qid="+this.state.qid+"&title="+title+"&desp="+desp,successAction,errorAction)
    }

    renderDocker=()=>{
        const dockerId=this.state.dockerId
        var style={ width: '100%',opacity:0.9,fontFamily:"Georgia",fontSize:18 }
        if(dockerId!=""){
            if(this.state.loading2){
                return(
                    <Card style={style}>
                        <Skeleton active />
                    </Card>
                )
            }else{
            return(
                <Card style={style}>
                    <Input
                    style={{marginBottom:3,fontWeight:"bold"}}
                    defaultValue={this.state.title}
                    onChange={this.onChangeTitle}
                    />
                    <TextArea
                    addonBefore="Description(Optional)"
                    onChange={this.onChangeDesp}
                    placeholder="(Optional) Add more detail to your Question to attract more helper"
                    autosize={{ minRows: 2, maxRows: 5 }}
                    />
                    <Row style={{width:"100%",fontSize:14,marginTop:7}} type="flex" justify="end">
                        Docker-{dockerId} has been set up
                    </Row>
                    <Row style={{width:"100%"}} type="flex" justify="end">
                        <Button
                        style={{ marginTop:5 }}
                        size="large"
                        type="primary"
                        onClick={this.redirectDocker}
                        >Open the docker and show us the code</Button>  
                    </Row>
                    <Row style={{width:"100%"}} type="flex" justify="end">
                        <Button
                        style={{ marginTop:5 }}
                        size="large"
                        type="link"
                        onClick={this.submit}
                        >Go to Question Detail</Button>  
                    </Row>
                </Card>
            )}
        }else{
            return null;
        }
    }

    onChangeTitle = (value) => {
        this.setState({
            title:value
        })
    }

    onChangeDesp = ({ target: { value } }) => {
        this.setState({
            desp:value
        })
      };

    renderInput=()=>{
        let style={}
        if(this.state.isEnter)
            style={ width: '100%',opacity:0.8,fontFamily:"Georgia",fontSize:18 }
        else
            style={ width: '100%',opacity:0.4,fontFamily:"Georgia",fontSize:18 }
        return(
            <AutoComplete
            size="large"
            style={style}
            onChange={this.onChangeTitle}
            disabled={this.state.dockerId!=""}
            placeholder="Describe Your Question And Request A New Stranding">
                <Input
                suffix={
                    <Button
                        className="search-btn"
                        style={{ marginRight: -12 }}
                        size="large"
                        type="link"
                        loading={this.state.loading}
                        onClick={this.request}
                        disabled={this.state.dockerId!=""}
                    >
                        Request
                    </Button>}
                />
            </AutoComplete>
        )
    }

    render(){
        return(
            <div
            onClick={()=>this.setState({isEnter:true})}>
                {this.renderInput()}
                {this.renderDocker()}
            </div>
        );
    }
}

export default connect(mapStateToProps)(withRouter(QuestionBar));