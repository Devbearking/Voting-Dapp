import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import classes from "./ContractBase.module.scss";
import Spinner from "../spinner/Spinner";

const VotingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface Option {
  name: string;
  voteCount: number;
}

const VotingABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "GetVoteResults",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "personName",
        type: "string",
      },
    ],
    name: "addPerson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "numbers",
        type: "uint256[]",
      },
    ],
    name: "hashNumbers",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "options",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "optionIndex",
        type: "uint256",
      },
    ],
    name: "removePerson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "optionIndex",
        type: "uint256",
      },
    ],
    name: "voteForOption",
    outputs: [
      {
        internalType: "string",
        name: "votedFor",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const Voting = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnDisabled, setbtn] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await web3Provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = await web3Provider.getSigner();
        setSigner(signer);

        const votingContract = new ethers.Contract(
          VotingAddress,
          VotingABI,
          signer
        );
        setContract(votingContract);

        const optionsCount = votingContract.options.length;
        const opts: Option[] = [];
        for (let i = 0; i < optionsCount; i++) {
          const option = await votingContract.options(i);
          opts.push({
            name: option.name,
            voteCount: option.voteCount.toNumber(),
          });
        }
        setOptions(opts);
      }
    };
    init();
  }, []);

  const addPerson = async () => {
    if (contract && newPerson) {
      setIsLoading(!isLoading);
      const tx = await contract.addPerson(newPerson);
      await tx.wait();
      setNewPerson("");
      const updatedOptions = [...options, { name: newPerson, voteCount: 0 }];
      setOptions(updatedOptions);
      setIsLoading(isLoading);
      if (showMore === false) setShowMore(!showMore);
    }
  };

  
  const voteForOption = async () => {
    setbtn(!isBtnDisabled)
    setIsLoading(!isLoading);
    if (contract && selectedOption !== null) {
      const tx = await contract.voteForOption(selectedOption);
      await tx.wait();
      const updatedOptions = options.map((option, index) =>
        index === selectedOption
          ? { ...option, voteCount: option.voteCount + 1 }
          : option
      );
      setbtn(isBtnDisabled)
      setOptions(updatedOptions);
      setIsLoading(isLoading);
    }
  };

  return (
    <div>
      <div className={classes["Voting"]}>
        <div className={classes["Content"]}>
          <h1>Voting DApp</h1>
          {account && (
            <p className={classes["info"]} id="account">
              Connected as: {account}
            </p>
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
            <button className={classes["button-30"]} onClick={addPerson} disabled={isBtnDisabled}>
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
                >
                  Vote
                </button>
              )}
              <h2>Vote Results</h2>
              {options.map((option, index) => (
                <label className={classes["candidates"]} id="result" key={index}>
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
