import os
import time
import random
import itertools
import folium
import requests
from haversine import haversine
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId

# 💰 Fixed shipping fee
SHIPPING_FEE = 100

# 🔐 Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")
OPENCAGE_API_KEY = os.getenv("OPENCAGE_API_KEY")

# 🌐 Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["Amazon"]
orders_collection = db["orders"]
user_collection = db["users"]
# 📥 Fetch non-delivered, group orders
orders = list(orders_collection.find({
    "orderStatus": {"$ne": "delivered"},
    "deliveryOption": "group",
    "$or": [
        { "embeddedMap": { "$eq": "empty" } },
        { "embeddedMap": { "$eq": "" } },
        { "embeddedMap": { "$exists": False } }
    ]
}))
print(f"Total matching orders: {len(orders)}")

# 📍 Geocode with OpenCage
def opencage_geocode(address):
    url = "https://api.opencagedata.com/geocode/v1/json"
    params = {
        "q": address,
        "key": OPENCAGE_API_KEY,
        "limit": 1,
        "countrycode": "in"
    }
    try:
        resp = requests.get(url, params=params, headers={"User-Agent": "shipment-map/1.0"})
        resp.raise_for_status()
        data = resp.json()
        if data["results"]:
            loc = data["results"][0]["geometry"]
            return (loc["lat"], loc["lng"])
    except Exception as e:
        print(f" Geocoding failed for '{address}': {e}")
    return None

# 📍 Construct and Geocode from MongoDB Orders
geocoded = []

for order in orders:
    shipping = order.get("shippingAddress", {})
    parts = [
        shipping.get("street", "").strip(),
        shipping.get("city", "").strip(),
        shipping.get("state", "").strip(),
        shipping.get("pincode", "").strip(),
        shipping.get("country", "").strip()
    ]
    full_address = ", ".join([p for p in parts if p])

    if not full_address:
        print(f" Skipping order {order['_id']} due to incomplete address")
        continue

    print(f" Geocoding order {order['_id']}: {full_address}")
    coords = opencage_geocode(full_address)

    if coords:
        geocoded.append({
            "orderId": str(order["_id"]),
            "address": full_address,
            "coords": coords
        })
    else:
        print(f" Geocoding failed for order {order['_id']}  {full_address}")

    time.sleep(0.5)

# 🚚 Grouping Logic
def all_within_radius(group, radius_km=5):
    for a, b in itertools.combinations(group, 2):
        if haversine(a["coords"], b["coords"]) > radius_km:
            return False
    return True

def group_addresses(geocoded, radius_km=5):
    groups = []
    for item in geocoded:
        added = False
        for group in groups:
            if all_within_radius(group + [item], radius_km):
                group.append(item)
                added = True
                break
        if not added:
            groups.append([item])
    return groups

shipment_groups = group_addresses(geocoded)

# 💸 Update discount in database
for group in shipment_groups:
    group_size = len(group)
    if group_size == 0:
        continue
    discount = round(SHIPPING_FEE / group_size, 2)
    for item in group:
        discount_value = round(100 - discount, 2)

        result = orders_collection.update_one(
            {"_id": ObjectId(item["orderId"])},
            {"$set": {"discount": discount_value}}
        )
        order = orders_collection.find_one({"_id": ObjectId(item["orderId"])})

        user_collection.update_one(
            {"userId": order["user"]},
            {"$inc": {"walletPoints": discount_value}}
        )
        print(f" Updated order {item['orderId']} with discount {discount_value}")

# 🗺️ Generate Map
m = folium.Map(location=[22.9734, 78.6569], zoom_start=5)

def random_color():
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

for i, group in enumerate(shipment_groups, 1):
    color = random_color()
    for item in group:
        folium.Marker(
            location=item["coords"],
            popup=f"Shipment {i}<br>{item['address']}",
            tooltip=item["address"],
            icon=folium.Icon(color="blue", icon="truck", prefix='fa')
        ).add_to(m)

    if len(group) > 1:
        lats = [item["coords"][0] for item in group]
        lngs = [item["coords"][1] for item in group]
        center = (sum(lats)/len(lats), sum(lngs)/len(lngs))
        folium.Circle(
            location=center,
            radius=5000,
            color=color,
            fill=True,
            fill_opacity=0.2,
            popup=f"Shipment {i}"
        ).add_to(m)

# 💾 Save map
m.save("shipment_map.html")
print(" Map saved to shipment_map.html  open in your browser.")
import gridfs

# 🔗 Setup GridFS to store files in MongoDB
fs = gridfs.GridFS(db)
# 📍 Generate map for each order: show ALL orders, highlight current one
for current_order in geocoded:
    current_coords = current_order["coords"]
    zoom_map = folium.Map(location=current_coords, zoom_start=11)

    # Identify current group
    current_group = None
    for group in shipment_groups:
        if any(item["orderId"] == current_order["orderId"] for item in group):
            current_group = group
            break

    if not current_group:
        print(f"Skipping order {current_order['orderId']} (no group)")
        continue

    # Draw all other groups with blue circles
    for group in shipment_groups:
        if group == current_group:
            continue  # Skip current group for now

        # Draw markers and blue circle
        lats = [item["coords"][0] for item in group]
        lngs = [item["coords"][1] for item in group]
        center = (sum(lats) / len(lats), sum(lngs) / len(lngs))

        folium.Circle(
            location=center,
            radius=5000,
            color="blue",
            fill=True,
            fill_opacity=0.1
        ).add_to(zoom_map)

        for item in group:
            folium.Marker(
                location=item["coords"],
                popup=(
                    f"<b>Order ID:</b> {item['orderId']}<br>"
                    f"<b>Address:</b> {item['address']}"
                ),
                tooltip=item["address"],
                icon=folium.Icon(color="blue", icon="truck", prefix="fa")
            ).add_to(zoom_map)

    # Draw current group with red circle and red marker for current order
    lats = [item["coords"][0] for item in current_group]
    lngs = [item["coords"][1] for item in current_group]
    center = (sum(lats) / len(lats), sum(lngs) / len(lngs))

    folium.Circle(
        location=center,
        radius=5000,
        color="red",
        fill=True,
        fill_opacity=0.2
    ).add_to(zoom_map)

    for item in current_group:
        is_current = str(item["orderId"]) == str(current_order["orderId"])
        folium.Marker(
            location=item["coords"],
            popup=(
                f"<b>Order ID:</b> {item['orderId']}<br>"
                f"<b>Address:</b> {item['address']}"
            ),
            tooltip="Your Order" if is_current else item["address"],
            icon=folium.Icon(
                color="red" if is_current else "blue",
                icon="star" if is_current else "truck",
                prefix="fa"
            )
        ).add_to(zoom_map)


    # Save and embed
    html_file_path = f"map_{current_order['orderId']}.html"
    zoom_map.save(html_file_path)

    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    orders_collection.update_one(
        {"_id": ObjectId(current_order["orderId"])},
        {"$set": {"embeddedMap": html_content}}
    )

    os.remove(html_file_path)
    print(f" Map updated with current and background groups for {current_order['orderId']}")
