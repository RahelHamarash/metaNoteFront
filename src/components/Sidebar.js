import React ,{Component} from "react";
import {Icon } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import NotebookSubBar from "./Notebooks/NotebookSubBar";
import "./sidebar.css"
import {Link} from "react-router-dom"
class Sidebar extends Component{


  constructor(props){

    super(props)
    this.state = {

    }


    this.notebookSubBar = this.notebookSubBar.bind(this)

  }

  notebookSubBar(e){

    e.preventDefault()
    this.props.openNotebookSubBar()  

  }
  
  render(){
    
    const {styles , menuItems} = this.props

    const sidebarStyle={

      height: "100%",
      width:styles.sidebarWidth,
      position: "fixed",
      backgroundColor:'#333',
      paddingTop: 50,
      transition:styles.transition ,
      opacity:this.props.state.sidebarOpen ? 1:0,
      

    }
    const menuItemStyle = {
      display: "flex",
      justifyContent:styles.sidebarCollapsed ? "center":"flex-start" ,
      alignItems: "center",
      padding: `30px ${styles.sidebarCollapsed ? 0 : 10}px`,
      color:"white",
    }
  
    const iconStyle = {
      fontSize: 26,
      marginRight: styles.sidebarCollapsed ? 0 : 10,
      
    }
  
    const logoStyle = {
      textAlign: "center",
      color: styles.white(),
      fontSize: 34,
      marginBottom: 60,
      fontWeight: "bold"
    }
    if(!this.props.state.notebooks){

      return (

          <div style={sidebarStyle} className="sidebar ">
          
            <a style={menuItemStyle}  title={"Notebooks"} onClick={this.notebookSubBar} href="#">
              <span style={iconStyle} >{
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={this.props.state.notebook ? "#5ED3B4" : "white"}>
                  <path d="M18.376 13.896l-2.376.479.479-2.375 1.897 1.896zm-1.425-2.368l1.896 1.896 5.153-5.153-1.896-1.896-5.153 5.153zm3.31 3.311l-.094.08v2.241c-3.927.269-6.853 1.148-8.25 1.649v-11.74c2.705-1.602 7.582-2.172 10.083-2.303v-1.766c-4.202.128-8.307.804-11 2.481-2.693-1.677-6.798-2.353-11-2.481v15.904c3.608.11 7.146.624 9.778 1.829.775.355 1.666.356 2.444 0 2.633-1.205 6.169-1.718 9.777-1.829v-5.804l-1.738 1.739zm-10.178 3.969c-1.397-.5-4.322-1.38-8.25-1.649v-12.228c4.727.356 6.9 1.341 8.25 2.14v11.737zm4.959-4.263l.177-1.066-2.219.549v1.019l2.042-.502z"/>
                </svg>
                }
              </span>
            </a>
            <a style={menuItemStyle}   href="#" title={"Mindmaps"}>
              <span style={iconStyle}>{<Icon name={"sitemap"} style={{color:this.state.mindmaps ? "#5ED3B4" : "white"}} size="small"/>}</span>
            </a>
            <a style={menuItemStyle}   href="" title={"Flash cards"}>
              <span style={iconStyle}>{<Icon name={"map outline"} style={{color:this.state.flashcards ? "#5ED3B4": "white"}} size="small"/>}</span>
            </a>  
            <a style={menuItemStyle}href="#" title={"Todo Lists"}>
              <span style={iconStyle}>{<Icon name={"checkmark box"} style={{color:this.state.todos ? "#5ED3B4": "white"}} size="small"/>}</span>
            </a>   
          </div>

      )
    }else{

    

        sidebarStyle.display = "flex"
        sidebarStyle.flexDirection = "row"


      return(
          <div style={sidebarStyle}>

            <div className="sidebar">

              <a  style={menuItemStyle} title={"Notebooks"} onClick={this.notebookSubBar} href="#"> 
                <span style={iconStyle}>{                
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={"#5ED3B4"}>
                    <path d="M18.376 13.896l-2.376.479.479-2.375 1.897 1.896zm-1.425-2.368l1.896 1.896 5.153-5.153-1.896-1.896-5.153 5.153zm3.31 3.311l-.094.08v2.241c-3.927.269-6.853 1.148-8.25 1.649v-11.74c2.705-1.602 7.582-2.172 10.083-2.303v-1.766c-4.202.128-8.307.804-11 2.481-2.693-1.677-6.798-2.353-11-2.481v15.904c3.608.11 7.146.624 9.778 1.829.775.355 1.666.356 2.444 0 2.633-1.205 6.169-1.718 9.777-1.829v-5.804l-1.738 1.739zm-10.178 3.969c-1.397-.5-4.322-1.38-8.25-1.649v-12.228c4.727.356 6.9 1.341 8.25 2.14v11.737zm4.959-4.263l.177-1.066-2.219.549v1.019l2.042-.502z"/>
                  </svg>}
                </span>
              </a>
              <a style={menuItemStyle}  href="#" title={"Mindmaps"}>
                <span style={iconStyle}>{<Icon name={"sitemap"} style={{color:this.state.mindmaps ? "#5ED3B4" : "white"}} size="small"/>}</span>
              </a>
              <a style={menuItemStyle}  href="" title={"Flash cards"}>
                <span style={iconStyle}>{<Icon name={"map outline"} style={{color:this.state.flashcards ? "#5ED3B4": "white"}} size="small"/>}</span>
              </a>  
              <a style={menuItemStyle}  href="" title={"Todo Lists"}>
                <span style={iconStyle}>{<Icon name={"checkmark box"} style={{color:this.state.todos ? "#5ED3B4": "white"}} size="small"/>}</span>
              </a>   
            </div>
            <div className="subSidebar">
              <NotebookSubBar 
                menuItems={menuItems} 
                styles={styles} 
                state={this.props.state}
                loadNotebookNotes={this.props.loadNotebookNotes} 
                notebooksMounted={this.props.notebooksMounted}
                changeNotebooksArrow={this.props.changeNotebooksArrow}
                openNotebooksEditor={this.props.openNotebooksEditor}  
                addNewNotebook={this.props.addNewNotebook}
                notebooksFetchFailedRetry={this.props.notebooksFetchFailedRetry}
                hanldeNotebookAdding={this.props.hanldeNotebookAdding}

              />
            </div>

          </div>
      )
    }
      
  }
};

export default Sidebar;
