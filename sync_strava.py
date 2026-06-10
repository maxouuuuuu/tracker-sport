#!/usr/bin/env python3
"""
Strava → data.json  (utilisé par GitHub Actions)
"""

import os, json, requests

CLIENT_ID     = os.environ["STRAVA_CLIENT_ID"]
CLIENT_SECRET = os.environ["STRAVA_CLIENT_SECRET"]
TOKEN_FILE    = "_strava_refresh.txt"

# Lire le refresh token : fichier en priorité, sinon secret GitHub
if os.path.exists(TOKEN_FILE):
    with open(TOKEN_FILE) as f:
        refresh_token = f.read().strip()
    print("🔑 Refresh token lu depuis le fichier")
else:
    refresh_token = os.environ["STRAVA_REFRESH_TOKEN"]
    print("🔑 Refresh token lu depuis les secrets GitHub")

# ── Renouveler l'access token ──────────────────────────────
r = requests.post("https://www.strava.com/oauth/token", data={
    "client_id":     CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "grant_type":    "refresh_token",
    "refresh_token": refresh_token,
})
r.raise_for_status()
token_data = r.json()
access_token      = token_data["access_token"]
new_refresh_token = token_data.get("refresh_token", refresh_token)

# Sauvegarder le nouveau refresh token pour la prochaine fois
with open(TOKEN_FILE, "w") as f:
    f.write(new_refresh_token)
print("✅ Refresh token mis à jour")

# ── Récupérer toutes les activités ────────────────────────
activities = []
page = 1
while True:
    r = requests.get(
        "https://www.strava.com/api/v3/athlete/activities",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"per_page": 200, "page": page},
    )
    r.raise_for_status()
    batch = r.json()
    if not batch:
        break
    activities.extend(batch)
    print(f"  Page {page} : {len(batch)} activités")
    if len(batch) < 200:
        break
    page += 1

print(f"📦 {len(activities)} activités récupérées au total")

# ── Transformer au format du tracker ──────────────────────
def transform(a):
    sport = a.get("sport_type") or a.get("type", "Other")
    return {
        "id":         f"stv_{a['id']}",
        "src":        "strava",
        "name":       a["name"],
        "sport_type": sport,
        "date":       a["start_date_local"][:10],
        "ts":         a["start_date_local"],
        "dur":        round((a.get("moving_time") or a.get("elapsed_time") or 0) / 60),
        "dist":       round(a.get("distance", 0) / 1000, 2),
        "cal":        a.get("calories") or 0,
        "elev":       a.get("total_elevation_gain") or 0,
        "rpe":        a.get("perceived_exertion"),
    }

data = [transform(a) for a in activities]

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ data.json généré avec {len(data)} activités")
