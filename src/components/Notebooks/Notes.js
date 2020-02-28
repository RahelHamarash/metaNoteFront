import React , {Component , Fragment} from "react";
import {Icon , Card , Image , Header , Divider , Button , Popup , Modal, Input} from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import "./notes.css"
import {Link} from "react-router-dom"
import {HalfCircleSpinner} from 'react-epic-spinners'

class Notes extends Component{

  constructor(props){

    super(props)
    this.state = {

      popup:false,
      open:false

    }

    this.openDropDownMenu = this.openDropDownMenu.bind(this)
    this.openEditor = this.openEditor.bind(this)
    this.renameNotebook = this.renameNotebook.bind(this)
    this.notebookFetchFailedRetry = this.notebookFetchFailedRetry.bind(this)

  }

  componentDidMount(){


    if(this.props.noteUnmounted === 'resolved' || 'initial'){    


      this.props.notebookMounted(this.props.notebook_id , 'mount' )
      this.props.changeNoteStatus('initial')
    

    }




  }

  componentDidUpdate(prevProps){

    console.log(this.props.noteUnmounted)

    if(this.props.noteUnmounted === 'resolved'){
      this.props.notebookMounted(this.props.notebook_id)
      this.props.changeNoteStatus('initial')

    }

    if(this.props.notebook_id !== prevProps.notebookValue._id && this.props.notebookFetched && this.props.notebookRequester !== this.props.notebook_id ){


      this.props.notebookMounted(this.props.notebook_id)           


    }

  }



  openDropDownMenu(){

    this.setState( state => {

      return {popup:!state.popup}
    })
  }

  openEditor(e,item){

    this.props.openNotebooksEditor(e , this.props.notebookValue._id , item)
  }


  renameNotebook(e , notebook_id){

    e.preventDefault()
    this.props.renameNotebook(notebook_id)
  }

  handleRename(bool){

    this.props.handleRename(bool)
  }

  notebookFetchFailedRetry(e,id){

    this.props.notebookFetchFailedRetry(id)
  }


  render(){

    console.log(this.props.notebookFetchFailed)

    const {styles} = this.props
    const { showSidebar } = styles;
    const contentStyle = {

      display:this.props.notebookFetched ? "block" :"flex",
      paddingTop: showSidebar ? styles.topBarHeight + 10 : styles.topBarHeight + 20,
      paddingBottom: showSidebar ? 20 : styles.footerMenuHeight + 20,
      paddingLeft: showSidebar ? styles.sidebarWidth + 15 : 40,
      transition:styles.transition,
      height:"100%",
      width:"99%",
      alignContent:"none",
      alignItems:this.props.notebookFetched ? "none" : "center",
      justifyContent:this.props.notebookFetched ? "none" : "center"
    }

    const {notebookValue , noteStatus} = this.props

    
    return (
      
      <div  style={contentStyle}>
        {
        this.props.notebookFetched ?
          <Fragment>
            <Header as="h2" color="grey" style={{ display:"flex" , justifyContent:"flex-start" }}>
              <span >{notebookValue.notebook_title}</span>
              <a style={{marginLeft:"10px"}} href="#"  title="Rename" onClick={() => this.handleRename(true)}> 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 24" fill="grey">
                  <path d="M18 14.45v6.55h-16v-12h6.743l1.978-2h-10.721v16h20v-10.573l-2 2.023zm1.473-10.615l1.707 1.707-9.281 9.378-2.23.472.512-2.169 9.292-9.388zm-.008-2.835l-11.104 11.216-1.361 5.784 5.898-1.248 11.103-11.218-4.536-4.534z"/>
                </svg>
              </a>
                <Modal size={"mini"} open={this.props.openRenameModal} onClose={() => this.handleRename(false)}>
                  <Modal.Header style={{color:"grey"}}>Rename Notebook</Modal.Header>
                  <Modal.Content>
                    <Input id="renameNotebook" placeholder="Type Notebook Name" size="big" style={{width:"100%"}} />
                  </Modal.Content>
                  <Modal.Actions>
                    <Button style={{backgroundColor:"orange"}} onClick={(e) => this.renameNotebook(e,notebookValue._id)} type="submit">Submit</Button>
                  </Modal.Actions>
                </Modal>

            </Header>
            <Divider/>
            <div className="auto-grid">
            
              {notebookValue.notes.map(note => {

                return(

                  <span key={note._id} className="flip-in-diag-2-br item">
                    <Card style={{cursor:"text" }}>
                      <Link 
                        onClick={(e) => this.openEditor(e,
                        { _id:notebookValue._id , notebook_title:notebookValue.notebook_title , note:{ _id:note._id , note_title:note.note_title } })} 
                        id={note._id}
                        to={`/notebooks/${this.props.notebookValue._id}/notes/${note._id}/show`}
                        style={{color:"black"}}
                      >    

                        <svg x="0" y="0" height="200" width="100%">
                          <foreignObject x="0" y="0" height="100%" width="100%" style={{fontSize:"10px"}} dangerouslySetInnerHTML={{__html:note.blocks.replace(/<[^>]*>?/gm, '')}}></foreignObject>
                        </svg>

                      </Link>
                      <Card.Content >
                        <Card.Header>{note.note_title}</Card.Header>
                          <Card.Meta style={{display:"flex", flexDirection:"row" , width:"100%" }}>
                            <span className='date' style={{alignSelf:"center" , width:"80%"}}>created in 2015</span>
                            <span style={{alignSelf:"center" , width:"20%"}}>
                              <Popup wide hideOnScroll trigger={<Button circular style={{boxShadow:"none"}} icon="ellipsis vertical" basic size="big"/>} position="bottom left" on='click'>
                                <div style={{display:"flex", flexDirection:"column" , justifyContent:"flex-start"}}>
                                  <span style={{color:"grey"}}>Move Note</span>
                                  <Divider style={{width:"100%"}}/>
                                  <span style={{color:"#ed5249"}}> Delete Note</span>
                                  <Divider style={{width:"100%"}}/>
                                  <span>Rename Note</span>
                                </div>
                              </Popup>
                            </span>
                          </Card.Meta>
                        </Card.Content>
                      </Card>
                    

                  </span>
                )
              })}


            </div>
          </Fragment>
          :

          this.props.notebookFetchFailed ? 
            <div style={{display:"flex", flexDirection:"column" , justifyContent:"center"}}>
              <a  href="#" onClick={(e) => this.notebookFetchFailedRetry(e,this.props.notebook_id)} style={{background:"none"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="98" height="50" viewBox="0 0 24 24" fill="#ff6666">
                  <path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z"/>
                </svg>
              </a>
              <div style={{color:"#ff6666", fontSize:"14px" }}>connection failed</div>
            </div>
            :
              <HalfCircleSpinner color="orange"/>
        }
      </div>
    );
  }
}

export default Notes;
