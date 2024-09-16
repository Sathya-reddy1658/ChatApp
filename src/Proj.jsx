import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ChatBox from './ChatBox.jsx'

const Url = 'https://ixmifuosorfrtpwdflxv.supabase.co/';
const Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bWlmdW9zb3JmcnRwd2RmbHh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjQwODUwNCwiZXhwIjoyMDQxOTg0NTA0fQ.iQbdblial1aVLGI_TDBCcmAN6NP36x-gsUClilyOq48';
const supabase = createClient(Url,Key);

const Proj = () => {
  const [chat, setChat] = useState([]);
  const [My, setMy] = useState("");
  const [frnd , setFrnd] = useState("");
  const [status , setStatus]=useState("Enter Mobile Numbers  ");
  const [msg , setMsg] =useState();
  const [usrNm , setUsrNm] = useState("");
  useEffect(() => {
    let id = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('AllChatData')
          .select('*')
          .or(`sender.eq.${My},sender.eq.${frnd}`)
          .or(`receiver.eq.${My},receiver.eq.${frnd}`);
  
        if (error) throw error;
  
        if (JSON.stringify(data) !== JSON.stringify(chat)) {
          setChat(data);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);
  
    return () => clearInterval(id);
  }, [My, frnd, chat]);
  
  function setMyNum(val){
     setMy(val);
  }
  function setFrndNum(val){
    setFrnd(val);
  }
  function checkRegd(){
    console.log(My +" bhai  "+frnd)
    let Ufound=false,Ffound=false;
    const fetchData = async () => {
      const { data, error } = await supabase.from('RegdUsers').select('Number,UserName');
      if (error) {
       console.log(error);
      } else {
        data.forEach((e)=>{
          if(e.Number==My){
            Ufound=true;
          }
          if(e.Number==frnd){
            setUsrNm(e.UserName);
            Ffound=true;
          }
        })
      }
      if(Ufound){
        if(Ffound){
          setStatus('Start chat by  sending your first message to ' +usrNm+' ('+ frnd +')');
        }
        else{
          setStatus(`Sorry ,${frnd} is not regestired`);
        }
      }
      else{
        const Regd = async () => {
          const { data, error } = await supabase.from('RegdUsers').insert([{UserName:'Unonymous',Number:My}]);
        }
        Regd();
        if(data){
          setStatus(`Looks like you haven't registered on the platform,chill,  we did it for you : )`);
        }
      }
    };
    fetchData();
  }
  function sendMsg(){
    const sender = async () => {
      const { data, error } = await supabase.from('AllChatData').insert([{sender:My,receiver:frnd,message:msg}]);
    }
    sender();
    setMsg("");
  }
  
  return (
    <div className='flex flex-col items-center justify-between gap-[6vh] p-10'>
       <h2 className='text-4xl text-gray-950'>{status}</h2>
      <div className='bg-yellow-300  flex gap-4 p-5 rounded-md justify-between text-2xl'>
        <input type="text" onChange={(e) => setMyNum(e.target.value)} placeholder='enter your mobile number ' className='p-2 rounded-md' />
        <input type="text" onChange={(e) => setFrndNum(e.target.value)} placeholder='enter friends mobile number ' className='p-2 rounded-md'/>
        <button onClick={checkRegd} className='bg-blue-300 border border-black rounded-md p-3'>Start Chat</button>
        </div>
        <ChatBox chat={chat} num1={My} num2={frnd}/>
        <div className='flex gap-2'>
        <input type="text" placeholder='Enter your message ' onChange={(e) => setMsg(e.target.value)} value ={msg} className='p-2 rounded-md bg-amber-200 text-2xl' />
        <button onClick={sendMsg} className=' p-2 rounded-md bg-fuchsia-300 text-2xl' >Send</button>
        </div>
    </div>
  );
};

export default Proj;
