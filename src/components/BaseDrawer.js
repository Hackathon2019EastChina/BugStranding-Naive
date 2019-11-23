import React,{Component} from "react";
import { Drawer} from 'antd';
import BaseComponent from "./BaseComponent"
import { resetDrawer } from '../redux/actions/action';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    title:state.drawerReducer.title,
    content: state.drawerReducer.content,
    loading: state.drawerReducer.loading,
    closing: state.drawerReducer.closing,
})

class BaseDrawer extends BaseComponent{

    constructor(props) {
        super(props);
        this.state={
            visible:false
        }
    }

    _close=()=>{
        this.setState({
            visible:false
        })
    }
    render(){
        if(this.props.closing){
            this.state.visible=false
            this.props.dispatch(resetDrawer())
        }
        else if(this.props.loading&&!this.state.visible){
            this.state.visible=true
            this.props.dispatch(resetDrawer())
        }
        var width="60%"
        if(document.body.clientWidth>1000)
            width="45%"
        return(
            <Drawer
            title={this.props.title}
            width={width}
            placement="right"
            closable={true}
            onClose={this._close}
            visible={this.state.visible}
            destroyOnClose
            >
                {this.props.content}
            </Drawer>
        );
  }
}

export default connect(mapStateToProps)(BaseDrawer) 