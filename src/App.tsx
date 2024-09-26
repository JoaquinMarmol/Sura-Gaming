import { useEffect, useState } from 'react'
import { Box, Text, Divider, Button, Spinner, Modal, Collapsible, ExternalLinkIcon } from '@0xsequence/design-system'
import { router, sequence } from './main'
import { SendTransactionsView } from './components/views/SendTransactionsView'
import { googleLogout } from '@react-oauth/google'
import { SignMessageView } from './components/views/SignMessageView'
import { CallContractsView } from './components/views/CallContractsView'
import { AnimatePresence } from 'framer-motion'
import { PINCodeInput } from './components/PINCodeInput'
import { SendERC20View } from './components/views/SendERC20View'
import { SendERC1155View } from './components/views/SendERC1155View'
import { NetworkSwitch } from './components/NetworkSwitch.tsx'
import { accountToName } from './components/views/ListAccountsView.tsx'
import { Account, IdentityType, Network } from '@0xsequence/waas'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [walletAddress, setWalletAddress] = useState<string>()
  const [fetchWalletAddressError, setFetchWalletAddressError] = useState<string>()
  const [isMounted, setIsMounted] = useState(false);
  const [sessionValidationCode, setSessionValidationCode] = useState<string[]>([])
  const [isValidateSessionPending, setIsValidateSessionPending] = useState(false)
  const [isFinishValidateSessionPending, setIsFinishValidateSessionPending] = useState(false)

  const [network, setNetwork] = useState<undefined | Network>()

  const [currentAccount, setCurrentAccount] = useState<Account>()

  useEffect(() => {
    sequence
      .getAddress()
      .then((address: string) => {
        setWalletAddress(address)
      })
      .catch((e: Error) => {
        setFetchWalletAddressError(e.message)
      })

    sequence.listAccounts().then(response => {
      if (response.currentAccountId) {
        setCurrentAccount(response.accounts.find(account => account.id === response.currentAccountId))
      }
    })
  }, [])

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
      <div style={{ maxWidth: "720px", margin: "80px auto", padding: "0 24px" }}>
      {/* Slider */}
      <div className="slider">
        {isMounted && (
          <Slider {...settings}>
            <div className="slider-img">
              <img className="slider-img" src="./slide.png" alt="Slide 1" />
            </div>
            <div className="slider-img">
              <img className="slider-img" src="./slide2.png" alt="Slide 2" />
            </div>
            <div className="slider-img">
              <img className="slider-img" src="./slide3.png" alt="Slide 3" />
            </div>
          </Slider>
        )}
      </div>
        <div className="connected-nft" style={{ marginTop: "40px" }}>
          <div className="connected-nft-title">
            <h2>Your NFTs</h2>
          </div>
          <div className="connected-nft-info">
            <div className="connected-nft-info-item">
              <img src="./earlyuser.png" className='connected-nft-image' alt="Top 1k" style={{ width: "100px" }} />
              <p>Top 1k</p>
            </div>
            <div className="connected-nft-info-item">
              <div className='scan-button'>
                +
              </div>
              <p>Scan at the event</p>
            </div>
          </div>
        </div>

        <div className="connected-wallet" style={{ marginTop: "40px" }}>
          <div className="connected-wallet-title">
            <h2>Your Wallet</h2>
          </div>
          <div className="connected-wallet-info">
            <h3>$0.00</h3>
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <img src="./Property 1=Nab Var - Home.svg" alt="Footer Icon" className="connected-footer" style={{ display: "block", margin: "0 auto" }} />
          <img src="./Home.svg" alt="Home Icon" className="connected-home" style={{ display: "block", margin: "0 auto", marginTop: "10px" }} />
          <div className="connected-profile-wallet" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <a href="/Profile">
              <img src="./Profile-gray.svg" alt="Profile Icon" className="connected-profile" />
            </a>
            <a href="/Wallet">
              <img src="./Wallet-gray.svg" alt="Wallet Icon" className="connected-wallet" />
            </a>
          </div>
        </div>
      </div>
      <Box marginY="0" marginX="auto" paddingX="6" style={{ maxWidth: '720px', marginTop: '80px', marginBottom: '80px' }}>
        <Box marginBottom="5" flexDirection="row">
          {currentAccount && (
            <Box flexDirection="column" gap="2">
              <Text marginTop="1" variant="normal" color="text100">
                {currentAccount.type === IdentityType.Guest
                  ? 'Guest account'
                  : `Logged in with account type ${currentAccount.type}`}{' '}
              </Text>
              {currentAccount.type !== IdentityType.Guest && accountToName(currentAccount)}
            </Box>
          )}

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
        </Box>

        <Divider background="buttonGlass" />

        <Box marginBottom="5">
          <Text variant="normal" color="text100" fontWeight="bold">
            Your wallet address:
          </Text>
        </Box>

        <Box marginBottom="5">
          <Text variant="normal" color="text100" fontWeight="normal">
            {walletAddress ? (
              <Box>
                <Text>{walletAddress}</Text>
              </Box>
            ) : (
              <Spinner />
            )}
          </Text>
        </Box>

        <Box>{fetchWalletAddressError && <Text>Error fetching wallet address: {fetchWalletAddressError}</Text>}</Box>

        <Divider background="buttonGlass" />

        <Box marginBottom="5">
          <NetworkSwitch onNetworkChange={setNetwork}></NetworkSwitch>
        </Box>

        <Divider background="buttonGlass" />

        <Collapsible marginY={'3'} label="Send native token transaction">
          <Divider background="buttonGlass" />
          <SendTransactionsView network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Send ERC20 transaction">
          <Divider background="buttonGlass" />
          <SendERC20View network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Send ERC1155 transaction">
          <Divider background="buttonGlass" />
          <SendERC1155View network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Sign a message">
          <Divider background="buttonGlass" />
          <SignMessageView network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="Call contracts">
          <Divider background="buttonGlass" />
          <CallContractsView network={network} />
        </Collapsible>
        <Collapsible marginY={'3'} label="External Wallet Linking Demo">
          <Text
            as="a"
            variant="medium"
            color="text100"
            href="https://demo-waas-wallet-link.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to demo
            <ExternalLinkIcon position="relative" top="1" marginLeft="1" />
          </Text>
        </Collapsible>
      </Box>
    </>
  )
}

export default App
