import React , {Component , Fragment} from "react"
import {Icon , Card , Grid , Divider } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import "../substyles.css"
import {Link} from "react-router-dom"



class NotebooksMobile extends Component {

    constructor(props){

        super(props)

        this.state = {


        }

        this.changeArrow = this.changeArrow.bind(this)
        this.openEditor = this.openEditor.bind(this)
    }

    changeArrow(e){

        this.setState({notebook_id:e.target.id})
        this.props.changeNotebooksArrow(e)
    }

    componentDidMount(){

        this.props.notebooksMounted()
    }

    openEditor(e , item){

        this.props.openNotebooksEditor(e , item._id, item)
    }

    render(){

        const {styles , state} = this.props
        const {showSidebar} = styles
        
        const contentStyle = {
            paddingTop: showSidebar ? 50 : styles.topBarHeight + 20,
            paddingBottom: showSidebar ? 20 : styles.footerMenuHeight + 20,
            paddingLeft: showSidebar ? styles.sidebarWidth + 40 : 40,
            background:"white",
            display:"flex",
            flexDirection:"column",
            height:"100%",
            width:"100%",
            position:"fixed"

                        
        }

        return(

            <div style={contentStyle}>
                {state.get.map(item => {
                    
                    return (
                    <div style={{marginBottom:20 , display:"flex" , flexDirection:"column" }} key={item._id} id="notebooksMobile">
                        <Link style={{color:this.props.state[item._id] ? "orange" : "grey"}} to="/notebooks">

                            <span style={{paddingRight:"7px" }}  onClick={this.changeArrow}>
                                <Icon 
                                    className="arrow" 
                                    id={item._id} state="false" 
                                    name={this.props.state[item._id] ? "arrow down" :"arrow right"} 
                                    link style={{color:this.props.state[item._id] ? "orange" : "grey" }} 
                                />
                            </span>
                            <span style={{color:this.props.state[item._id] ? "orange" : "grey" , fontSize:"18px" }}>{item.notebook_title}</span>
                            <Divider/>

                        </Link>
                        <div style={{color:"grey" , display:this.props.state[item._id] ? "flex" :"none" , flexDirection:"column" , paddingLeft:"15px" , justifyItems:"center"}} className={"scale-in-ver-top"}>
                            {item.notes.map(note => {

                            return (

                                <Fragment key={note._id} >
                                <Link to="/notebooks" style={{paddingBottom:"3px" , color:this.props.state[note._id] ? "orange" : "grey"}} className="truncate" title={note.note_title}  id={note._id} onClick={(e) => this.openEditor(e,{_id:item._id , notebook_title:item.notebook_title , note:{_id:note._id , note_title:note.note_title}})}>
                                    {note.note_title}
                                </Link>
                                <Divider/>
                                </Fragment>
                            )
                            })}

                        </div>
                        <span style={{color:"grey"}}>{item.notes.length} notes</span>

                    </div>
                    )
                })}
            </div>
        )
    }
}

export default NotebooksMobile