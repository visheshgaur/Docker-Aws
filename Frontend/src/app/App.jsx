import "./App.css"
import {Editor} from "@monaco-editor/react"
function App() {
  
  return (
    <>
      <main className="h-screen w-full bg-black p-4 flex gap-2 ">
        <aside className="h-full w-1/4 bg-amber-50 rounded-lg "></aside>
        <section className="h-full w-3/4 bg-neutral-400 rounded-lg overflow-hidden">
        <Editor height="100%" defaultLanguage="javascript" defaultValue="// Write your Code Here ..." theme="vs-dark"></Editor></section>
      </main>
    </>
  )
}

export default App
