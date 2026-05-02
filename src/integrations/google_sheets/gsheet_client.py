# src/integrations/google_sheets/gsheet_client.py

import gspread
from oauth2client.service_account import ServiceAccountCredentials

# =========================
# CONFIG
# =========================
SERVICE_ACCOUNT_FILE = "credentials/service_account.json"
SPREADSHEET_NAME = "AI_Contract_Compliance_Dashboard"

SCOPE = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]


# =========================
# CLIENT FACTORY
# =========================
def get_spreadsheet():
    # ensure credentials file exists before attempting to open spreadsheet
    import os
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"⚠️ Google Sheets credentials '{SERVICE_ACCOUNT_FILE}' not found. Skipping sheet writes.")
        return None

    try:
        creds = ServiceAccountCredentials.from_json_keyfile_name(
            SERVICE_ACCOUNT_FILE, SCOPE
        )
        client = gspread.authorize(creds)
        return client.open(SPREADSHEET_NAME)
    except Exception as e:
        print("⚠️ Unable to authorize Google Sheets client:", e)
        return None
