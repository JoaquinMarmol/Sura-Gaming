import { Box, Text, Spinner, Modal} from '@0xsequence/design-system'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { router, sequence } from '../main'
import { PINCodeInput } from '../components/PINCodeInput'
import { EmailConflictWarning } from '../components/views/EmailConflictWarningView.tsx'
import { randomName } from '../utils/indexer'
import { useEmailAuth } from '../utils/useEmailAuth.ts'
import { EmailConflictInfo } from '@0xsequence/waas'
import '../Login/login.css'

function Login() {
  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isEmailValid = inputRef.current?.validity.valid
  const [showEmailWarning, setEmailWarning] = useState(false)
  const [code, setCode] = useState<string[]>([])

  const [emailConflictInfo, setEmailConflictInfo] = useState<EmailConflictInfo | undefined>()
  const [isEmailConflictModalOpen, setIsEmailConflictModalOpen] = useState(false)
  const forceCreateFuncRef = useRef<(() => Promise<void>) | null>(null)

  sequence.onEmailConflict(async (info, forceCreate) => {
    forceCreateFuncRef.current = forceCreate
    setEmailConflictInfo(info)
    setIsEmailConflictModalOpen(true)
  })

  const {
    inProgress: emailAuthInProgress,
    loading: emailAuthLoading,
    initiateAuth: initiateEmailAuth,
    sendChallengeAnswer,
    cancel: cancelEmailAuth
  } = useEmailAuth({
    sessionName: randomName(),
    onSuccess: async ({ wallet }) => {
      console.log(`Wallet address: ${wallet}`)
      router.navigate('/account')
    }
  })

  useEffect(() => {
    sequence.isSignedIn().then((signedIn: boolean) => {
      if (!signedIn) {
        router.navigate('/register')
      }
    })
  }, [])

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const res = await sequence.signIn(
      {
        idToken: tokenResponse.credential!
      },
      randomName()
    )

    console.log(`Wallet address: ${res.wallet}`)
    console.log(`Email address: ${res.email}`)
    router.navigate('/account')
  }

  return (
    <>
      <Box marginY="0" marginX="auto" paddingX="6" flexDirection={'column'} justifyContent={'center'} alignItems={'center'} style={{ maxWidth: '720px', marginTop: '80px', marginBottom: '80px' }}>
        <img src="./sura.svg" alt="" />
        <Box marginTop="6">
          <Text variant="large" color="text100" fontWeight="bold">
            Email Login
          </Text>
        </Box>

        {sendChallengeAnswer ? (
          <div className='email-auth'>
            <Box flexDirection="column">
              <img src="./sura.svg" alt=""/>
              <Box marginTop="6" flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                <Text variant="xlarge" color="text100" fontWeight="bold" textAlign="center">
                  Check your inbox
                </Text>
                <Text marginTop="5" variant="normal" color="text80" textAlign="center">
                  We&apos;ve sent you an email with a verification code.
                </Text>
              </Box>
              <Box marginTop="4" justifyContent={'center'} alignItems={'center'}>
                <PINCodeInput value={code} digits={6} onChange={setCode} />
              </Box>

              <Box gap="2" marginY="4" justifyContent={'center'} alignItems={'center'}>
                {emailAuthLoading ? (
                  <Spinner />
                ) : (
                  <button
                    disabled={code.includes('')}
                    onClick={() => sendChallengeAnswer(code.join(''))}
                    data-id="verifyButton"
                    className="verify-button"
                  >
                    Verify
                  </button>
                )}
              </Box>
            </Box>
          </div>
        ) : (
          <Box marginTop="5" marginBottom="4">
            <div className='login-email'>
              <input
                name="email"
                type="email"
                onChange={(ev: { target: { value: SetStateAction<string> } }) => {
                  setEmail(ev.target.value)
                }}
                ref={inputRef}
                onKeyDown={(ev: { key: string }) => {
                  if (email && ev.key === 'Enter') {
                    initiateEmailAuth(email)
                  }
                }}
                onBlur={() => setEmailWarning(!!email && !isEmailValid)}
                value={email}
                placeholder="hello@example.com"
                required
                data-id="loginEmail"
                className="input-login-email"
              />
              {showEmailWarning && (
                <Text as="p" variant="small" color="negative" marginY="2">
                  Invalid email address
                </Text>
              )}
            </div>
            <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
              {emailAuthLoading ? (
                <Spinner />
              ) : (
                <button
                  disabled={!isEmailValid}
                  onClick={() => initiateEmailAuth(email)}
                  className="login-continue-button"
                >
                  Continue
                </button>
              )}
            </Box>
          </Box>
        )}

        <Box paddingY="4" gap="4" flexDirection="column" alignItems="center" width="full">
          {!emailAuthInProgress && (
            <>
              <Box marginBottom="2">
                <Text variant="large" color="text100" fontWeight="bold">
                  Social Login
                </Text>
              </Box>
              <Box gap="4" flexDirection="column" width="fit">
                {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                  <Box>
                    <GoogleLogin key="google" onSuccess={handleGoogleLogin} shape="circle" width={230} />
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
        <Text as="p" variant="small" color="text80" textAlign="center">Already have an account? <a href="./#/login" className='log-in'>Log in</a></Text>
      </Box>

      {isEmailConflictModalOpen && emailConflictInfo && (
        <Modal size="small" onClose={() => setIsEmailConflictModalOpen(false)}>
          <EmailConflictWarning
            info={emailConflictInfo}
            onCancel={() => {
              setIsEmailConflictModalOpen(false)
              setEmailConflictInfo(undefined)
              if (emailAuthInProgress) {
                setCode([])
                cancelEmailAuth()
                setEmail('')
              }
            }}
            onConfirm={async () => {
              setIsEmailConflictModalOpen(false)
              setEmailConflictInfo(undefined)
              await forceCreateFuncRef.current?.()
            }}
          />
        </Modal>
      )}
    </>
  )
}

export default Login
