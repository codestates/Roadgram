import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { RootState } from '..';

const socket = io(`${process.env.REACT_APP_API_URL}`);

function ChatRoomsPage() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [msg, setMsg] = useState({ message: '' });
    const [chatBody, setChatBody] = useState<any>([]);
    const { nickname } = userInfo;

    useEffect(() => {
        socket.on('returnToClient', ({nickname, message}) => {
            setChatBody([...chatBody, { nickname, message }]);
        })
    })

    const onTextChange = (e: any) => {
        setMsg({ message: e.target.value });
    }
    
    const sendMessage = (e: any) => {
        e.preventDefault();
        const { message } = msg;
        if (e.target.value !== '') {
            socket.emit('send', { nickname, message });
        }
        setMsg({ message: '' });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    return (
        <div className="chat-container">
            <div className="chat-lists">chat room lists</div>
            <div className="each-room">
                <div className="chat-partner">
                    chat parter Info
                </div>
                <div className="chat-body">
                    {chatBody.map((each: { nickname: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; message: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
                        return (
                            <div className="each-msg">
                                <span className="msg-owner">{each.nickname}</span>
                                <span className="msg-text">{each.message}</span>
                                <span className="msg-time">{`${year}년 ${month}월 ${date}일 ${hour}시 ${minutes}분`}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="chat-box">
                    <input className="chat-input" type="text"
                    value={msg.message}
                    onChange={e => onTextChange(e)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') sendMessage(e)
                    }}/>
                    <button type="submit" className="chat-send" value={msg.message} onClick={sendMessage}>전송</button>
                </div>
            </div>
        </div>
    )
}

export default ChatRoomsPage;