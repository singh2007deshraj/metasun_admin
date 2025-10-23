import { btcAbi, web3 } from "./web3";


export function RemoveUnderScore(text = "") {
  const formattedText = text.replace("_", " ");
  return formattedText;
}

export function formatText(text = "") {
  const formattedText = `${text.slice(0, 6)}...${text.slice(-6)}`;
  return formattedText;
}

export async function getPrice() {
  try {
   const contract =  new web3.eth.Contract(btcAbi,import.meta.env.VITE_CONTRACT_ADDRESS)
    const price = await contract.methods.getPrice().call();
    return Number(price)/1e18;
  } catch (error) {
    console.log(error);
  }
}
