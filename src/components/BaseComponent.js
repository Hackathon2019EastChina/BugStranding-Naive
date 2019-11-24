import { Component } from 'react';
import {notification} from 'antd';

var moment = require('moment');

export class BaseComponent extends Component {
    
    // local
    //ip = "http://localhost:3000";  
    // local_peer
    // ip = "http://211.65.35.118:3000";  
    // remote
    // ip = "http://ifnya.com:3000";
    // remote Azure
    ip = "http://nyako.moe:3000"

    post = (url, form, successAction,unsuccessAction,errorAction) => {
        return fetch(this.ip + url, { 
            method: 'POST', 
            mode: 'cors',
            body: form, 
            credentials: 'include',
            header: { 'content-type': 'multipart/form-data' } 
            })
            .then((response) => (response.json()))
            .catch((error) => { console.error(error); })
            .then((result) => { this.handleResult(result,successAction,unsuccessAction,errorAction); });
    }

    get = (url, successAction)=>{
        var unsuccessAvtion=(result)=>{
            console.log(result)
            this.pushNotification("danger", result.message);
        }
        var errorAction=()=>{
            console.log("error")
        }
        this.getWithErrorAction(url,successAction,unsuccessAvtion,errorAction)
    }

    getWithErrorAction = (url, successAction,unsuccessAction,errorAction)=>{
        return fetch(this.ip + url, { 
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
            })
            .then((response) => (response.json()))
            .catch((error) => { console.log(error); })
            .then((result) => { this.handleResult(result,successAction,unsuccessAction,errorAction); });
    }

    timeout(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, ms, 'done');
        });
    }

    handleResult=(result,successAction,unsuccessAction,errorAction) => {
        if (!result) {
            console.log(result)
            if(errorAction) errorAction()
            this.pushNotification("danger", "Connection Failure");
            return;
        }

        if (result.status==null) {
            if(unsuccessAction) 
                unsuccessAction(result)
            return;
        }
        successAction(result);
        return;
        this.pushNotification("danger","Unparsable "+ JSON.stringify(result));
    }

    fromNow = (date) => {
        return moment(date).fromNow()
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleDate=(_date,count)=>{
        if(_date){
            _date+=""
            var date = _date.substring(5, 7) + "月" + _date.substring(8, 10) + "日";
            if (count == 1) 
                date += "（今天）";
            else if (count == 2) 
                date += "（明天）";
            return date;
        }
    }

    handleTime=(_time)=>{
        if(_time){
            _time+=""
            var time= _time.substring(11, 16)
            return time
        }
    }

    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    pushNotification = ( kind, reason ) => {
        notification.config({
            placement: 'topRight',
            top: 80,
            duration: 4,
        });
        if(kind=='danger')
            notification.warning({
                message:reason,
                description:"Unsuccess",
            })
        else if(kind=='success')
            notification.success({
                message:reason,
                description:"Success"
            })
        else
            notification.open({
                message:reason,
                description:"Unknown Error"
            })
    }

    scrollToView=(id)=>{
        if (id) {
            let anchorElement = document.getElementById(id);
            if(anchorElement) { 
                anchorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' 
                });
            }
        }
    }

    sleep(delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
          continue;
        }
    }

    loadStorage(key){
        return localStorage.getItem(key)
    }
    

}

export default BaseComponent;