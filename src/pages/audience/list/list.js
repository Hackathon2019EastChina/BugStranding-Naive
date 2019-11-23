import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Row, Col, AutoComplete,Tabs } from 'antd';
import CCard from './cCard'
import UCard from './uCard'
const { TabPane } = Tabs;

export class List extends BaseComponent {

    renderQCard=()=>{
        return(
            <TabPane tab="Under Going" key="1">
                <UCard/>
                <UCard/>
            </TabPane>
        )
    }

    renderACard=()=>{
        return(
            <TabPane tab="Completed" key="2">
                <CCard/>
                <CCard/>
                <CCard/>
            </TabPane>
        )
    }

    render(){
        return (
            <Row style={styles.container} >
                <Col lg={6} xs={1}/>
                <Col lg={12} xs={22}>
                    <Tabs defaultActiveKey="1" >
                        {this.renderQCard()}
                        {this.renderACard()}
                    </Tabs>        
                </Col>
                <Col lg={6} xs={1}/>
            </Row>
        );
    }
}

const styles = {
    container:{
        marginTop:"50px"
    }
}

