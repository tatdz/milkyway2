// src/components/ValidatorRow.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { AttestButton } from './AttestButton';

interface Validator {
  id: number;
  name: string;
  // other validator fields ...
}

interface ValidatorRowProps {
  validator: Validator;
  nullifierHash: string;
  contractAddress: string;
  contractAbi: any;
  provider: ethers.providers.Web3Provider | null;
}

export const ValidatorRow: React.FC<ValidatorRowProps> = ({
  validator,
  nullifierHash,
  contractAddress,
  contractAbi,
  provider,
}) => {
  const { data: hasAttested, isLoading } = useQuery(
    ['nullifierUsed', nullifierHash],
    async () => {
      if (!provider) return false;
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);
      return await contract.isNullifierUsed(nullifierHash);
    },
    { enabled: Boolean(provider && nullifierHash) }
  );

  return (
    <tr>
      <td>{validator.name}</td>
      {/* other validator info columns */}

      <td>
        {isLoading ? (
          <span>Loading...</span>
        ) : hasAttested ? (
          <span className="text-green-600 font-semibold">Attested</span>
        ) : (
          <AttestButton
            validatorId={validator.id}
            nullifier={nullifierHash}
            contractAddress={contractAddress}
            contractAbi={contractAbi}
            provider={provider}
          />
        )}
      </td>
    </tr>
  );
};
