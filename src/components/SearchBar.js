import React,{Component} from "react";
import {Row,Col,AutoComplete,Input} from 'antd';
import BaseComponent from './BaseComponent'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import {setKeyword} from '../redux/actions/action'

const mapStateToProps = state => ({
    keyword: state.keywordReducer.keyword,
})
class SearchBar extends BaseComponent {
    
    constructor(props){
        super(props);
        this.state={
            isEnter:false,
            dataSource:[],
            name:""
        }
    };

    search=()=>{
        const keyword=this.state.name
        this.props.dispatch(setKeyword(keyword))
        this.props.history.push({pathname:"/user/search",state:{keyword}})
    }

    fetchAutoComplete = (value) => {
        var successAction = (result) => {
            this.setState({dataSource: result.content});
            console.log("success")
        }
        this.post('/movie/incomplete?keyword='+value,null, successAction)
    }

    autoOnChange = (value) => {
        this.setState({
            name:value
        })
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout((
            this.fetchAutoComplete(value)
        ),500);
    }

    renderSearch=()=>{
        let style={}
        if(this.state.isEnter)
            style={ width: '100%',opacity:1,fontFamily:"Georgia" }
        else
            style={ width: '100%',opacity:0.4,fontFamily:"Georgia" }
        return(
            <AutoComplete
            size="large"
            style={style}
            dataSource={this.state.dataSource} 
            onChange={this.autoOnChange}
            placeholder="Search For An Existing QA">
                <Input.Search
                size="large"
                onSearch={this.search}
                />
            </AutoComplete>
        )
    }

    render(){
        return(
            <div
            onClick={()=>this.setState({isEnter:true})}>
                {this.renderSearch()}
            </div>
        );
    }
}

export default connect(mapStateToProps)(withRouter(SearchBar));