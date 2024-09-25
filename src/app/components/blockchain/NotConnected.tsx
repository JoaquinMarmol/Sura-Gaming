import { useOpenConnectModal } from "@0xsequence/kit";

const NotConnected = () => {
  const { setOpenConnectModal } = useOpenConnectModal();
  const onClickConnect = () => {
    setOpenConnectModal(true);
  };

  return (
    <>
      <div className="card">
        <button onClick={onClickConnect}>Sign in</button>
      </div>
    </>
  );
};

export default NotConnected;
