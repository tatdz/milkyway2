package valueobjects

import "errors"

// BlockRange represents a range of blocks
type BlockRange struct {
	StartBlock int
	EndBlock   int
}

// NewBlockRange creates a new block range
func NewBlockRange(startBlock, endBlock int) (*BlockRange, error) {
	if startBlock < 0 {
		return nil, errors.New("start block cannot be negative")
	}
	if endBlock < 0 {
		return nil, errors.New("end block cannot be negative")
	}
	if startBlock > endBlock {
		return nil, errors.New("start block cannot be greater than end block")
	}

	return &BlockRange{
		StartBlock: startBlock,
		EndBlock:   endBlock,
	}, nil
}

// Contains returns true if the given block is within the range
func (br *BlockRange) Contains(block int) bool {
	return block >= br.StartBlock && block <= br.EndBlock
}

// IsValid returns true if the block range is valid
func (br *BlockRange) IsValid() bool {
	return br.StartBlock >= 0 && br.EndBlock >= 0 && br.StartBlock <= br.EndBlock
}

// GetRange returns the start and end blocks
func (br *BlockRange) GetRange() (int, int) {
	return br.StartBlock, br.EndBlock
} 