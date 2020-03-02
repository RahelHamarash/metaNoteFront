import React, { Component } from "react";
import "./topbar.css" ;
import {Button} from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'

class TopBar extends Component{


  constructor(props){

    super(props)

    this.HandleSidebar = this.HandleSidebar.bind(this)

  }
  HandleSidebar(e){

    this.props.ClickSidebarButton(e)
  }
  
  render(){

    const {styles} = this.props 
    const topBarStyle = {
      position: "fixed",
      top: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: styles.topBarHeight,
      backgroundColor: "#fff",
      borderBottom: "1px solid #d8d8d8",
      fontWeight: "bold",
      padding: "0px 6px",
      boxSizing: "border-box"
    }

    return (
      <div style={topBarStyle} className="header">
        <Button icon="th list" style={{backgroundColor:"white" , color:this.props.sidebarOpen ? "#5ED3B4" : "grey" }}  size="big" onClick={this.HandleSidebar}/>
      </div>
    )
  }
}

export default TopBar;
