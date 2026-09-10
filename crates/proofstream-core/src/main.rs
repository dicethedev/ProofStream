use proofstream_core::{build_proof, sample_records};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let packet = build_proof(&sample_records(), 0)?;
    println!("{}", serde_json::to_string_pretty(&packet)?);
    Ok(())
}
