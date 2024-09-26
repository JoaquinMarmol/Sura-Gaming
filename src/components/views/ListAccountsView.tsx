import { Box, Button, Divider, PINCodeInput, Spinner, Text, TextInput, useToast } from '@0xsequence/design-system'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { Account, IdentityType } from '@0xsequence/waas'
import { CredentialResponse, GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import AppleSignin from 'react-apple-signin-auth'

import { sequence } from '../../main'

import { useEmailAuth } from '../../utils/useEmailAuth'
import { randomName } from '../../utils/indexer'
import { isAccountAlreadyLinkedError } from '../../utils/error'

export function accountToName(acc: Account) {
  if (acc.type === IdentityType.Email) {
    return (
      <Text variant="normal" color="text100">
        Email ({acc.email})
      </Text>
    )
  }

  if (acc.type === IdentityType.Guest) {
    return (
      <Text variant="normal" color="text100">
        Guest account
      </Text>
    )
  }

  if (acc.type === IdentityType.PlayFab) {
    return (
      <Text variant="normal" color="text100">
        PlayFab ({acc.email})
      </Text>
    )
  }

  if (acc.type === IdentityType.OIDC) {
    if (acc.issuer?.includes('cognito-idp')) {
      return (
        <Text variant="normal" color="text100">
          Email Legacy ({acc.email})
        </Text>
      )
    }
  }

  if (acc.type === IdentityType.Stytch) {
    return <>Stytch account ({acc.email})</>
  }

  if (import.meta.env.VITE_STYTCH_LEGACY_ISSUER && acc.issuer === import.meta.env.VITE_STYTCH_LEGACY_ISSUER) {
    return <>WRAPPED Stytch account ({acc.email}</>
  }

  switch (acc.issuer) {
    case 'https://accounts.google.com':
      return (
        <Box gap="2" marginTop="2">
          <img
            width={24}
            src="data:image/png;base64,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"
          />
          <Text variant="normal" color="text100">
            Google ({acc.email})
          </Text>
        </Box>
      )
    case 'https://appleid.apple.com':
      return (
        <Box gap="2">
          <img
            width={24}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABMlJREFUaEPVmV1oXEUUx89/Ete6SUykWiv4QcRYymISc2fWdCPUVUQUpIqKPggaEa1Wqj7UPokg+hJfagM+iMX2QS0RjQSFIkLpQ2Oyd+7GtaTiB4rgB8ZqNKlJupvco6MbCHH33tnNzSaZ1zn3f/6/O3PnzMwFbfCGDe6f1gxgfHw8Njs7exMRXd/c3Hygra3tXDUvs+YAx48f39TU1LSPiJ4koq1F0y1Syj/XPYDWuouIjhJR2xKzc47jxAHwugZwXbcHwEdE1LzUKIBhx3F6qjFvnqnJFMpkMluFEGNLpsxSv3ullP3rGkBrbd78HctNMvNkoVC4JpVK/b5uATKZjBJCZEoZBPC44zivV2u+JlPI87x+Zn6qhMnDUsrelZivCYDW+nMium6pUWZ+U0r5KAB/IwCcIaLNxigz/yGEeNZxnMMrNb74/IpXoZGRkUvr6+vnyhUirfXbRDTDzCfi8fhgIpE4a5KPjo5uFkJcKf5rv3V2dn5fTS2oGEBrfRkRPUREdzFzJ4Dzi2/3VwAnieiDWCw21N7ePrls2sB13R11dXW7mPn2EtPqLAAN4Eh9ff27HR0df9mMkjWA2QI0NjY+T0RPA2gIEmfmcwCOEdHHzPyjECLFzPcS0dU2pojoDDPvVkq9FxZvBWAKERENCiG6wwQj7u+XUu4N0gwFGBsba1lYWBglomsjNmcr94KU8sVywYEAzCyy2eyHxTlrmzCyOGbOA9gnpTxYFYDrug8AeCcyRxUIMfNPRHS3UqpkFQ9dRgcGBupaW1tPAdheQd6oQqd939+RTCbHwwTLTqFsNnuL7/ufhAmsUv8eKeVrNtplAVzX7TPzz0YkyhhmNgWtTUpZsNEtC6C1Nvv3ThuRKGOY+RWl1HO2mkEjMAmgxVYoqjgA9ziO876tXkkAc2MwMzMzByC0Ttgmso1j5hvCVp6lWiUNFvc7ZhmreWPmLqWUmb5WrSRALpfbUigUfrFSiDiImW9VSlmvfiUBhoeHL4jFYjMRe7OSY+b9Sqk+q+CgWwnXdScAXGIrFFUcM3+qlErZ6pX9SD3PO8nM1kK2CW3ifN/vSSaTwzaxQXXggNn724isQsyp6enpZDqdngvTDgK4j4gGwgRWsf+Q4ziPhR38ywIUzwETRHTeKpoMlAZwdGpqqjdoJAILVSaTOSaEuG2tAExeZv4GwDNSSnO7978WCOB53p3/FJahtQQwuX3fn2hoaLgikUjkl3sJO5HB87wviGjbGkO8JKU0FwqVjYCJ1lqbQ/WrawgwPz8/39rd3f1DVQDFqvwVEV2+RhBvSSkfLJfbarfped7D5j6z1gDmUE9E25VS364IwNxOeJ53gohurCUEgD7HcfYH5bQaASPguu42AJ8R0aYaQXydz+c7UqnUbCQARYhHAByqAcAcM++0OdhYj8Ci6YAfFpFwMTMD6JVSHrERrBjAfA9a64MA9lgkWCCin33fjwkhtljG75ZSvmER+29IxQCLwlrrJ5j5ZQAXLUt2GoDZBA5OTU2dTqfT86Y/l8s15PP5nQDuN1fzRHThsue+NL+iKjmNrQigWOQuJiJzbX4VgO8AjHZ1deXC3l6xttxslkjz35iZc/F4fKjUViFMq+oRCBOuVf+GB/gb9M3GQJMHYpQAAAAASUVORK5CYII="
          />
          <Text variant="normal" color="text100">
            Apple ({acc.email})
          </Text>
        </Box>
      )
    default:
      return 'Unknown'
  }
}

export function ListAccountsView() {
  const toast = useToast()

  const [currentAccount, setCurrentAccount] = useState<Account>()
  const [accounts, setAccounts] = useState<Account[]>()
  const [loading, setLoading] = useState<boolean>(true)

  const [error, setError] = useState<string>()

  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isEmailValid = inputRef.current?.validity.valid
  const [showEmailWarning, setEmailWarning] = useState(false)
  const [code, setCode] = useState<string[]>([])

  const {
    inProgress: emailAuthInProgress,
    loading: emailAuthLoading,
    initiateAuth: initiateEmailAuth,
    sendChallengeAnswer
  } = useEmailAuth({
    sessionName: randomName(),
    onSuccess: async ({ wallet }) => {
      console.log(`Wallet address: ${wallet}`)
    },
    linkAccount: true
  })

  const removeAccount = async (id: string) => {
    setLoading(true)
    setAccounts(undefined)
    try {
      await sequence.removeAccount(id)
      const response = await sequence.listAccounts()
      setAccounts(response.accounts)
    } catch (e: any) {
      setError(e.message)
      const response = await sequence.listAccounts()
      setAccounts(response.accounts)
    }

    setLoading(false)
  }

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const challenge = await sequence.initAuth({ idToken: tokenResponse.credential! })

    try {
      const linkResponse = await sequence.linkAccount(challenge)
      setAccounts(accounts => [...(accounts || []), linkResponse.account])
    } catch (e) {
      if (isAccountAlreadyLinkedError(e)) {
        toast({
          title: 'Account already linked',
          description: 'This account is already linked to another wallet',
          variant: 'error'
        })
      }
    }
  }

  const appleRedirectUri =
    'https://' + window.location.host + (window.location.host.includes('github.io') ? '/demo-waas-auth' : '/')
  const handleAppleLogin = async (response: { authorization: { id_token: string } }) => {
    const challenge = await sequence.initAuth({ idToken: response.authorization.id_token })
    try {
      const linkResponse = await sequence.linkAccount(challenge)
      setAccounts(accounts => [...(accounts || []), linkResponse.account])
    } catch (e) {
      if (isAccountAlreadyLinkedError(e)) {
        toast({
          title: 'Account already linked',
          description: 'This account is already linked to another wallet',
          variant: 'error'
        })
      }
    }
  }

  const handleGooglePlayfabLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: tokenResponse => {
      ;(window as any).PlayFabClientSDK.LoginWithGoogleAccount(
        {
          AccessToken: tokenResponse.access_token, // This access token is generated after a user has signed into Google
          CreateAccount: true,
          TitleId: import.meta.env.VITE_PLAYFAB_TITLE_ID
        },
        async (response?: { data: { SessionTicket: string } }, error?: Error) => {
          if (response) {
            try {
              const challange = await sequence.initAuth({
                playFabTitleId: import.meta.env.VITE_PLAYFAB_TITLE_ID,
                playFabSessionTicket: response.data.SessionTicket
              })

              const linkResponse = await sequence.linkAccount(challange)

              console.log('playfab account', JSON.stringify(linkResponse.account, null, 2))

              setAccounts(accounts => [...(accounts || []), linkResponse.account])
            } catch (e) {
              console.error(e)

              if (isAccountAlreadyLinkedError(e)) {
                toast({
                  title: 'Account already linked',
                  description: 'This account is already linked to another wallet',
                  variant: 'error'
                })
              }
            }
          } else if (error) {
            console.log('Error: ' + JSON.stringify(error))
          }
        }
      )
    }
  })

  useEffect(() => {
    sequence
      .listAccounts()
      .then(response => {
        setAccounts(response.accounts)

        if (response.currentAccountId) {
          setCurrentAccount(response.accounts.find(account => account.id === response.currentAccountId))
        }

        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [emailAuthInProgress])

  return (
    <Box>
      <Divider background="buttonGlass" />
      <Box marginBottom="5" gap="4" flexDirection="column">
        <Text variant="normal" color="text100" fontWeight="bold">
          Your connected (linked) accounts
        </Text>
        {accounts && (
          <>
            {accounts.map(a => (
              <Box key={a.id} flexDirection="row" alignItems="center" gap="2">
                <Text variant="normal" color="text100">
                  {accountToName(a)}
                </Text>
                {a.id !== currentAccount?.id && <Button size="xs" label="Remove" onClick={() => removeAccount(a.id)} />}
                {a.id === currentAccount?.id && (
                  <Box>
                    <Text variant="small" color="text100">
                      (Account you logged in with)
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}
        {loading && <Spinner />}
      </Box>

      <Divider background="buttonGlass" />

      <Box flexDirection="column" gap="2" width="fit">
        <Text variant="large" color="text100" fontWeight="bold" marginBottom="5">
          Connect (link) another login method
        </Text>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && <GoogleLogin onSuccess={handleGoogleLogin} shape="circle" width={230} />}
        <Divider background="buttonGlass" width="full" />
        {import.meta.env.VITE_APPLE_CLIENT_ID && (
          <AppleSignin
            authOptions={{
              clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
              scope: 'openid email',
              redirectURI: appleRedirectUri,
              usePopup: true
            }}
            onError={(error: any) => console.error(error)}
            onSuccess={handleAppleLogin}
            uiType="dark"
          />
        )}

        {import.meta.env.VITE_PLAYFAB_TITLE_ID && (
          <>
            <Divider background="buttonGlass" width="full" />
            <Box marginTop="2">
              <Box>
                <Button label="Login with Google (through Playfab)" onClick={handleGooglePlayfabLogin} />
              </Box>
            </Box>
          </>
        )}

        <Divider background="buttonGlass" width="full" />

        <Box marginTop="2">
          <Text variant="normal" color="text100" fontWeight="bold">
            Email
          </Text>
        </Box>

        {sendChallengeAnswer ? (
          <Box flexDirection="column">
            <Box marginTop="3">
              <Text marginTop="5" variant="normal" color="text80">
                Enter code received in email.
              </Text>
            </Box>
            <Box marginTop="4">
              <PINCodeInput value={code} digits={6} onChange={setCode} />
            </Box>

            <Box gap="2" marginY="4">
              {emailAuthLoading ? (
                <Spinner />
              ) : (
                <Button
                  variant="primary"
                  disabled={code.includes('')}
                  label="Verify"
                  onClick={() => sendChallengeAnswer(code.join(''))}
                  data-id="verifyButton"
                />
              )}
            </Box>
          </Box>
        ) : (
          <Box marginBottom="4">
            <Text variant="normal" color="text80">
              Enter your email to recieve a code to login and create your wallet. <br />
              Please check your spam folder if you don't see it in your inbox.
            </Text>

            <Box marginTop="6">
              <TextInput
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
              />
              {showEmailWarning && (
                <Text as="p" variant="small" color="negative" marginY="2">
                  Invalid email address
                </Text>
              )}
            </Box>
            <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
              {emailAuthLoading ? (
                <Spinner />
              ) : (
                <Button
                  variant="primary"
                  disabled={!isEmailValid}
                  label="Continue"
                  onClick={() => initiateEmailAuth(email)}
                  data-id="continueButton"
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
      {error && (
        <Text variant="normal" color="text100" fontWeight="bold">
          Error loading accounts: {error}
        </Text>
      )}
    </Box>
  )
}
