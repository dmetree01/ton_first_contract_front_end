import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();
  const { connected } = useTonConnect();
  return (
    <div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <TonConnectButton />
      </div>
      <div style={{display: "flex", textAlign: "left"}}>
        <div className='Card'>
          <h3>Contract data</h3>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address}</div>
          <hr/>
          <b>Our contract Owner</b>
          <div className='Hint'>{owner_address?.toString() || 'Loading...'}</div>
          <hr/>
          <b>Our contract Balance</b>
          <div className='Hint'>{(contract_balance && fromNano(contract_balance)) || 'Loading...'}</div>
          <hr/>
          <b>Recent sender:</b>
          <div className='Hint'>{recent_sender?.toString() || 'Loading...'}</div>
          <hr/>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
        <div className='Card' style={{marginLeft: "50px"}}>
          <h3>Contract actions</h3>
          <div>Increment contract counter number by 1</div>
          <div>
            {connected && (
              <button
                onClick={() => {
                  sendIncrement();
                }}
              >
                Increment by 1
              </button>
            )}
          </div>
          <hr/><br/>
          <div>Deposit contract balance by 1 TON</div>
          <div>
            {connected && (
              <button
                onClick={() => {
                  sendDeposit();
                }}
              >
                Request deposit of 1 TON
              </button>
            )}
          </div>
          <hr/><br/>
          <div>Withdrawal from contract balance by 0.5 TON</div>
          <div>
            {connected && (
              <button
                onClick={() => {
                  sendWithdrawalRequest();
                }}
              >
                Request 0.5 TON withdrawal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;