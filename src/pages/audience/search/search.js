import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import {Skeleton, Row, Col, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import {setKeyword} from '../../../redux/actions/action'
import {withRouter} from "react-router-dom";
import ErrorPage from '../../../components/ErrorPage'
import UCard from '../list/uCard'

var keyword=null
const mapStateToProps = state => ({
    keyword: state.keywordReducer.keyword,
})
export class Search extends BaseComponent {
    constructor(props){
        super(props);
        if(this.props.location.state){
            keyword=this.props.location.state.keyword
        }
        this.state={
            loading:true,
            data:[]
        }
    }

    componentWillMount(){
        this.getResult(keyword)
    }

    getResult=(keyword)=>{
        var successAction = (result) => {
            this.setState({loading:false,data:result.question})   
        }
        this.get("/question/search?keywords="+keyword,successAction)
    }

    renderItem=(item)=>{
        return(
            <UCard data={item}/>
        );
    }
    
    renderList=()=>{
        if(this.state.data.length>0)
            return(
                <Row  type='flex' justify='center' style={{width:"100%"}}>
                    
                    <Col lg={2} xs={1}/>
                    <Col lg={20} xs={22}>
                        {this.state.data.map(this.renderItem)}
                    </Col>
                    <Col lg={2} xs={1}/>
                </Row>
            )
        if(this.state.loading)
            return(
                <Row  type='flex' justify='center' style={{width:"100%"}}>
                    <Col span={18}>
                        <Skeleton active/>
                    </Col>
                </Row>
            )
        else
            return(
                <ErrorPage text={"No result found"}/>
            )
    }

    render(){
        if(this.props.keyword) {
            if(keyword!=this.props.keyword)
                this.getResult(this.props.keyword)
            keyword=this.props.keyword
        }
        if(!keyword)
            return (
                <Row style={styles.container} >
                    <ErrorPage text={"Access Failed. Please follow the instruction of the site."}/>
                </Row>
            );
        else
            return (
                <Row style={styles.container} >
                    <Row style={styles.rows} id="listStart" type='flex' justify='center'>
                        <Col xs={22} sm={20} lg={17}>
                            <h3 style={styles.titles}>Search Result</h3>
                        </Col>
                    </Row>
                    <Row style={styles.rows} type='flex' justify='center'>
                        <Col xs={24} sm={22} lg={20}>
                            {this.renderList()}
                        </Col>
                    </Row>
                </Row>
            );
    }
}

const styles = {
    container:{
        marginTop:"50px"
    },
    titles:{
        marginLeft:20,
        marginTop:10,
        fontSize:22,
        fontFamily:"Georgia"
    },
    rows:{
        marginBottom:30
    }
}

