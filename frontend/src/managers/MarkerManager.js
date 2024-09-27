class MarkerManager {
    static triggerMarker(event, data) {
      console.log(`Marker triggered: ${event}`, data);
      // You can also make API calls through ApiManager
      ApiManager.postMessage({ event, data });
    }
  }
  
  export default MarkerManager;