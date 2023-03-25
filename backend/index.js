import axios from "axios";

const instance = axios.create({
  baseURL: `/api/`,
  withCredentials: true,
});

export async function post(route, body = {}) {
  return await instance
    .post(`${route}`, body)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
}
export async function UpToIPFS(file) {
  const formData = new FormData();   
    formData.append('file', file)    
    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);    
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",
       formData,
        {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: 'd7dfa5e4a5d6244ba414',
          pinata_secret_api_key: '091489cb3ec7cf2722988cad65a326444c415f53542957790892aa0d3fe9c4ad',
        }
      });
    return res
}

export async function createTransaction( utxos,asset,assetPrice) {
  return await post(`create-mining-transaction`, { utxos, asset });
}

export async function signTransaction(signedTx, originalMetadata) {
  return await post(`sign-transaction`, {
    signedTx,
    originalMetadata,
  });
}
