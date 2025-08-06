// src/hooks/useAttest.ts
import { useMutation } from '@tanstack/react-query';
import { ethers } from 'ethers';

interface AttestationInput {
  validatorId: number;
  nullifier: string;
}

export function useAttest(contractAddress: string, contractAbi: any, provider: ethers.providers.Web3Provider | null) {
  return useMutation(async ({ validatorId, nullifier }: AttestationInput) => {
    if (!provider) throw new Error('No Ethereum provider available');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    const tx = await contract.attest(validatorId, nullifier);
    await tx.wait();
    return tx.hash;
  });
}
