import os
from huggingface_hub import HfApi, login

def upload_model_to_huggingface(
    model_path: str,
    repo_id: str,
    token: str = None,
    commit_message: str = "Upload model via script"
):
    """
    Uploads a local model directory to the Hugging Face Hub.

    Args:
        model_path (str): Path to the local directory containing model files.
        repo_id (str): The Hugging Face repo ID (e.g., 'username/model-name').
        token (str): Your Hugging Face write token. If None, looks for HF_TOKEN env var or previous login.
        commit_message (str): Message for the commit.
    """
    
    # Ensure we have a token
    if token:
        login(token=token)
    
    api = HfApi()
    
    print(f"Starting upload from '{model_path}' to '{repo_id}'...")
    
    try:
        # Create repo if it doesn't exist (optional, but good practice)
        api.create_repo(repo_id=repo_id, exist_ok=True)
        
        # Upload folder
        api.upload_folder(
            folder_path=model_path,
            repo_id=repo_id,
            commit_message=commit_message,
            ignore_patterns=[".git", ".DS_Store", "__pycache__"]
        )
        
        print(f"✅ Successfully uploaded model to https://huggingface.co/{repo_id}")
        
    except Exception as e:
        print(f"❌ Error uploading model: {e}")

if __name__ == "__main__":
    # Configuration
    # Ganti nilai di bawah ini sesuai kebutuhan Anda
    LOCAL_MODEL_PATH = "./my_model_directory" # Folder lokal berisi model (misal: .pt, .h5, config.json)
    REPO_ID = "Dawgggggg/vure-bonefracture"   # Repository ID di Hugging Face
    HF_TOKEN = os.getenv("HF_TOKEN")          # Token API (Write access)
    
    # Validasi sederhana
    if not os.path.exists(LOCAL_MODEL_PATH):
        print(f"⚠️ Warning: Folder '{LOCAL_MODEL_PATH}' tidak ditemukan. Pastikan path benar sebelum menjalankan.")
    else:
        upload_model_to_huggingface(LOCAL_MODEL_PATH, REPO_ID, HF_TOKEN)
