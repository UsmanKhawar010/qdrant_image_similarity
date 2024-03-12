import os
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from PIL import Image
from imgbeddings import imgbeddings
from qdrant_client import QdrantClient
from qdrant_client.http import models
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from fastapi import FastAPI, Request, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

"""
command to run docker

docker run -p 6333:6333 -p 6334:6334 -v "D:\docker example\back_end\qdrant_storage:/qdrant/storage:z" qdrant/qdrant

"""


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from the React frontend
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Set the upload folder
UPLOAD_FOLDER = os.getcwd()

client = QdrantClient("localhost", port=6333)
collection_name = "image_embeddings_usman2"
templates = Jinja2Templates(directory="templates")
ibed = imgbeddings()


def check_create_collection(collection_name, client):
    collections_response = client.get_collections()
    collection_descriptions = collections_response.collections

    embeddings_collection_present = False
    for collection in collection_descriptions:
        if collection.name == collection_name:
            embeddings_collection_present = True
            break

    if not embeddings_collection_present:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=768, distance=models.Distance.COSINE),
        )
        insert_values_into_collection(collection_name, client)
        return "Collection created"
    else:
        return "Collection present"


# Function to retrieve embeddings and file paths from a folder
def get_embeddings_and_paths(root_folder):
    embeddings = []
    paths = []
    for foldername, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.lower().endswith((".jpg", ".png", ".jpeg")):
                img_path = os.path.join(foldername, filename)
                paths.append(img_path)
                image = Image.open(img_path)
                embedding = ibed.to_embeddings(image)
                flattened_embedding = np.array(
                    embedding).flatten().tolist()
                embeddings.append(flattened_embedding)
    return embeddings, paths


# Function to insert embeddings into Qdrant collection
def insert_embeddings_into_collection(embeddings, paths, collection_name, client):
    check_create_collection(collection_name, client)
    points = [
        models.PointStruct(id=i, vector=embedding, payload={"path": path})
        for i, (embedding, path) in enumerate(zip(embeddings, paths))
    ]
    client.upsert(collection_name=collection_name, points=points)


# Function to query the collection for the most similar image
def query_most_similar_image(query_embedding):
    query_result = client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=1,
    )
    return query_result[0].payload["path"] if query_result else None


def insert_values_into_collection(collection_name, client):
    root_folder = "./static/combined_images/"
    all_embeddings, all_paths = get_embeddings_and_paths(root_folder)
    # print("All paths:", all_paths)  # Add this line to print the paths
    insert_embeddings_into_collection(all_embeddings, all_paths, collection_name, client)
    return f"Embeddings added to the collection"

def image_to_base64(image):
    # Convert image to RGB mode if it's in palette mode
    if image.mode == 'P':
        image = image.convert('RGB')

    # Convert the image to base64
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/upload")
async def upload(request: Request, file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    contents = await file.read()
    file_path = os.path.join(UPLOAD_FOLDER, 'uploaded_image.jpg')

    with open(file_path, "wb") as f:
        f.write(contents)

    query_image = Image.open(file_path)
    query_embedding = np.array(ibed.to_embeddings(query_image)).flatten().tolist()
    check_create_collection(collection_name, client)

    matched_image_path = query_most_similar_image(query_embedding)

    if matched_image_path:
        # matched_image = Image.open(matched_image_path)

        # fig, axes = plt.subplots(1, 2)
        # axes[0].imshow(query_image)
        # axes[0].set_title("Query Image")
        # axes[0].axis("off")
        # axes[1].imshow(matched_image)
        # axes[1].set_title("Matched Image")
        # axes[1].axis("off")

        # buffer = BytesIO()
        # plt.savefig(buffer, format='png')
        # buffer.seek(0)
        # plot_data = base64.b64encode(buffer.read()).decode('utf-8')

        # html_content = f"""
        #     <!DOCTYPE html>
        #     <html>
        #     <head>
        #         <title>Image Comparison</title>
        #     </head>
        #     <body>
        #         <h1>Image Comparison</h1>
        #         <div>
        #             <h2>Query Image</h2>
        #             <img src="data:image/png;base64,{plot_data}" alt="Query Image">
        #         </div>
        #         <div>
        #             <h2>Matched Image</h2>
        #             <img src="data:image/png;base64,{plot_data}" alt="Matched Image">
        #         </div>
        #     </body>
        #     </html>
        # """

        # return HTMLResponse(content=html_content)
        
        matched_image = Image.open(matched_image_path)

        # Convert query and matched images to base64 strings
        query_image_base64 = image_to_base64(query_image)
        matched_image_base64 = image_to_base64(matched_image)

        return templates.TemplateResponse(
            "result.html", 
            {"request": request, "query_image": query_image_base64, "matched_image": matched_image_base64}
        )

    return "No matching image found."




    return "No matching image found."
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
