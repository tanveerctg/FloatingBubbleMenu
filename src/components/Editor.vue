<template>
  <div>
    <div id="editor" v-on:keyup="keyUpHandler"></div>
  	<div id="content"></div>
  </div>
</template>

<script>

import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"
import {Plugin} from "prosemirror-state"
import {toggleMark, setBlockType, wrapIn} from "prosemirror-commands"


	export default {
	  name: 'Editor',
	  props: ['msg'],
	  data:function(){
	      return{
	          view:null
	      }
	  },
	  methods:{
	  	keyUpHandler(){
	  		console.log(JSON.stringify(this.view.state.tr.doc))
	  	}
	  },
	  mounted(){
		const mySchema = new Schema({
		  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
		  marks: schema.spec.marks
		})



	class FloatingToolMenu {
	  constructor(view,items) {
	  	
	  	this.items = items
	  	this.view=view
	    this.floatingToolBar = document.createElement("div")
	    this.floatingToolBar.className = "toolbar"
	    this.position=1
	    this.totalElement=this.view.dom.children
	    this.lastEle=false
	    this.dom = document.createElement("div")
	    this.dom.className = "menubar"

	    const commandItemsToHtml=this.items.map(({dom}) => dom.outerHTML).join('')

		
		this.dom.innerHTML=commandItemsToHtml;
		this.floatingToolBar.innerHTML=commandItemsToHtml;

		this.wrapper = document.createElement("div")

		this.wrapper.innerHTML=this.dom.outerHTML+this.floatingToolBar.outerHTML
		this.dom=this.wrapper.children[0]
		this.floatingToolBar=this.wrapper.children[1]

		    

	    view.dom.parentNode.appendChild(this.wrapper)

	  
		this.dom.addEventListener("mousedown", e => {
			e.preventDefault()
		view.focus()
		items.forEach(({command, dom}) => {
			console.log(e.target)
			if (dom.textContent==e.target.textContent)
			command(view.state, view.dispatch, view)
		})
		})
	    this.floatingToolBar.addEventListener("mousedown", e => {
	      e.preventDefault()
	      view.focus()
	      items.forEach(({command, dom}) => {
	        if (dom.textContent==e.target.textContent)
	          command(view.state, view.dispatch, view)
		      this.removeFloatingMenu()
	      })
	    })
		
	    this.update(view, null)

	    document.querySelector('#editor').addEventListener('keyup',e=>{


	    	 if(e.keyCode==8){
	    	 	if(this.lastEle){
	    			this.lastEle=false
					this.removeFloatingMenu()	  
	    			this.position--;

	    			if(this.position<1){
						console.log('ashche')
	    				this.position=1;
	    				this.lastEle=true;
						this.activeFloatingMenu({top:0,left:0})
	    			}
	    			return;
			    }	

	    	 	if(!view.dom.children[this.position-1]){
	    	 		this.lastEle=false
					this.removeFloatingMenu() 
	    			this.position--;
	    			return;
	    	 	}

	    
    		 if(view.dom.children[this.position-1].textContent =='') {
				
    		 	    this.lastEle=true;

		    		const top=this.view.dom.querySelector(`*:nth-child(${this.position})`).getBoundingClientRect().top;
					const left=this.view.dom.querySelector(`*:nth-child(${this.position})`).getBoundingClientRect().left;

					this.activeFloatingMenu({top,left})
	    		}	    		
	    		
	    	}
	    	if(e.keyCode==13){
	    		this.position++		
	    	}
	    	 if(e.keyCode==40){
	    	 	const totalElement=this.view.dom.children;
	    	 	
	    		this.position++
	    	
	    		if(this.position>totalElement.length){
	    			this.position=totalElement.length;
	    			
	    		}
	    		
	    	}

	       if(e.keyCode==38){

	    		this.position--
	    		if(this.position<1){
	    			this.position=1;
	    		}
	    		
	    	}
	    	if(this.view.dom.querySelector(`*:nth-child(${this.position})`).textContent==''){

	    		const top=this.view.dom.querySelector(`*:nth-child(${this.position})`).getBoundingClientRect().top;
				const left=this.view.dom.querySelector(`*:nth-child(${this.position})`).getBoundingClientRect().left;
				this.activeFloatingMenu({top,left})

	    	}else{
	    		this.lastEle=false;
				this.removeFloatingMenu()  		
	    	}
	
		    const totalElement=Array.from(this.totalElement);

		    totalElement.forEach((el,index)=>{
		    	el.addEventListener('mousedown',e=>{
	    		   const {top,left}=e.target.getBoundingClientRect();
		    		
			    	if(e.target.textContent==''){
						this.activeFloatingMenu({top,left})
			    	}else{
						this.removeFloatingMenu()		
			    	}
		    	
					this.position=index+1;

		    	})
		    })

		   


	    })
	  }
	activeFloatingMenu({top=null,left=null}){		 
		this.floatingToolBar.classList.add('active')
		this.floatingToolBar.classList.remove('inactive')
		if(top && left){
			this.floatingToolBar.style.left = left-10 + "px"
			this.floatingToolBar.style.top = top-10 + "px" 	
		}
	}
	removeFloatingMenu(){
		this.floatingToolBar.classList.remove('active')
		this.floatingToolBar.classList.add('inactive')	  
	}
	  update(view,lastState){

	    this.items.forEach(({command, dom}) => {
	      let active = command(this.view.state, null, this.view)
	      dom.style.display = active ? "" : "none"
	    })
	    let state = view.state
	    // Don't do anything if the document/selection didn't change
	    if (lastState && lastState.doc.eq(state.doc) &&
	        lastState.selection.eq(state.selection)) return
	    // Hide the tooltip if the selection is empty
	    if (state.selection.empty) {
	      this.dom.style.display = "none"
	      return
	    }
	    // Otherwise, reposition it and update its content
	    this.dom.style.display = ""
	    let {from, to} = state.selection
	    // These are in screen coordinates
	    let start = view.coordsAtPos(from), end = view.coordsAtPos(to)
	    // The box in which the tooltip is positioned, to use as base
		
	    let box = this.dom.offsetParent.getBoundingClientRect()
	    // Find a center-ish x position from the selection endpoints (when
	    // crossing lines, end may be more to the left)
	    let left = Math.max((start.left + end.left) / 2, start.left + 3)
	    this.dom.style.left = (left - box.left) + "px"
	    this.dom.style.bottom = (box.bottom - start.top) + "px"
	  }

	  destroy() { 
	  	this.floatingToolBar.remove()
	    this.dom.remove()
	  }
	}




	// Helper function to create menu icons
	function icon(text, name) {
	  let span = document.createElement("span")
	  span.className = "menuicon " + name
	  span.title = name
	  span.textContent = text
	  return span
	}

	// Create an icon for a heading at the given level
	function heading(level) {
	  return {
	    command: setBlockType(mySchema.nodes.heading, {level}),
	    dom: icon("H" + level, "heading")
	  }
	}
	let allCommands=[
	  {command: toggleMark(mySchema.marks.strong), dom: icon("B", "strong")},
	  {command: toggleMark(mySchema.marks.em), dom: icon("i", "em")},
	  {command: setBlockType(mySchema.nodes.paragraph), dom: icon("p", "paragraph")},
	  heading(1), heading(2), heading(3),
	  {command: wrapIn(mySchema.nodes.blockquote), dom: icon(">", "blockquote")}
	]


	let floatingMenuPlugin = new Plugin({
	  view(editorView) { return new FloatingToolMenu(editorView,allCommands) },

	})

	let clickPlugin = new Plugin({
	  props: {
	  handleClickOn(view, pos, node, nodePos, event, direct){
	      console.log(view, pos, node, nodePos, event, direct)
	     const {top,left}=view.coordsAtPos(pos);
console.log(top,left)
	      console.log("A button was pressed!")     
	    }
	  }
	})


	let view  = new EditorView(document.querySelector("#editor"), {
	  state: EditorState.create({
	    doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
	    plugins: exampleSetup({schema: mySchema}).concat(floatingMenuPlugin).concat(clickPlugin)
	  })
	})

	this.view=view;

	let transaction=this.view.state.tr;
  	 	
  	transaction.insertText(JSON.parse(this.msg).greeting)
    let newState=this.view.state.apply(transaction)
  	this.view.updateState(newState)

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
