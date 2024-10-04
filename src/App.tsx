import { useEffect, useState } from 'react'
import { Box, Text, Button, Spinner, Modal } from '@0xsequence/design-system'
import { router, sequence } from './main'
import { googleLogout } from '@react-oauth/google'
import { AnimatePresence } from 'framer-motion'
import { PINCodeInput } from './components/PINCodeInput'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [sessionValidationCode, setSessionValidationCode] = useState<string[]>([])
  const [isValidateSessionPending, setIsValidateSessionPending] = useState(false)
  const [isFinishValidateSessionPending, setIsFinishValidateSessionPending] = useState(false)

  useEffect(() => {
    sequence.isSignedIn().then((signedIn: boolean) => {
      if (!signedIn) {
        router.navigate('/welcome')
      }
    })
  }, [])

  useEffect(() => {
    const code = sessionValidationCode.join('')
    if (code.length === 6) {
      setIsFinishValidateSessionPending(true)
      sequence.finishValidateSession(code)
    }
  }, [sessionValidationCode])

  useEffect(() => {
    const removeCallback = sequence.onValidationRequired(() => {
      setIsValidateSessionPending(true)

      sequence.waitForSessionValid(600 * 1000, 4000).then((isValid: boolean) => {
        console.log('isValid', isValid)
        setSessionValidationCode([])
        setIsValidateSessionPending(false)
        setIsFinishValidateSessionPending(false)
      })
    })
    return () => {
      removeCallback.then((cb: any) => cb())
    }
  }, [])

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

  const gameSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.3,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: 0,
  };

  return (
    <>
      <AnimatePresence>
        {isValidateSessionPending && (
          <Modal>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '1.2em',
                height: '50vh'
              }}
            >
              <Box flexDirection="column" alignItems="center">
                <Text marginBottom="7">Please enter the session verification code that was sent to your email</Text>
                <PINCodeInput value={sessionValidationCode} digits={6} onChange={setSessionValidationCode} />
                <Box marginTop="5">{isFinishValidateSessionPending && <Spinner />}</Box>
              </Box>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <header className="page__header">
        <h3>Hello User!</h3>
        <img src="/notificacion.svg" alt="" className="profile-page__header-question" />
      </header>
      <div style={{ maxWidth: "720px", padding: "0 20px", margin: "0px auto" }}>
        <div className="slider">
          {isMounted && (
            <Slider {...settings}>
              <div className="slider-img">
                <img className="slider-img" src="./Bannerhome.png" alt="Slide 1" />
              </div>
              <div className="slider-img">
                <img className="slider-img" src="./Bannerhome1.png" alt="Slide 2" />
              </div>
            </Slider>
          )}
        </div>
        <div className="connected-nft-title">
            <h2 className='connected-nft-title-text'>Tus NFTs</h2>
            <div className='connected-nft-title-arrow'>
              <p>Ver todos</p>
              <img src="/arrowright.svg" alt="" />
            </div>
        </div>
        <div className="connected-nft">
          <div className="connected-nft-info">
            <div className="connected-nft-info-item">
              <img src="./earlyuser.png" className='connected-nft-image' alt="Top 1k" style={{ width: "100px" }} />
              <p className='connected-nft-info-text'>Founding member</p>
            </div>
            <div className="connected-nft-info-item">
              <div className='scan-button'>
                +
              </div>
              <p>Scan at the event</p>
            </div>
          </div>
        </div>
        <div className="connected-nft-title">
          <h2 className="connected-nft-title-text">Juegos Destacados</h2>
        </div>
        <div className="connected-nft-games" style={{ overflow: 'hidden' }}>
          {isMounted && (
            <Slider {...gameSliderSettings}>
              <div className="connected-nft-game">
                <img src="./game.svg" alt="Elemental Raiders" className='connected-nft-game-image'/>
                <p>Elemental Raiders</p>
              </div>
              <div className="connected-nft-game">
                <img src="./game1.svg" alt="Cyber Titans" className='connected-nft-game-image'/>
                <p>Cyber Titans</p>
              </div>
              <div className="connected-nft-game">
                <img src="./game2.svg" alt="Big Time" className='connected-nft-game-image'/>
                <p>Big Time</p>
              </div>
              <div className="connected-nft-game">
                <img src="./game3.svg" alt="Metasoccer" className='connected-nft-game-image'/>
                <p>Metasoccer</p>
              </div>
              <div className="connected-nft-game">
                <img src="./game4.svg" alt="Axie Infinity" className='connected-nft-game-image'/>
                <p>Axie Infinity</p>
              </div>
            </Slider>
          )}
        </div>
        <Button
            marginLeft="auto"
            label="Log out"
            size="xs"
            onClick={async () => {
              try {
                await sequence.dropSession({ strict: false })
              } catch (e: any) {
                console.warn(`Could not drop session: ${e.message}`)
              }

              googleLogout()
              router.navigate('/login')
            }}
          />
        <div>
          <img src="/Property 1=Nab Var - Home.svg" alt="" className="connected-footer"/>
          <a href="/">
            <img src="/footerHome.svg" alt="" className="connected-home"/>
          </a>
          <div className="connected-profile-wallet">
            <a href="/" className='connected-home-link'></a>
            <a href="./#/wallet" className="connected-wallet"></a>
            <a href="./#/profile" className="connected-profile"></a>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
