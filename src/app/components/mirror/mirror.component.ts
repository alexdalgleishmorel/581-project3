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
        // Start detecting faces once the video has metadata loaded
        this.detectFaces();
      };
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  detectFaces() {
    const canvas = this.overlay.nativeElement;
  
    const videoWidth = this.video.nativeElement.videoWidth;
    const videoHeight = this.video.nativeElement.videoHeight;
  
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  
    const displaySize = { width: videoWidth, height: videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(this.video.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions(); // Detect expressions
  
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
      // Clear the overlay and draw new detections
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  
      // Draw expressions on the canvas or log them
      resizedDetections.forEach(detection => {
        const { expressions } = detection;
        const expression = getTopExpression(expressions); // Get top expression
  
        context.font = '16px Arial';
        context.fillStyle = 'red';
        context.fillText(expression, detection.detection.box.x, detection.detection.box.y - 10);
      });
    }, 100);
  }
}

function getTopExpression(expressions: faceapi.FaceExpressions): string {
  let topExpression = '';
  let maxProbability = 0;

  for (const [expression, probability] of Object.entries(expressions)) {
    if (probability > maxProbability) {
      maxProbability = probability;
      topExpression = expression;
    }
  }

  return `${topExpression} (${(maxProbability * 100).toFixed(1)}%)`;
}
