import React, { createContext, useContext,useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

// Components


function Vote() {
  const [input, setInput] = useState({
    member_account: "",
    member_name: "",
  });

  const {
    currentAccount,
  } = useContext(TransactionContext);

  const [eventAddress, setEventAddress] = useState('');
  const [showEnable, setShowEnable] = useState(false);
  const [voteDetail, setVoteDetail] = useState("");

  const handleChange = (e, name) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const createCreditContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      creditAddress,
      creditABI,
      signer
    );

    return transactionsContract;
  };

  const createNftContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      nftAddress,
      nftABI,
      signer
    );

    return transactionsContract;
  };

  useEffect(() => {

    getEventAddress();

  })

  async function getEventAddress() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();

        const proposal_address =
          await creditContract.getCurEventAddress();

        console.log(proposal_address);
        setEventAddress(proposal_address);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function Vote_Agree() {
    if (!input) return

    // console.log(input.member_account);
    // console.log(input.owner_account);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        let transRx = await creditContract.vote_simple(true); 

        creditContract.on('VoteMajority', function(event, votenum){
          console.log(votenum); 
          setVoteDetail(String(votenum));
          setShowEnable(true);
        })

      }
    } catch (error) {
      console.log(error);
    }
  };

  async function Vote_Oppose() {
    if (!input) return

    // console.log(input.member_account);
    // console.log(input.owner_account);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        let transRx = await creditContract.vote_simple(false); 

        creditContract.on('VoteMajority', function(event, votenum){
          console.log(votenum); 
          setVoteDetail(String(votenum));
          setShowEnable(true);
        })

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <h1 className="font-semibold text-lg text-yellow-200">Abi Attending Event</h1>
        <label
          htmlFor="proposal_address"
          className="flex flex-col items-start justify-center"
        >
          <p>Proposal Link</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled" 
          value = {eventAddress}
          id="proposal_address"
          name="proposal_address"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="member_account"
          className="flex flex-col items-start justify-center"
        >
          <p>Member account</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled" 
          value = {currentAccount}
          id="member_account"
          name="member_account"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />

        <button onClick={Vote_Agree} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Agree
        </button>
        <br>
        </br>
        <div>
          <button onClick={Vote_Oppose} className="p-3 px-10 text-white rounded-xl bg-[#ca9267] font-bold">
            Oppose
          </button>
        </div>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Vote Num is {voteDetail}</p>) : ''
          }
        </div>

      </div>
    </div>
  )
}

export default Vote
