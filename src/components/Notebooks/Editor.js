import React , {Component} from "react"
// tinymce
import TinyMce from "./TinyMce"
import {Icon, Header, Button , Dimmer , Segment, Message } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import "./editor.css"
import { Switch } from "react-router"
import { SpringSpinner } from "react-epic-spinners"


class Editor extends Component{
    

  constructor(props){

    super(props)

    this.state = {


    }
  }
  
  componentDidMount(){



  }

  componentDidUpdate(prevProps){


  }

  sidebarButton(e){



  }

  mobileKeyboardHandler(){

    
  }

  componentWillUnmount(){

  }
  
  render(){

    console.log("requester",this.props.noteRequester)
    const {styles} = this.props
    const showSidebar = styles.showSidebar
    const contentStyle = {
      paddingTop: showSidebar ? styles.topBarHeight + 10 : styles.topBarHeight + 20,
      paddingRight: 20,
      paddingBottom: showSidebar ? 20 : styles.footerMenuHeight + 20,
      paddingLeft: showSidebar ? styles.sidebarWidth + 40 : 40,
      background:"white",
      transition:styles.transition,
      width:"100%",
      height:"100%",   

    }




      return(
        
        <div style={contentStyle}>
            

          <TinyMce   
            item={this.props.item} 
            postNote={this.props.postNote} 
            changeNoteStatus={this.props.changeNoteStatus} 
          />
              
        </div>
          
        
        )

  }
}

export default Editor

