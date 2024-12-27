# Jewook’s Portfolio Website

## Introduction

Welcome to my portfolio website! I created this website to showcase my experience, projects, and more. I decided to build it myself using **React** for the frontend and **Express** for the backend.

## System Architecture

![System Architecture](https://lukas-portfolio.s3.us-east-2.amazonaws.com/335f59e3ea369ac65f464f0a39562ab0.jpg)

The frontend is hosted on **AWS S3** and configured with the domain [https://jewook.dev](https://jewook.dev) using the **Route 53** service on AWS. The **Node.js Express** server is hosted on **AWS EC2**. The server communicates with the **Notion API** to fetch page content, allowing me to display the content from my Notion app on my portfolio website.

Additionally, when the server processes image data from Notion, it uploads the images to **Amazon S3** and retrieves their public URLs. This approach enables me to display both image content and text information to the visitors of my portfolio.

## EC2 Hosting

Since the project size isn't very large, I decided to upload the files directly to the EC2 server. When creating the EC2 instance, I ensured to add port `5000` to the inbound ruleset, as that’s the port I used locally to communicate with the frontend.

### Transferring Code to EC2

To transfer the code to EC2, use the following command:

### Accessing EC2 via SSH

Connect to your EC2 instance using SSH:

```bash
ssh -i <path-to-the-pem-file> ec2-user@<public-ip-address>
```

### Unzipping and Running the Server

After transferring the ZIP file, unzip it and remove the ZIP file as it's no longer needed:

```bash
unzip <project-name>.zip
rm -f <project-name>.zip
cd <project-name>
npm install
node index.js
```

### Testing the Server

Use Postman to test if the server is working as expected by sending a GET request to:

```
http://<EC2-PUBLIC-IP>:5000/page/{notion_page_id}/blocks
```

A `200 Success` message indicates that the server is functioning correctly.

![Server Success](https://lukas-portfolio.s3.us-east-2.amazonaws.com/775987405bb920bfd58c46da528a9f39.jpg)

### Configuring Frontend Communication

Once the server is confirmed to be working, configure Axios on the frontend to communicate with the server hosted on AWS EC2. I created a custom React Hook to fetch content data from the Notion page.

```jsx
import { useState, useEffect } from "react";
import axios from "axios";

interface BlockResponse {
    data: any; 
}

export const useAxios = (pageId: string) => {
    const [data, setData] = useState<BlockResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const BASE_URL = "http://<PUBLIC-IP-ADDRESS>";

    useEffect(() => {
        axios.get(`${BASE_URL}/page/${pageId}/blocks`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [pageId]);

    return { data, loading, error };
};
```

## Problem Solving: Duplicate Images Uploaded to S3

I encountered an issue where duplicate images were being uploaded to S3. Initially, I tried fetching the image URLs directly from the Notion page, but it wasn't feasible. To resolve this, I implemented the following steps to download images from Notion and upload them to an AWS S3 bucket, ensuring that only unique images are stored.

### 1. Generate Unique Hashes for Images

I used the MD5 hash of the image content to identify duplicates.

```jsx
import axios from "axios";
import crypto from "crypto";

async function generateContentHash(imageUrl) {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return crypto.createHash("md5").update(response.data).digest("hex");
}
```

### 2. Check File Existence in S3

Before uploading, the system checks if the file already exists in the S3 bucket.

```jsx
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-2" });

async function checkIfFileExists(bucket, key) {
    try {
        await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        return true; 
    } catch (err) {
        return false; 
    }
}
```

### 3. Upload Only Unique Files

If the file does not exist, it gets uploaded to S3; otherwise, the existing URL is reused.

```jsx
import { PutObjectCommand } from "@aws-sdk/client-s3";

async function uploadImage(imageUrl) {
    const hash = await generateContentHash(imageUrl);
    const fileName = `${hash}.jpg`;

    if (await checkIfFileExists(process.env.S3_BUCKET_NAME, fileName)) {
        return `File already exists: ${fileName}`;
    }

    const data = await axios.get(imageUrl, { responseType: "arraybuffer" });
    await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: data.data,
    }));
    return `File uploaded: ${fileName}`;
}
```

### 4. Integrate with Notion API

```jsx
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function processNotionImages(pageId) {
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    for (const block of blocks.results) {
        if (block.type === "image") {
            const url = block.image.file?.url || block.image.external?.url;
            console.log(await uploadImage(url));
        }
    }
}
```

When fetching a page from Notion, if the images already exist in the S3 bucket, the following message is displayed:

![Duplicate Image Message](https://lukas-portfolio.s3.us-east-2.amazonaws.com/c7c1750aa0423d09f611756212699c76.jpg)

## Used Technologies

### IDEs
- IntelliJ IDEA
- Visual Studio Code

### Languages / Frameworks
- JavaScript
- TypeScript
- React
- Express
- Notion API

### Cloud Services
- AWS S3
- AWS EC2
- AWS Route 53

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure environment variables:**

    Create a `.env` file and add the necessary environment variables, such as AWS credentials and Notion API keys.

4. **Run the server:**

    ```bash
    node index.js
    ```

## Usage

1. **Access the website:**

    Open your browser and navigate to [https://jewook.dev](https://jewook.dev).

2. **Interact with the portfolio:**

    Browse through the projects, experience, and other sections showcased on the website.
