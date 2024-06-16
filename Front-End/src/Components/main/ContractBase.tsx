import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import classes from "./ContractBase.module.scss";
import Spinner from "../spinner/Spinner";
import ContractABI from "../../App/ContractABI.json";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";

const VotingAddress = "0xE690C0503BEc390231387ca9FC2c36404445b9fE";

interface Option {
  name: string;
  voteCount: number;
}

const VotingABI = ContractABI;

const Voting = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [newRemove, setNewRemove] = useState("");
  const [contractOwner, setOwner] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnDisabled, setbtn] = useState(false);
  const [, setError] = useState<string | null>(null);

  // Ethers
  const [, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Wagmi
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();

  useEffect(() => {
    const getResults = async () => {
      const owner = await (contract as any).owner();

      const Results: any = await (contract as any).GetVoteResults();

      const candidate = Results[0];

      const voteCount = Results[1];

      const candidateResults = [];
      for (let i = 0; i < candidate.length; i++) {
        candidateResults.push({
          name: candidate[i],
          voteCount: voteCount[i].toString(),
        });
        setOptions(candidateResults);
      }

      setOwner(owner);
    };

    if (isConnected) {
      setShowMore(true);
    }
    if (!contract) ConnectToWallet();

    if (!!contract) {
      console.log(!!contract);
      getResults();
    }
  }, [contract, isConnected]);

  const ConnectToCorrectChain = async () => {
    try {
      switchChain({ chainId: chains[0].id });
    } catch (error) {
      console.error("Error checking chain:", error);
    }
  };

  const ConnectToWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const signer = await web3Provider.getSigner();
        setSigner(signer);

        const votingContract = new ethers.Contract(
          VotingAddress,
          VotingABI,
          signer
        );
        setContract(votingContract);
        setShowMore(true);
      } catch (error) {
        console.error("User rejectet wallet connect", error);
      }
    }
  };

  const removePerson = async () => {
    if (contract && newRemove) {
      const remove = await contract.removePerson(newRemove);
      await remove.wait();
      setNewRemove("");
    }
  };
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
          {/* Address and Connect, Disconnect Buttons */}
          {address && isConnected ? (
            <div>
              <p className={classes["info"]} id="account">
                Connected as: {address}
              </p>
              <button
                className={classes["button-30"]}
                onClick={() => {
                  disconnect();
                  setShowMore(false);
                }}
              >
                Disconnect
              </button>
              {chainId === chains[0].id ? (
                <div></div>
              ) : (
                <div className={classes["ChainChecker"]}>
                  <h1>Please switch to the correct chain</h1>
                  {chains.map((chain) => (
                    <button
                      className={classes["messageBtn"]}
                      key={chain.id}
                      onClick={ConnectToCorrectChain}
                    >
                      Switch to {chain.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button className={classes["button-30"]} onClick={ConnectToWallet}>
              Connect to Wallet
            </button>
          )}
          {/* Only Owenr: Add and Remove Candidates */}
          {address === contractOwner ? (
            <div className={classes["Owner-Container"]}>
              <h2>Add Person</h2>
              <input
                className={classes["candidate-input"]}
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
              <h2>Remove Person</h2>
              <input
                className={classes["candidate-input"]}
                placeholder="Person's index"
                type="text"
                value={newRemove}
                onChange={(e) => setNewRemove(e.target.value)}
              />
              <button className={classes["button-30"]} onClick={removePerson}>
                Remove
              </button>
            </div>
          ) : (
            <div></div>
          )}
          {/* Candidates options and results */}
          {showMore && (
            <div className={classes["Results"]}>
              <div className={classes["candidates-container"]}>
                <div className={classes["vote-for-results"]}>
                  <h2>Vote for a Person</h2>
                  {options.map((option, index) => (
                    <div key={index} className={classes["candidates-rows"]}>
                      <input
                        type="checkbox"
                        value={index}
                        checked={selectedOption === index}
                        onChange={() => setSelectedOption(index)}
                      />
                      <label className={classes["candidates"]} id="person">
                        <p>{option.name}</p>
                      </label>
                    </div>
                  ))}
                  <hr />
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
                </div>
              </div>
              <div className={classes["candidates-container"]}>
                <div className={classes["vote-for-results"]}>
                  <h2>Vote Results</h2>
                  {options.map((option, index) => (
                    <div className={classes["candidates-rows"]} key={index}>
                      <label
                        className={classes["candidates"]}
                        id="result"
                        key={index}
                      >
                        <p>
                          Candidate: {option.name} Votes: {option.voteCount}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Message for non Copywrite */}
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
