import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Lokacija } from '../models/lokacija';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit, AfterViewInit {
  @Input() location: Lokacija | null = null
  @ViewChild(GoogleMap) mapComponent!: GoogleMap
  zoom = 13
  center: google.maps.LatLngLiteral = { lat: 44.787197, lng: 20.457273 }
  marker!: google.maps.Marker

  ngOnInit(): void {
    if (this.location) {
      this.center = { lat: this.location.lat, lng: this.location.lng }
    }
  }

  ngAfterViewInit(): void {
    if (this.mapComponent) {
      this.mapComponent.center = this.center

      this.marker = new google.maps.Marker({
        position: this.center,
        map: this.mapComponent.googleMap!,
        title: 'Selected Location',
      })

      if (this.location) {
        this.updateMapLocation()
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && this.mapComponent) {
      this.updateMapLocation()
    }
  }

  updateMapLocation(): void {
    if (this.location) {
      const newCenter = { lat: this.location.lat, lng: this.location.lng }
      this.mapComponent.googleMap!.setCenter(newCenter)
      this.marker.setPosition(newCenter)
    }
  }
}