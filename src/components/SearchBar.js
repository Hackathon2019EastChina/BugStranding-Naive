import React,{Component} from "react";
import {Row,Col,AutoComplete,Input} from 'antd';
import BaseComponent from './BaseComponent'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import {setKeyword} from '../redux/actions/action'
import { timeout } from "q";

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
        if(!keyword||keyword==""){
            this.pushNotification("danger","Keyword shouldn't be empty.")
            return
        }
        this.props.history.push({pathname:"/user/",state:{keyword}})
        this.timeout(1).then(()=>
        
        this.props.history.push({pathname:"/user/search",state:{keyword}}))
        
    }

    fetchAutoComplete = (value) => {
        var successAction = (result) => {
            const group=result.recommend
            if(group&&group.suggestionGroups.length){
                const jArr=group.suggestionGroups[0].searchSuggestions
                var suggestions=[]
                for(var i=0;i<jArr.length;i++){
                    suggestions.push(jArr[i].displayText)
                }
                this.setState({dataSource:suggestions });
            }
        }
        this.get('/question/searchRecommend?keywords='+value,successAction)
    }

    autoOnChange = (value) => {
        this.setState({
            name:value
        })
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timeout(500).then(()=>{
            this.fetchAutoComplete(value)
        });
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

export default withRouter(connect(mapStateToProps)(SearchBar));