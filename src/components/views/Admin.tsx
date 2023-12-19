/* eslint-disable array-callback-return */
/* eslint-disable no-lone-blocks */


// import { WalletMultiButton, } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

import { BACKEND_URL, LIKE, NEXT_PUBLIC_SOLANA_NETWORK, NEXT_PUBLIC_STAKE_CONTRACT_ID, COMMENT, RETWEET, QUOTE, USER_POOL_SEED, RPC_URL } from '../../constant/env';

// import * as anchor from "@project-serum/anchor";
// import { ConfirmOptions, Keypair, PublicKey, Transaction } from "@solana/web3.js";

import Radio from "./Radio";

import Loader from "../loader/Loader";

const Admin = () => {


	

	const tweetIdInputRef = useRef<HTMLInputElement>(null);

	const tweetUserNameInputRef = useRef<HTMLInputElement>(null);

	const solInputRef = useRef<HTMLInputElement>(null);

	// const connection = new anchor.web3.Connection(
	// 	RPC_URL
	// );

	const [tweetLink, setTweetLink] = useState("");

	const [tweetId, setTweetId] = useState("");

	const [userName, setUserName] = useState("");

	const [tweetOptions, setTweetOptions] = useState<String[]>([]);

	const [showLoader, setShowLoader] = useState(false);

	const setHandleChange = (name: string, isSelected: boolean) => {
		if (isSelected) {
			if (tweetOptions.indexOf(name) == -1) {
				tweetOptions.push(name);
				setTweetOptions(tweetOptions)
			}
		}
		else {
			var filtered = tweetOptions.filter(function (value, index, arr) {
				return value !== name;
			});
			setTweetOptions(filtered);
		}
	}

	useEffect(() => {
		try {
			setShowLoader(true);
			axios.get(`${BACKEND_URL}/admin/getTweet`).then((res) => {
				if (res.status == 200) {
					setTweetLink(res.data.tweet.tweetLink);
					setTweetId(res.data.tweet.tweetId);
					setUserName(res.data.tweet.userName);
					setTweetOptions(res.data.tweet.option);
				}
				setShowLoader(false);
			}).catch((err) => {
				setShowLoader(false);
			})
		} catch (error) {
		}
	}, []);

	const onSaveTweet = () => {
		if (!tweetIdInputRef.current?.value) {
			// toast.error("Input tweet id, please.")
			console.error("Input tweel id,please");
			return;
		}

		if (tweetOptions.length == 0) {
			// toast.error("Please select action type.");
			console.error("Please select action type.");
			return;
		}

		try {
			setShowLoader(true);
			axios.post(`${BACKEND_URL}/admin/saveTweet`, {
				tweetLink: tweetIdInputRef.current?.value,
				option: tweetOptions
			}).then((res) => {
				setShowLoader(false);
				// toast.success(res.data.message);
				console.log(res.data.message);
			}).catch((err) => {
				setShowLoader(false);
			})
		} catch (error) {

		}
	}

	

	const onSaveUserName = () => {
		if (!tweetUserNameInputRef.current?.value) {
			// toast.error("Input user name, please.");
			console.error("Input user name, please.");
			return;
		}

		try {
			setShowLoader(true);
			axios.post(`${BACKEND_URL}/admin/saveTweet`, {
				userName: tweetUserNameInputRef.current?.value
			}).then((res) => {
				setShowLoader(false);
				// toast.success(res.data.message);
				console.log(res.data.message);
			}).catch((err) => {
				setShowLoader(false);
			})
		} catch (error) {
		}
	}

	

	

	return (
		<div className="text-white">
			{(showLoader) && <Loader text={"Loading"} />}
			<div className="px-4 lg:px-8 min-h-screen">
				{/* Main Navbar */}
				<nav className="sm:flex items-center justify-between py-5">
					<a href="/" className="sm:w-52 w-36">
						<img src={''} alt="main-logo" />
					</a>
					{/* <WalletMultiButton className="wallet-btn"
						style={{ background: 'transparent' }}
					> */}
						{ <div className="mt-2 py-0 px-6 rounded-full flex items-center bg-gradient-to-r from-primary to-secondary cursor-pointer">
							<img src={''} alt="wallet" className="mr-2 w-5" />
							Connect Wallet
						</div>}
					{/* </WalletMultiButton> */}
				</nav>
				<div className="sm:flex items-center py-5">
					<button onClick={()=> console.log('')} className="sm:ml-5 ml-2 mt-2 sm:mt-0 bg-gradient-to-r from-primary to-secondary py-3 px-8 rounded-2xl cursor-pointer mr-5">
						Allocate Rewards
					</button>
					<input ref={solInputRef} type="number" className="py-3 px-3 rounded-2xl sm:w-1/4 w-full outline-none bg-LightPurple uppercase" placeholder="Sol Amount to Send to User" />
					<button onClick={()=> console.log('')} className="sm:ml-5 ml-2 mt-2 sm:mt-0 bg-gradient-to-r from-primary to-secondary py-3 px-8 rounded-2xl cursor-pointer">
						Send
					</button>
				</div>
				<h1 className="text-2xl mt-8 pl-4"> Task for Claim</h1>
				<div className="lg:flex justify-between mt-10">
					{/* Left  */}
					<div className="px-4 py-4 rounded-borderContainer basis-half bg-gradient-to-r from-Secprimary to-Secsecondary mb-4 lg:mb-0">
						<h1 className="text-xl text-center mb-4">Retweet This Tweet</h1>
						<input ref={tweetIdInputRef} className="py-3 px-3 rounded-2xl sm:w-3/4 w-full outline-none bg-LightPurple" placeholder="Enter Twitter Id" defaultValue={tweetLink} />
						<p className="mt-4 mb-5 sm:w-3/4 w-full">User Should do Following to claim Revenue</p>
						<Radio name={LIKE} selected={tweetOptions.indexOf(LIKE) !== -1}
							handleChange={setHandleChange}></Radio>
						<Radio name={COMMENT} selected={tweetOptions.indexOf(COMMENT) !== -1}
							handleChange={setHandleChange}></Radio>
						<Radio name={QUOTE} selected={tweetOptions.indexOf(QUOTE) !== -1}
							handleChange={setHandleChange}></Radio>
						<Radio name={RETWEET} selected={tweetOptions.indexOf(RETWEET) !== -1}
							handleChange={setHandleChange}></Radio>
						<div className="flex items-end justify-end">
							<div className="flex items-center">
								<button className="mt-5 bg-gradient-to-r from-primary to-secondary py-3 px-8 rounded-2xl" onClick={onSaveTweet}>
									Save
								</button>
							</div>
						</div>
					</div>
					{/* Right  */}
					<div className={userName ? "px-4 pt-4 rounded-borderContainer basis-half bg-gradient-to-r from-Secprimary to-Secsecondary mb-4 lg:mb-0 border-2 border-green-700" : "px-4 pt-4 rounded-borderContainer basis-half bg-gradient-to-r from-Secprimary to-Secsecondary mb-4 lg:mb-0"}>
						<h1 className="text-xl text-center">Create A Tweet</h1>
						<h1 className="text-xl capitalize pt-4">Twitter Account to Link in Tweet</h1>
						<input ref={tweetUserNameInputRef} className="py-3 px-3 rounded-2xl sm:w-1/2 w-full outline-none bg-LightPurple mt-4" placeholder="@Username" defaultValue={userName} />
						<div className="flex items-end justify-end">
							<div className="flex items-center">
								<button className="mt-5 bg-gradient-to-r from-primary to-secondary py-3 px-8 mb-3 sm:mb-0 rounded-2xl" onClick={onSaveUserName}>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admin;
