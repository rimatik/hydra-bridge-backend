import { ethers } from "ethers";
import Web3 from "web3";
import { BuildTxResponseDto } from "../common/dtos";
require("dotenv").config();
const { ETH_INFURA_ID, ETH_NETWORK, ETH_CHAIN_ID } = process.env;

export const getProviderUrl = () => {
  let provider = `https://${ETH_NETWORK}.infura.io/v3/${ETH_INFURA_ID}`;

  if (ETH_CHAIN_ID === "1337") {
    provider = "http://localhost:8545";
  }
  return provider;
};

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(getProviderUrl(), {
    chainId: Number(ETH_CHAIN_ID),
    name: ETH_NETWORK,
  });
};

export const getSigner = () => {
  return getProvider().getSigner();
};

export const encodeParameter = (
  type: string = "uint256",
  amount: string | number | undefined
) => {
  const web3 = new Web3(getProviderUrl());
  return amount ? web3.eth.abi.encodeParameter(type, amount) : undefined;
};


export const decodeParameter = (
  type: string = "uint256",
  data : any
) => {
  const web3 = new Web3(getProviderUrl());
  return data ? web3.eth.abi.decodeParameter(type, data) : undefined;
};

export const calculateTransactionCost = async (
  params: BuildTxResponseDto
): Promise<string> => {
  const web3 = new Web3(getProviderUrl());
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = await web3.eth.estimateGas(params);
  var transactionFee = Number.parseInt(gasPrice) * gasLimit;
  return ethers.utils.formatEther(transactionFee);
};
