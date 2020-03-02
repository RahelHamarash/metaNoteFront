import React ,{Component , Fragment} from "react";
import {Icon , Card , Divider , Input , Button , Modal , Header , Grid , Portal , Segment , Popup } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import "../substyles.css"
import {SpringSpinner , HalfCircleSpinner, AtomSpinner, FulfillingBouncingCircleSpinner} from 'react-epic-spinners'
import {Link } from "react-router-dom"

class NotebookSubBar extends Component{


  constructor(props){



    super(props)
    this.state = {

      searchHover:false,      
    }
    this.changeArrow = this.changeArrow.bind(this)
    this.loadNotes = this.loadNotes.bind(this)
    this.openEditor = this.openEditor.bind(this)
    this.addNotebook = this.addNotebook.bind(this)
    this.newNotebookHover = this.newNotebookHover.bind(this)
    this.searchHover = this.searchHover.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.notebooksFetchFailedRetry = this.notebooksFetchFailedRetry.bind(this)
  }



  componentDidMount(){


    this.props.notebooksMounted()


  }



  loadNotes(e , id){

    this.props.loadNotebookNotes(e , id)
  }

  changeArrow(e){

    e.preventDefault()
    this.props.changeNotebooksArrow(e)
  }

  openEditor(e, editorItem){

    
    this.props.openNotebooksEditor(e,editorItem._id , editorItem)
  }

  addNotebook(e){

    e.preventDefault()
    this.props.addNewNotebook(e)
  }

  newNotebookHover(e){

    e.preventDefault()
    this.setState(state => {

      return {notebookHover:!state.notebookHover}
    })
  }

  searchHover(e){

    e.preventDefault()
    this.setState(state => {

      return {searchHover:!state.searchHover}
    })
  }

  handleOpen(bool){

    this.setState({open:bool})
  }


  notebooksFetchFailedRetry(e){

    this.props.notebooksFetchFailedRetry()
  }

  hanldeNotebookAdding(e,bool){

    e.preventDefault()
    this.props.hanldeNotebookAdding(bool)
  }


  
  render(){


    const {styles,menuItems} = this.props
    const sidebarStyle={

      display:this.props.state.notebooksFetched ? "block":"flex",
      position: "relative",
      transition:styles.transition,
      paddingTop: 10,
      alignItems:this.props.state.notebooksFetched ?"none" :"center",
      width:"100%",
      alignContent : this.props.state.notebooksFetched ? "none" : "center",
      justifyContent : this.props.state.notebooksFetched ? "none" : "center"
    }
    const menuItemStyle = {
      display: "flex",
      justifyContent:styles.sidebarCollapsed ? "center":"flex-start" ,
      alignItems: "center",
      padding: `10 ${styles.sidebarCollapsed ? 0 : 10}px`,
      paddingRight:'14px',
      paddingTop:'10px',
      color: 'black',


      
    }
  

      return (
        <div style={sidebarStyle} className="scroll scale-in-left" >
          {
            this.props.state.notebooksFetched ? 
            <Fragment>
              <div  style={{display:"flex"  , paddingLeft:"15px" }} >
              <span style={menuItemStyle}>
                {this.props.state.addingNotebook === "loading" ?

                  <FulfillingBouncingCircleSpinner color="#5ED3B4" size={25}/>                
                  :
                  <Fragment> 
                    <a title="Add New Notebook"  href="#" onClick={(e) => this.hanldeNotebookAdding(e,true)}>
                      <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg" fill="grey">
                        <path d="M7 2c1.695 1.942 2.371 3 4 3h13v17h-24v-20h7zm4 5c-2.339 0-3.537-1.388-4.917-3h-4.083v16h20v-13h-11zm2 6h3v2h-3v3h-2v-3h-3v-2h3v-3h2v3z"/>
                      </svg>
                    </a>
                    <Modal size={"mini"} open={this.props.state.openNewNotebookModal} onClose={this.props.state.notebookAddingStatus === "resolved" ? (e) => this.hanldeNotebookAdding(e,false) : null}>
                    <Modal.Header style={{color:"grey" , display:"flex" , width:"100%"}}>
                      <span style={{width:"95%"}}>Add New Notebook</span>
                      <a onClick={(e) => this.hanldeNotebookAdding(e,false)} href="#" style={{width:"5%"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="grey">
                          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
                        </svg>
                      </a>
                    </Modal.Header>
                    <Modal.Content>
                      <Input id="addNotebookInput" placeholder="Type Notebook Name" size="big" style={{width:"100%"}} />
                      {this.props.state.notebookAddingStatus === "failed" ? <p style={{color:"#D8000C" , paddingTop:"5px"}}>failed to  add notebook , please check connection</p> : null}
                    </Modal.Content>
                    <Modal.Actions style={{display:"flex", flexDirection:"row" , justifyContent:"flex-end"}}>                    
                        {this.props.state.notebookAddingStatus === "loading" ? <HalfCircleSpinner color="#5ED3B4" size={25} style={{marginTop:"5px",marginRight:"8px"}}/> : null}
                        <Button style={{backgroundColor:"#5ED3B4"}} onClick={(e) => this.addNotebook(e)} type="submit">Submit</Button>
                    </Modal.Actions>
                  </Modal>
                </Fragment>
                
                }

              </span>
              <span style={menuItemStyle}>
                <a 
                    href="#"
                    onMouseEnter={this.searchHover}
                    onMouseLeave={this.searchHover}
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24"  fill={this.state.searchHover ? "#5ED3B4" :"grey"}>
                    <path d="M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/>
                  </svg>
                </a>
              </span>
            
            </div>
            <Divider/>
          </Fragment>
            :
            false
          }


          {
            
          this.props.state.notebooksFetched ?
            this.props.state.notebooksValue.map(item => {
                
                return (
                  <div style={{marginBottom:30 , display:"flex", flexDirection:"column" , justifyContent:"space-between" , paddingLeft:"15px" }} key={item._id}>
                    <div style={{display:"flex" }}>
                      <a style={{color:"white" , paddingRight:"7px" }}  onClick={this.changeArrow} href="#"><Icon className="arrow" id={item._id} state="false" name={this.props.state[item._id] ? "arrow down" :"arrow right"} link style={{color:this.props.state[item._id] ? "#5ED3B4" : "white" }} /></a>
                      <Link to={this.props.state[`${item._id}${item._id}`] ? '/' : `/notebooks/${item._id}/notes` } style={{color:this.props.state[`${item._id}${item._id}`] ? "#5ED3B4":"white" , wordWrap: "break-word"  }} id={`${item._id}${item._id}`}  className="notebooks" onClick={(e) => this.loadNotes( e, item._id)} >{item.notebook_title}</Link>

                    </div>

                      <div style={{color:"white" , display:this.props.state[item._id] ? "flex" :"none" , flexDirection:"column" , paddingLeft:"15px" , justifyItems:"center"}} className={"scale-in-ver-top"}>
                        {item.notes.map(note => {
                                        

                          return (
                            <Fragment key={note._id} >
                              <Divider/>
                              <Link
                              to={ this.props.state[note._id] ? '/':  `/notebooks/${item._id}/notes/${note._id}/show` }                              
                              onClick={(e) => this.openEditor(e,{ _id:item._id , notebook_title:item.notebook_title , note:{ _id:note._id , note_title:note.note_title }})} 
                              id={note._id} 
                              style={{paddingBottom:"3px" , color:this.props.state[note._id] ? "#5ED3B4" : "white"}} 
                              className="truncate" title={note.note_title}  id={note._id}
                                  
                              >
                              {note.note_title}
                              </Link>
                            </Fragment>
                            
                          )
                        })}

                      </div>
                    
                    
                    <span style={{color:"grey" , marginTop:"10px"}}>{`${item.notes.length} notes`}</span>
                    <Divider/>

                  </div>
                )
            })
          :
          this.props.state.notebooksFetchFailed ?
          <div style={{display:"flex", flexDirection:"column" , justifyContent:"center"}}>
            <a  href="#" onClick={this.notebooksFetchFailedRetry} style={{background:"none"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="98" height="50" viewBox="0 0 24 24" fill="#ff6666">
                <path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z"/>
              </svg>
            </a>
            <div style={{color:"#ff6666", fontSize:"14px" }}>connection failed</div>

          </div>
          :
          <SpringSpinner color="#5ED3B4" />
          }

        </div>
      ) 
  }
}

export default NotebookSubBar;
