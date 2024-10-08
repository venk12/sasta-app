import pandas as pd
from thefuzz import process
from thefuzz import fuzz
from sentence_transformers import SentenceTransformer, util

def search_fuzzy(product_name, product_std_category, df_database):
    store_name = df_database['store_name'].unique()
    results = []

    for store in store_name:
        df_store = df_database[df_database['store_name'] == store]
        # Filter df_store by the relevant category first
        df_store_category = df_store[df_store['standardized_categories'] == product_std_category]
        
        # Perform fuzzy matching on the filtered DataFrame
        matches = process.extract(product_name, df_store_category['product_name'], scorer=fuzz.token_sort_ratio, limit=3)

        # Create a DataFrame to display the results
        if matches:  # Check if there are any matches
            fuzzy_matches_df = pd.DataFrame({
                'Original': [product_name] * len(matches),
                'Matched': [match[0] for match in matches],
                'Score': [match[1] for match in matches],
                'Store': [store] * len(matches),
                **df_store.loc[df_store['product_name'].isin([match[0] for match in matches])].drop(columns=['product_name', 'product_id']).to_dict(orient='records')[0]
            })
        else:
            # If no matches, create an empty DataFrame with the same structure
            fuzzy_matches_df = pd.DataFrame(columns=['Original', 'Matched', 'Score', 'Store'])

        # Get top 3 matches for the current store
        top_matches = fuzzy_matches_df.nlargest(5, 'Score')
        results.append(top_matches)

    # Concatenate results from all stores
    final_results = pd.concat(results, ignore_index=True)
    return final_results

def search_embedding(product_name, product_std_category, df_database):
    # Load the embedding model
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Generate embeddings for the product name
    product_embedding = model.encode(product_name, convert_to_tensor=True)

    # Filter the database for the relevant category
    df_store_category = df_database[df_database['standardized_categories'] == product_std_category]

    # Generate embeddings for the products in the filtered DataFrame
    product_embeddings = model.encode(df_store_category['product_name'].tolist(), convert_to_tensor=True)

    # Compute cosine similarities
    cosine_scores = util.pytorch_cos_sim(product_embedding, product_embeddings)[0]

    # Create a DataFrame to display the results
    results = pd.DataFrame({
        'Matched': df_store_category['product_name'],
        'Score': cosine_scores.cpu().numpy()  # Convert tensor to numpy array
    })

    # Get top 5 matches
    top_matches = results.nlargest(5, 'Score')
    return top_matches