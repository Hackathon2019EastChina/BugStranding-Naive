import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Row, Col, AutoComplete,Tabs,Button,Typography,Input,Divider } from 'antd';
import QDetail from './qDetail'
import ADetail from './aDetail'

const { TabPane } = Tabs;
const { Title,Paragraph } = Typography;
const { TextArea } = Input;

export class Detail extends BaseComponent {
    constructor(props){
        super(props);
        this.state={
            question:0,
            found:false
        }
    }
    
    componentWillMount(){
        const {qid,user,completed}=this.props.location.state
        var successAction =     (result) => {
            if(result.status=="ok"){
                this.setState({question:result.question,found:true})
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

    render(){
        if(!this.state.found)
            return(
                <Row style={styles.container} >
                    <Col lg={6} xs={1}/>
                    {/* <Col lg={12} xs={22}>
                        Sorry, answer not found. 
                    </Col> */}
                    <Col lg={6} xs={1}/>
                </Row>
            )
        if(this.props.location.state&&this.state.question.user==this.loadStorage("user")){
            
            return (
                <QDetail data={this.state.question}/>
            )
        }else{
            return(
                <ADetail data={this.state.question}/>
            )
        }
    }
}

const styles = {
    container:{
        marginTop:"50px"
    }
}

