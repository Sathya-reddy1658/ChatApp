import React from 'react'

function ChatBox({chat, num1,num2}) {
    function date(string){
        let string2 = new Date(string).toLocaleString("en-IN", {timeZone: "Asia/Kolkata"});
        return string2.substring(string2.indexOf(' '));
     }
  return (
    <div>
       <div className='flex flex-col border-[3px] border-black h-[55vh] w-[40vw] rounded-md bg-indigo-100'>
        {
          chat.map((item, index) => {
            return <h1 key={index} className={`${item.sender==num1 ? 'bg-green-500 self-end' :'bg-blue-300 self-start'} p-2 rounded-md m-2 text-xl w-[20vw] `}>{item.message}<span className='text-sm'>{date(item.created_at)}</span></h1>
          })
        }
      </div>
    </div>
  )
}

export default ChatBox
