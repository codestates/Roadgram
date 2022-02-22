import React from 'react';

function WithdrawalDoneModal() {
    const confirmHandler = async () => {
        
    }
    return (
        <div className="withdrawal-center-wrap">
        <div className="withdrawal-background">
            <div className="withdrawal-box">
            <div className="withdrawal-msg">탈퇴되었습니다. Roadgram을 이용해주셔서 감사드립니다.</div>
            <button className="yesorno" type="button" onClick={confirmHandler}>확인</button>
            </div>
        </div>
        </div>
    )
}

export default WithdrawalDoneModal;