from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
# from hedera import PrivateKey

# Generate a new Hedera private key (Ed25519 key)
private_key = "302e020100300506032b657004220420af589687ca3cf7ed7e4803688f7c1d83423e9d3bf41332797b9091bd7411e740"
public_key = "302a300506032b6570032100f636fbce75a08d6470b8e51f5ac014b71c34da7fb6ba9f608f508c8d771d6d3f"
# Extract the private and public keys from the Hedera key
private_key_bytes =bytes.fromhex(private_key)#.to_bytes()
public_key_bytes = bytes.fromhex(public_key)

# Convert the Hedera Private Key to PEM format (Ed25519 key in PKCS8 format)
private_key_pem = private_key_bytes.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# Convert the Hedera Public Key to PEM format (SubjectPublicKeyInfo format)
public_key_pem = public_key_bytes.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

# Print the PEM formatted keys
print("Private Key in PEM format:\n", private_key_pem.decode('utf-8'))
print("Public Key in PEM format:\n", public_key_pem.decode('utf-8'))

# Save to files (Optional)
with open("private_key.pem", "wb") as private_file:
    private_file.write(private_key_pem)

with open("public_key.pem", "wb") as public_file:
    public_file.write(public_key_pem)