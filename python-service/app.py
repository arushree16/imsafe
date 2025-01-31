from flask import Flask, request, jsonify
import requests
from cachetools import TTLCache
import random

app = Flask(__name__)
API_KEY = "AIzaSyAwjTfAbg_-HFu9Zr8fCZMNJsVF2XaTuFo"
CRIME_API = "https://crimecheck.in/api/crime_data"  # Placeholder API
cache = TTLCache(maxsize=100, ttl=300)  # Cache results for 5 mins

def fetch_nearby_places(lat, lng, place_type):
    """Fetch nearby police stations, hospitals, etc."""
    cache_key = f"{lat},{lng},{place_type}"
    if cache_key in cache:
        return cache[cache_key]

    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=1000&type={place_type}&key={API_KEY}"
    response = requests.get(url).json()
    cache[cache_key] = response.get("results", [])
    return cache[cache_key]

def fetch_reviews(place_id):
    """Fetch user reviews for a place."""
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=rating,reviews&key={API_KEY}"
    response = requests.get(url).json()
    return response.get("result", {})

def fetch_crime_data(lat, lng):
    """Get past crime reports from API (mocked)."""
    cache_key = f"{lat},{lng},crime"
    if cache_key in cache:
        return cache[cache_key]

    # Simulated crime data for now
    response = {"crime_count": random.randint(0, 15)}  # Replace with API call
    cache[cache_key] = response
    return response

def calculate_safety_score(police_count, avg_rating, crime_count):
    """Assign safety score based on multiple factors."""
    score = 50  # Base Score

    # Police Station Weight
    if police_count >= 5:
        score += 30
    elif police_count >= 2:
        score += 15

    # Review Weight
    if avg_rating >= 4.5:
        score += 20
    elif avg_rating >= 3.5:
        score += 10

    # Crime Weight (Penalty)
    if crime_count >= 10:
        score -= 40
    elif crime_count >= 5:
        score -= 20

    return max(0, min(score, 100))

@app.route("/get_safety_score", methods=["GET"])
def get_safety_score():
    lat = request.args.get("lat")
    lng = request.args.get("lng")

    if not lat or not lng:
        return jsonify({"error": "Latitude & longitude required"}), 400

    police_stations = fetch_nearby_places(lat, lng, "police")
    crime_data = fetch_crime_data(lat, lng)

    total_police = len(police_stations)
    crime_count = crime_data.get("crime_count", 0)

    ratings = []
    for place in police_stations[:3]:  # Limit to 3 places
        place_details = fetch_reviews(place["place_id"])
        if "rating" in place_details:
            ratings.append(place_details["rating"])

    avg_rating = sum(ratings) / len(ratings) if ratings else 3.5

    safety_score = calculate_safety_score(total_police, avg_rating, crime_count)

    return jsonify({
        "safety_score": safety_score,
        "police_stations": total_police,
        "avg_rating": avg_rating,
        "crime_count": crime_count,
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)
