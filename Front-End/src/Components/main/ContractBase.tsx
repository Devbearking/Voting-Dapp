import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import classes from "./ContractBase.module.scss";
import Spinner from "../spinner/Spinner";
import ContractABI from '../../App/ContractABI.json'
import { useAccount, useDisconnect } from 'wagmi'
 
const VotingAddress = "0xfFcEe5d0532D64e69D585F5b3bbCCa8ecBA74562";

interface Option {
  name: string;
  voteCount: number;
}

const VotingABI = ContractABI;

const Voting = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnDisabled, setbtn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect();

  // You don't need this logic. Refactor.
  useEffect(() => {

    const getVoters = async () => {
      const owner = await (contract as any).GetVoteResults();
      console.log('owner', owner)
    }

    if(!!contract) getVoters();

  }, [contract])
  
   const ConnectToWallet = async () => {
   
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      const accounts = await web3Provider.send("eth_requestAccounts", []);
 
      const signer = await web3Provider.getSigner();
      setSigner(signer);
      const votingContract = new ethers.Contract(
        VotingAddress,
        VotingABI,
        signer
      );
      setContract(votingContract);
    }
  };

  // const disconnectWallet = () => {
  //   setAccount(null);
  //   setProvider(null);
  //   setSigner(null);
  //   setContract(null);
  //   setOptions([]);
  //   setShowMore(false);
  // };

  const addPerson = async () => {
    if (contract && newPerson) {
      setIsLoading(!isLoading);
      try {
        const tx = await contract.addPerson(newPerson);
        await tx.wait();
        setNewPerson("");
        const updatedOptions = [...options, { name: newPerson, voteCount: 0 }];
        setOptions(updatedOptions);
        setIsLoading(isLoading);
        if (!showMore) setShowMore(true);
      } catch (error) {
        if ((error as any).code === 4001) {
          setError("Transaction rejected by user.");
        } else {
          setError("An error occurred during the transaction.");
        }
        setIsLoading(false);
      }
    }
  };

  const voteForOption = async () => {
    setbtn(!isBtnDisabled);
    setIsLoading(!isLoading);
    if (contract && selectedOption !== null) {
      try {
        const tx = await contract.voteForOption(selectedOption);
        await tx.wait();
        const updatedOptions = options.map((option, index) =>
          index === selectedOption
            ? { ...option, voteCount: option.voteCount + 1 }
            : option
        );
        setbtn(isBtnDisabled);
        setOptions(updatedOptions);
        setIsLoading(isLoading);
      } catch (error) {
        if ((error as any).code === 4001) {
          setError("Transaction rejected by user.");
        } else {
          setError("An error occurred during the transaction.");
        }
        setIsLoading(false);
        setbtn(isBtnDisabled);
      }
    }
  };

  return (
    <div>
      <div className={classes["Voting"]}>
        <div className={classes["Content"]}>
          <h1>Voting DApp</h1>
          {address && isConnected ? (
            <p className={classes["info"]} id="account">
              Connected as: {address}
              <button onClick={() => disconnect()}>Disconnect</button>
            </p>
          ) : (
            <button className={classes["button-30"]} onClick={ConnectToWallet}>
              Connect to Wallet
            </button>
          )}
          <h2>Add Person</h2>
          <input
            className={classes["input"]}
            placeholder="Full Name"
            type="text"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
          />
          {isLoading && isBtnDisabled === false ? (
            <Spinner />
          ) : (
            <button
              className={classes["button-30"]}
              onClick={addPerson}
              disabled={isBtnDisabled || !isConnected}
            >
              Add Person
            </button>
          )}
          {showMore && (
            <div>
              <h2>Vote for a Person</h2>
              {options.map((option, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                  />
                  <label className={classes["candidates"]} id="person">
                    {option.name}
                  </label>
                </div>
              ))}
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  className={classes["button-30"]}
                  onClick={voteForOption}
                  // disabled={}
                >
                  Vote
                </button>
              )}
              <h2>Vote Results</h2>
              {options.map((option, index) => (
                <label
                  className={classes["candidates"]}
                  id="result"
                  key={index}
                >
                  {option.name}: {option.voteCount}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={classes["message"]}>
        <h1 className={classes["messageHeading"]}>Important Message !!!</h1>
        <p>
          This Voting Dapp is a decentralized application designed to facilitate
          secure and transparent voting processes. Created for a specific job
          application, it is intended solely for demonstration purposes and is
          not for sale or commercial use. The Dapp showcases the candidate's
          skills in blockchain technology, smart contract development, and user
          interface design.
        </p>
        <h3>Disclaimer:</h3>
        <p>
          This Voting Dapp is a non-commercial, educational project created
          specifically for a job application. It is not intended for public
          deployment, commercial use, or any real-world voting scenarios. The
          code and application are provided "as-is" without any warranties or
          guarantees of functionality or security.
        </p>
      </div>
    </div>
  );
};

export default Voting;
