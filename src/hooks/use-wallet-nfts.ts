/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useWallet } from '@solana/wallet-adapter-react';
// import { PublicKey } from '@solana/web3.js';
// import { useEffect, useState } from 'react';
// // import { getNftsForOwner1 } from '../utils/candy-machine';
// import useWalletBalance from './use-wallet-balance';

// const useWalletNfts = () => {
// 	const [balance] = useWalletBalance();
// 	// const wallet = useWallet();
// 	const [isLoadingWalletNfts, setIsLoadingWalletNfts] = useState(false);
// 	const [walletNfts, setWalletNfts] = useState<any[]>([]);

// 	useEffect(() => {
// 		getWalletNfts()
// 	}, [wallet?.publicKey, balance]);

// 	const getWalletNfts = async () => {
// 		try {
// 			if (
// 				!wallet ||
// 				!wallet.publicKey ||
// 				!wallet.signAllTransactions ||
// 				!wallet.signTransaction
// 			) {
// 				return;
// 			}
// 			setIsLoadingWalletNfts(true);
// 			// const nftsForOwner = await getNftsForOwner1(wallet?.publicKey);

// 			// const nftsForOwner = await getNftsForOwner(connection, wallet.publicKey);
// 			// setWalletNfts(nftsForOwner);
// 			setIsLoadingWalletNfts(false);
// 		}
// 		catch (err) {
// 		}
// 	}
// 	return { isLoadingWalletNfts, walletNfts, setWalletNfts, getWalletNfts };
// }

// export default useWalletNfts;