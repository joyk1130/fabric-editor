import React, {Component} from 'react'

class Property extends Component{
    render(){
        const s = {
            float:'left'
        }
        return(
            <div className='property' style={s}>
                <button onClick = {this.props.onClickMakeItem}>Circle</button>
                <button onClick = {this.props.onClickMakeItem}>Circle</button>
            </div>
        );
    }
}

export default Property;