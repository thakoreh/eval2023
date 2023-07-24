from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import datetime
from datetime import datetime, timedelta
import requests


from blockcypher import simple_spend
from blockcypher import create_unsigned_tx
from blockcypher import make_tx_signatures
from blockcypher import broadcast_signed_transaction
from blockcypher import get_address_details

app = FastAPI()
__APITOKEN__ = "2365d842cd384fe589d8434ffe7438c9"


origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:8000/balance/test",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a MongoClient to the running MongoDB instance
# MongoDB connection
uri = f"mongodb+srv://super:admin@wallet-manager-db.vdsnyqp.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"))
# Send a ping to confirm a successful connection
client.admin.command("ping")
print("Pinged your deployment. You successfully connected to MongoDB!")
# db = client["wallet-manager-db"]
db = client["wallets-db"]


class WalletModel(BaseModel):
    public_key: str
    private_key: str


class Transaction(BaseModel):
    walletAddress: str
    destination: str
    amount: str


class BroadcastModel(BaseModel):
    transaction_data: str


@app.get("/")
async def home():
    return {"Hello": "World"}


@app.get("/wallets")
async def list_wallets():
    # Here, you'd get wallet list.
    final_list = []
    wallets_name = db["wallets-name"]

    res = list(wallets_name.find({"walletName": {"$exists": True}}))
    for index, wallet in enumerate(res):
        final_list.append(
            {
                "index": index,
                "wallet_name": wallet["walletName"],
                "wallet_address": wallet["walletAddress"],
            }
        )

    return final_list


@app.get("/wallets/{walletAddress}")
async def get_wallet(walletAddress):
    # Here, you'd get wallet list.
    final_list = []
    print(walletAddress)

    wallets_name = db["wallets-name"]

    res = list(wallets_name.find({"walletAddress": walletAddress}, {"_id": 0}))

    balance_sheet = db["balance-sheet"]

    bln_record = list(balance_sheet.find({"walletAddress": walletAddress}, {"_id": 0}))

    balance = bln_record[0]["balance"]

    res[0].update({"balance": balance})
    print(res[0])
    return res[0]


@app.get("/search/{walletAddress}")
async def search_wallet_in_db(walletAddress):
    final_list = []
    public_wallets = db["public-wallets"]

    # Fetch wallet from MongoDB
    res = list(public_wallets.find({"walletAddress": walletAddress}, {"_id": 0}))

    # If wallet not found, return a message
    if len(res) == 0:
        return {
            "status_code": 404,
            "message": f"No wallet found with address {walletAddress}",
        }

    # Get the last update time from the wallet data
    last_update_time = res[0]["date"]

    # Check if the last update time is more than 30 minutes ago
    if datetime.utcnow() - last_update_time > timedelta(minutes=30):
        # Fetch fresh data from BlockCypher
        response = requests.get(
            f"https://api.blockcypher.com/v1/bcy/test/addrs/{walletAddress}"
        )
        data = response.json()

        # Update the wallet information in MongoDB
        public_wallets.update_one({"walletAddress": walletAddress}, {"$set": data})

        # Replace the old wallet data with the fresh data
        res[0] = data

    transactions = db["transactions"]
    tx_list = list(
        transactions.find({"source_address": walletAddress}, {"_id": 0}).limit(10)
    )
    res[0].update({"transactions": tx_list})
    print({"status_code": 200, "data": res[0]})

    return {"status_code": 200, "data": res[0]}


@app.get("/search/blockcypher/{walletAddress}")
async def search_wallet_in_blockcypher(walletAddress):
    # querying block cypher for address
    # result = get_address_details(walletAddress)
    address_url = f"https://api.blockcypher.com/v1/bcy/test/addrs/{walletAddress}"

    result = requests.get(address_url).json()
    if "error" in result:
        return {"status_code": 404, "message": result["error"]}
    print(result)
    wallet_data = {
        "walletAddress": result["address"],
        "date": datetime.utcnow(),
        "balance": result["final_balance"],
    }
    public_wallets = db["public-wallets"]
    public_wallets.insert_one(wallet_data)
    final_txs = []
    if "txrefs" in result:
        for count, eachTransaction in enumerate(result["txrefs"]):
            tx_data = {
                "tx_id": eachTransaction["tx_hash"],
                "amount": eachTransaction["value"],
                "coin_symbol": "bcy",
                "source_address": walletAddress,
                "confirmations": eachTransaction["confirmations"],
            }
            final_txs.append(tx_data)
            if count > 10:
                break

        transactions = db["transactions"]

        transactions.insert_many(final_txs)

    return {"status_code": 200, "data": result}


@app.get("/wallet")
async def create_wallet():
    # Here, you'd generate a new wallet and return the keys.

    # we need to generate wallet address and then wallet itself
    "https://api.blockcypher.com/v1/btc/test3/addrs"
    return {"name": "hi"}


class WalletName(BaseModel):
    walletName: str


@app.post("/wallet")
async def create_wallet(walletName: WalletName):
    # Here, you'd generate a new wallet and return the keys.

    # we need to generate wallet address and then wallet itself
    create_address_url = "https://api.blockcypher.com/v1/bcy/test/addrs"
    response_address = requests.post(create_address_url)
    response_addressJSON = json.loads(response_address.content)

    wallet_data = {
        "walletName": walletName.walletName,
        "walletAddress": response_addressJSON["address"],
        "private": response_addressJSON["private"],
        "public": response_addressJSON["public"],
        "wif": response_addressJSON["wif"],
    }

    create_wallet_url = (
        f"https://api.blockcypher.com/v1/bcy/test/wallets?token={__APITOKEN__}"
    )
    jsonData = {
        "name": wallet_data["walletName"],
        "addresses": [f"{wallet_data['walletAddress']}"],
    }
    response_wallet = requests.post(create_wallet_url, json=jsonData)

    print(response_wallet)
    balance_sheet = db["balance-sheet"]
    balance_data = {
        "walletName": walletName.walletName,
        "walletAddress": response_addressJSON["address"],
        "balance": 0,
    }
    result = balance_sheet.insert_one(balance_data)

    wallets = db["wallets-name"]
    # Store the wallet in MongoDB
    result = wallets.insert_one(wallet_data)

    # Prepare the response
    response = wallet_data
    response["_id"] = str(result.inserted_id)  # Convert ObjectId to string

    return response


@app.post("/updatebalance")
async def create_transaction(transaction: Transaction):
    # update transaction
    balance_sheet = db["balance-sheet"]

    balance_sheet.update_one(
        {"walletAddress": transaction.walletAddress},
        {"$inc": {"balance": -int(transaction.amount)}},
    )
    print("Updated transaction successfully")
    return {"status_code": 204}


class FaucetRequested(BaseModel):
    walletAddress: str
    amountRequested: str


@app.post("/requestfaucet")
async def request_faucet(faucetRequested: FaucetRequested):
    # Here, you'd generate a new wallet and return the keys.

    # we need to generate wallet address and then wallet itself
    walletAddress = faucetRequested.walletAddress
    amountRequested = faucetRequested.amountRequested
    from blockcypher import send_faucet_coins

    response_faucet = send_faucet_coins(
        address_to_fund=walletAddress,
        satoshis=int(amountRequested),
        api_key=__APITOKEN__,
        coin_symbol="bcy",
    )

    print(response_faucet)

    transactions_faucet = db["transactions-faucet"]

    transactions_faucet_data = {
        "address": walletAddress,
        "amount": amountRequested,
        "tx_ref": response_faucet["tx_ref"],
    }

    # Store the wallet in MongoDB
    result = transactions_faucet.insert_one(transactions_faucet_data)

    # update balance
    balance_sheet = db["balance-sheet"]
    balance_sheet.update_one(
        {"walletAddress": walletAddress}, {"$inc": {"balance": int(amountRequested)}}
    )
    # Prepare the response
    response = transactions_faucet_data
    response["_id"] = str(result.inserted_id)  # Convert ObjectId to string

    # update balance
    transactions = db["transactions"]
    transactions.insert_one(
        {
            "walletAddress": walletAddress,
            "destination_address": walletAddress,
            "amount": int(amountRequested),
            "coin_symbol": "bcy",
            "tx_id": response_faucet["tx_ref"],
            "confirmations": 0,
            "isFaucet": True,
        }
    )

    return response


@app.get("/balance/{walletAddress}")
async def get_balance(walletAddress):
    balance_sheet = db["balance-sheet"]

    return balance_sheet.find_one({"walletAddress": walletAddress.strip()})["balance"]


@app.get("/transactions/walletAddress/{walletAddress}")
async def get_transactions_for_wallet_address(walletAddress):
    transactions = db["transactions"]
    try:
        res = list(
            transactions.find({"source_address": walletAddress.strip()}, {"_id": 0})
        )
        return res
    except Exception:
        return []


@app.post("/transaction")
async def perform_transaction(transaction: Transaction):
    # Here, you'd broadcast a transaction to the Bitcoin testnet network.
    # The request data should include the transaction details.
    wallet_name = db["wallets-name"]
    print(transaction)

    private_key = wallet_name.find_one(
        {"walletAddress": transaction.walletAddress.strip()}
    )["private"]

    print(private_key)

    try:
        response_txs = simple_spend(
            from_privkey=private_key,
            to_address=transaction.destination,
            to_satoshis=int(transaction.amount),
            coin_symbol="bcy",
            api_key=__APITOKEN__,
        )
        print(response_txs)
    except Exception as e:
        if "Build Unsigned TX Error" in str(e):
            return {
                "status_code": 400,
                "message": "Please increase sending amount, It is too low",
            }
        return {
            "message": "Internal Server Error. Please check your address again!",
            "status_code": 500,
        }

    transactions = db["transactions"]
    transactions_data = {
        "source_address": transaction.walletAddress,
        "destination_address": transaction.destination,
        "amount": int(transaction.amount),
        "coin_symbol": "bcy",
        "tx_id": response_txs,
        "confirmations": 0,
    }

    transactions.insert_one(transactions_data)

    balance_sheet = db["balance-sheet"]
    balance_sheet.update_one(
        {"walletAddress": transaction.destination},
        {"$inc": {"balance": int(transaction.amount)}},
    )
    balance_sheet.update_one(
        {"walletAddress": transaction.walletAddress},
        {"$inc": {"balance": -int(transaction.amount)}},
    )

    return {"response": response_txs, "status_code": 201}
