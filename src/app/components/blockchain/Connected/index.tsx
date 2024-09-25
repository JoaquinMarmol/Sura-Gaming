import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Disconnect from "./Disconnect";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
import Link from "next/link";

const Slider = dynamic(() => import("react-slick"), { ssr: false });


const Connected = () => {
  const { address } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container">
      <header className="account-page__header">
        <h3>Hello {address}!</h3>
        <img src="/img/flechaizq.svg" alt="" className="account-page__header-arrow" />
      </header>
      <div className="slider">
        {isMounted && (
          <Slider {...settings}>
            <div className="slider-img">
              <img className="slider-img" src="/img/slide.png" alt="Slide 1" />
            </div>
            <div className="slider-img">
              <img className="slider-img" src="/img/slide2.png" alt="Slide 2" />
            </div>
            <div className="slider-img">
              <img className="slider-img" src="/img/slide3.png" alt="Slide 3" />
            </div>
          </Slider>
        )}
      </div>
      <Disconnect />
      <div className="connected-nft">
        <div className="connected-nft-title">
          <h3 className="connected-nft-title-h3">Your NFTS</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div className="connected-nft-info">
          <div className="connected-nft-info-item">
            <img src="/img/earlyuser.png" alt="" />
            <p>Top 1k</p>
          </div>
          <div className="connected-nft-info-item">
            <img src="/img/scan.png" alt="" />
            <p>Scan at the event</p>
          </div>
        </div>
      </div>
      <div className="connected-nft">
        <div className="connected-nft-title">
          <h3 className="connected-nft-title-h3">Your Wallet</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div className="connected-nft-info">
          <h2>$0.00</h2>
        </div>
      </div>
      <div>
        <img src="/img/Property 1=Nab Var - Home.svg" alt="" className="connected-footer"/>
        <img src="/img/Home.svg" alt="" className="connected-home"/>
        <div className="connected-profile-wallet">
          <Link href="/Profile">
            <img src="/img/Profile-gray.svg" alt="" className="connected-profile"/>
          </Link>
          <Link href="/Wallet">
            <img src="/img/Wallet-gray.svg" alt="" className="connected-wallet"/>          
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Connected;
