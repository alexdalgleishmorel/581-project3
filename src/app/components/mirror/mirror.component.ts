import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { PROXIMITY_THRESHOLD } from 'src/app/data';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'mirror',
  templateUrl: './mirror.component.html',
  styleUrls: ['./mirror.component.scss'],
})
export class MirrorComponent implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef;
  @ViewChild('overlay', { static: true }) overlay!: ElementRef;

  isHappy = false;
  isSad = false;
  userDistance = 0;
  private currentExpression: string | null = null;
  private overlayImage = new Image();
  private overlayImageWidth = 100;
  private overlayImageHeight = 100;
  private overlayImageOffset = 10;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    await this.loadModels();
    this.updateOverlayImage();
    this.startVideo();
  }

  async loadModels() {
    const modelPath = '/assets/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
  }

  async startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = stream;

      this.video.nativeElement.onloadedmetadata = () => {
        this.detectExpressions();
      };
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  detectExpressions() {
    const canvas = this.overlay.nativeElement;
    const videoWidth = this.video.nativeElement.videoWidth;
    const videoHeight = this.video.nativeElement.videoHeight;
    
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    const displaySize = { width: videoWidth, height: videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
    
    const context = canvas.getContext('2d', { willReadFrequently: true });
    
    const referenceFaceWidth = 120; // Adjust based on your setup
    const referenceDistance = 100; // Reference distance in centimeters
    let lastIdentityCheck = Date.now();
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(this.video.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();
      
      context.clearRect(0, 0, canvas.width, canvas.height);
    
      detections.forEach(detection => {
        const { expressions, descriptor } = detection;
        const topExpression = this.getTopExpression(expressions);
  
        // Perform identity check only every 3 seconds
        const currentTime = Date.now();
        let personId: string | undefined;
        if (currentTime - lastIdentityCheck >= 3000) {
          personId = this.dataService.getOrAssignId(descriptor);
          lastIdentityCheck = currentTime;
        }
        
        // Track expression and update overlay based on the expression
        this.trackExpression(topExpression);
    
        // Calculate face position and estimated distance
        const { x, y, width } = detection.detection.box;
        const newDistance = (referenceFaceWidth / width) * referenceDistance;
  
        if (proximityChange(this.userDistance, newDistance)) {
          this.userDistance = newDistance;
          this.updateOverlayImage();
        }
    
        // Position the overlay image based on face position and accessory offsets
        const overlayX = x + width / 2 - this.overlayImageWidth / 2;
        const overlayY = y - this.overlayImageHeight - this.overlayImageOffset;
  
        context.drawImage(this.overlayImage, overlayX, overlayY, this.overlayImageWidth, this.overlayImageHeight);
      });
    }, 1000); // Run every second for expression detection and positioning
  }

  getTopExpression(expressions: faceapi.FaceExpressions): string {
    return Object.entries(expressions)
      .reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }

  trackExpression(expression: string) {
    const now = Date.now();

    // Check if there was a change in expression
    if (expression !== this.currentExpression) {
      this.currentExpression = expression;

      // Check if the new expression is happy or sad
      if (this.currentExpression === 'happy' || this.currentExpression === 'sad') {
        this.updateOverlayImage();
      }
    }
  }

  private updateOverlayImage() {
    const accessory = this.dataService.getNextAccessory(this.userDistance, this.currentExpression);
    if (accessory) {
      this.overlayImage.src = accessory.imageUrl;
      this.overlayImageWidth = accessory.imageWidth || 100;  // Set default width if undefined
      this.overlayImageHeight = accessory.imageHeight || 100; // Set default height if undefined
      this.overlayImageOffset = accessory.imageOffset || 10;  // Set default offset if undefined
    }
  }
}

function proximityChange(previous: number, current: number) {
  if (previous < PROXIMITY_THRESHOLD && current > PROXIMITY_THRESHOLD) {
    return true;
  }
  if (previous > PROXIMITY_THRESHOLD && current < PROXIMITY_THRESHOLD) {
    return true;
  }
  return false;
}
