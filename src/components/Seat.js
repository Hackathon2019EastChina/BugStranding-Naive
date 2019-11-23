import React from "react";
import BaseComponent from './BaseComponent'
import { Row, Col,Button } from 'antd';

const seatTypes=[
    [require("./resource/seat0.png"),require("./resource/seat0.png"),require("./resource/seat0.png")],
    [require("./resource/seat1.png"),require("./resource/seat1_occupied.png"),require("./resource/seat1_selected.png")],
    [require("./resource/seat1.png"),require("./resource/seat1_occupied.png"),require("./resource/seat1_selected.png")],
    [require("./resource/seat1.png"),require("./resource/seat1_occupied.png"),require("./resource/seat1_selected.png")],
]
export default class Seat extends BaseComponent{
    constructor(props){
        super(props);
        this.state={
            selected:this.props.selected,
        }
    }

    onClick=()=>{
        const {selected}=this.state
        const {x,y}=this.props
        this.state.selected=!selected
        if(!selected)
            this.props.addSelected(x,y)
        else
            this.props.removeSelected(x,y)
    }

    render(){
        const {isLocked,seats}=this.props
        if(this.state.selected)
            return (this.renderSeatType(seatTypes[seats][2]))
        else
            return(this.renderSeatType(seatTypes[seats][isLocked]))
    }

    renderSeatType=(seatType)=>{
        const {isLocked,seats}=this.props
        return(
            <Button 
            style={styles.seatButton}
            onClick={this.onClick} 
            disabled={seats==0||isLocked!=0} 
            type="link">
                <img style={styles.seat} src={seatType}/>
            </Button>
        )
    }


}

const styles = {
    rows:{
        marginTop:40
    },
    seat:{
        width:50,
        height:50,
    },
    seatButton:{
        padding:0,
        margin:3,
        width:50,
        height:50,
    }
}