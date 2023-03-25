import { useWallet,CardanoWallet } from "@meshsdk/react";
import { useState,useEffect } from "react";
import { useRouter } from 'next/router'
import axios from "axios";
import { Transaction } from "@meshsdk/core";
import useSWR from 'swr'
 export default function Post() {
  const [data, setData] = useState(null)
  const [isLoadingData, setLoadingData] = useState(false)

   const { wallet,connected } = useWallet();
   const [txHash, setTxHash] = useState(null);
   const [loading, setLoading] = useState(false);
   const router = useRouter()
   const { pid } = router.query




   const fetcher = (id) => axios.get(`http://localhost:8536/api/gateway/${id}/getvalue`)
    .then(res => {
      setData(res.data ?? null)
      setLoadingData(false)
    })


  useSWR(pid, fetcher)
console.log()

  if (isLoadingData) return <p>Loading...</p>
  if (data == null) return <p>No data</p>
 
   async function startPayment() {
      setLoading(true);
      try {
         const tx = new Transaction({ initiator: wallet })
         .sendLovelace(data.StoreAddress,`${data.Amount*1000000}`);
         const unsignedTx = await tx.build();
         const signedTx = await wallet.signTx(unsignedTx);
         const txHash = await wallet.submitTx(signedTx);
         setTxHash(txHash);
          const res =  await axios.post(`http://localhost:8536/gateway/${data.ID}/update`, {TxHash:txHash});
          console.log(res.data)
  
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
   return (
<>
<div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md">
    <div className="stats">  
  <div className="stat">
    <div className="stat-title">Pay</div>
    <div className="stat-value">{data.Amount} (ADA)</div>
    <div className="stat-actions">

          

    {connected ? (
              <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => startPayment()}
              disabled={loading}
            >
              {loading ? "Creating transaction..." : "Process"}
            </button>

          ) : (
            <CardanoWallet />
          )}
          {txHash && (
            <div>
              <p>Successful, transaction hash:</p>
              <code>{txHash}</code>
            </div>
          )}
    </div>
  </div>
  
</div>
    </div>
  </div>
</div>

</>
    )
 } 