'use client'
import React, { useContext, useState, useEffect } from "react";
import RequestCardForMachine from "./RequestCardForMachine"
import { RequestContext } from "@/context/Request";
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
import useAdmin from "@/hooks/useAdmin";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { FormControl, TableHead, TableRow } from "@mui/material";
import CommentDialog from "./CommentDialog";
import { request } from "http";
import { useRouter } from "next/navigation";
import FinishedDialog from "./FinishedDialog";
export type MachineListProps = {
    index: number;
}

export type indRequestForMachine = {
    id: number
    groupname: number
    machine: number
    filename: string
    finalMaterial: string
    status: string
    comment: string
}

export default function LaserCutMachineList({ index }: MachineListProps) {
    const { requests } = useContext(RequestContext);
    const Button = require('@mui/material/Button').default
    const router = useRouter();
    const { getLaserCutRequest, putLaserCutRequestMachine,
        putLaserCutRequestMaterial, putLaserCutRequestStatus } = useLaserCutRequest(); 
    
    const [ requestList, setRequestList ] = useState<indRequestForMachine[]>();
    
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [ dialogOpen, setDialogOpen] = useState(false);
    const [dialogString, setDialogString] = useState("");
    const [name, setName] = useState(0);
    const [groupID, setGroupID] = useState(0);

    useEffect(() => {
        const gReq = async () => {
            try{
                const requestListInit = await getLaserCutRequest();
                const requestListJson:indRequestForMachine[] = requestListInit["dbresultReq"];
                setRequestList(requestListJson);
            }
            catch(e){
                console.log(e);
            }
        }
        gReq();
    },[]);

    const handleStatusChange =  async(id: number, newStatus: string) => {
        try{
            await putLaserCutRequestStatus({
                id,
                newStatus
            })
            console.log("successful test3")
        }catch(e){
            console.error(e);
        }
        router.refresh();
    }
    // const testRequest = {
    //     filename: "test1",
    //     type: "3DP",
    //     comment: "test1test1test1test1test1test1test1test1test1test1test1test1test1test1test1test1test1test1test1test1",
    //     status: "waiting",
    // };

    return (
        // <>
        // <div className="m-1 w-1/2 h-full flex flex-col">
        //     <h3 className="text-2xl font-bold">機器{index}</h3>
        //     <div id={`machine${index}`} className="min-h-60 flex flex-col items-center justify-start bg-white rounded border-2 border-black overflow-y-auto">
        //         <div className="w-full sticky top-0 bg-white z-10">
        //             <div className="g-3 w-full flex flex-row items-center justify-between border-b-2 border-black">
        //                 <p className="text-sm">檔案名稱</p>
        //                 <p className="text-sm">列印備註</p>
        //                 <p className="text-sm">完成列印</p>
        //             </div>
        //         </div>
        //         <RequestCardForMachine information={testRequest}/>
        //         {requests.map((request) => {
        //             if (request.number === index)   {
        //                 return (
        //                     <RequestCardForMachine information={request}/>
        //                 )
        //             } else {
        //                 return null;
        //             }
        //         })}
        //         {
        //             requestList.map((request)=>(
        //                 <RequestCardForMachine information={{
        //                     filename:request.filename,
        //                     type:request.type,
        //                     comment:"temp",//request.comment,
        //                     status:request.status
        //                 }}></RequestCardForMachine>
        //                 )
        //             )
        //         }
        //     </div>
        // </div>
        // </>
        
        <>
        <div className="flex-col w-full content-start">
            <TableContainer component={Paper} sx={{width: '95%',maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        <TableRow key="head" className="bg-yellow-300">
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>預約組別</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>檔案名稱</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>最終板材</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>狀態</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>備註</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <CommentDialog open={commentDialogOpen} comment={dialogString} onClose={() => setCommentDialogOpen(false)}/>
            <FinishedDialog open={dialogOpen} groupName={name} id={groupID} onClose={()=>setDialogOpen(false)} type="laser"/>
            <TableContainer component={Paper} sx={{width: '95%',maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        {
                            requestList?.map( (request)=>(
                                // <RequestCard information={{
                                //     group:String(request.groupname),
                                //     filename:request.filename,
                                //     material:request.material,
                                //     status:request.status,
                                //     comment:request.comment

                                // }}></RequestCard>
                            ( request.machine === index && request.status === "切")?
                            <TableRow key={request.id}>
                                <TableCell sx={{textAlign: 'center'}}>{String(request.groupname)}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.filename}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.finalMaterial}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    {request.status}
                                    <Button onClick={()=>{
                                            setDialogOpen(true);
                                            setGroupID(request.id);
                                            setName(request.groupname);
                                        }}>完成</Button>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <Button onClick={()=>{
                                            setCommentDialogOpen(true);
                                            setDialogString(request.comment)
                                        }}>{request.comment}</Button>    
                                </TableCell>
                            </TableRow>
                            :
                            ""
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <CommentDialog open={commentDialogOpen} comment={dialogString} onClose={() => setCommentDialogOpen(false)}/>
            <FinishedDialog open={dialogOpen} groupName={name} id={groupID} onClose={()=>setDialogOpen(false)} type="laser"/>
        </div>
        </>
    )
}