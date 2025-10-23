import toast from "react-hot-toast";
const PROD = import.meta.env.VITE_ENV
console.log("Environment",PROD)
export const base_url = (PROD === "development") ? "https://symmetrical-goldfish-67r4pv59gj92695-8001.app.github.dev/metasun" : "https://api.btcmine.io/api";
// export const base_url = "http://localhost:8080/api";

export const bsc_url = PROD === "development" ? "https://opbnb-testnet.bscscan.com/tx": "https://bscscan.com/tx"
export const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(()=>{
        toast.success("Copied to Clipboard!")
    }).catch(()=>{
        toast.error("Failed to copy!")
    })
};
