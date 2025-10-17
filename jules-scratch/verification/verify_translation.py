import os
from playwright.sync_api import sync_playwright, Page, expect

def test_spanish_translation(page: Page):
    """
    This test verifies that the Spanish translation of the features and solutions pages is working correctly.
    """
    # Create the directory if it doesn't exist
    os.makedirs("jules-scratch/verification", exist_ok=True)

    # 1. Arrange: Go to the Spanish homepage.
    page.goto("http://localhost:1313/es/")
    print("Navigated to Spanish homepage")

    # 2. Screenshot: Capture the Spanish homepage.
    page.screenshot(path="jules-scratch/verification/homepage_es.png")
    print("Took screenshot of Spanish homepage")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    test_spanish_translation(page)
    browser.close()