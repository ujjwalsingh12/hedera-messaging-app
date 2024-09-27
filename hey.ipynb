To use a previously generated Ed25519 key for signing or verifying a message, you can load the key from its stored format. The key could be stored in a file, a string, or in a byte array. Here’s how you can use a previously generated key, covering the most common storage formats: PEM, byte array, and hex string.

### 1. **Using a Key Stored in PEM Format**

#### Loading a Private Key from PEM

```python
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

# Load a private key from a PEM string or file
private_key_pem = b"""-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIDyMDrEzDa3UeE4aJW6pN2YmAIldYavqqHZqZg9SGGp3
-----END PRIVATE KEY-----"""

# Convert the PEM key to an Ed25519 private key object
private_key = serialization.load_pem_private_key(
    private_key_pem,
    password=None,  # Replace with the password if the key is encrypted
    backend=default_backend()
)

# Now you can use this private key to sign messages
message = b"Sample message to sign"
signature = private_key.sign(message)
print("Signature (Hex):", signature.hex())
```

#### Loading a Public Key from PEM

```python
# Load a public key from a PEM string or file
public_key_pem = b"""-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAtGRP1czgLp4sWy5OU1+xXHJmZ2xA0VhoUItB7Uz67kM=
-----END PUBLIC KEY-----"""

# Convert the PEM key to an Ed25519 public key object
public_key = serialization.load_pem_public_key(
    public_key_pem,
    backend=default_backend()
)

# Now you can use this public key to verify messages
try:
    public_key.verify(signature, message)
    print("The signature is valid.")
except:
    print("The signature is invalid.")
```

### 2. **Using a Key Stored as Raw Bytes**

If your private or public key is stored as a byte array, you can load it directly.

#### Private Key from Bytes
```python
from cryptography.hazmat.primitives.asymmetric import ed25519

# Assume private_key_bytes is your previously generated private key in bytes
private_key_bytes = bytes.fromhex('d2c8edfa83e9c4b0a2b25ed3a11a1a53d47e73da0d2282aef4d3ea2fbe1e8d92')

# Load the private key from bytes
private_key = ed25519.Ed25519PrivateKey.from_private_bytes(private_key_bytes)

# Sign a message
message = b"Sample message to sign"
signature = private_key.sign(message)
print("Signature (Hex):", signature.hex())
```

#### Public Key from Bytes
```python
# Assume public_key_bytes is your previously generated public key in bytes
public_key_bytes = bytes.fromhex('d75aa65f8b2313f6442c68800ef778a2fbb0bbdcbf9f469d4b0c8e4d982d6c08')

# Load the public key from bytes
public_key = ed25519.Ed25519PublicKey.from_public_bytes(public_key_bytes)

# Verify a message
try:
    public_key.verify(signature, message)
    print("The signature is valid.")
except:
    print("The signature is invalid.")
```

### 3. **Using a Key Stored as a Hex String**

If your private or public key is stored as a hexadecimal string, you need to convert it to bytes before using it.

#### Private Key from Hex String
```python
# Hex string representation of the private key
private_key_hex = 'd2c8edfa83e9c4b0a2b25ed3a11a1a53d47e73da0d2282aef4d3ea2fbe1e8d92'

# Convert hex string to bytes
private_key_bytes = bytes.fromhex(private_key_hex)

# Load the private key from bytes
private_key = ed25519.Ed25519PrivateKey.from_private_bytes(private_key_bytes)

# Sign a message
message = b"Sample message to sign"
signature = private_key.sign(message)
print("Signature (Hex):", signature.hex())
```

#### Public Key from Hex String
```python
# Hex string representation of the public key
public_key_hex = 'd75aa65f8b2313f6442c68800ef778a2fbb0bbdcbf9f469d4b0c8e4d982d6c08'

# Convert hex string to bytes
public_key_bytes = bytes.fromhex(public_key_hex)

# Load the public key from bytes
public_key = ed25519.Ed25519PublicKey.from_public_bytes(public_key_bytes)

# Verify a message
try:
    public_key.verify(signature, message)
    print("The signature is valid.")
except:
    print("The signature is invalid.")
```

### Summary:

- **PEM Format**: Use `serialization` methods to load keys from PEM format strings or files.
- **Raw Bytes**: Use the `from_private_bytes` or `from_public_bytes` methods to load keys directly from bytes.
- **Hex Strings**: Convert hex strings to bytes using `bytes.fromhex()` before loading them as keys.

This approach allows you to use previously generated keys stored in various formats for signing and verifying messages. Let me know if you need more specific details or help with other formats!