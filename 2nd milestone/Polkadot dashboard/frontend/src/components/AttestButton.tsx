// src/components/AttestButton.tsx
import React from 'react';
import { useAttest } from '../hooks/useAttest';

interface AttestButtonProps {
  validatorId: number;
  nullifier: string;
  contractAddress: string;
  contractAbi: any;
  provider: any;
}

export const AttestButton: React.FC<AttestButtonProps> = ({
  validatorId,
  nullifier,
  contractAddress,
  contractAbi,
  provider,
}) => {
  const { mutate: attest, isLoading, isError, error } = useAttest(contractAddress, contractAbi, provider);

  return (
    <button
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
      onClick={() => attest({ validatorId, nullifier })}
      title={isError && error?.message ? error.message : undefined}
    >
      {isLoading ? 'Submitting...' : 'Attest'}
    </button>
  );
};
