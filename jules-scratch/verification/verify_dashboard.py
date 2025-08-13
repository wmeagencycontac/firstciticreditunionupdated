import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Create the test user
    page.goto("http://127.0.0.1:8080/test-setup")
    page.get_by_role("button", name="Create Test User").click()
    expect(page.get_by_role("heading", name="✅ Test User Created Successfully!")).to_be_visible()

    # Go to the login page
    page.goto("http://127.0.0.1:8080/login")

    # Fill in the email and password
    page.get_by_label("Email").fill("test@bankingapp.com")
    page.get_by_label("Password").fill("TestPassword123!")

    # Click the login button
    page.get_by_role("button", name="Sign in").click()

    # Wait for the dashboard to load
    expect(page).to_have_url(re.compile(".*dashboard"))
    expect(page.get_by_text("Total Balance")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/dashboard.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
