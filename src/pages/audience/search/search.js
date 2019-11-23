import React from "react";
import BaseComponent from '../../../components/BaseComponent'
import { Row, Col, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import {setKeyword} from '../../../redux/actions/action'
import {withRouter} from "react-router-dom";
import ErrorPage from '../../../components/ErrorPage'

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
            data1:[],
            data2:[]
        }
    }

    componentWillMount(){
        this.getResult(keyword)
    }

    getResult=(keyword)=>{
        var successAction = (result) => {
            const data1=[]
            const data2=[]
            if(result.content!=null&&result.content.length>0){
                for(var i=0;i<result.content.length;i++){
                    if(i%2==0)
                        data1.push(result.content[i])
                    else
                        data2.push(result.content[i])
                }
                this.state.data1=data1
                this.state.data2=data2
            }
            this.setState({loading:false})   
        }
        this.get("/movie/search?keyword="+keyword,successAction)
    }

    renderItem=(item)=>{
        return(
            {/* <FilmCard item={item}/> */}
        );
    }
    
    renderList=()=>{
        if(this.state.data1.length>0)
            return(
                <Row  type='flex' justify='space-around'>
                    <Col xs={11} sm={10}>
                        {this.state.data1.map(this.renderItem)}
                    </Col>
                    <Col xs={11} sm={10}>
                        {this.state.data2.map(this.renderItem)}
                    </Col>
                </Row>
            )
        else
            return(
                <ErrorPage text={"未找到相应结果"}/>
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
                    <ErrorPage text={"访问失败，请遵照网站指引进行浏览"}/>
                </Row>
            );
        else
            return (
                <Row style={styles.container} >
                    <Row style={styles.rows} id="listStart" type='flex' justify='center'>
                        <Col xs={22} sm={20} lg={18}>
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
        fontSize:20,
        fontFamily:"黑体"
    },
    rows:{
        marginBottom:30
    }
}