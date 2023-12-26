import Stake from "./Stake";
import UnStake from "./UnStake";
import Loader from "../loader/Loader";
import ProgressBar from "../loader/ProgressBar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CONNECT } from "../../actions";
import { connectWallet } from "../../utils";
import CONFIG from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import { GetNFTinfo, GetUserNfts, claim, stakeAllItem, stakeItem, unstakeItem } from "../../services";
import "react-toastify/dist/ReactToastify.css";
import img from "../../assets/2xLogo.png";

// Get NFT from wallet
//change
const Home = () => {
  interface NftInfo {
    currentSupply: number;
    maxSupply: number;
    userNftIds: number[];
    stakedNftIds: number[];
  }

  interface UserNft {
    name: string;
    id: number;
    imageUri: string;
  }

  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [reward, setReward] = useState("");
  const [unStackProductIds, setUnStackProduct] = useState<number[]>([]);
  const [stakedProductIds, setStakedProduct] = useState<number[]>([]);
  const storeData: any = useSelector((status) => status);
  const [walletStatus, setWalletStatus] = useState({
    status: ``,
    address: ``,
  });
  const [info, setInfo] = useState<NftInfo>();
  const [userNfts, setUserNfts] = useState<any>();
  const [stakedNfts, setStakedNfts] = useState<any>();
  const [totalStakedNfts, setTotalStakedNfts] = useState(0);
  const [maxNftsSupply, setMaxNftsSupply] = useState(0);

  const nfts = [
    { id: 1, imageUrl: "https://www.basepunk.xyz/assets/images/tm8.png", name: "NFT 1" },
    { id: 2, imageUrl: "https://www.basepunk.xyz/assets/images/tm5.png", name: "NFT 2" },
    { id: 3, imageUrl: "https://www.basepunk.xyz/assets/images/tm7.png", name: "NFT 3" },
    { id: 4, imageUrl: "https://www.basepunk.xyz/assets/images/tm2.png", name: "NFT 4" },
    { id: 5, imageUrl: "https://www.basepunk.xyz/assets/images/tm4.png", name: "NFT 5" },
    { id: 6, imageUrl: "https://www.basepunk.xyz/assets/images/tm3.png", name: "NFT 6" },
  ];

  const handleConnect = async () => {
    try {
      const wallet: any = await connectWallet();
      dispatch(
        CONNECT({
          wallet: `connected`,
          address: wallet.address,
        })
      );

      localStorage.setItem(CONFIG.WALLET_STATUS_LOCALSTORAGE, "connected");
      localStorage.setItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE, wallet.address);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDisConnect = () => {
    dispatch(
      CONNECT({
        wallet: `disconnect`,
        address: ``,
      })
    );
    localStorage.setItem(CONFIG.WALLET_STATUS_LOCALSTORAGE, "disconnect");
    localStorage.setItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE, "");
  };

  async function isConnected() {
    const accounts = await window.ethereum.request({method: 'eth_accounts'});       
    if (accounts.length) {
       console.log(`You're connected to: ${accounts[0]}`);
       dispatch(
        CONNECT({
          wallet: `connected`,
          address: accounts[0],
        })
      );
    } else {
       console.log("Metamask is not connected");
       dispatch(
        CONNECT({
          wallet: `disconnect`,
          address: ``,
        })
      );
    }
 }

  useEffect(() => {
    const get_walletStatus: any = localStorage.getItem(CONFIG.WALLET_STATUS_LOCALSTORAGE);
    const get_walletAddress: any = localStorage.getItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE);
    setWalletStatus({
      ...walletStatus,
      status: get_walletStatus,
      address: get_walletAddress,
    });
  }, [storeData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!window.ethereum || !window.ethereum.isConnected() || !window.ethereum.selectedAddress) {
          // Wallet is not connected, return early
          console.log("Wallet not connected");
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, provider);

        const updateReward = async () => {
          try {
            const user = await provider.getSigner().getAddress();
            const res = await staking_contract.callStatic.getTotalRewardEarned(user);
            setReward(ethers.utils.formatEther(res));
            console.log("Reward updated");
          } catch (error) {
            console.error("Error updating reward:", error);
          }
        };

        // Fetch initial data
        updateReward();

        // Update the reward every second
        const intervalId = setInterval(updateReward, 1000);

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: any) => {
          if (accounts.length === 0) {
            // Wallet disconnected, stop the interval
            clearInterval(intervalId);
            console.log("Wallet disconnected");
          }
        });

        // Clean up the interval and event listener when the component is unmounted or dependencies change
        return () => {
          clearInterval(intervalId);
          window.ethereum.removeAllListeners("accountsChanged");
        };
      } catch (error) {
        // Handle errors here
        console.error("Error fetching reward:", error);
      }
    };

    // Call the async function
    fetchData();
  }, [storeData, window.ethereum]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://base-mainnet.g.alchemy.com/v2/o9t9nCPDgoErA9_nMlxHY5sTXzHpcpdl"
        );
        const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, provider);
        const nft_contract = new ethers.Contract(CONFIG.NFTContract.address, CONFIG.NFTContract.ABI, provider);
        const maxSupply = await nft_contract.totalSupply();
        console.log("Max Supply updated");
        setMaxNftsSupply(Number(maxSupply));
        const updateNftsStaked = async () => {
          const currentSupply = await staking_contract.totalItemsStaked();
          setTotalStakedNfts(Number(currentSupply));
          console.log("Total Staked NFT updated");
        };

        // Fetch initial data
        updateNftsStaked();

        // Update the reward every second
        const intervalId = setInterval(updateNftsStaked, 1000);

        // Clean up the interval when the component is unmounted or dependencies change
        return () => clearInterval(intervalId);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function
    fetchData();
  }, []);

  useEffect(() => {
    try {
      window.ethereum.on("accountsChanged", async () => {
        const wallet: any = await connectWallet();
        localStorage.setItem(CONFIG.WALLET_STATUS_LOCALSTORAGE, "connected");
        localStorage.setItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE, wallet.address);
        dispatch(
          CONNECT({
            wallet: "connected",
            address: wallet.address,
          })
        );

        setWalletStatus({
          ...walletStatus,
          status: "connected",
          address: wallet.address,
        });
        const fetchData = async () => {
          try {
            await getInfo();
          } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors if needed
          }
        };

        fetchData();
      });
    } catch {}
  }, []);
  useEffect(()=> {
    try{
      if(!window.ethereum.isConnected() || !window.ethereum._metamask.isUnlocked()){
        dispatch(
          CONNECT({
            wallet: `disconnect`,
            address: ``,
          })
        );
        localStorage.setItem(CONFIG.WALLET_STATUS_LOCALSTORAGE, "disconnect");
        localStorage.setItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE, "");
      }
    }catch{

    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await isConnected();
      } catch (error) {
        console.error("Error fetching metamask:", error);
        // Handle errors if needed
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors if needed
      }
    };

    fetchData();
  }, []);

  const getInfo = async () => {
    try {
      if (window.ethereum) {
        setShowLoader(true);
        console.log("calling getInfo");
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const nft_contract = new ethers.Contract(CONFIG.NFTContract.address, CONFIG.NFTContract.ABI, provider);
        const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, provider);

        const signer = provider.getSigner();
        const user = await signer.getAddress();

        let stakedTokens = Array.from(await staking_contract.tokensOfOwner(user), (x) => Number(x));
        console.log("staked tokens ", stakedTokens);

        const currentSupply = await staking_contract.totalItemsStaked();

        const maxSupply = await nft_contract.totalSupply();
        console.log("max supply", Number(maxSupply));

        let userTokens: any = await GetUserNfts(user.toString());
        console.log("res from fn", userTokens);

        if (Array.isArray(userTokens)) {
          userTokens = userTokens.filter((id: any) => !stakedTokens.includes(id)).sort();
          console.log("user Tokens", userTokens);
        } else {
          console.error("User tokens are not an array:", userTokens);
        }

        setInfo({
          currentSupply: Number(currentSupply),
          maxSupply: Number(maxSupply),
          userNftIds: userTokens,
          stakedNftIds: stakedTokens,
        });

        //   const _userNfts: any = await Promise.all(userTokens.map(async (nft: any) => {

        //     // const tokenUri = await nft_contract.tokenURI(nft);
        //     const res = await GetNFTinfo(nft);
        //     console.log(res);
        //     return {
        //       name: res?.name,
        //       id: nft,
        //       imageUri: res?.image.pngUrl
        //     }
        // }))

        // setUserNfts(_userNfts);
        let _userNfts: any = [];
        const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

        const processUserNFTs = async (tokens: any) => {
          const batchSize = 20;
          const totalBatches = Math.ceil(tokens.length / batchSize);

          for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const start = batchIndex * batchSize;
            const end = (batchIndex + 1) * batchSize;
            const batchTokens = tokens.slice(start, end);

            const batchResults = await Promise.all(
              batchTokens.map(async (nft: any) => {
                const res = await GetNFTinfo(nft);
                console.log(res);
                return {
                  name: res?.nft.name,
                  id: nft,
                  imageUri: res?.nft.image_url,
                };
              })
            );

            // Process the results of the batch, you can store them or perform further actions

            console.log("Processed batch:", batchResults);
            _userNfts = _userNfts.concat(batchResults);

            // If it's not the last batch, add a delay before the next batch
            if (batchIndex < totalBatches - 1) {
              await delay(1000); // Adjust the delay as needed (1000 ms = 1 second)
            }
          }
        };

        await processUserNFTs(userTokens);
        console.log("_userNFT", _userNfts);
        setUserNfts(_userNfts);

        //  const _stakedNfts: any = await Promise.all(stakedTokens.map(async (nft) => {

        //   const res = await GetNFTinfo(nft);
        //   console.log(res);
        //   return {
        //     name: res?.name,
        //     id: nft,
        //     imageUri: res?.image.pngUrl
        //   }
        // }))
        let _stakedNfts: any = [];
        const processStakedNFTs = async (tokens: any) => {
          const batchSize = 20;
          const totalBatches = Math.ceil(tokens.length / batchSize);

          for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const start = batchIndex * batchSize;
            const end = (batchIndex + 1) * batchSize;
            const batchTokens = tokens.slice(start, end);

            const batchResults = await Promise.all(
              batchTokens.map(async (nft: any) => {
                const res = await GetNFTinfo(nft);
                console.log(res);
                return {
                  name: res?.nft.name,
                  id: nft,
                  imageUri: res?.nft.image_url,
                };
              })
            );

            // Process the results of the batch, you can store them or perform further actions

            console.log("Processed batch:", batchResults);
            _stakedNfts = _stakedNfts.concat(batchResults);

            // If it's not the last batch, add a delay before the next batch
            if (batchIndex < totalBatches - 1) {
              await delay(1000); // Adjust the delay as needed (1000 ms = 1 second)
            }
          }
        };

        await processStakedNFTs(stakedTokens);
        console.log("_staked", _stakedNfts);
        setStakedNfts(_stakedNfts);

        setShowLoader(false);
      }
    } catch (e) {
      console.log("error", e);
      setShowLoader(false);
    }
  };

  const getNftInfoFromUri = async (tokenUri: any) => {
    try {
      // Use https://ipfs.io/ipfs/ to fetch the JSON metadata from the token URI
      const response = await fetch(`https://ipfs.io/ipfs/${tokenUri.replace("ipfs://", "")}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const metadata = await response.json();

      // Assuming metadata structure includes 'name', 'id', and 'image'
      const nftInfo = {
        name: metadata.name,
        id: metadata.id,
        imageUri: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
        // Add other properties as needed based on your metadata structure
      };

      return nftInfo;
    } catch (error) {
      console.error("Error fetching NFT info:", error);
      // Handle errors if needed
      return null;
    }
  };

  const handleUnstackProduct = (e: boolean, i: number) => {
    if (e) {
      if (unStackProductIds.length >= 10) {
        toast.error("You can unstake 10 NFTs in maximum at once.");
        return;
      }
      setUnStackProduct([...unStackProductIds, i]);
    } else {
      setUnStackProduct(unStackProductIds.filter((item) => item !== i));
    }
  };

  const handleStakedProduct = (e: boolean, i: number) => {
    if (e) {
      if (unStackProductIds.length >= 10) {
        toast.error("You can stake 10 NFTs in maximum at once.");
        return;
      }
      setStakedProduct([...stakedProductIds, i]);
    } else {
      setStakedProduct(stakedProductIds.filter((item) => item !== i));
    }
  };

  const handleStake = async () => {
    if (unStackProductIds.length <= 0) {
      toast.error("Select NFTs, please.");
      return;
    }
    setShowLoader(true);
    let staking_nfts = [];
    for (let i = 0; i < unStackProductIds.length; i++) {
      staking_nfts.push(userNfts[unStackProductIds[i]]);
    }
    var filtered = userNfts.filter(function (value: any, index: any, arr: any) {
      return unStackProductIds.indexOf(index) === -1;
    });

    const staking_nftIds = staking_nfts.map((nft) => nft.id);
    console.log("stakeItem param", staking_nftIds);
    const res = await stakeItem(staking_nftIds);
    if (res === 1) {
      setUnStackProduct([]);
      setStakedNfts(stakedNfts.concat(staking_nfts));
      await getInfo();
      toast.success("NFT staked succesfully");
    }
  };

  const handleStakeAll = async () => {
    if (userNfts.length <= 0) {
      toast.error("No NFTs.");
      return;
    }
    setShowLoader(true);

    const staking_nftIds = userNfts.map((nft: any) => nft.id);

    const res = await stakeAllItem(staking_nftIds.filter((_nft: any, index: number) => index < 10));
    if (res === 1) {
      setUnStackProduct([]);
      setStakedNfts(stakedNfts.concat(staking_nftIds.filter((_nft: any, index: number) => index < 10)));
      await getInfo();
      toast.success("NFT staked succesfully");
    }
  };
  const stopLoader = () => {
    setShowLoader(false);
    setLoadingMessage("");
  };

  const handleUnStake = async () => {
    if (stakedProductIds.length <= 0) {
      toast.error("Select NFTs, please");
      return;
    }
    setShowLoader(true);
    let unstaking_nfts = [];
    for (let i = 0; i < stakedProductIds.length; i++) {
      unstaking_nfts.push(stakedNfts[stakedProductIds[i]]);
    }

    var filtered = stakedNfts.filter(function (value: any, index: any, arr: any) {
      return stakedProductIds.indexOf(index) === -1;
    });

    const unstaking_nftsId = unstaking_nfts.map((nft) => nft.id);
    const res = await unstakeItem(unstaking_nftsId);
    if (res === 1) {
      setStakedProduct([]);
      await getInfo();
      toast.success("NFT unstaked succesfully");
    }
  };

  const handleUnStakeAll = async () => {
    if (stakedNfts.length <= 0) {
      toast.error("No NFTs.");
      return;
    }
    setShowLoader(true);
    const unstaking_nftIds = stakedNfts.map((nft: any) => nft.id);
    const res = await unstakeItem(unstaking_nftIds.filter((_nft: any, index: number) => index < 10));
    if (res === 1) {
      setStakedProduct([]);
      await getInfo();
      toast.success("NFT unstaked succesfully");
    }
  };

  const handleClaim = async () => {
    if (stakedNfts.length <= 0) {
      toast.error("No NFTs.");
      return;
    }
    setShowLoader(true);
    const claim_nftIds = stakedNfts.map((nft: any) => nft.id);
    const res = await claim(claim_nftIds);
    if (res === 1) {
      setStakedProduct([]);
      await getInfo();
      toast.success("Rewards claimed succesfully");
    }
  };

  return (
    <>
      <div className="text-white body-bg">
        {showLoader && <Loader text={loadingMessage} />}
        <div className="px-4 min-h-screen max-w-7xl mx-auto">
          {/* Main Navbar */}
          <nav className="flex items-center justify-between py-5 flex-col xsm:flex-row gap-3 xsm:gap-0">
            <a href="/">
              <span className="font-extrabold text-2xl sm:text-4xl italic text-white">BasePunk</span>
            </a>
            <ul className="flex items-center justify-center md:justify-start">
              <li>
                <a
                  href="#"
                  className="text-white opacity-30 cursor-pointer hover:text-4ccbc9 hover:opacity-100 relative"
                  title="home"
                >
                  <span className="font-bold text-base sm:text-xl">HOME</span>
                </a>
              </li>
              <li className="text-base flex ml-4">
                {storeData.wallet === `connected` ? (
                  <div
                    className="text-indigo-600 bg-white rounded-[4px]  hover:bg-green-500 py-[0.5rem] px-[1rem] cursor-pointer"
                    onClick={handleDisConnect}
                  >
                    {storeData?.address
                      ? storeData?.address?.substr(0, 6) +
                        "..." +
                        storeData?.address?.substr(storeData?.address.length - 4, 4)
                      : `Connect Wallet`}
                  </div>
                ) : (
                  <div
                    className="text-indigo-600 bg-white rounded-[4px] py-[0.5rem] px-[1rem] cursor-pointer  hover:bg-green-500"
                    onClick={handleConnect}
                  >
                    Connect Wallet
                  </div>
                )}
              </li>
              <ToastContainer />
            </ul>
          </nav>
          <h2
            className="text-center mt-5"
            // style={{
            //   textAlign: "center",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   // backgroundColor: "lightblue",
            //   width: "100%",
            //   borderRadius: "10px",
            // }}
          >
            NFT's Staked: {totalStakedNfts}/ {maxNftsSupply}
          </h2>
          <ProgressBar bgcolor="#ef6c00" completed={totalStakedNfts} totalSupply={maxNftsSupply} />

          {/* Bonus Claim Bar  */}
          <div className="sm:flex items-center justify-between mt-10 bg-LightPurple rounded-2xl sm:py-8 py-5 md:px-11 sm:px-8 px-5">
            <h1 className="text-2xl">Stake and earn rewards (5 $WBPunk / Day)</h1>
            <div className="sm:flex items-center">
              <h1 className="my-5 sm:my-0 text-2xl">{Number(reward).toFixed(3)} $WBPunk</h1>
              <button
                className="sm:ml-5 bg-pink-600 text-white py-2 px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black"
                title="COMING SOON"
                onClick={() => {
                  handleClaim().then(() => {
                    stopLoader();
                  });
                }}
              >
                CLAIM
              </button>
            </div>
          </div>
          {/* Staking Main  */}
          <div className="flex flex-col md:flex-row justify-between mt-10 gap-6">
            {/* Left  */}
            <div className="p-4 w-full md:w-1/2 rounded-lg sm:rounded-2xl md:rounded-3xl bg-gradient-to-r from-Secprimary to-Secsecondary">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm sm:text-base">NFTs in wallet: {userNfts?.length}</p>

                <div className="flex items-center gap-4">
                  <button
                    className=" bg-pink-600 text-white px-3 md:px-6 lg:px-6 py-2 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleStake().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    Stake
                  </button>
                  <button
                    className="bg-white text-black py-2 px-3 md:px-6 lg:px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleStakeAll().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    Stake All
                  </button>
                </div>
              </div>

              {/* Staking Container  */}
              <div className="flex gap-3 flex-wrap mt-3 panel">
                {userNfts?.length > 0 ? (
                  userNfts?.map((nft: any, idx: any) => {
                    return (
                      <Stake
                        key={idx}
                        selected={unStackProductIds.indexOf(idx) !== -1}
                        nft={nft}
                        index={idx}
                        image={nft.imageUri}
                        name={nft.name}
                        handleOrderCollect={handleUnstackProduct}
                      />
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "12em 1em",
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "lightblue",
                      width: "100%",
                      borderRadius: "10px",
                      margin: "1em 1em",
                    }}
                  >
                    {!showLoader && "No NFTs"}
                  </div>
                )}
              </div>
            </div>
            {/* Right  */}
            <div className="p-4 w-full md:w-1/2 rounded-lg sm:rounded-2xl md:rounded-3xl bg-gradient-to-r from-Secprimary to-Secsecondary">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm sm:text-base">Staked NFTs : {stakedNfts?.length}</p>

                <div className="flex items-center gap-4">
                  <button
                    className="bg-pink-600  text-white py-2 px-3 md:px-6 lg:px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleUnStake().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    UnStake
                  </button>
                  <button
                    className="bg-white text-black py-2 px-3 md:px-6 lg:px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleUnStakeAll().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    UnStake All
                  </button>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap mt-3 panel">
                {stakedNfts?.length > 0 ? (
                  stakedNfts.map((nft: any, idx: any) => {
                    return (
                      <UnStake
                        key={idx}
                        selected={stakedProductIds.indexOf(idx) !== -1}
                        nft={nft}
                        index={idx}
                        image={nft.imageUri}
                        name={nft.name}
                        handleOrderCollect={handleStakedProduct}
                      />
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "12em 1em",
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "lightblue",
                      width: "100%",
                      borderRadius: "10px",
                      margin: "1em 1em",
                    }}
                  >
                    {!showLoader && "No NFTs"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 panel">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {nfts.map((nft) => (
                <div key={nft.id} className="col-span-1">
                  <img src={nft.imageUrl} alt={nft.name} className="w-full h-auto rounded-md" />
                </div>
              ))}
            </div>
          </div>

          <footer className="md:pt-footer pt-footersm md:pb-footer pb-bfooter">
            <div className="sm:flex items-center justify-between gap-4">
              <div className="flex-1">
                <a href="/" className="flex items-center justify-center sm:block">
                  <span className="font-extrabold text-3xl sm:text-4xl italic text-white">BasePunk</span>
                </a>
                <span className="text-sm sm:text-base mt-2 sm:mt-6 block text-center sm:text-left">
                  Base punk is a digital collection and global community of creators, developers, and innovators. We are
                  the change makers.
                </span>
              </div>
              <div className="my-5 sm:my-0 flex-1 flex items-center justify-start flex-col">
                <h4 className="text-sm sm:text-base text-left">Follow us</h4>
                <ul className="my-4 sm:my-5 md:items-start flex items-center space-x-3">
                  <li className="bg-[#4ccbc9] rounded-xl w-10 h-10 flex items-center justify-center">
                    <a href="https://discord.com/invite/pDUx5j7cY4" target="_blank" rel="noreferrer">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M17.1758 12.5742C17.4466 12.8451 17.582 13.1836 17.582 13.5898C17.582 13.9961 17.4466 14.3516 17.1758 14.6562C16.9388 14.9271 16.6341 15.0625 16.2617 15.0625C16.0247 15.0625 15.8047 14.9948 15.6016 14.8594C15.3984 14.724 15.2292 14.5547 15.0938 14.3516C14.9922 14.1146 14.9414 13.8607 14.9414 13.5898C14.9414 13.3867 14.9753 13.2005 15.043 13.0312C15.1107 12.862 15.1953 12.7096 15.2969 12.5742C15.4323 12.4388 15.5846 12.3372 15.7539 12.2695C15.9232 12.2018 16.0924 12.168 16.2617 12.168C16.6341 12.168 16.9388 12.3034 17.1758 12.5742ZM10.5742 12.5742C10.8451 12.3034 11.1667 12.168 11.5391 12.168C11.9115 12.168 12.2161 12.3034 12.4531 12.5742C12.724 12.8451 12.8594 13.1836 12.8594 13.5898C12.8594 13.9961 12.724 14.3516 12.4531 14.6562C12.2161 14.9271 11.9115 15.0625 11.5391 15.0625C11.1667 15.0625 10.8451 14.9271 10.5742 14.6562C10.3372 14.3516 10.2188 13.9961 10.2188 13.5898C10.2188 13.1836 10.3372 12.8451 10.5742 12.5742ZM25.25 3.94141V27.25C23.2865 25.5234 21.2721 23.6953 19.207 21.7656L19.918 24.2031H5.14062C4.42969 24.2031 3.80339 23.9492 3.26172 23.4414C2.75391 22.8997 2.5 22.2565 2.5 21.5117V3.94141C2.5 3.19661 2.75391 2.57031 3.26172 2.0625C3.80339 1.52083 4.42969 1.25 5.14062 1.25H22.6094C23.3203 1.25 23.9297 1.52083 24.4375 2.0625C24.9792 2.57031 25.25 3.19661 25.25 3.94141ZM21.543 16.2305C21.543 15.0117 21.3906 13.776 21.0859 12.5234C20.7812 11.237 20.4596 10.2721 20.1211 9.62891L19.6641 8.66406C19.3255 8.39323 18.9531 8.17318 18.5469 8.00391C18.1745 7.80078 17.8359 7.66536 17.5312 7.59766C17.2604 7.49609 17.0065 7.42839 16.7695 7.39453C16.5326 7.32682 16.3464 7.29297 16.2109 7.29297H16.0078L15.8555 7.49609C16.4987 7.69922 17.0911 7.95312 17.6328 8.25781C18.1745 8.52865 18.5469 8.7487 18.75 8.91797L19.0547 9.17188C17.5651 8.32552 15.9401 7.88542 14.1797 7.85156C12.4193 7.81771 10.8112 8.1224 9.35547 8.76562L8.59375 9.17188C9.30469 8.49479 10.4388 7.91927 11.9961 7.44531L11.8945 7.29297C10.7096 7.29297 9.49089 7.75 8.23828 8.66406C8.10286 8.9349 7.93359 9.29036 7.73047 9.73047C7.52734 10.1706 7.23958 11.0677 6.86719 12.4219C6.52865 13.7422 6.35938 15.0117 6.35938 16.2305C6.42708 16.3997 6.54557 16.5859 6.71484 16.7891C6.91797 16.9922 7.35807 17.2799 8.03516 17.6523C8.71224 18.0247 9.47396 18.2109 10.3203 18.2109C10.6589 17.8385 10.9466 17.4831 11.1836 17.1445C10.7096 17.0091 10.2695 16.8229 9.86328 16.5859C9.49089 16.3151 9.23698 16.0781 9.10156 15.875L8.89844 15.6211C8.96615 15.6549 9.03385 15.7057 9.10156 15.7734C9.20312 15.8073 9.28776 15.8411 9.35547 15.875C9.42318 15.9089 9.45703 15.9258 9.45703 15.9258C10.6081 16.569 11.8776 16.9583 13.2656 17.0938C14.6875 17.1953 16.1263 16.9583 17.582 16.3828C18.0898 16.2135 18.5807 15.9596 19.0547 15.6211C18.6146 16.332 17.8359 16.8568 16.7188 17.1953L17.582 18.2109C18.1237 18.2109 18.6146 18.1432 19.0547 18.0078C19.5286 17.8385 19.901 17.6693 20.1719 17.5C20.4766 17.2969 20.7305 17.1107 20.9336 16.9414C21.1706 16.7383 21.3229 16.569 21.3906 16.4336L21.543 16.2305Z"
                          fill="#020722"
                        ></path>
                      </svg>
                    </a>
                  </li>
                  <li className="bg-[#4ccbc9] rounded-xl w-10 h-10 flex items-center justify-center">
                    <a href="https://twitter.com/Punkonbase" target="_blank" rel="noreferrer">
                      <img
                        src={
                          "https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=626&ext=jpg"
                        }
                        alt="Twitter"
                        className="w-6"
                      />
                    </a>
                  </li>
                  <li className="bg-[#4ccbc9] rounded-xl w-10 h-10 flex items-center justify-center">
                    <a href="https://medium.com/@punkonbase/" target="_blank" rel="noreferrer">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.75625 8.21094C4.75625 7.90625 4.63776 7.63542 4.40078 7.39844L2.11563 4.65625V4.25H9.27578L14.7602 16.3359L19.5844 4.25H26.3891V4.65625L24.4086 6.53516C24.2393 6.67057 24.1716 6.85677 24.2055 7.09375V20.9062C24.1716 21.1432 24.2393 21.3294 24.4086 21.4648L26.3383 23.3438V23.75H16.6898V23.3438L18.6703 21.4141C18.7719 21.3125 18.8227 21.2448 18.8227 21.2109C18.8565 21.1432 18.8734 21.0247 18.8734 20.8555V9.68359L13.3891 23.6992H12.6273L6.17813 9.68359V19.0781C6.14427 19.4844 6.26276 19.8398 6.53359 20.1445L9.12344 23.293V23.6992H1.81094V23.293L4.40078 20.1445C4.70547 19.8398 4.82396 19.4844 4.75625 19.0781V8.21094Z"
                          fill="#020722"
                        ></path>
                      </svg>
                    </a>
                  </li>
                  <li className="bg-[#4ccbc9] rounded-xl w-10 h-10 flex items-center justify-center">
                    <a href="https://github.com/Basepunkorg" target="_blank" rel="noreferrer">
                      <svg
                        height="28"
                        width="28"
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        version="1.1"
                        data-view-component="true"
                      >
                        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-base text-center md:text-start">Developed with ❤️ by </p>
                <div>
                  <a
                    className="hover:text-black text-blue-500 transition duration-300 ml-2 flex items-center flex-col"
                    href="https://www.2xsolution.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={img} alt="2x Solution Logo" className="w-28" />
                  </a>
                </div>
              </div>
            </div>
          </footer>

          {/* MODAL  */}

          {/* {showClaimListModal && (
          <CliamListModal
            isClaimEnable={isClaimEnable}
            handleClose={setShowClaimListModal}
            handleTweet={onHandleTweet}
            handleClaimToken={onClaimToken}
            handleUser={setShowUserModal}
          />
        )} */}

          {/* {showTweetModal && (
          <TwitterModal
            tweetId={tweetId}
            walletAddress={publicKey?.toString()}
            options={tweetOptions}
            handleClose={setShowTweetModal}
            handleClaimEnable={setClaimEnable}
          />
        )}

        {showUserModal && (
          <UserModal
            tweetId={tweetId}
            walletAddress={publicKey?.toString()}
            handleClose={setShowUserModal}
            handleClaimEnable={setClaimEnable}
          />
        )} */}
        </div>
      </div>
    </>
  );
};

export default Home;
