/* import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg'; */
import {useForm} from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot";
import {object,string,date} from "valibot"
import "./style.css"
import { useStopwatch } from 'react-timer-hook';
import { storage } from "wxt/storage";

const schema = object({
  title: string("Title is Required"),
})


function App() {
  const {
    /* totalSeconds, */
    seconds,
    minutes,
    hours,
    /* days,
    isRunning, */
    start,
    pause,
    /* reset, */
  } = useStopwatch();

  const [form,{title}] = useForm({
    id: "notion-submit",
    defaultValue: {
      title: "Tested"
    },
    onValidate({formData}) {
      return parseWithValibot(formData,{
        schema
      })
    },
    async onSubmit(event, context) {
      event.preventDefault();
      const formData = await context.formData
      const submission = await parseWithValibot(formData, {
        schema,
      });

      // Send the submission back to the client if the status is not successful
      if (submission.status !== 'success') {
        return submission.reply();
      }
      
    }})

    async function TimeStrage(){
      start()
      const SaveTime = await storage.getItem<string>("local:timer")
      if(SaveTime === null){
        const time = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`
        await storage.setItem("local:timer",time)
        document.getElementById("now")!.textContent = time
      }
      document.getElementById("now")!.textContent = SaveTime
    } 

  return (
    <>
    <main className="p-5">
      <h1 className="text-2xl border-black rounded-full bg-slate-200 text-center text-bold p-3">活動記録</h1>
      <div className="text-lg text-center" id="now">Please Timer Start</div>
      <div className="flex flex-auto"> 
          {[TimeStrage,pause].map((val,idx) => <button 
            className="border-black rounded-xl hover:bg-slate-300 bg-slate-200 py-2 px-3 mx-2"
            onClick={val}
          >
            {idx === 0 ? "start" : "stop"}
          </button>)}
        </div>
      <form 
        className="flex flex-col" 
        id={form.id} 
        onSubmit={form.onSubmit}
      >
        <div className="flex flex-col">
          <label>Title</label>
          <input 
            className="border-black border rounded-md px-1" 
            type="text" 
            name="title"
          />
          <div>{title.errors}</div>
        </div>
        <button 
          className="hover:bg-blue-300 border-black justify-center items-center border bg-blue-100 rounded-2xl py-[2.5px] px-3 mt-3 text-center" 
          form={form.id}>
            Submit
          </button>
      </form>
    </main>
    </>
  );
}

export default App;
