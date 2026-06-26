import "./App.css"
import {Editor} from "@monaco-editor/react"
import {MonacoBinding} from "y-monaco";
import { useRef,useMemo, useEffect } from "react";
import * as Y from "yjs";
import {SocketIOProvider} from "y-socket.io";
import { useState } from "react";

function App() {
  const [username,setUsername]=useState(()=>{
    return new URLSearchParams(window.location.search).get("username")||""
  });
  const [users,setUsers]=useState([]);
  const editorRef=useRef(null);
  const ydoc=useMemo(()=>new Y.Doc(),[])
  const yText=useMemo(()=>ydoc.getText("monaco"),[ydoc])

  const handleMount=(editor)=>{
    editorRef.current=editor
    const monacoBinding=new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
     
    )
    
  }
  useEffect(()=>{
    
    const provider=new SocketIOProvider("http://localhost:3000", "monaco",ydoc,{autoConnect:true});
    provider.awareness.setLocalStateField("user",{username})
    provider.awareness.on("change",()=>{
      const states=Array.from(provider.awareness.getStates().values())
      const users=(states.filter(state=>state.user)).map(state=>state.user)
      setUsers(users)
    })
    function handleBeforeUnload(){
      provider.awareness.setLocalStateField("user",null);
      
    }
    window.addEventListener("beforeunload",handleBeforeUnload)
    
    return()=>{
      
    provider.disconnect();
    window.removeEventListener("beforeunload",handleBeforeUnload)
    }
  },[username])
  const handleSubmit=(e)=>{
    console.log(e)
    e.preventDefault();
    const formdata=new FormData(e.target)
    setUsername(formdata.get("username"))
    window.history.pushState({},"","?username="+formdata.get("username"))

  }
  if(!username){
    return(
      <main className="h-screen w-full bg-black p-4 flex gap-2 p-4 items-center justify-center">
        <form className="p-4 rounded-md shadow-2xl bg-white flex flex-col gap-2" onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter Username" name="username" required className="rounded-md p-2 border"></input>
          <button type="submit" className="bg-emerald-300 rounded-md p-2 text-white font-medium cursor-pointer">Submit</button>

        </form>
      </main>
    )
  }
  return (
    <>
      <main className="min-h-screen w-full bg-neutral-950 p-4 flex flex-col md:flex-row gap-4">
  {/* Sidebar */}
  <aside className="w-full h-fit md:w-72 md:h-full bg-neutral-900 rounded-xl shadow-xl flex flex-col overflow-hidden">
    {/* Header */}
    <div className="p-5 border-b border-neutral-800">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        👥 Online Users
      </h2>
      <p className="text-sm text-neutral-400 mt-2">
        {users.length} {users.length === 1 ? "user" : "users"} online
      </p>
    </div>

    {/* Users List */}
    <ul className="flex-1 overflow-y-auto p-4 space-y-3">
      {users.length > 0 ? (
        users.map((user, index) => (
          <li
            key={index}
            className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg px-4 py-3 transition-all duration-200 cursor-pointer"
          >
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50"></div>
            </div>

            <div className="flex flex-col">
              <span className="text-white font-medium">
                {user.username}
              </span>
              <span className="text-xs text-neutral-400">
                Online
              </span>
            </div>
          </li>
        ))
      ) : (
        <div className="text-center text-neutral-500 mt-10">
          No users online
        </div>
      )}
    </ul>
  </aside>

  {/* Editor */}
  <section className="flex-1 h-[70vh] md:h-auto rounded-xl overflow-hidden shadow-xl border border-neutral-800">
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// Write your Code Here ..."
      theme="vs-dark"
      onMount={handleMount}
    />
  </section>
</main>
    </>
  )
}

export default App
