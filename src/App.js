import React, { Component, Fragment } from "react";
import TopBar from "./components/TopBar";
import FooterMenu from "./components/FooterMenu";
import Content from "./components/Content"
import Notes from "./components/Notebooks/Notes";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Notebooks/Editor"
import "./components/styles.css"
import NotebooksMobile from "./components/Notebooks/NotebooksMobile";
import {BrowserRouter as Router , Switch , Route } from "react-router-dom"
import { Persist } from 'react-persist'
import {SpringSpinner} from "react-epic-spinners"

const originalFetch = require('isomorphic-fetch')
const fetch = require('fetch-retry')(originalFetch);

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
      open:false,
      notebooks:false,
      notesloaded:false ,
      notebooksValue:[],
      notebookValue:{},
      notebooksFetched:false,
      editor:false,
      item:null,
      editorItem:null,
      sidebarOpen:true,
      notebook_id:null,
      noteUnmounted:'initial',
      addingNotebook:'initial',
      openRenameModal:false,
      notebookRequester:null,
      noteRequester:null,
      isReactReady:false,
      notebooksFetchFailed:false,
      notebookFetchFailed:false,

    }

    

    this.openNotebookSubBar = this.openNotebookSubBar.bind(this)
    this.notebooksMounted = this.notebooksMounted.bind(this)
    this.notebookMounted = this.notebookMounted.bind(this)
    this.loadNotebookNotes = this.loadNotebookNotes.bind(this)
    this.changeNotebooksArrow = this.changeNotebooksArrow.bind(this)
    this.openNotebooksEditor = this.openNotebooksEditor.bind(this)
    this.ClickSidebarButton = this.ClickSidebarButton.bind(this)
    this.postNote = this.postNote.bind(this)
    this.changeNoteStatus = this.changeNoteStatus.bind(this)
    this.addNewNotebook  = this.addNewNotebook.bind(this)
    this.renameNotebook = this.renameNotebook.bind(this)
    this.handleRename = this.handleRename.bind(this)
    this.notebooksFetchFailedRetry = this.notebooksFetchFailedRetry.bind(this)
    this.notebookFetchFailedRetry = this.notebookFetchFailedRetry.bind(this)

  }


  componentDidMount() {

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this))
    this.setState({isReactReady:true})
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))

  }

  updateDimensions() {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    this.setState({ windowWidth:windowWidth, windowHeight:windowHeight })
    
  }

  // opens the notebooks second sidebar 
  openNotebookSubBar(){

    this.setState(state => {

      return {notebooks:!state.notebooks, open:!state.open}   
    }) 

    if(!this.state.notebooks){

      this.setState({notebooksFetchFailed:false})
    }
    
  }



  notebooksMounted(){


    console.log("called")
    if(!this.state.notebooksFetched ){

      fetch("http://localhost:3333/notebooks",{ retries: 5, retryDelay: 1000})
      .then(result => result.json())
      .then(json => {

        if(json.status){

          this.setState({notebooksValue:json.notebooks , notebooksFetched:true })

          json.notebooks.forEach(item => {
      
            /* each arrow from sub-bar */ this.setState({[item._id]:this.state[item._id] ? true:false})
            /* each notebook from sub-bar */ this.setState({[`${item._id}${item._id}`]: this.state[`${item._id}${item._id}`] ? true :false})
            item.notes.forEach(note => {
    
            /*each note from subar-bar + notes page */  this.setState({[note._id]: this.state[note._id] ? true : false})
            })
          })
        }
      })
      .catch(err => {

        this.setState({notebooksFetchFailed:true})
      })

    }
  }

  notebooksFetchFailedRetry(){

    console.log("clicked")
    this.setState({notebooksFetchFailed:false})
    this.notebooksMounted()
  }


  notebookMounted(id){

    this.setState({notebookFetched:false , notebookFetchFailed:false })
    fetch(`http://localhost:3333/notebooks/${id}/notes`,{ retries: 5, retryDelay: 1000})
    .then(result => result.json())
    .then(json => {

      if(json.status){

        this.setState({notebookValue:json , notebookFetched:true , notebookMountedStatus:true , notebookRequester:json._id , notebookFetchFailed:false })

      }
    })
    .catch(err => {

      this.setState({notebookFetchFailed:true})
    })

  }

  notebookFetchFailedRetry(id){

    this.setState({notebookFetchFailed:false})
    this.notebookMounted(id)


  }
  
  changeNotebooksArrow(e){


    const id = e.target.id
    this.setState(state => {

      return {[id]:!state[id]}
    })
    

  }

  loadNotebookNotes(e,notebook_id){

    const id = e.target.id  
    const unClicks = this.state.notebooksValue.filter(item => `${item._id}${item._id}` !== id)
    this.setState({editor:false })
    if(this.state.editor){
      this.state.notebooksValue.forEach(item => {

        item.notes.forEach(note => {

          this.setState({[note._id]:false})
        })
      })
    }
    unClicks.forEach(unClick => {

      this.setState({[`${unClick._id}${unClick._id}`]:false})
    })

    this.setState(state => {

      return {[id]:!state[id]}
    }, () => {
        
        const clickedNotebookIndex = this.state.notebooksValue.findIndex(item => {

          return item._id === notebook_id
        })
        this.setState(state => {

          return state.notebooksValue.unshift(this.state.notebooksValue.splice(clickedNotebookIndex,1)[0])
        })

        this.state[id] ? this.setState({notesloaded:true , notebook_id:notebook_id }) 
        
        : 
        this.setState({notesloaded:false , notebook_id:null})
      })
    
    
  }

  openNotebooksEditor(e,notebook_id, editorItem ){


    const currentNote = e.currentTarget

    this.setState({notesloaded:false})
    this.state.notebooksValue.forEach(item => {

      this.setState({[`${item._id}${item._id}`]:false})
      item.notes.forEach(note => {

        if(note._id !== currentNote.id){

          this.setState({[note._id]:false })
        }
      })
    })

    this.setState(state => {

      return {
        
        [notebook_id]:state[notebook_id] ? state[notebook_id] :!state[notebook_id] ,         
        [currentNote.id]:!state[currentNote.id],
        currentNotebook_id:state[currentNote.id] ? notebook_id : null , 
        currentNote_id:state[currentNote.id] ? currentNote.id : null 
      }
    },() => {
      // movoes notebook to top starts from next line 
      const clickedNotebookIndex = this.state.notebooksValue.findIndex(item => {

        return item._id === notebook_id
      })
      this.setState(state => {

        return state.notebooksValue.unshift(this.state.notebooksValue.splice(clickedNotebookIndex,1)[0])
      })

      // ends here


      this.state[currentNote.id] ? this.setState({editor:true , editorItem:editorItem}) : this.setState({editor:false , editorItem:null}) 
    })    
  }

  ClickSidebarButton(e){

    e.preventDefault()
    this.setState(state => {

      return {sidebarOpen:!state.sidebarOpen}
    })

  }

  postNote(notebook_id,note_id){

    if(localStorage.getItem(note_id) !== null){
      fetch(`http://localhost:3333/notebooks/${notebook_id}/notes/${note_id}`, {
        method: 'put',
        retries: 5, 
        retryDelay: 1000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          
          blocks:localStorage.getItem(note_id)          
          
        })
      }
      )
      .then(result => result.json())
      .then(json => {

        if(json.status){
       
          localStorage.removeItem(note_id)
          this.setState({noteUnmounted:'resolved',noteRequester:note_id })
        
        }

      })
      .catch(err => {

        this.setState({noteRequester:`${note_id}${note_id}`})
      })

    }

  }

  changeNoteStatus(state){

    this.setState({noteUnmounted:state})

  
  }


  handleRename(bool){

    this.setState({openRenameModal:bool})
  }

  addNewNotebook(e){

    this.setState({addingNotebook:"loading"})

    fetch('http://localhost:3333/notebooks', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          notebook_title:document.getElementById("addNotebookInput").value
      })
    })
    .then(result => result.json())
    .then(json => {

      this.setState({addingNotebook:"added"})
      this.setState(state => {

        return state.notebooksValue.push(json)

      },() => {

        document.getElementById(`${json._id}${json._id}`).click()
      })
    })
  }

  renameNotebook(notebook_id){

    fetch(`http://localhost:3333/notebooks/${notebook_id}`, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        notebook_title:document.getElementById("renameNotebook").value      
      })
    }) 
    .then(result => result.json())
    .then(json => {

      if(json.status){

        this.setState(state => {

          return state.notebooksValue.filter(item => {
  
            return item._id === json._id
          })[0]
          .notebook_title = json.notebook_title 
          
        })
  
        this.setState(state => {

          return state.notebookValue.notebook_title = json.notebook_title
        })
        

        this.handleRename(false)
      }


    })
    .catch(err => console.log(err))
  }

         
  render() {

    const { windowWidth } = this.state;
    const styles = {
    white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    topBarHeight: 50,
    footerMenuHeight: 50,
    showFooterMenuText: windowWidth > 0,
    showSidebar: true,
    sidebarWidth:this.state.sidebarOpen ? windowWidth < 1100 ? this.state.open ? 250 : 50 : this.state.open ? 300 : 50 : 0,
    sidebarCollapsed: windowWidth < 0,
    transition:".5s",      
    
  }


    const menuItems = styles.showSidebar
      ? [
          { name:"book" ,color:"black" , title:"Notebooks" , text:"Notebooks" },
          { name:"sitemap" , color:"black" ,  title:"Mindmaps" , text:"Mindmaps"},
          { name: "map outline" , color:"black" , title:"Flashcards" , text:"Flashcards" },
          { name:"checkmark box" , color:"black" , title:"Todo List" , text:"Todo Lists"},

        ]
      : [
          { name:"book" ,color:"black" , title:"Notebooks" , text:"Notebooks" },
          { name:"sitemap" , color:"black" ,  title:"Mindmaps" , text:"Mindmaps"},
          { name: "map outline" , color:"black" , title:"Flashcards" , text:"Flashcards" },
          { name:"checkmark box" , color:"black" , title:"Todo List" , text:"Todo Lists"},

        ];
    
    return (
      this.state.isReactReady ?

        <Router style={{height:"100%" , width:"100%" }}>

          <div
            style={{
              backgroundColor: "white",
              position: "relative",
              height:"100%",
              width:"100%",

            }}
          >
            {styles.showSidebar ? (
              <Fragment>              
                <Sidebar                 
                  menuItems={menuItems} 
                  styles={styles} 
                  state={this.state}  
                  openNotebookSubBar={this.openNotebookSubBar}  
                  notebooksMounted={this.notebooksMounted}
                  changeNotebooksArrow = {this.changeNotebooksArrow}
                  loadNotebookNotes={this.loadNotebookNotes}
                  openNotebooksEditor={this.openNotebooksEditor}
                  addNewNotebook={this.addNewNotebook}
                  notebooksFetchFailedRetry={this.notebooksFetchFailedRetry}
                />

                <Switch>

                  {this.state.editor ?
                  
                    <Route exact path={"/notebooks/:notebook_id/notes/:note_id/show"} render={props => 

                      <Editor
          
                        styles={styles}
                        item={this.state.editorItem}
                        postNote={this.postNote}
                        changeNoteStatus={this.changeNoteStatus}
                        {...props}
                        noteRequester={this.state.noteRequester}
                        noteStatus={this.noteStatus}

                      /> }
                    />

                    :
                      this.state.notesloaded ?
                        <Route exact path="/notebooks/:notebook_id/notes/" render={props => 
                          <Notes 
                            styles={styles} 
                            notebook_id={this.state.notebook_id}
                            openNotebooksEditor={this.openNotebooksEditor}
                            notebookMounted={this.notebookMounted}
                            notebookValue={this.state.notebookValue}
                            notebookFetched={this.state.notebookFetched}
                            unmountedNotebook_id={this.state.unmountedNotebook_id}
                            unmountedNote_id={this.state.unmountedNote_id}
                            noteUnmounted={this.state.noteUnmounted}
                            changeNoteStatus={this.changeNoteStatus}
                            renameNotebook={this.renameNotebook}
                            renameNotebookValue={this.state.renameNotebookValue}
                            handleRename={this.handleRename}
                            openRenameModal={this.state.openRenameModal}
                            notebookRequester={this.state.notebookRequester}
                            notebookFetchFailed={this.state.notebookFetchFailed}
                            notebookFetchFailedRetry={this.notebookFetchFailedRetry}
                            {...props}
                        />
                        }/>
                      :
                        <Route exact path={"/"} render={props => 

                          <Content  styles={styles} {...props}/>
                        }/>
                        
                  }
                </Switch>
                <TopBar styles={styles} sidebarOpen={this.state.sidebarOpen} ClickSidebarButton={this.ClickSidebarButton}/>        
              </Fragment>
            ) : (
              // <div style={{width:"100%", height:"100%"}}> 
                
              //   {
              //   this.state.editor ? 
                
              //   <Editor                 
              //     styles={styles}
              //     item={this.state.editorItem} 
              //     />
              //   : 
              //     this.state.notebooks ?
              //       <NotebooksMobile 
              //         styles={styles} 
              //         state={this.state}
              //         item={this.state.item}  
              //         notebooksMounted={this.notebooksMounted}
              //         changeNotebooksArrow = {this.changeNotebooksArrow}
              //         openNotebooksEditor={this.openNotebooksEditor}
              //       />
              //     :
              //       <Content styles={styles}/>
              //   }
              //   <TopBar styles={styles} sidebarOpen={this.state.sidebarOpen} ClickSidebarButton={this.ClickSidebarButton}/>

              // </div>
              null
            )}

              
            {/* {!styles.showSidebar && (
              <FooterMenu menuItems={menuItems} styles={styles} 
                          openNotebookSubBar={this.openNotebookSubBar} 
                          notebooks={this.state.notebooks} 
                          editor={this.state.editor}
              />
              
            )} */}
          </div>
        </Router>
      :
      <div style={{justifyContent:"center" , alignContent:"center"}}>
        <SpringSpinner color="orange" size={5}/>
      </div>
    )
    
  }
}

export default App;
