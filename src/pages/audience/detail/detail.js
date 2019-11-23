import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Row, Col, AutoComplete,Tabs,Button,Typography,Input,Divider } from 'antd';
import User from './user'
import QDetail from './qDetail'

const { TabPane } = Tabs;
const { Title,Paragraph } = Typography;
const { TextArea } = Input;

export class Detail extends BaseComponent {
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        if(this.props.location.state&&this.props.location.state.user==this.loadStorage("user")){
            return (
                <QDetail state={this.props.location.state}/>
            )
        }else{
            return(
                null
                /* <ADetail/> */
            )
        }
    }
}

const styles = {
    container:{
        marginTop:"50px"
    }
}

