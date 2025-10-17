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

    # 2. Act: Click on the "Características" link in the navigation.
    features_link = page.get_by_role("button", name="Características")
    features_link.click()

    # 3. Assert: Check that the "Escritura de Contenido con IA" link is visible.
    content_writing_link = page.get_by_role("link", name="Escritura de Contenido con IA")
    expect(content_writing_link).to_be_visible()

    # 4. Screenshot: Capture the features menu.
    page.screenshot(path="jules-scratch/verification/features_menu_es.png")

    # 5. Act: Click on the "Soluciones" link in the navigation.
    solutions_link = page.get_by_role("button", name="Soluciones")
    solutions_link.click()

    # 6. Assert: Check that the "Agencias de Marketing" link is visible.
    agencies_link = page.get_by_role("link", name="Agencias de Marketing")
    expect(agencies_link).to_be_visible()

    # 7. Screenshot: Capture the solutions menu.
    page.screenshot(path="jules-scratch/verification/solutions_menu_es.png")

    # 8. Act: Click on the language switcher to go back to English.
    language_switcher = page.get_by_role("button", name="Español")
    language_switcher.click()
    english_link = page.get_by_role("link", name="English")
    english_link.click()

    # 9. Assert: Check that the "Features" link is visible.
    features_link_en = page.get_by_role("button", name="Features")
    expect(features_link_en).to_be_visible()

    # 10. Screenshot: Capture the English homepage.
    page.screenshot(path="jules-scratch/verification/homepage_en.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    test_spanish_translation(page)
    browser.close()