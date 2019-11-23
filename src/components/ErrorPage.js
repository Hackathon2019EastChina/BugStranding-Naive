import React from "react";
import BaseComponent from './BaseComponent'
import { Row, Col, AutoComplete,Typography } from 'antd';

export default class ErrorPage extends BaseComponent {
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (
            <Row style={styles.rows} >
                <Col span={24} style={styles.rows}>
                    <Row type='flex' justify='center'>
                        <img style={styles.pic} src={require('./resource/error.png')}/>
                    </Row>
                </Col>
                <Col span={24} style={styles.rows}>    
                    <Row type='flex' justify='center'>
                        <Typography style={styles.name}>{this.props.text}</Typography>
                    </Row>
                </Col>
            </Row>
        );
    }
}

const styles = {
    container:{
        marginTop:"100px"
    },
    pic:{
        height:180,
        width:180
    },
    name:{
        textAlign:'start',
        fontSize:"24px",
        color:"black",
        fontFamily:"Georgia",
        margin:10
    },
}

