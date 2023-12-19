/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";

import { Circles } from 'react-loader-spinner'
import { BACKEND_URL, COMMENT, LIKE, NEXT_PUBLIC_SOLANA_NETWORK, NEXT_PUBLIC_STAKE_CONTRACT_ID, QUOTE, RETWEET, RPC_URL, USER_POOL_SEED } from "../../constant/env";
import axios from "axios";
// import CloneIcon from "../assets/Close.png";
// import toast from 'react-hot-toast';
// import { ConfirmOptions, PublicKey } from "@solana/web3.js";
// import * as anchor from "@project-serum/anchor";
// import { STAKE_CONTRACT_IDL } from "../../constant/contract";
// import { useAnchorWallet } from "@solana/wallet-adapter-react";

interface ClaimListModalInterface {
    handleClose: (isShowing: boolean) => void;
    handleTweet: (isShowing: boolean, tweetId: string, tweetOptions: []) => void;
    handleUser: (isShowing: boolean) => void;
    handleClaimToken: (index: Number) => void;
    isClaimEnable: boolean,
}

interface Tweet {
    month: Number,
    year: Number,
    rewardAmount: string,
    isClaimed: boolean,
    userName: string,
    tweetId: string,
    tweetOptions: []
}

const CliamListModal = (props: ClaimListModalInterface) => {
    const [isLoading, setShowLoading] = useState(true);
    // const anchorWallet = useAnchorWallet();
    const [tweetList, setTweetList] = useState<Tweet[]>([]);
    // const connection = new anchor.web3.Connection(
    //     RPC_URL
    // );

    // const getClaimList = async (tweets: any[]) => {
    //     if (anchorWallet) {

    //         const claimList: Tweet[] = [];
    //         const programId = new PublicKey(NEXT_PUBLIC_STAKE_CONTRACT_ID!);
    //         const idl = STAKE_CONTRACT_IDL as anchor.Idl;

    //         const confirmOption: ConfirmOptions = {
    //             commitment: "finalized",
    //             preflightCommitment: "finalized",
    //             skipPreflight: false,
    //         };
    //         let provider = new anchor.Provider(connection, anchorWallet, confirmOption);
    //         let program = new anchor.Program(idl, programId, provider);

    //         let [userPool] = await PublicKey.findProgramAddress(
    //             [Buffer.from(USER_POOL_SEED), anchorWallet.publicKey.toBuffer()],
    //             program.programId
    //         );
    //         let userPoolInfo = null;
    //         try {
    //             userPoolInfo = await program.account.userPool.fetch(userPool);
    //         } catch (e) { console.error(e) }

    //         if (userPoolInfo) {
    //             for (let i = 0; i < userPoolInfo.counter.toNumber(); i++) {
    //                 let [userPoolAllocate] = await PublicKey.findProgramAddress(
    //                     [Buffer.from(USER_POOL_SEED), anchorWallet.publicKey.toBuffer(), new anchor.BN(i).toArrayLike(Buffer, "le", 8)],
    //                     program.programId
    //                 );

    //                 try {
    //                     let userPoolAllocateInfo = await program.account.allocateInfo.fetch(userPoolAllocate);

    //                     const month = (new Date(userPoolAllocateInfo.allocatedTime.toNumber() * 1000)).getUTCMonth() + 1;
    //                     const year = (new Date(userPoolAllocateInfo.allocatedTime.toNumber() * 1000)).getUTCFullYear();
    //                     let userName = "";
    //                     let tweetId = "";
    //                     let options = [];
    //                     for (let j = 0; j < tweets.length; j++) {
    //                         if (tweets[j].year == year && tweets[j].month == month) {
    //                             userName = tweets[j].userName;
    //                             tweetId = tweets[j].tweetId;
    //                             options = tweets[j].option;
    //                         }
    //                     }

    //                     if (userPoolAllocateInfo) {
    //                         claimList.push({
    //                             month: month,
    //                             year: year,
    //                             rewardAmount: userPoolAllocateInfo.rewardAmount.toNumber(),
    //                             isClaimed: userPoolAllocateInfo.isClaimed,
    //                             userName: userName,
    //                             tweetId: tweetId,
    //                             tweetOptions: options
    //                         })
    //                         // return userPoolAllocateInfo;
    //                     }
    //                 }
    //                 catch (e) {
    //                     console.error(e)
    //                 }
    //             }
    //             setTweetList(claimList);

    //         }
    //         setShowLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     try {
    //         setShowLoading(true);
    //         axios.get(`${BACKEND_URL}/admin/getTweetList`).then((res) => {
    //             if (res.status == 200) {
    //                 getClaimList(res.data.tweets);
    //             }
    //             else {
    //                 setShowLoading(false);
    //             }
    //         });
    //     }
    //     catch (e) {

    //     }
    // }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-ModalBg flex items-center justify-center p-4">
            <div className="bg-Modal rounded-borderRadiusCard w-full max-w-4xl p-7 max-h-1/5 overflow-y-auto myscroller" style={{ overflow: 'auto', maxHeight: 700 }}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl capitalize staking font-bold">
                        Claimable Rewards
                    </h1>

                    <div
                        className="w-4 cursor-pointer"
                        onClick={() => props.handleClose(false)}
                    >
                        <img src={""} alt="close" />
                    </div>
                </div>
                {isLoading ? <div className="flex justify-center">
                    < Circles
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="circles-loading"
                        wrapperStyle={{ justifyContent: 'center' }
                        }
                        wrapperClass=""
                        visible={true}
                    />
                </div > : <div>
                    <table className="w-full min-h-full">
                        <thead>
                            <tr >
                                <th>
                                    Month
                                </th>
                                <th>
                                    Reward Amount
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        {tweetList.length > 0 ?
                            <tbody>
                                {
                                    tweetList.map((item :any, index) => {
                                        return (
                                            <tr className="text-center" key={index}>
                                                <td className="py-1">
                                                    {item.year} / {item.month}
                                                </td>
                                                <td >
                                                    {item.rewardAmount}
                                                </td>
                                                <td>
                                                    {!item.isClaimed ?
                                                        <button onClick={() => {
                                                            if (props.isClaimEnable) {
                                                                props.handleClaimToken(index);
                                                            }
                                                            else {
                                                                if (item.userName) {
                                                                    props.handleUser(true);
                                                                }
                                                                else {
                                                                    props.handleTweet(true, item.tweetId, item.tweetOptions);
                                                                }
                                                            }
                                                        }} className="" disabled={false}>
                                                            Claim
                                                        </button> : <button>Claimed</button>}
                                                </td>
                                            </tr>)
                                    })
                                }
                            </tbody> : <div>No claimables</div>
                        }

                    </table>
                </div>}

            </div>
        </div>
    );
};

export default CliamListModal;
