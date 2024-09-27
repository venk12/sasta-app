import os
import pandas as pd
from langchain_openai import OpenAIEmbeddings

from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS

class UploadManager:
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.file_path = os.path.join(self.current_dir, "data", "df_all_products.csv")    
        
        try:
            df = pd.read_csv(self.file_path)
            print(df.head())
            documents = df.apply(lambda row: " ".join(row.astype(str)), axis=1).tolist()

            if os.path.exists("vectorstore.json"):
                self.load_vectorstore()
                print("Vector store loaded successfully.")
                self.data = documents
            else:
                embeddings = OpenAIEmbeddings()
                self.vectorstore = FAISS.from_texts(documents, embeddings)
                self.save_vectorstore()
                print(f"CSV file loaded successfully and vector store created.")
                self.data = documents
                
        except FileNotFoundError:
            print(f"Error: The file '{self.file_path}' was not found.")
            print("Please make sure the CSV file exists in the correct location.")
            self.data = []

        except Exception as e:
            print(f"An error occurred while loading the CSV file: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {e.args}")
            self.data = []

        print(f"Number of records loaded: {len(self.data)}")

    def save_vectorstore(self):
        print(f"Saving vector store to {self.current_dir}")
        self.vectorstore.save_local("vectorstore.json")

    def load_vectorstore(self):
        self.vectorstore = FAISS.load_local("vectorstore.json", OpenAIEmbeddings(), allow_dangerous_deserialization=True)

    def get_data(self):
        return self.data

    def get_similar_entries(self, query):
        return self.vectorstore.similarity_search(query, k =20)

    def upload_file(self):
        pass


