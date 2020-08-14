import React, {Component} from 'react'
import foldIcon from '../asset/image/folding-icon.svg';
import { findRenderedComponentWithType } from 'react-dom/test-utils';

class LeftNavigation extends Component{
    
    isLeftSidebarFold = (bool) => 
    {
        if (!bool) {
            return {
            width: "424px",
            animationDelay: ".3s",
            background:'white',
            };
        } 
        else {
            return {
            width: "60px",
            animationDelay: ".3s",
            background:'white',
            };
        }
    }

    render()
    {
        const _leftNavigationName = this.props.visible ? "leftNavigation" : "leftNavigation Template";
        const {visible, onLeftFoldUpdate} = this.props;

        return(
            <React.Fragment>
                <div id="leftNavigation" className={_leftNavigationName} style={this.isLeftSidebarFold(visible)}>
                    <div className="boxWrapper">
                        {/* <div className="option item">
                        {this.renderMenu()}
                        </div> */}

                        <div className="fold_btn" onClick={() => onLeftFoldUpdate(!visible)}>
                            <img src={foldIcon} alt="setting" />
                        </div>
                    </div>
                    {/* <LeftSideNavigation
                        searchInfoInitialize={this.props.searchInfoInitialize}
                        getSearchMenuControl={this.props.getSearchMenuControl}
                        handleSearch={this.props.handleSearch}
                        isLeftSidebarFold={this.props.visible}
                        selectMenu={this.props.selectMenu}
                        isImageClicked={this.props.isImageClicked}
                        isTextClicked={this.props.isTextClicked}
                        handleTemplateButton={this.props.handleTemplateButton}
                        handleOpenMyDesign={this.props.handleOpenMyDesign}
                        onClickUploadImg={this.props.onClickUploadImg}
                        onClickFigure={this.props.onClickFigure}
                        onClickLine={this.props.onClickLine}
                        clickedElement={this.props.clickedElement}
                        handleChangeInput={this.props.handleChangeInput}
                        searchInput={this.props.searchInput}
                        clickedTap={this.props.clickedTap}
                        getSearchInfo={this.props.getSearchInfo}
                        isLogined={this.props.isLogined}
                        setPatternBackground={this.props.setPatternBackground}
                        defaultCategoryId={this.props.defaultCategoryId}
                    /> */}
                </div>
            </React.Fragment>
        );
    }
}

export default LeftNavigation;