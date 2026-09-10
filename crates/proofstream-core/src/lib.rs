use merkle_core::{
    prelude::*,
    types::{ProofNode, ProofSide},
};
use merkle_variants::BinaryMerkleTree;
use merkleforge_hash::Keccak256;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct EventRecord {
    pub id: String,
    pub label: String,
    pub block_number: Option<u64>,
    pub transaction_hash: Option<String>,
    pub payload: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProofStep {
    pub side: String,
    pub hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ProofPacket {
    pub row: usize,
    pub checked_record: EventRecord,
    pub dataset_root: String,
    pub client_recomputed_root: String,
    pub leaf_hash: String,
    pub sibling_path: Vec<ProofStep>,
    pub valid: bool,
}

#[derive(Debug, thiserror::Error)]
pub enum ProofStreamError {
    #[error("cannot prove row {row}; dataset contains {len} rows")]
    RowOutOfBounds { row: usize, len: usize },
    #[error("dataset must contain at least one record")]
    EmptyDataset,
    #[error("failed to encode event record: {0}")]
    Encoding(#[from] serde_json::Error),
    #[error("merkle operation failed: {0}")]
    Merkle(#[from] MerkleError),
}

pub fn build_proof(records: &[EventRecord], row: usize) -> Result<ProofPacket, ProofStreamError> {
    if records.is_empty() {
        return Err(ProofStreamError::EmptyDataset);
    }

    let Some(record) = records.get(row) else {
        return Err(ProofStreamError::RowOutOfBounds {
            row,
            len: records.len(),
        });
    };

    let mut tree = BinaryMerkleTree::<Keccak256>::new();
    let encoded_records = records
        .iter()
        .map(canonical_event_bytes)
        .collect::<Result<Vec<_>, _>>()?;

    for encoded in &encoded_records {
        tree.insert(encoded)?;
    }

    let proof = tree.generate_proof(LeafIndex(row))?;
    let root = tree.root().ok_or(ProofStreamError::EmptyDataset)?.clone();
    let checked_bytes = canonical_event_bytes(record)?;
    let valid = BinaryMerkleTree::<Keccak256>::verify(&root, &checked_bytes, &proof);
    let client_recomputed_root = recompute_root_hex(&checked_bytes, &proof);

    Ok(ProofPacket {
        row,
        checked_record: record.clone(),
        dataset_root: hex::encode(root),
        client_recomputed_root,
        leaf_hash: hex::encode(Keccak256::hash(&checked_bytes)),
        sibling_path: proof.path.iter().map(proof_step).collect(),
        valid,
    })
}

pub fn sample_records() -> Vec<EventRecord> {
    vec![
        event("swap-1", "tx:alice->bob:100", 19_420_001),
        event("swap-2", "tx:bob->carol:50", 19_420_002),
        event("swap-3", "tx:carol->dave:25", 19_420_003),
        event("swap-4", "tx:dave->erin:10", 19_420_004),
    ]
}

fn canonical_event_bytes(record: &EventRecord) -> Result<Vec<u8>, serde_json::Error> {
    serde_json::to_vec(record)
}

fn proof_step(node: &ProofNode<[u8; 32]>) -> ProofStep {
    let side = match node.side {
        ProofSide::Left => "left",
        ProofSide::Right => "right",
    };

    ProofStep {
        side: side.to_string(),
        hash: hex::encode(node.hash),
    }
}

fn recompute_root_hex(leaf_data: &[u8], proof: &MerkleProof<[u8; 32]>) -> String {
    let mut current = Keccak256::hash(leaf_data);

    for ProofNode { hash, side } in &proof.path {
        current = match side {
            ProofSide::Left => Keccak256::hash_nodes(hash, &current),
            ProofSide::Right => Keccak256::hash_nodes(&current, hash),
        };
    }

    hex::encode(current)
}

fn event(id: &str, label: &str, block_number: u64) -> EventRecord {
    EventRecord {
        id: id.to_string(),
        label: label.to_string(),
        block_number: Some(block_number),
        transaction_hash: Some(format!("0x{id:0<60}")),
        payload: serde_json::json!({
            "source": "demo",
            "kind": "swap",
            "record": label,
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generated_packet_verifies() {
        let packet = build_proof(&sample_records(), 0).expect("proof packet");

        assert!(packet.valid);
        assert_eq!(packet.dataset_root, packet.client_recomputed_root);
        assert_eq!(packet.sibling_path.len(), 2);
    }

    #[test]
    fn out_of_bounds_row_is_rejected() {
        let err = build_proof(&sample_records(), 99).expect_err("row should fail");

        assert!(matches!(
            err,
            ProofStreamError::RowOutOfBounds { row: 99, len: 4 }
        ));
    }
}
