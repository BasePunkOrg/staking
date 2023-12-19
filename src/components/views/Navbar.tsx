/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
// import logo from "../assets/logo.png";
// import { useMediaQuery } from "react-responsive";
// import { WalletMultiButton, } from "@solana/wallet-adapter-react-ui";
// import WalletBtnImg from '../assets/wallet-icon.png';
// import { useMemo, useState } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
const Navbar = () => {
  //Media Quearry
  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 950px)" });
  // const { publicKey, wallet, disconnect } = useWallet();
  // const base58 = useMemo(() => publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58(), [publicKey]);
  // const content = useMemo(() => {
  //   if (!wallet || !base58)
  //     return null;
  //   return base58.slice(0, 4) + '..' + base58.slice(-4);
  // }, [wallet, base58]);

  return (
    <div>
      {/* <WalletMultiButton className="wallet-btn"
        style={{ background: 'transparent' }}
      > */}
        {/* {wallet ? content : <img src={WalletBtnImg} style={{ width: 150 }} />}
      </WalletMultiButton> */}
    </div>
  );
};

export default Navbar;
