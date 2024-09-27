from geopy.geocoders import Nominatim
import requests
import folium
from folium.plugins import MarkerCluster
from concurrent.futures import ThreadPoolExecutor, as_completed

def geocode_postal_code(postal_code):
    geolocator = Nominatim(user_agent="supermarket_finder")
    location = geolocator.geocode(postal_code)
    if location:
        return location.latitude, location.longitude
    else:
        return None, None

def search_places(api_key, lat, lng, radius, search_type=None, search_name=None):
    nearby_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    places_params = {
        'location': f'{lat},{lng}',  # Latitude and Longitude
        'radius': radius,  # Radius in meters
        'key': api_key  # Your API key
    }
    
    # Add search parameters based on type or name
    if search_type:
        places_params['type'] = search_type
    if search_name:
        places_params['keyword'] = search_name

    # Make the GET request to Google Places API
    response = requests.get(nearby_url, params=places_params)
    if response.status_code == 200:
        return response.json().get('results', [])
    else:
        print(f"Error: {response.status_code}")
        return []

def add_place_to_map(marker_cluster, lat, lng, name, address, color, popup, added_places, locations):
    location_key = (lat, lng)
    if location_key not in added_places:
        folium.Marker(
            [lat, lng],
            popup=f"{popup}\n{name}\n{address}",
            icon=folium.Icon(color=color)
        ).add_to(marker_cluster)
        locations.append([lat, lng])
        added_places.add(location_key)

def generate_map_html(api_key, latitude, longitude, output_path):
    map = folium.Map(location=[latitude, longitude], zoom_start=13)
    marker_cluster = MarkerCluster().add_to(map)

    # Add a triangle marker (using DivIcon) for the input postal code
    folium.map.Marker(
        [latitude, longitude],
        icon=folium.DivIcon(
            html=f"""
            <div style="position: relative;">
                <div style="position: absolute; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid green;"></div>
            </div>"""
        ),
        popup="Input Postal Code"
    ).add_to(map)

    locations = [[latitude, longitude]]
    added_places = set()

    def search_and_add_places(keyword, color, popup, radius):
        results = search_places(api_key, latitude, longitude, radius=radius, search_name=keyword)
        for result in results:
            name = result['name']
            address = result.get('vicinity', 'No address provided')
            lat = result['geometry']['location']['lat']
            lng = result['geometry']['location']['lng']
            add_place_to_map(marker_cluster, lat, lng, name, address, color, popup, added_places, locations)

    # Combine all search keywords
    search_tasks = [
        *[(supermarket, "orange", "Supermarket", 5000) for supermarket in ['Lidl', 'Jumbo', 'Aldi', 'Albert Heijn', 'Dirk', 'Spar']],
        *[(store, "blue", "Small Store", 5000) for store in ['Toko', 'Asian supermarket', 'Turkish supermarket', 'Die Grenze']],
        *[(market, "red", "Market Area", 3000) for market in ['market', 'open-air market', 'bazaar']]
    ]

    # Use ThreadPoolExecutor for concurrent API requests
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(search_and_add_places, *task) for task in search_tasks]
        for future in as_completed(futures):
            future.result()  # This will raise any exceptions that occurred during execution

    # Auto-adjust the map to cover all markers
    map.fit_bounds(locations)

    # Save the map as an HTML file
    map_html = output_path + "supermarkets_map.html"
    map.save(map_html)

    return map_html