import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { UpToIPFS,createTransaction, signTransaction } from "../backend";

export default function mNFT() {
  const { wallet, connected } = useWallet();
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    assetName: "",
    assetQuantity: 0,
    metadata_name: "",
    metadata_author: "",
    metadata_description: "",
    file: null,
  });
  function handleChange(e) {
    if (e.target.files) {
      setFormdata({ ...formdata, [e.target.name]: e.target.files[0] });
    }else{
      setFormdata({ ...formdata, [e.target.name]: e.target.value });
    }
  }
   
  async function startMintNFT() {
    setLoading(true);
    try {
      const recipientAddress = await wallet.getChangeAddress();
      const utxos = await wallet.getUtxos();
      const pinned = await UpToIPFS(formdata.file)
      console.log(pinned.data)
      
      const asset = {
        assetName: formdata.assetName,
        assetQuantity: formdata.assetQuantity,
        metadata: {
          author: formdata.author,
          name: formdata.metadata_name,
          image: `ipfs://${pinned.data.IpfsHash}`,
          mediaType: "image/jpg",
          description: formdata.metadata_description,
        },
        label: "721",
        recipient: {
          address: recipientAddress,
        },
      };

      const {maskedTx, originalMetadata } = await createTransaction(
        utxos,
        asset
        );

      const signedTx = await wallet.signTx(maskedTx, true);
      const { appWalletSignedTx } = await signTransaction(
        signedTx,
        originalMetadata
      );

      const txHash = await wallet.submitTx(appWalletSignedTx);

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
                Asset Name
                </label>
                <input type="text" name="assetName"  onChange={handleChange} value={formdata.assetName} placeholder="Asset Name"  className="input input-bordered input-success w-full" />

              </div>
              <div className="col-span-6 lg:col-span-8">
                    <label htmlFor="Amount" className="block text-sm font-medium text-gray-700">
                    Asset Quantity
                    </label>
                    <input type="number"  name="assetQuantity" onChange={handleChange} value={formdata.assetQuantity} placeholder="100000" className="input input-bordered input-error w-full" />
                  </div>

              
              <div className="col-span-6 lg:col-span-8">
                <label htmlFor="Amount" className="block text-sm font-medium text-gray-700">
                Image
                </label>
                <input type="file" name="file" onChange={handleChange} className="file-input file-input-bordered file-input-accent w-full" />
              </div>
              <div className="col-span-6 lg:col-span-8">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                Metadata Name
                </label>
                <input type="text" name="metadata_name"  onChange={handleChange} value={formdata.metadata_name} placeholder="Name"  className="input input-bordered input-success w-full" />

              </div>
              <div className="col-span-6 lg:col-span-8">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                Metadata Author
                </label>
                <input type="text" name="metadata_author"  onChange={handleChange} value={formdata.metadata_author} placeholder="Author"  className="input input-bordered input-success w-full" />

              </div>

              <div className="col-span-6 lg:col-span-8">
                <label htmlFor="Amount" className="block text-sm font-medium text-gray-700">
                Metadata Description
                </label>
                <input type="text"  name="metadata_description" onChange={handleChange} value={formdata.metadata_description} placeholder="Description" className="input input-bordered input-error w-full" />
              </div>





            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              {connected ? (
              <button className="btn btn-success"
                type="button"
                onClick={() => startMintNFT()}
                disabled={loading}
              >
                {loading ? "Creating transaction..." : "Mint Token"}
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
