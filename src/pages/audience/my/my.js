import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Row, Col, AutoComplete,Tabs } from 'antd';
import QCard from './qCard'
import ACard from './aCard'
const { TabPane } = Tabs;

export class My extends BaseComponent {

    renderQCard=()=>{
        return(
            <TabPane tab="Questions" key="1">
                <QCard/>
                <QCard/>
            </TabPane>
        )
    }

    renderACard=()=>{
        return(
            <TabPane tab="Answers" key="2">
                <ACard/>
                <ACard/>
                <ACard/>
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

