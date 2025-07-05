from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util
import torch
import pandas as pd
import math

app = Flask(__name__)
CORS(app)

# Constants
PRODUCTS_PER_PAGE = 35
TOP_ECO_COUNT = 5
PAGE2_ECO_RATIO = 0.4

# Load model and data
print("🔄 Loading model and data...")
model = SentenceTransformer("all-MiniLM-L6-v2")
df = pd.read_csv("products_clean_updated1.csv")
product_embeddings = torch.load("embeddings_updated1.pt")
print("✅ Model and embeddings loaded.")


def sanitize_product(product):
    return {
        k: (None if isinstance(v, float) and math.isnan(v) else v)
        for k, v in product.items()
    }


@app.route("/")
def home():
    return "✅ GreenKart Flask Server is running!"


@app.route("/search", methods=["GET"])
def search_products():
    query = request.args.get("query", "").strip()
    page = int(request.args.get("page", 1))

    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400

    # Encode query and compute similarity
    query_embedding = model.encode(query, convert_to_tensor=True)
    cosine_scores = util.cos_sim(query_embedding, product_embeddings)[0]
    df["similarity"] = cosine_scores.cpu().numpy()

    # Sort products by similarity
    sorted_df = df.sort_values(by="similarity", ascending=False)

    # Split into eco and non-eco
    eco_df = sorted_df[
        (sorted_df["isOrganic"] == True) & (sorted_df["sustainableScore"] >= 75)
    ].reset_index(drop=True)
    non_eco_df = sorted_df[~sorted_df.index.isin(eco_df.index)].reset_index(drop=True)

    if page == 1:
        # Page 1: 5 top eco + 18 eco + 27 non-eco (shuffled)
        top_eco = eco_df.head(TOP_ECO_COUNT)
        rest_eco = eco_df.iloc[TOP_ECO_COUNT : TOP_ECO_COUNT + 18]
        rest_non_eco = non_eco_df.head(27)

        mixed_rest = pd.concat([rest_eco, rest_non_eco]).sample(frac=1, random_state=42)
        final_df = pd.concat([top_eco, mixed_rest]).reset_index(drop=True)
    else:
        # Page 2 and onwards
        eco_count = int(PRODUCTS_PER_PAGE * PAGE2_ECO_RATIO)
        non_eco_count = PRODUCTS_PER_PAGE - eco_count

        eco_offset = TOP_ECO_COUNT + 18 + (page - 2) * eco_count
        non_eco_offset = 27 + (page - 2) * non_eco_count

        eco_slice = eco_df.iloc[eco_offset : eco_offset + eco_count]
        non_eco_slice = non_eco_df.iloc[non_eco_offset : non_eco_offset + non_eco_count]

        final_df = (
            pd.concat([eco_slice, non_eco_slice])
            .sample(frac=1, random_state=page)
            .reset_index(drop=True)
        )

    # ✅ Convert images string to list in all cases
    final_result = []
    for _, row in final_df.iterrows():
        images = []
        if isinstance(row["images"], str):
            images = [img.strip() for img in row["images"].split(",") if img.strip()]
        if not images:
            continue  # Skip if image list is empty
        product = row.to_dict()
        product["images"] = images
        product = sanitize_product(product)
        final_result.append(product)

    return jsonify(final_result)


@app.route("/search-green", methods=["GET"])
def search_green_products():
    query = request.args.get("query", "").strip()
    page = int(request.args.get("page", 1))

    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400

    query_embedding = model.encode(query, convert_to_tensor=True)
    cosine_scores = util.cos_sim(query_embedding, product_embeddings)[0]
    df["similarity"] = cosine_scores.cpu().numpy()

    sorted_eco_df = (
        df[(df["isOrganic"] == True)]
        .sort_values(by="similarity", ascending=False)
        .reset_index(drop=True)
    )

    start = (page - 1) * PRODUCTS_PER_PAGE
    end = start + PRODUCTS_PER_PAGE
    page_df = sorted_eco_df.iloc[start:end]

    final_result = []
    for _, row in page_df.iterrows():
        images = []
        if isinstance(row["images"], str):
            images = [img.strip() for img in row["images"].split(",") if img.strip()]
        if not images:
            continue  # Skip products without valid images
        product = row.to_dict()
        product["images"] = images
        product = sanitize_product(product)
        final_result.append(product)

    return jsonify(final_result)


if __name__ == "__main__":
    app.run(debug=True)
