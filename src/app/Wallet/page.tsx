"use client";
import { useAccount } from "wagmi";
import ChainInfo from "../components/blockchain/Connected/ChainInfo";
import Link from "next/link";

export default function WalletPage() {
  const { address, chain, chainId } = useAccount();
  return (
    <div>
      {chain && <ChainInfo chain={chain} address={address!} />}  
      <h1>Wallet Page</h1>

      <div>
        <img src="/img/Property 1=Nab Var - Home.svg" alt="" className="connected-footer"/>
        <Link href="/">
          <img src="/img/Home-gray.svg" alt="" className="connected-home"/>
        </Link>
        <div className="connected-profile-wallet">
          <Link href="/Profile">
            <img src="/img/Profile-gray.svg" alt="" className="connected-profile"/>
          </Link>
          <Link href="/Wallet">
            <img src="/img/Wallet.svg" alt="" className="connected-wallet"/>          
          </Link>
        </div>
      </div>
    </div>
  );
}