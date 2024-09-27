from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization

# Step 1: Generate an Ed25519 private key
private_key = ed25519.Ed25519PrivateKey.generate()
print(str(private_key.hex()))

# Step 2: Generate the corresponding public key
public_key = private_key.public_key()

# Step 3: Message to be signed
message = b"This is a secret message!"

# Step 4: Sign the message using the private key
signature = private_key.sign(message)

print("Signature (Hex):", signature.hex())

# Step 5: Verify the signature using the public key
try:
    public_key.verify(signature, message)
    print("The signature is valid.")
except:
    print("The signature is invalid.")