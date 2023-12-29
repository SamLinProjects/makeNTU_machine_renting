"use client"
import React, { useState, useRef, useContext } from "react";
import InputArea from "@/components/ui/InputArea";
import { useRouter, usePathname } from "next/navigation";
import { AccountContext } from "@/context/Account";

export default function reserve() {
    const { user } = useContext(AccountContext);
    const fileRef = useRef<HTMLInputElement>(null);
    const noteRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [falseTitle, setFalseTitle] = useState(false);
    const [tooLong, setTooLong] = useState(false);
    const [NoteTooLong, setNoteTooLong] = useState(false);
    const [unselected, setUnselected] = useState(false);
    if(user?.permission!=='admin' && user?.permission!=='contestant'){
        if(!tooLong) {
            alert("Please login first!");
            setTooLong(true);
        }
        router.push('/');
    }

    const handleSubmit = async () => {
        if(type === "") {
            setUnselected(true);
            return;
        } else {
            setUnselected(false);
        } if(!title) {
            setFalseTitle(true);
            return;
        } else {
            setFalseTitle(false);
        } if(title.length > 15) {
            setTooLong(true);
            return;
        } else {
            setTooLong(false);
        } if(note.length > 60) {
            setNoteTooLong(true);
            return;
        }
        const pathTemp = pathname.split("/");
        const teamName = pathTemp[2];
        const request = {teamName, type, title, note};
        console.log(request);
        
        try {
            const response = await fetch('api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            if (!response.ok) {
                alert("Sorry, something rong happened. Please try again later.");
                console.log(response);
                return;
            }
        } catch (error) {
            alert("Sorry, something rong happened. Please try again later.");
            console.log(error);
            return;
        }
        router.push(`/contestant/${teamName}`);
    }

    return (
        <div className="m-2 p-3 text-lg flex flex-col items-center justify-center justify-between border-2 border-black">
            <div className="m-3 mb-0.5 w-2/6 flex items-center gap-2 border-2 border-black">
                <p className="font-bold w-1/4 text-right">隊伍編號：</p>
                <InputArea
                    editable={false}
                    value={"test"}
                    />
            </div>
            <div className="flex items-end w-2/6 h-5 border-2 border-black" />
            <div className="m-3 mb-0.5 w-2/6 flex items-center gap-2 border-2 border-black">
                <p className="font-bold flex-end w-1/4 text-right">機台類型：</p>
                <select 
                    className="p-1 h-8 border-black border-2 text-gray-800 rounded-lg bg-white focus:outline-none"
                    value={type}
                    onChange={(e)=>setType(e.target.value)}
                    defaultValue="">
                    <option value="">--Select--</option>
                    <option value="3DP">3D列印機</option>
                    <option value="LCM">雷射切割機</option>
                </select>
            </div>
            <div className="flex items-end w-2/6 h-5 border-2 border-black">
                {unselected && <p className="ml-20 w-3/4  pl-5 text-sm text-red-500 ">請選擇借用機台類型</p>}
            </div>
            <div className="m-3 mb-0.5 w-2/6 flex items-center gap-2 border-2 border-black">
                <p className="font-bold w-1/4 text-right">檔案名稱：</p>
                <InputArea
                    ref={fileRef}
                    placeHolder={"file name"}
                    editable={true}
                    value={title}
                    onChange={(e) => setTitle(e)}
                />
            </div>
            <div className="flex items-end w-2/6 h-5 border-2 border-black">
                {falseTitle && <p className="ml-20 w-3/4 pl-5 text-sm text-red-500">請輸入檔案名稱</p>}
                {tooLong && <p className="ml-20 w-3/4 pl-5 text-sm text-red-500">檔案名稱不可超過15字</p>}
            </div>
            <div className="m-3 mb-0.5 w-2/6 flex gap-2 border-2 border-black">
                <p className="font-bold w-1/4 text-right">備註：</p>
                <textarea
                    ref={noteRef}
                    className="resize-none p-1 border-2 text-gray-800 border-black rounded-lg focus:border-gray-600 focus:outline-none"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>
            <div className="flex items-end w-2/6 h-5 border-2 border-black">
                {NoteTooLong && <p className="ml-20 w-5/6 pl-5 text-sm text-red-500">備註不可超過60字</p>}
            </div>
            <div className="m-2 flex gap-2 border-2 border-black">
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={() => router.back()}
                >取消</button>
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={handleSubmit}>登記</button>
            </div>
        </div>
    )
}