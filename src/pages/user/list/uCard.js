import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import copy from 'copy-to-clipboard';
import {Card, Row, Col, Typography,Button,Icon, Table,Divider,Descriptions,Input } from 'antd';
import User from '../../../components/auth/user'
import {withRouter} from "react-router-dom";
const { TextArea } = Input;
const { Title,Paragraph } = Typography;

const test={
}

var columns = [];
class UCard extends BaseComponent {

    constructor(props){
        super(props);
        this.state={
            desp:1,
        }
    };

    componentWillMount(){
    }

    renderTitle=(title,desp,user,time,qid)=>{
        // return(
        //     <Row type="flex" justify="start" align="middle">
        //         <Col span={24}>
        //             <Title level={2}>{title}</Title>
        //         </Col>
        //         <Col span={24}>
        //             <Row type="flex" justify="start" align="middle">
        //                 <User user={user}/>
        //             </Row>
        //         </Col>
        //         <Col span={24}>
        //             <Paragraph style={{fontSize:18,marginBottom:5}}>{time}</Paragraph> 
        //         </Col>
        //         <Row type="flex" justify="start" align="middle" style={{width: '100%'}}>  
        //             <Paragraph style={{fontSize:18,marginBottom:5}}>{desp}</Paragraph>
        //         </Row>
        //     </Row>
        // )

        return (
            <Card 
                style={{width:"100%",marginBottom:20}}
                title={<Title level={3}>
                {<a onClick={()=>{this.props.history.push({
                pathname:"/user/detail",
                state:{qid,user,completed:true}
                })}}>{title}</a>}</Title>}>

                <Col span={24}>
                     <Row type="flex" justify="start" align="middle">
                         <User user={user}/>
                     </Row>
                 </Col>
                 <Col span={24}>
                     <Paragraph style={{fontSize:18,marginBottom:5}}>{time}</Paragraph> 
                 </Col>
                 <Row type="flex" justify="start" align="middle" style={{width: '100%'}}>  
                     <Paragraph style={{fontSize:18,marginBottom:5}}>{desp}</Paragraph>
                 </Row>
            </Card>



        );




    }

    render(){
        const {title,desp,user,time}=this.props.data
        const qid=this.props.data.qid
        return (
            this.renderTitle(title,desp,user,time,qid)
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

export default withRouter(UCard);

