import { useWallet,useAssets } from "@meshsdk/react";
import { useState } from "react";
import { Transaction } from "@meshsdk/core";
// import { sendAssets } from "../backend";
export  default  function Trans() {
  const { wallet, connected } = useWallet();
  const assets = useAssets();

  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    asset: "",
    address: "",
    amount: "",
  });
  console.log(assets)

  function handleChange(e) {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  }

  async function startSent() {
    setLoading(true);
    try {
      const tx = new Transaction({ initiator: wallet })
      .sendAssets(
        formdata.address,
        [
          {
            unit: formdata.asset,
            quantity: formdata.amount,
          },
        ]
      );
      // .sendLovelace(formdata.address,formdata.amount);
      console.log(tx)
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      console.log(unsignedTx)
      const txHash = await wallet.submitTx(signedTx);
      setTxHash(txHash);

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }


  return (
    <div className="mt-10 sm:mt-0">
    <div className="md:grid md:grid-cols-3 md:gap-6">

      <div className="mt-5 md:col-span-2 md:mt-0">
        <form action="#" method="POST">
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 lg:col-span-8">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  Asset
                  </label>
                  <select  className="select select-primary w-full" onChange={handleChange} name="asset">
                 
                  {assets &&
                    assets.slice(0, 10).map((option, index) => (
                      <option key={index} value={option.unit}>
                        {option.assetName}
                      </option>
                  ))}
                  </select>                 
                </div>
                <div className="col-span-6 lg:col-span-8">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  Send to Address
                  </label>
                  <input type="text" name="address"  onChange={handleChange} value={formdata.address} placeholder="Address"  className="input input-bordered input-success w-full" />

                </div>

                <div className="col-span-6 lg:col-span-8">
                  <label htmlFor="Amount" className="block text-sm font-medium text-gray-700">
                  Amount
                  </label>
                  <input type="number"  name="amount" onChange={handleChange}value={formdata.amount} placeholder="100" className="input input-bordered input-error w-full" />
                </div>





              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            {connected ? (
              <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => startSent()}
              disabled={loading}
            >
              {loading ? "Creating transaction..." : "Send"}
            </button>

          ) : (
            <p> Please connect to wallet</p>
          )}
          {txHash && (
            <div>
              <p>Successful, transaction hash:</p>
              <code>{txHash}</code>
            </div>
          )}
              
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
