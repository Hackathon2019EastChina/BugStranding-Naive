import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Row, Col, AutoComplete,Tabs } from 'antd';
import QCard from './qCard'
const { TabPane } = Tabs;

export class My extends BaseComponent {

    constructor(props){
        super(props);
        this.state={
            data:1,
        }
    };

    componentWillMount(){
        var successAction = (result) => {
            if(result.status=="ok"){
                this.setState({data:result.questions})
            }else{
                this.pushNotification("danger", JSON.stringify(result));
            }
        }

        var errorAction = (result) => {
            this.pushNotification("danger", "Connection Failed");
        }
        
        this.getWithErrorAction('/question/list?user='+this.loadStorage("user"), successAction,errorAction);
    }

    renderQCard=(data)=>{
        if(data.user!=this.loadStorage("user"))
            return(
                <QCard data={data}/>
            )
    }

    renderACard=(data)=>{
        if(data.user==this.loadStorage("user"))
            return(
                <QCard data={data}/>
            )
    }

    render(){
        if(this.state.data.length){
            if(this.state.data.length>0)
                return (
                    <Row style={styles.container} >
                        <Col lg={6} xs={1}/>
                        <Col lg={12} xs={22}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Answers" key="1">
                                    {this.state.data.map(this.renderQCard)}
                                </TabPane>
                                <TabPane tab="Questions" key="2">
                                    {this.state.data.map(this.renderACard)}
                                </TabPane>
                            </Tabs>
                        </Col>
                        <Col lg={6} xs={1}/>
                    </Row>
                );
            else
                return(
                    <Row style={styles.container} type="flex" justify="center">
                        <Row style={{fontSize:22,marginTop:300}}>
                            No questions or answers yet.
                        </Row>
                    </Row>
                )
        }
        else{
            return null
        }
    }
}

const styles = {
    container:{
        marginTop:"50px",
        paddingBottom:"100px"
    }
}

