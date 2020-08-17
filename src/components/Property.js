import React, {Component} from 'react'

class Property extends Component{

    state = {
        x:0,
        y:0,
    }

    render(){
        const s = {
            float:'left'
        }
        return(
            <div className='property' style={s}>
                <div>
                    <button onClick = {this.props.onClickMakeItem}>Circle</button>

                    <button onClick = {(e) => {this.props.onClickOrigin('x')}}>OriginX</button>
                    <button onClick = {(e) => {this.props.onClickOrigin('y')}}>OriginY</button>
                </div>
            </div>
        );
    }
}

export default Property;