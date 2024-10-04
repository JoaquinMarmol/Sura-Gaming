import { Box } from '@0xsequence/design-system'
import '../Login/login.css'

function Welcome() {
  return (
    <div className="welcome-page">
      <Box marginY="0" marginX="auto" flexDirection={'column'} justifyContent={'center'} alignItems={'center'} style={{ maxWidth: '720px',}}>
        <img src="/image.png" alt="" className="welcome-page__header-img" />
        <h1 className="welcome-page__title">¡El futuro del gaming!</h1>
        <div className="welcome-page__buttons">
          <a className="signup-button" href="./#/register">Crear cuenta</a>
          <a className="login-button" href="./#/login">Iniciar sesion</a>
        </div>
      </Box>
    </div>
  )
}

export default Welcome