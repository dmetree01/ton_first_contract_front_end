import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();
  const [balance, setBalance] = useState<null | number>(0);

  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQDVZ0pE11fODkYRAWP7l3kyZFmFVIAWrGTF0lwffaNLcDhF")
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      setBalance(null);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const val = await mainContract.getData();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const balance = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance.number);

      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance, 
    ...contractData,
    sendIncrement: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return mainContract?.sendIncrement(sender, toNano(0.05), 5);
    },
    sendDeposit: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return mainContract?.sendDeposit(sender, toNano(1));
    },
    sendWithdrawalRequest: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return mainContract?.sendWithdrawalRequest(sender, toNano(0.05), toNano(0.5));
    },
  };
}