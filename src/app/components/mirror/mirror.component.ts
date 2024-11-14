import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'mirror',
  templateUrl: './mirror.component.html',
  styleUrls: ['./mirror.component.scss'],
})
export class MirrorComponent implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef;

  isHappy = false;
  isSad = false;
  private expressionStartTime: number | null = null;
  private currentExpression: string | null = null;

  async ngOnInit() {
    await this.loadModels();
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
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(this.video.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      detections.forEach(detection => {
        const { expressions } = detection;
        const topExpression = this.getTopExpression(expressions);

        // Track expression duration and set isHappy or isSad accordingly
        this.trackExpression(topExpression);
      });
    }, 100);
  }

  // Helper to get the dominant expression
  getTopExpression(expressions: faceapi.FaceExpressions): string {
    return Object.entries(expressions)
      .reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }

  // Track expression for duration and toggle variables if condition is met
  trackExpression(expression: string) {
    const now = Date.now();

    if (expression !== this.currentExpression) {
      // Reset the timer if expression changes
      this.currentExpression = expression;
      this.expressionStartTime = now;
    } else if (this.expressionStartTime && now - this.expressionStartTime >= 1000) {
      // Check if expression has been constant for 1 second
      this.isHappy = expression === 'happy';
      this.isSad = expression === 'sad';

      // Reset other states if necessary
      if (this.isHappy) this.isSad = false;
      if (this.isSad) this.isHappy = false;

      // Reset the timer after setting the expression
      this.expressionStartTime = now;

      console.log(this.currentExpression);
    }
  }
}
