import React, { Component } from "react";

import "./Editor.scss";


import FabricCanvas from '../Fabric/FabricCanvas'
//import FabricCanvas from '../Fabric/b'

import Property from './Property'
// import TemplateAutoFitMenu from "./TemplateAutoFitMenu/TemplateAutoFitMenu";

class Editor extends Component 
{
    onLeftFoldUpdate = (bool) =>{
        this.setState({fold:bool});
      }

    onClickMakeItem = (type) => {
        FabricCanvas.getInstance().__MakeTool.makeCircle(300,300);
    }

    render()
    {
        return(
            <React.Fragment>
                <FabricCanvas></FabricCanvas>
                <Property onClickMakeItem = {this.onClickMakeItem}></Property>
            </React.Fragment>
        );

        
        
    }
}
    
//     return (
//       <React.Fragment>
        

//         <div id="editor" className="editor" style={editorStyle}>
//         </div>
//         //   <TemplateAutoFitMenu
//         //     open={isOpenTemplateAutoFitMenu}
//         //     handleClickAwayTemplateAutoFitMenu={this.handleClickAwayTemplateAutoFitMenu}
//         //     handleSelectTemplateAutoFitMenu={this.handleSelectTemplateAutoFitMenu}
//         //     menus={AUTO_FIT_MENUS}
//         //     selectedMenuId={selectedTemplateAutoFitMenu}
//         //     isOpenedLeftSideNav={!lsbFold}
//         //   />

//           <div className="Editor-All"></div>
//           <LeftNavigation 
//             visible = {this.state.fold}
//             onLeftFoldUpdate = {this.onLeftFoldUpdate}
//             >

//             </LeftNavigation>
//           </div>

//         </div>
//       </React.Fragment>
//     );
//   }


export default Editor;
