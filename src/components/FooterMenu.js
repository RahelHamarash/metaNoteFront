import React , {Component} from "react";
import {Icon, Container} from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import {Link} from "react-router-dom"

class FooterMenu extends Component{
  
  constructor(props){

    super(props)

    this.state = {

    }

    this.notebooksSidebar = this.notebooksSidebar.bind(this)

  }

  notebooksSidebar(e){

    e.preventDefault()
    this.props.openNotebookSubBar()
  }



  render(){

    const {styles , menuItems} = this.props
    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          width: "100%",
          height: styles.footerMenuHeight,
          backgroundColor: "#333",
          color: "#fff",
          position: "fixed",
          bottom: 0,
          padding:0,
        }}
        id="footermenu"
      >
      
      <Link

      to="/notebooks"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection:"column",
        color:"grey"

      }}

      onClick={this.notebooksSidebar}
      >
        <span style={{ marginRight: 5, fontSize: 20 }}><Icon name={"book"} style={{color:this.props.notebooks ? "orange" : "white"}}/></span>
        {styles.showFooterMenuText && "Notebooks"}
        

      </Link>
      <a
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection:"column",
        color:"grey"
      }}
      href="#"

      >
      <span style={{ marginRight: 5, fontSize: 20 }}><Icon name={"sitemap"} style={{color:this.state.mindmaps ? "orange" : "white"}}/></span>
      {styles.showFooterMenuText && <br/> && "Mindmaps"}
      </a>
      <a
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection:"column",
        color:"grey"

      }}
      href="#"

      >
      <span style={{ marginRight: 5, fontSize: 20 }}><Icon name={"map outline"} style={{color:this.state.flashcards ? "orange" : "white"}}/></span>
      {styles.showFooterMenuText && <br/> && "Flashcards"}
      </a>
      <a
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection:"column",
        color:"grey"

      }}

      href="#"


      >
      <span style={{ marginRight: 5, fontSize: 20 }}><Icon name={"checkmark box"} style={{color:this.state.todos ? "orange" : "white"}}/></span>
      {styles.showFooterMenuText && "Todo Lists"}
      </a>
      </div>
    );
  }
}

export default FooterMenu;
