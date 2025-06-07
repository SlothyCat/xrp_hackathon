from flask import Flask, request, jsonify 
import xrpl 
from flask_cors import CORS
from xrpl.wallet import Wallet
from xrpl.core.keypairs import derive_keypair
from xrpl.transaction import autofill, sign, submit_and_wait



print("Starting Flask backend...")


app = Flask(__name__)
CORS(app)

# Connection to paynet 
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234"
client = xrpl.clients.JsonRpcClient(JSON_RPC_URL)

@app.route("/send", methods=["POST"])
def send_payment(): 
    # define constants
    data = request.json
    seed = data.get("seed")
    destination = data.get("destination")
    amount = float(data.get("amount"))

    try: 
        # Load wallet - opens a wallet using a secret private key 
        public_key, private_key = derive_keypair(seed)
        wallet = Wallet(seed=seed, public_key=public_key, private_key=private_key)

        # Create payment tx - creating a draft of a payment transaction 
        payment = xrpl.models.transactions.Payment(
            account=wallet.classic_address, 
            amount=xrpl.utils.xrp_to_drops(amount),
            destination=destination,
        )

        # autofill, sign, and submit - fills in  missing blanks like fees, network info etc, signs cheque using wallet key, gets the current exchange rate
        tx = autofill(payment, client)
        signed_tx = sign(tx, wallet)
        response = submit_and_wait(signed_tx, client)

        tx_hash = response.result.get("hash")
        result = response.result.get("meta", {}).get("TransactionResult")

        # if transaction succeeded, return transaction hash and a link to view it online 
        if result == "tesSUCCESS":
            return jsonify({
                "success": True,
                "txHash": tx_hash, 
                "explorer": f"https://testnet.xrpl.org/transactions/{tx_hash}"
            })
        else:
            return jsonify({"success": False, "error": result})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(port=3000)
            