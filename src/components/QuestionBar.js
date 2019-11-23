import React,{Component} from "react";
import {Row,Card,AutoComplete,Input, Button,Icon} from 'antd';
import BaseComponent from './BaseComponent'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import {setKeyword} from '../redux/actions/action'

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
            loading2: false,
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
            this.pushNotification("danger","Description Shouldn't Be Empty")
            return null;
        }
        this.setState({loading:true})
        //request
        var successAction = (result) => {
            if(result.status=="ok"){
                this.setState({loading:false,dockerId:result.dockerId,qid:result.qid})
                this.timeout(600).then(()=>
                    this.pushNotification("success","Request Succeeded")
                )
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Request Failed");
        }
        this.getWithErrorAction("/question/create?user="+this.loadStorage("user"),successAction,errorAction)
        
    }

    submit=()=>{
        this.setState({loading2:true})
        const {qid,title,desp}=this.state
        const user=this.loadStorage("user")
        var successAction = (result) => {
            if(result.status=="ok"){
                this.setState({loading:false,dockerId:result.dockerId,qid:result.qid})
                this.pushNotification("success","Submit Succeeded")
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
   
    handleCopy=(dockerId)=>{
        if(copy(dockerId+""))
            this.pushNotification("success","Docker-"+dockerId+" has been copied. Please open it in VS Code")
        else
            this.pushNotification("danger","Copy Failed")
    }

    renderDocker=()=>{
        const dockerId=this.state.dockerId
        var style={ width: '100%',opacity:0.9,fontFamily:"Georgia",fontSize:18 }
        if(dockerId!=""){
            return(
                <Card style={style}>
                    <Row type="flex" justify='center'align="middle">
                        <Row style={{width:"70%"}}> 
                            Docker-{dockerId} Is Now Being set up.
                        </Row>
                        <Row style={{width:"30%"}}type="flex" justify='end'> 
                            <Button
                            style={{ marginRight: -12 }}
                            size="large"
                            type="link"
                            onClick={()=>{this.handleCopy(dockerId)}}
                            >Copy Docker Id to Clipboard</Button>   
                        </Row>
                    </Row>
                    <Input
                    addonBefore="Title"
                    defaultValue={this.state.title}
                    onChange={this.onChangeTitle}
                    autosize={{ minRows: 1, maxRows: 1 }}
                    />
                    <TextArea
                    addonBefore="Description(Optional)"
                    onChange={this.onChangeDesp}
                    placeholder="(Optional) Add more detail to your Question to attract more helper"
                    autosize={{ minRows: 2, maxRows: 5 }}
                    />
                    <Row style={{width:"100%"}} type="flex" justify="end">
                        <Button
                        style={{ marginTop:10 }}
                        size="large"
                        type="primary"
                        loading={this.state.loading2}
                        onClick={this.submit}
                        >Link Docker and Question</Button>  
                    </Row>
                </Card>
            )
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

    renderSearch=()=>{
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
                {this.renderSearch()}
                {this.renderDocker()}
            </div>
        );
    }
}

export default connect(mapStateToProps)(withRouter(QuestionBar));