// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable eqeqeq */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
// import { useEffect, useState } from "react";
// // import * as anchor from "@project-serum/anchor";
// // import useWalletBalance from "./use-wallet-balance";
// // import {
// //   TOKEN_PROGRAM_ID,
// //   ASSOCIATED_TOKEN_PROGRAM_ID,
// //   Token,
// // } from "@solana/spl-token";
// import { NodeWallet, programs } from "@metaplex/js";
// // import toast from "react-hot-toast";
// // import {
// //   Keypair,
// //   PublicKey,
// //   Transaction,
// //   ConfirmOptions,
// //   LAMPORTS_PER_SOL,
// //   Connection,
// // } from "@solana/web3.js";
// // import * as splToken from "@solana/spl-token";
// import axios from "axios";
// import {
//   STAKE_DATA_SIZE,
//   STAKE_CONTRACT_IDL,
//   COLLECTION_NAME,
//   CREATOR,
// } from "../constant/contract";
// import {
//   NEXT_PUBLIC_SOLANA_NETWORK,
//   NEXT_PUBLIC_STAKE_CONTRACT_ID,
//   RPC_URL,
// } from "../constant/env";
// // import { printLog } from "../utils/utility";
// // import { makeTransaction, sendTransactions, signAndSendTransactions } from "../helpers/sol/connection";
// // import { getNftsForOwner1 } from "../utils/candy-machine";

// const {
//   metadata: { Metadata },
// } = programs;
// const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
//   "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
// );
// // const connection = new anchor.web3.Connection(
// //   NEXT_PUBLIC_SOLANA_NETWORK == "devnet"
// //     ? "https://metaplex.devnet.rpcpool.com"
// //     : "https://metaplex.mainnet.rpcpool.com"
// // );

// const connection = new anchor.web3.Connection(
//   RPC_URL
// );


// // const programId = new PublicKey(NEXT_PUBLIC_STAKE_CONTRACT_ID!);
// const idl = STAKE_CONTRACT_IDL as anchor.Idl;
// // const confirmOption: ConfirmOptions = {
// //   commitment: "finalized",
// //   preflightCommitment: "finalized",
// //   skipPreflight: false,
// // };

// const GLOBAL_AUTHORITY_SEED = "global-authority-1";
// const USER_POOL_SEED = "user-pool";
// const USER_POOL_DATA_SEED = "user-pool-data";
// // Global Authority key : 2fq64eEiTJr3J5vSTNr8SABQRSNM1QA2AvepgsfBoFNu
// const REWARD_TOKEN = "B4giMGA7DZSQTniJfYiMvKGg7wPF77T8kj9dAAZfcZtG";
// // const rewardMint = new PublicKey(REWARD_TOKEN);
// const DAY_TIME = 60 * 60 * 24; // 1 mins

// const createAssociatedTokenAccountInstruction = (
//   associatedTokenAddress: anchor.web3.PublicKey,
//   payer: anchor.web3.PublicKey,
//   walletAddress: anchor.web3.PublicKey,
//   splTokenMintAddress: anchor.web3.PublicKey
// ) => {
//   const keys = [
//     { pubkey: payer, isSigner: true, isWritable: true },
//     { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
//     { pubkey: walletAddress, isSigner: false, isWritable: false },
//     { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
//     {
//       pubkey: anchor.web3.SystemProgram.programId,
//       isSigner: false,
//       isWritable: false,
//     },
//     // { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
//     {
//       pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
//       isSigner: false,
//       isWritable: false,
//     },
//   ];
//   return new anchor.web3.TransactionInstruction({
//     keys,
//     // programId: ASSOCIATED_TOKEN_PROGRAM_ID,
//     data: Buffer.from([]),
//   });
// };

// // const sendTransaction = async (
// //   transaction: Transaction,
// //   signers: Keypair[],
// //   wallet: AnchorWallet
// // ) => {
// //   try {
// //     transaction.feePayer = wallet.publicKey;
// //     transaction.recentBlockhash = (
// //       await connection.getRecentBlockhash("max")
// //     ).blockhash;
// //     await transaction.setSigners(
// //       wallet.publicKey,
// //       ...signers.map((s) => s.publicKey)
// //     );
// //     if (signers.length != 0) await transaction.partialSign(...signers);
// //     const signedTransaction = await wallet.signTransaction(transaction);
// //     let hash = await connection.sendRawTransaction(
// //       await signedTransaction.serialize()
// //     );
// //     const result = await connection.confirmTransaction(hash);
// //     if (result.value.err)
// //       toast.error("Transaction failed. Please try again.");
// //     else
// //       toast.success("Transaction succeed.");
// //   } catch (err) {
// //     toast.error("Transaction failed. Please try again.");
// //   }
// // };

// // const getTokenWallet = async (
// //   wallet: anchor.web3.PublicKey,
// //   mint: anchor.web3.PublicKey
// // ) => {
// //   return (
// //     await anchor.web3.PublicKey.findProgramAddress(
// //       [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
// //       ASSOCIATED_TOKEN_PROGRAM_ID
// //     )
// //   )[0];
// // };

// // const getMetadata = async (
// //   mint: anchor.web3.PublicKey
// // ): Promise<anchor.web3.PublicKey> => {
// //   return (
// //     await anchor.web3.PublicKey.findProgramAddress(
// //       [
// //         Buffer.from("metadata"),
// //         TOKEN_METADATA_PROGRAM_ID.toBuffer(),
// //         mint.toBuffer(),
// //       ],
// //       TOKEN_METADATA_PROGRAM_ID
// //     )
// //   )[0];
// // };

// // const getStakedNftsForOwner = async (wallet: AnchorWallet) => {
// //   let allTokens: any = [];
// //   try {
// //     const provider = new anchor.Provider(
// //       connection,
// //       wallet,
// //       anchor.Provider.defaultOptions()
// //     );
// //     const program = new anchor.Program(idl, programId, provider);
// //     let [userPool] = await PublicKey.findProgramAddress(
// //       [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
// //       program.programId
// //     );
// //     allTokens = getNftsForOwner1(userPool);
// //   }
// //   catch (error) {
// //   }
  
// //   return allTokens;
// // };

// // const getStakedNftsForOwner1 = async (wallet: AnchorWallet) => {
// //   const provider = new anchor.Provider(
// //     connection,
// //     wallet,
// //     anchor.Provider.defaultOptions()
// //   );
// //   const program = new anchor.Program(idl, programId, provider);

// //   const allTokens: any = [];
// //   try {
// //     let resp = await connection.getProgramAccounts(programId, {
// //       dataSlice: {
// //         length: 0,
// //         offset: 0,
// //       },
// //       filters: [
// //         {
// //           dataSize: STAKE_DATA_SIZE,
// //         },
// //         {
// //           memcmp: {
// //             offset: 8,
// //             bytes: wallet.publicKey.toBase58(),
// //           },
// //         },
// //       ],
// //     });

// //     for (let nftAccount of resp) {
// //       let stakedNft = await program.account.userPool.fetch(nftAccount.pubkey);
// //       if (stakedNft.itemCount == 0) {
// //         continue;
// //       }

// //       for (let i = 0; i < stakedNft.itemCount; i++) {
// //         let mint = stakedNft.nftMintList[i];
// //         let pda = await getMetadata(mint);
// //         const accountInfo: any = await connection.getParsedAccountInfo(pda);
// //         let metadata: any = new Metadata(
// //           wallet.publicKey.toString(),
// //           accountInfo.value
// //         );
// //         const { data }: any = await axios.get(metadata.data.data.uri);
// //         const entireData = {
// //           ...data,
// //           id: Number(data.name.replace(/^\D+/g, "").split(" - ")[0]),
// //         };
// //         allTokens.push({
// //           poolKey: nftAccount.pubkey,
// //           address: mint,
// //           ...entireData,
// //         });
// //       }
// //     }
// //   } catch (e) {
// //   }
// //   return allTokens;
// // };

// // const getPoolInfo = async (wallet: AnchorWallet) => {
// //   const provider = new anchor.Provider(
// //     connection,
// //     wallet,
// //     anchor.Provider.defaultOptions()
// //   );
// //   const program = new anchor.Program(idl, programId, provider);
// //   let userPoolInfo = null;
// //   // for (let stakeAccount of resp) {
// //   let [userPool] = await PublicKey.findProgramAddress(
// //     [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
// //     program.programId
// //   );
// //   try {
// //     userPoolInfo = await program.account.userPool.fetch(userPool);
// //   } catch { }
// //   return userPoolInfo;
// // };

// // const getGlobalInfo = async () => {
// //   const provider = new anchor.Provider(
// //     connection,
// //     new NodeWallet(new Keypair()),
// //     anchor.Provider.defaultOptions()
// //   );
// //   const program = new anchor.Program(idl, programId, provider);
// //   let globalInfo = null;
// //   // for (let stakeAccount of resp) {
// //   let [globalAuthority] = await PublicKey.findProgramAddress(
// //     [Buffer.from(GLOBAL_AUTHORITY_SEED)],
// //     program.programId
// //   );

// //   try {
// //     globalInfo = await program.account.globalPool.fetch(globalAuthority); //
// //   } catch (err) {
// //   }
// //   return globalInfo;
// // };

// // const _stakeNftList = async (
// //   wallet: AnchorWallet,
// //   stakeMode: any,
// //   nftMintList: any
// // ) => {
// //   let provider = new anchor.Provider(
// //     connection,
// //     wallet,
// //     anchor.Provider.defaultOptions()
// //   );
// //   let program = new anchor.Program(idl, programId, provider);
// //   let [userPool] = await PublicKey.findProgramAddress(
// //     [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
// //     program.programId
// //   );
// //   // let transaction = new Transaction();
// //   // let signers: Keypair[] = [];

// //   try {
// //     let transactions: Transaction[] = [];

// //     let userPoolInfo = await getPoolInfo(wallet);

// //     if (userPoolInfo == null) {
// //       let instructions: any[] = [];
// //       instructions.push(
// //         await program.instruction.initUserPool({
// //           accounts: {
// //             owner: wallet.publicKey,
// //             userPool: userPool,
// //             systemProgram: anchor.web3.SystemProgram.programId,
// //           },
// //         })
// //       );

// //       const transaction = await makeTransaction(connection, instructions, [], wallet?.publicKey);
// //       transactions.push(transaction);
// //     }

// //     const [globalAuthority] = await PublicKey.findProgramAddress(
// //       [Buffer.from(GLOBAL_AUTHORITY_SEED)],
// //       program.programId
// //     );

// //     for (let i = 0; i < nftMintList.length; i++) {
// //       let instructions: any[] = [];
// //       let nftMint = nftMintList[i];

// //       const sourceNftAccount = nftMint.account;
// //       const destNftAccount = await getTokenWallet(
// //         userPool,
// //         nftMint.address
// //       );
      

// //       if ((await connection.getAccountInfo(destNftAccount)) == null) {
// //         // transaction.add(createAssociatedTokenAccountInstruction(destNftAccount, wallet.publicKey, globalAuthority, nftMint.address))
// //         instructions.push(
// //           createAssociatedTokenAccountInstruction(
// //             destNftAccount,
// //             wallet.publicKey,
// //             userPool,
// //             nftMint.address
// //           )
// //         );
// //       }

// //       let [userPoolData] = await PublicKey.findProgramAddress(
// //         [
// //           Buffer.from(USER_POOL_DATA_SEED),
// //           wallet.publicKey.toBuffer(),
// //           nftMint.address.toBuffer(),
// //         ],
// //         program.programId
// //       );

// //       instructions.push(
// //         await program.instruction.stakeNft({
// //           accounts: {
// //             owner: wallet.publicKey,
// //             userPool: userPool,
// //             userPoolData: userPoolData,
// //             globalAuthority: globalAuthority,
// //             nftMint: nftMint.address,
// //             sourceNftAccount: sourceNftAccount,
// //             destNftAccount: destNftAccount,
// //             tokenProgram: TOKEN_PROGRAM_ID,
// //             systemProgram: anchor.web3.SystemProgram.programId,
// //           },
// //         })
// //       );

      
// //       const transaction = await makeTransaction(connection, instructions, [], wallet?.publicKey);
// //       transactions.push(transaction);
// //     }

// //     const result = await signAndSendTransactions(
// //       connection,
// //       wallet,
// //       transactions,
// //     );

// //     if (result?.length > 0) {
// //       toast.success("Transaction succeed.");
// //       return 1;
// //     }
// //     else {
// //       toast.error("Transaction failed.");
// //       return 0;  
// //     }
// //   } catch (err) {
// //     toast.error("Transaction failed.");
// //     return 0;
// //   }
// //   // await sendTransaction(transaction, signers, wallet);
// // };

// // function delay(ms: any) {
// //   return new Promise((resolve) => {
// //     setTimeout(resolve, ms);
// //   });
// // }

// // const stake = async (
// //   PoolKey: PublicKey,
// //   nftMint: PublicKey,
// //   wallet: AnchorWallet
// // ) => {
// //   let provider = new anchor.Provider(connection, wallet, confirmOption);
// //   let program = new anchor.Program(idl, programId, provider);

// //   const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
// //     [Buffer.from(GLOBAL_AUTHORITY_SEED)],
// //     program.programId
// //   );

// //   const sourceNftAccount = await getTokenWallet(wallet.publicKey, nftMint);
// //   const destNftAccount = await getTokenWallet(PoolKey, nftMint);
// //   let transaction = new Transaction();
// //   let signers: Keypair[] = [];
// //   let [userPoolData] = await PublicKey.findProgramAddress(
// //     [
// //       Buffer.from(USER_POOL_DATA_SEED),
// //       wallet.publicKey.toBuffer(),
// //       nftMint.toBuffer(),
// //     ],
// //     program.programId
// //   );

// //   if ((await connection.getAccountInfo(destNftAccount)) == null)
// //     transaction.add(
// //       createAssociatedTokenAccountInstruction(
// //         destNftAccount,
// //         wallet.publicKey,
// //         PoolKey,
// //         nftMint
// //       )
// //     );
// //   transaction.add(
// //     await program.instruction.stakeNft(globalBump, 0, {
// //       accounts: {
// //         owner: wallet.publicKey,
// //         userPool: PoolKey,
// //         userPoolData: userPoolData,
// //         globalAuthority: globalAuthority,
// //         nftMint: nftMint,
// //         sourceNftAccount: sourceNftAccount,
// //         destNftAccount: destNftAccount,
// //         tokenProgram: TOKEN_PROGRAM_ID,
// //         systemProgram: anchor.web3.SystemProgram.programId,
// //       },
// //     })
// //   );
// //   await sendTransaction(transaction, signers, wallet);
// // };

// // const unStake = async (nfts: any[], wallet: AnchorWallet) => {
// //   let provider = new anchor.Provider(
// //     connection,
// //     wallet,
// //     anchor.Provider.defaultOptions()
// //   );
// //   let program = new anchor.Program(idl, programId, provider);

// //   const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
// //     [Buffer.from(GLOBAL_AUTHORITY_SEED)],
// //     program.programId
// //   );

// //   let [userPool, userBump] = await PublicKey.findProgramAddress(
// //     [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
// //     program.programId
// //   );

// //   let transactions: Transaction[] = [];

// //   // let transaction = new Transaction();
// //   for (let i = 0; i < nfts.length; i++) {
// //     let instructions: any[] = [];
// //     let destAccount = await getTokenWallet(wallet.publicKey, nfts[i].address);
// //     let sourceAccount = await getTokenWallet(userPool, nfts[i].address);

// //     if ((await connection.getAccountInfo(destAccount)) == null) {
// //       // transaction.add(createAssociatedTokenAccountInstruction(destAccount, wallet.publicKey, wallet.publicKey, nfts[i].address))
// //       instructions.push(
// //         createAssociatedTokenAccountInstruction(
// //           destAccount,
// //           wallet.publicKey,
// //           wallet.publicKey,
// //           nfts[i].address
// //         )
// //       );
// //     }

// //     let [userPoolData] = await PublicKey.findProgramAddress(
// //       [
// //         Buffer.from(USER_POOL_DATA_SEED),
// //         wallet.publicKey.toBuffer(),
// //         nfts[i].address.toBuffer(),
// //       ],
// //       program.programId
// //     );

// //     instructions.push(
// //       await program.instruction.unstakeNft(userBump, {
// //         accounts: {
// //           owner: wallet.publicKey,
// //           userPool: userPool,
// //           userPoolData: userPoolData,
// //           globalAuthority: globalAuthority,
// //           nftMint: nfts[i].address,
// //           sourceNftAccount: sourceAccount,
// //           destNftAccount: destAccount,
// //           tokenProgram: TOKEN_PROGRAM_ID,
// //         },
// //       })
// //     );
// //     const transaction = await makeTransaction(connection, instructions, [], wallet.publicKey);

// //     transactions.push(transaction);
// //   }

// //   // await sendTransaction(transaction, [], wallet);
// //   try {
// //     const result = await signAndSendTransactions(
// //       connection,
// //       wallet,
// //       transactions,
// //     );

// //     if (result?.length > 0) {
// //       toast.success("Transaction succeed.");
// //       return 1;
// //     }
// //     else {
// //       toast.error("Transaction failed.");
// //       return 0;  
// //     }
// //   } catch (err) {
// //     toast.error("Transaction failed.");
// //     return 0;
// //   }
// // };

// // async function 
// // claim(index: Number, wallet: AnchorWallet) {
// //   let provider = new anchor.Provider(connection, wallet, confirmOption);
// //   let program = new anchor.Program(idl, programId, provider);

// //   const [globalAuthority] = await PublicKey.findProgramAddress(
// //     [Buffer.from(GLOBAL_AUTHORITY_SEED)],
// //     program.programId
// //   );

// //   // var myToken = new Token(
// //   //   connection,
// //   //   rewardMint,
// //   //   TOKEN_PROGRAM_ID,
// //   //   wallet as any
// //   // );
// //   // let sourceRewardAccount = await getTokenWallet(globalAuthority, rewardMint);
// //   // let sourceRewardAccount = new PublicKey("3EgS7Kd3MNGxLC3FHBqKytx6mZEuxTkmswBabKMeTCzw");

// //   // let srcAccInfo = await myToken.getAccountInfo(globalAuthority);
// //   // console.log('claim srcAccInfo',srcAccInfo.address.toString())
// //   // if (!srcAccInfo) {
// //   //   return;
// //   // }

// //   let transaction = new Transaction();

// //   // let destRewardAccount = await withFindOrInitAssociatedTokenAccount(
// //   //   transaction,
// //   //   provider.connection,
// //   //   rewardMint,
// //   //   wallet.publicKey,
// //   //   wallet.publicKey,
// //   //   true
// //   // );


// //   let [userPool] = await PublicKey.findProgramAddress(
// //     [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer()],
// //     program.programId
// //   );

// //   let [userPoolAllocate] = await PublicKey.findProgramAddress(
// //     [Buffer.from(USER_POOL_SEED), wallet.publicKey.toBuffer(), (new anchor.BN(index.toString())).toArrayLike(Buffer, "le", 8)],
// //     program.programId
// //   );

// //   const [globalEscrow] = await PublicKey.findProgramAddress(
// //     [Buffer.from(anchor.utils.bytes.utf8.encode('escrow-cjh'))],
// //     program.programId
// //   );

// //   transaction.add(
// //     await program.instruction.claimReward({
// //       accounts: {
// //         globalAuthority: globalAuthority,
// //         userPool: userPool,
// //         userPoolAllocate: userPoolAllocate,
// //         owner: wallet.publicKey,
// //         sourceAccount: globalEscrow,
// //         tokenProgram: TOKEN_PROGRAM_ID,
// //         systemProgram: anchor.web3.SystemProgram.programId,
// //       },
// //     })
// //   );
// //   try {
// //     await sendTransaction(transaction, [], wallet);
// //   } catch (err: any) {
// //     printLog(err.reason || err.error?.message || err.message);
// //   }
// // }

// // const useNftStake = () => {
// //   const [balance, setBalance] = useWalletBalance();
// //   const anchorWallet = useAnchorWallet();
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [stakedNfts, setStakedNfts] = useState<Array<any>>([]);
// //   // const [claimedAmount, setClaimedAmount] = useState(0);
// //   // const [dailyReward, setDailyReward] = useState(0);
// //   const [claimAmount, setClaimAmount] = useState(0);
// //   const [totalStakedNFT, setTotalStakedNFT] = useState(0);
// //   const [rewardedTime, setRewardedTime] = useState(0);
// //   const [globalInterval, setGlobalInterval] = useState<any>(null);

// //   useEffect(() => {
// //     getStakedNfts();
// //   }, [anchorWallet, balance]);

// //   useEffect(() => {
// //     const interval = setInterval(async () => {
// //       try {
// //         if (
// //           !anchorWallet ||
// //           !anchorWallet.publicKey ||
// //           !anchorWallet.signAllTransactions ||
// //           !anchorWallet.signTransaction
// //         ) {
// //           return;
// //         }
// //         let poolInfo = await getPoolInfo(anchorWallet);
// //         if (poolInfo != null) {
// //           let days = 0;
// //           if (Math.floor(Date.now() / 1000) > poolInfo.rewardTime.toNumber()) {
// //             days =
// //               (Math.floor(Date.now() / 1000) - poolInfo.rewardTime.toNumber()) /
// //               DAY_TIME;
// //           }
// //           let reward =
// //             poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL +
// //             poolInfo.stakedCount * days;
// //           setClaimAmount(Math.floor(reward * 100) / 100);
// //           // console.log('This will run every second!', get_daily_reward(poolInfo.stakedCount), Math.floor(Date.now() / 1000), poolInfo.rewardTime.toNumber());
// //         }
// //       } catch (err) {
// //       }
// //     }, 10000);
// //     return () => clearInterval(interval);
// //   }, [anchorWallet]);

// //   const getStakedNfts = async () => {
// //     try {
// //       setIsLoading(true);
// //       if (globalInterval) {
// //         clearInterval(globalInterval);
// //       }
// //       const interval = setInterval(async () => {
// //         let globalInfo = await getGlobalInfo();
// //         setTotalStakedNFT(globalInfo?.stakedCount);
// //       }, 1000);
// //       setGlobalInterval(interval);
     
// //       if (
// //         !anchorWallet ||
// //         !anchorWallet.publicKey ||
// //         !anchorWallet.signAllTransactions ||
// //         !anchorWallet.signTransaction
// //       ) {
// //         setIsLoading(false);
// //         return;
// //       }
// //       const stakedNftsForOwner = await getStakedNftsForOwner(anchorWallet);
// //       setStakedNfts(stakedNftsForOwner);
// //       const poolInfo = await getPoolInfo(anchorWallet);
// //       if (poolInfo != null) {
// //         setClaimAmount(Math.floor(poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL * 100) / 100);
// //         setRewardedTime(poolInfo.rewardTime.toNumber());
// //       }
// //     } catch(error) {
// //     }

// //     setIsLoading(false);
// //   }
  
// //   const get_daily_reward_multiplier = (cnt: number) => {
// //     let res = 0.0;
// //     if (cnt == 1) {
// //       res = 1;
// //     } else if (cnt == 2) {
// //       res = 1.25;
// //     } else if (cnt == 4) {
// //       res = 1.5;
// //     } else if (cnt == 6) {
// //       res = 1.75;
// //     } else if (cnt == 8) {
// //       res = 2;
// //     }
// //     return res;
// //   };

// //   const get_daily_reward = (staked_count: number) => {
// //     let rest = staked_count % 8;
// //     let daily_reward = 0;
// //     if (rest % 2 == 0) {
// //       daily_reward =
// //         8.0 * 2.0 * 2.0 * Math.floor(staked_count / 8) +
// //         rest * 2.0 * get_daily_reward_multiplier(rest);
// //     } else {
// //       daily_reward =
// //         8.0 * 2.0 * 2.0 * Math.floor(staked_count / 8) +
// //         (rest - 1) * 2.0 * get_daily_reward_multiplier(rest - 1) +
// //         1.0 * 2.0 * 1.0;
// //     }
// //     // let days = (now - self.reward_time) / DAY_TIME;
// //     // self.total_reward = self.total_reward + daily_reward as u64 * days as u64 * DECIMAL;
// //     // self.reward_time = now;
// //     // Ok(self.total_reward)
// //     return daily_reward;
// //   };

// //   const updateBalance = async (wallet: AnchorWallet) => {
// //     const balance = await connection.getBalance(wallet.publicKey);
// //     setBalance(balance / LAMPORTS_PER_SOL);
// //   };

// //   const stakeNftList = async (stakeMode: any, nftMintList: any) => {
// //     if (!anchorWallet) {
// //       toast.error("Connect wallet first, please.");
// //       return 0;
// //     }
// //     setIsLoading(true);
// //     try {
// //       const res = await _stakeNftList(anchorWallet, stakeMode, nftMintList);
// //       // await updateBalance(anchorWallet);
// //       if (res == 1) {
// //         const poolInfo = await getPoolInfo(anchorWallet);
// //         if (poolInfo != null) {
// //           // setClaimAmount(poolInfo.stakedCount);
         
// //           setClaimAmount(Math.floor(poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL * 100) / 100);
// //           setRewardedTime(poolInfo.rewardTime.toNumber());
// //         }
// //       }
// //       setIsLoading(false);
// //       return res;
// //     } catch (err) {
// //       setIsLoading(false);
// //       return 0;
// //     }
// //   };

// //   const stakeNft = async (PoolKey: PublicKey, nftMint: PublicKey) => {
// //     if (!anchorWallet) {
// //       toast.error("Connect wallet first, please.");
// //       return;
// //     }

// //     setIsLoading(true);

// //     await stake(PoolKey, nftMint, anchorWallet);
// //     // await updateBalance(anchorWallet);

// //     setIsLoading(false);
// //   };

// //   const unStakeNft = async (nfts: any[]) => {
// //     if (!anchorWallet) {
// //       toast.error("Connect wallet first, please.");
// //       return;
// //     }
// //     setIsLoading(true);
// //     const res = await unStake(nfts, anchorWallet);
// //     if (res == 1) {
// //       const poolInfo = await getPoolInfo(anchorWallet);
// //       if (poolInfo != null) {
       
// //         setClaimAmount(Math.floor(poolInfo.totalReward.toNumber() / LAMPORTS_PER_SOL * 100) / 100);
// //         setRewardedTime(poolInfo.rewardTime.toNumber());
// //       }
// //     }
// //     setIsLoading(false);
// //     return res;
// //   };

// //   const claimRewards = async (index: Number) => {
// //     if (!anchorWallet) {
// //       toast.error("Connect wallet first, please.");
// //       return;
// //     }

// //     setIsLoading(true);
// //     await claim(index, anchorWallet);
// //     setIsLoading(false);
// //   };

// //   return {
// //     isLoading,
// //     stakedNfts,
// //     claimAmount,
// //     totalStakedNFT,
// //     stakeNftList,
// //     stakeNft,
// //     unStakeNft,
// //     claimRewards,
// //     getStakedNfts,
// //     setStakedNfts,
// //   };
// // };

// // async function withFindOrInitAssociatedTokenAccount(
// //   transaction: Transaction,
// //   connection: Connection,
// //   mint: PublicKey,
// //   owner: PublicKey,
// //   payer: PublicKey,
// //   allowOwnerOffCurve: boolean
// // ) {
// //   const associatedAddress = await splToken.Token.getAssociatedTokenAddress(
// //     splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
// //     splToken.TOKEN_PROGRAM_ID,
// //     mint,
// //     owner,
// //     allowOwnerOffCurve
// //   );
// //   const account = await connection.getAccountInfo(associatedAddress);
// //   if (!account) {
// //     transaction.add(
// //       splToken.Token.createAssociatedTokenAccountInstruction(
// //         splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
// //         splToken.TOKEN_PROGRAM_ID,
// //         mint,
// //         associatedAddress,
// //         owner,
// //         payer
// //       )
// //     );
// //   }
// //   return associatedAddress;
// // }

// // export default useNftStake;
