import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SpinnerRoundFilled } from "spinners-react";
import limeLogo from "../assets/limeLogo.png";

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
      const tx = await contract.addPerson(newPerson);
      await tx.wait();
      setNewPerson("");
      const updatedOptions = [...options, { name: newPerson, voteCount: 0 }];
      setOptions(updatedOptions);
    }
    return (
      <div>
        <SpinnerRoundFilled className="spinner" enabled={true} />
      </div>
    );
  };

  const voteForOption = async () => {
    if (contract && selectedOption !== null) {
      const tx = await contract.voteForOption(selectedOption);
      await tx.wait();
      const updatedOptions = options.map((option, index) =>
        index === selectedOption
          ? { ...option, voteCount: option.voteCount + 1 }
          : option
      );
      setOptions(updatedOptions);
    }
  };

  return (
    <div className="Voting">
      <img className="logo" src={limeLogo} alt=""></img>
      <div className="Content">
        <h1>Voting DApp</h1>
        {account && <p>Connected as: {account}</p>}
        <h2>Add Person</h2>
        <input
          className="input"
          placeholder="Full Name"
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
        />
        <button className="button-30" onClick={addPerson}>
          Add Person
        </button>
        {/* <SpinnerRoundFilled className="spinner" enabled={true} /> */}
        <h2>Vote for a Person</h2>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              value={index}
              checked={selectedOption === index}
              onChange={() => setSelectedOption(index)}
            />
            {option.name} - {option.voteCount} votes
          </div>
        ))}
        <button className="button-30" onClick={voteForOption}>
          Vote
        </button>
        <h2>Vote Results</h2>
        {options.map((option, index) => (
          <div className="expanding-div" key={index}>
            {option.name}: {option.voteCount}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Voting;
