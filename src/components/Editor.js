import React, { Component } from "react";

import "./Editor.scss";

import LeftNavigation from "./LeftNavigation";

import FabricCanvas from '../Fabric/FabricCanvas'
// import TemplateAutoFitMenu from "./TemplateAutoFitMenu/TemplateAutoFitMenu";

class Editor extends Component 
{
    state = {
        fold : false
    }

    onLeftFoldUpdate = (bool) =>{
        this.setState({fold:bool});
      }

    render()
    {
        const editorStyle = this.state.fold? { marginLeft: "60px" } : { marginLeft: "424px" }
        
        return(
            <React.Fragment>
                <FabricCanvas></FabricCanvas>
                 {/* <LeftNavigation 
                        visible = {this.state.fold}
                        onLeftFoldUpdate = {this.onLeftFoldUpdate}
                        >
                </LeftNavigation>  
                    <div id = 'editor' className = 'editor' style={editorStyle}>
                    <div className="Editor-All">
                        
                    </div>
                    
                </div> */}
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
