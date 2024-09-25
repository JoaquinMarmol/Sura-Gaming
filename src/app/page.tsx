"use client";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Connected from "./components/blockchain/Connected";
import NotConnected from "./components/blockchain/NotConnected";

const HomePage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");

      if (!hasLoggedInBefore) {
        router.push("/Account");
        localStorage.setItem("hasLoggedInBefore", "true");
      }
    }
  }, [isConnected, router]);

  return (
    <div className="homepage">
      {!isConnected && (
        <>
          <img src="/img/image1.png" alt="Gaming image" />
          <h2 className="homepage__marginBtNormal">
            Welcome to the future of gaming!
          </h2>
        </>
      )}

      {isConnected ? <Connected /> : <NotConnected />}
    </div>
  );
};

export default HomePage;
