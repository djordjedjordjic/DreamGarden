import { Component } from '@angular/core';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent {
  center: google.maps.LatLngLiteral = { lat: 44.787197, lng: 20.457273 };
  zoom = 13;
  selectedLocation: google.maps.LatLngLiteral | null = null;

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.selectedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    }
  }

  saveLocation() {
    if (this.selectedLocation) {
      localStorage.setItem("lokacija", JSON.stringify(this.selectedLocation))
      // console.log('Izabrana lokacija:', this.selectedLocation);
    } else {
      localStorage.setItem("lokacija", "")
      // console.log('Nije izabrana lokacija');
    }
  }
}
