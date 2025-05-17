# check_gemini_models.py
import google.generativeai as genai
import os

# Make sure to set your API key as an environment variable
# or load it from your Django settings if running as a management command.
# For a simple script, you can hardcode it temporarily for this check ONLY.
# REMEMBER TO REMOVE IT AFTERWARDS IF HARDCODED.
API_KEY = "AIzaSyCVncBZonvAMMgMxe3b0vzSAh8gLlq0cqM" # Replace with your actual key from settings.py
                                  # Or better: os.environ.get("GEMINI_API_KEY_ENV_VAR")

if not API_KEY:
    print("Error: GEMINI_API_KEY not found. Please set it.")
else:
    genai.configure(api_key=API_KEY)
    print("Available Gemini Models:")
    print("------------------------")
    model_count = 0
    for m in genai.list_models():
        # Check if the model supports the 'generateContent' method,
        # which is used by `GenerativeModel.generate_content()`
        if 'generateContent' in m.supported_generation_methods:
            print(f"Model Name: {m.name}")
            print(f"  Display Name: {m.display_name}")
            print(f"  Description: {m.description}")
            print(f"  Supported Generation Methods: {m.supported_generation_methods}")
            print(f"  Input Token Limit: {m.input_token_limit}")
            print(f"  Output Token Limit: {m.output_token_limit}")
            print("---")
            model_count += 1
    if model_count == 0:
        print("No models found that support 'generateContent'. Check your API key and project setup.")
    else:
        print(f"\nFound {model_count} models supporting 'generateContent'.")
        print("Consider using one of these, e.g., 'gemini-1.5-flash-latest' or 'gemini-1.5-pro-latest' if available, or another from the list.")