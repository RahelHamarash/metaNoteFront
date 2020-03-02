import React, { Component ,Fragment } from "react";
import tinymce from "tinymce/tinymce";
import { CircleSpinner } from "react-spinners-kit"
import "tinymce/themes/silver";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/table"
import "tinymce/plugins/preview"
import "tinymce/plugins/print"
import "tinymce/plugins/importcss"
import "tinymce/plugins/searchreplace"
import "tinymce/plugins/autolink"
import "tinymce/plugins/save"
import "tinymce/plugins/noneditable"
import "tinymce/plugins/codesample"
import "tinymce/plugins/lists"
import "tinymce/plugins/advlist"
import "tinymce/plugins/hr"
import "tinymce/plugins/paste"
import "tinymce/plugins/quickbars"
import "tinymce/plugins/link"
import "tinymce/plugins/image"
import "tinymce/plugins/media"
import "tinymce/plugins/directionality"
import "tinymce/plugins/paste"
import 'semantic-ui-css/semantic.min.css'
import {HalfCircleSpinner,SpringSpinner} from 'react-epic-spinners'
const originalFetch = require('isomorphic-fetch')
const fetch = require('fetch-retry')(originalFetch)

class TinyMce extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      
      editor: null,
      noteRequester:"loading"
    
    }

    this.callbacksave = this.callbacksave.bind(this)
    this.tinymceInit = this.tinymceInit.bind(this)
    this.saveBtnTimeout = this.saveBtnTimeout.bind(this)
    this.saveBtnTimer = this.saveBtnTimer.bind(this)
    this.postRequestTimout = this.postRequestTimout.bind(this)
    this.postRequestTimer = this.postRequestTimer.bind(this)



  }

  callbacksave(content){

    localStorage.setItem(this.props.item.note._id,`<div>${content}</div>`)

  }


  componentDidMount() {

    fetch(`http://localhost:3333/notebooks/${this.props.item._id}/notes/${this.props.item.note._id}/show`,{ retries: 5, retryDelay: 1000})
    .then(result => result.json())
    .then(json => {

      if(json.status){

        this.setState({noteRequester:"resolved"})
        this.tinymceInit(json)

      }
    })
    .catch(err => {

      this.setState({noteRequester:"error"})
    })

    

  }

  touchHandler(e){

    e.preventDefault()
  }

  componentWillUnmount() {


    if(this.state.noteRequester === "resolved"){

      this.state.editor.dom.doc.getElementById("tinymce").removeEventListener('keyup',this.saveBtnTimer)
      this.state.editor.dom.doc.getElementById("tinymce").removeEventListener('keyup',this.postRequestTimer)
      tinymce.remove(this.state.editor)
      this.props.changeNoteStatus('loading')
      this.props.postNote(this.props.item._id,this.props.item.note._id)
    }

  }

  componentDidUpdate(prevProps){


    if(this.props.item.note._id !== prevProps.item.note._id){

      this.props.postNote(prevProps.item._id,prevProps.item.note._id)
      if(this.state.editor !== null){

        this.state.editor.setContent('')
        tinymce.remove(this.state.editor)
      }

      this.setState({noteRequester:"loading"})
      fetch(`http://localhost:3333/notebooks/${this.props.item._id}/notes/${this.props.item.note._id}/show`,{ retries: 5, retryDelay: 1000})
      .then(result => result.json())
      .then(json => {
  
        if(json.status){
  
          this.setState({noteRequester:"resolved"})
          this.tinymceInit(json)
  
        }
      })
      .catch(err => {

        this.setState({noteRequester:"error"})
      })

    }

    // if(localStorage.getItem(this.props.item.note._id) !== null){

    //   console.log("localstorage")
    //   this.state.editor.setContent(localStorage.getItem(this.props.item.note._id))

    // }else{
      
    //   console.log("fetch")
    //   fetch(`http://localhost:3333/notebooks/${this.props.item._id}/notes/${this.props.item.note._id}/show`)
    //   .then(result => result.json())
    //   .then(json => {

    //     localStorage.setItem(this.props.item.note._id,json.note.blocks)
    //     this.state.editor.setContent(localStorage.getItem(this.props.item.note._id))
        
        
        
    //   })
    // }
  }

  tinymceInit(json){

    tinymce.init({
      selector: "#tiny",
      menubar:false,
      skin_url: `${process.env.PUBLIC_URL}/skins/ui/oxide`,
      skin:"oxide",
      toolbar_drawer: 'floating',
      elementpath:false,
      contextmenu:false,
      entity_encoding : "raw", // stores charecters in none-entity form
      plugins: ` preview print hr  paste importcss searchreplace autolink save 
                directionality image link media  table 
                advlist lists wordcount  quickbars link `,
      toolbar: ` wordcount undo redo | bold italic underline strikethrough subscript superscript  | removeformat | formatselect fontsizeselect fontselect codesample |  
                forecolor backcolor | image link media | alignleft aligncenter alignright alignjustify hr | outdent indent rtl |  numlist bullist | table 
                | save  preview  print | searchreplace ` ,
      

                //mobile mode
      mobile:{

        plugins: `preview print hr  paste importcss searchreplace autolink save 
                directionality image link media  table 
                advlist lists wordcount  quickbars link `,
        toolbar:`wordcount undo redo | subscript superscript removeformat | formatselect fontselect fontsizeselect codesample | 
                alignleft aligncenter alignright alignjustify hr  | outdent indent rtl | save preview print | searchplace `,
        quickbars_selection_toolbar: 'bold italic underline strikethrough | removeformat | forecolor backcolor | link ', // quick utilities to show when text is selected
        quickbars_insert_toolbar: `image quicktable media numlist bullist`, // quick unitilites to show in textarea available in mobile only
        

      },
      fontsize_formats:'8=8px 10=10px 12=12px 14=14px 16=16px 18=18px 24=24px 36=36px' ,
      block_formats: 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;Quote=blockquote;', //formats to show in toolbar
      quickbars_selection_toolbar: 'bold italic underline strikethrough subscript superscript | removeformat | forecolor backcolor | link', // quick utilities to show when text is selected
      quickbars_insert_toolbar: false, // quick unitilites to show in textarea available in mobile only
      image_title:true, // toolbar image title
      image_dimensions: false, 
      media_alt_source: false, // disables alternative source in media section
      media_embeded:false, //
      media_live_embeds: true, // enable user to watch video within the editor
      media_poster: false, // disables advanced field in media
      // file_picker_tyoe and file_picker_callback are used to enable user to upload images
      file_picker_types: 'image',
      resize:false,
      save_enablewhendirty: true, // disbales save button until modification is done
      save_onsavecallback: (editor) => this.callbacksave(editor.getContent()) , // callback function called when save button is hit
      /* and here's our custom image picker*/
      // file_picker_callback: function (cb, value, meta) {
      //   let input = document.createElement('input');
      //   input.setAttribute('type', 'file');
      //   input.setAttribute('accept', 'image/*');
    
      //   /*
      //     Note: In modern browsers input[type="file"] is functional without
      //     even adding it to the DOM, but that might not be the case in some older
      //     or quirky browsers like IE, so you might want to add it to the DOM
      //     just in case, and visually hide it. And do not forget do remove it
      //     once you do not need it anymore.
      //   */
    
      //   input.onchange = function () {
      //     let file = this.files[0];
    
      //     let reader = new FileReader();
      //     reader.onload = function () {
      //       /*
      //         Note: Now we need to register the blob in TinyMCEs image blob
      //         registry. In the next release this part hopefully won't be
      //         necessary, as we are looking to handle it internally.
      //       */
      //       let id = 'blobid' + (new Date()).getTime();
      //       let blobCache =  tinymce.activeEditor.editorUpload.blobCache;
      //       let base64 = reader.result.split(',')[1];
      //       let blobInfo = blobCache.create(id, file, base64);
      //       blobCache.add(blobInfo);
    
      //       /* call the callback and populate the Title field with the file name */
      //       cb(blobInfo.blobUri(), { title: file.name });
      //     }
      //     reader.readAsDataURL(file);
      //   }
    
      //   input.click();
      // },
      setup: editor => {

        this.setState({editor:editor})
        editor.on("init", () => {

         if(localStorage.getItem(this.props.item.note._id) !== null){

          editor.setContent(localStorage.getItem(this.props.item.note._id))  
          this.props.postNote(this.props.item._id,this.props.item.note._id)
            
        }else{

          
          localStorage.setItem(json.note._id,json.note.blocks)
          editor.setContent(localStorage.getItem(json.note._id))
        }

        this.saveBtnTimeout()
        this.postRequestTimout()

        })

        editor.setProgressState(true)



      },
      height:"100%",
      width:"100%",
      branding:false,

      
    }).then(

      () => {


      }
    )  
  }

  saveBtnTimeout(){

    this.btnTimer = null
    const textarea = this.state.editor.dom.doc.getElementById("tinymce")
    textarea.addEventListener('keyup',this.saveBtnTimer)
  }

  saveBtnTimer(){

    clearTimeout(this.btnTimer)
    this.btnTimer = setTimeout(() => this.state.editor.execCommand('mceSave'),1000)
  }

  postRequestTimout(){

    this.postTimer = null
    const textarea = this.state.editor.dom.doc.getElementById("tinymce")
    textarea.addEventListener('keyup',this.postRequestTimer)

  }

  postRequestTimer(){

    clearTimeout(this.postTimer)
    this.postTimer = setTimeout(() => this.props.postNote(this.props.item._id,this.props.item.note._id),5000)
  }

 


  render() {

    if(this.state.noteRequester === "resolved" ){

      return (
    
       

        <textarea
        id="tiny"
        style={{visibility:"hidden"}}
        />
    
        
      )
    }else{

      if(this.state.noteRequester === "error"){
        return(
          <div style={{display:"flex",justifyContent:"center",alignItems:"center" , height:"100%" , flexDirection:"column" }}>
            <p style={{color:"#D8000C"}}>connection failed</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="50"  height="50" viewBox="0 0 24 24" fill="#A50203">
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.001 14c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"/>
            </svg>
          </div>
        )
      }else{

        return(

          <div style={{display:"flex",justifyContent:"center",alignItems:"center" , height:"100%"}}><SpringSpinner color="#5ED3B4"/></div>

        )

      }
    }
  
  }
}

export default TinyMce;
