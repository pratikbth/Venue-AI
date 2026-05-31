import os
import asyncio
from dotenv import load_dotenv
load_dotenv()

from server import generate_image, GenerateRequest

async def test_generation():
    print("Initializing test request...")
    # Simple base64 image (1x1 transparent pixel) for testing multimodal input
    test_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    req = GenerateRequest(
        prompt="A beautiful luxury wedding stage with golden lights and floral decorations",
        venue_image=test_image_b64,
        design_image=test_image_b64,
        variant_count=1
    )
    
    print("Calling generate_image endpoint function...")
    try:
        result = await generate_image(req)
        print("\n=== Result ===")
        print(f"Success: {result.get('success')}")
        if result.get('success'):
            print(f"Provider used: {result.get('provider')}")
            print(f"Model used: {result.get('model')}")
            print(f"Generated Image Length: {len(result.get('image_data', ''))} characters")
        else:
            print(f"Error: {result.get('error')}")
            print(f"Description: {result.get('description')}")
    except Exception as e:
        print(f"Exception raised during generation: {e}")

if __name__ == "__main__":
    asyncio.run(test_generation())
