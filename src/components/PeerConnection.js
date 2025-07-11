import Peer from 'peerjs';
import { useState, useEffect, useRef } from 'react';
import QRCode from "react-qr-code";
import "../styles/PeerConnection.css";
import { useLocation } from "react-router-dom";

const PeerConnection = () => {

    const location = useLocation();

    const [connection, setConnection] = useState(null);
    const [id, setId] = useState(null);
    const [remoteId, setRemoteId] = useState(null);
    const [otherId, setOtherId] = useState("");

    const selfRef = useRef(null)

    useEffect(() => {
        const peer = new Peer(); // No ID provided, PeerJS will generate one

        peer.on('open', (id) => {
            setId(id);
            selfRef.current = peer;
        });

        peer.on('connection', (conn) => {
            // conn.on('data', (data) => {
            //     if (data.type === 'file') {
            //     const blob = new Blob([data.file]);
            //     const url = URL.createObjectURL(blob);
            //     console.log("Received file URL:", url);
            //     // You can trigger a download or display the file
            //     }
            // });
            // setConnection(conn);
            console.log(`Got connection from`);
            setConnection(conn);
            });
    }, [])

    useEffect(() => {
        if(id === null || selfRef === null)
            return;

        console.log(`Connection set with peer server: ${id}`)

        const queryParams = new URLSearchParams(location.search)

        const peer = queryParams.get("peer")

        if(peer === null)
            return;

        const peerConnection = selfRef.current.connect(peer);
        peerConnection.on('open', () => {
            setConnection(peerConnection);
        });

    }, [id])

    useEffect(() => {
        if(connection === null || connection === undefined)
            return;

        setRemoteId(connection.peer)
    }, [connection])

    function setConnect(){
        const peerConnection = selfRef.current.connect(otherId);

        peerConnection.on('open', () => {
            setConnection(peerConnection);
            console.log(`Connected`)
        });
    }

    useEffect(() => {}, [remoteId])

    return (
        <>
            <div>
                <div className="bg-white-bigger">
                    {
                        id && <QRCode value={`${window.location.protocol}://${window.location.hostname}:${window.location.port}?peer=${id}`} />
                    }
                </div>
                
                <p>{id === null ? "No Id" : id}</p>
                <p>
                    {
                        remoteId !== null
                        ? <span>Connected to {remoteId}</span>
                        : <span>Not connected yet</span>
                    }
                </p>
                <input type="text" onChange={(event)=> setOtherId(event.target.value)} />
                <button onClick={setConnect} >CONNECT</button>
            </div>
        </>
    );
}

export default PeerConnection;