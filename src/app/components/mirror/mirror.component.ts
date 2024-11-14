import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';

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
  private expressionStartTime: number | null = null;
  private currentExpression: string | null = null;
  private overlayImage = new Image();

  async ngOnInit() {
    await this.loadModels();
    this.startVideo();
    this.overlayImage.src = '/assets/wood-texture.jpeg'; // Path to your overlay image
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
  
    // Set desired dimensions for the overlay image
    const overlayWidth = 100;
    const overlayHeight = 100;
  
    // Reference face width at a known distance (e.g., 1 meter)
    const referenceFaceWidth = 120; // Adjust based on your setup
    const referenceDistance = 100; // Reference distance in centimeters
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(this.video.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
  
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      detections.forEach(detection => {
        const { expressions } = detection;
        const topExpression = this.getTopExpression(expressions);
  
        // Track expression duration and set isHappy or isSad accordingly
        this.trackExpression(topExpression);
  
        // Get the position and dimensions of the detected face
        const { x, y, width, height } = detection.detection.box;
  
        // Estimate distance based on face width
        this.userDistance = (referenceFaceWidth / width) * referenceDistance;
  
        // Position the overlay image based on the face position
        const overlayX = x + width / 2 - overlayWidth / 2;
        const overlayY = y - overlayHeight - 10;
  
        // Draw the overlay image
        context.drawImage(this.overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);
      });
    }, 100);
  }  

  getTopExpression(expressions: faceapi.FaceExpressions): string {
    return Object.entries(expressions)
      .reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }

  trackExpression(expression: string) {
    const now = Date.now();

    if (expression !== this.currentExpression) {
      this.currentExpression = expression;
      this.expressionStartTime = now;
    } else if (this.expressionStartTime && now - this.expressionStartTime >= 1000) {
      this.isHappy = expression === 'happy';
      this.isSad = expression === 'sad';

      if (this.isHappy) this.isSad = false;
      if (this.isSad) this.isHappy = false;

      this.expressionStartTime = now;
    }
  }
}
