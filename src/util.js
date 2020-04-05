import * as posenet from "@tensorflow-models/posenet"
const lineWidth = 2;

export function checkUserMediaError() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    )
  }
  return null
}

export function getMediaStreamConstraints(facingMode, frameRate) {
  return {
    audio: false,
    video: {
      facingMode,
      frameRate
    }
  }
}

export function getConfidentPoses(poses, minPoseConfidence, minPartConfidence) {
  return poses
    .filter(({ score }) => score > minPoseConfidence)
    .map(pose => ({
      ...pose,
      keypoints: pose.keypoints.filter(({ score }) => score > minPartConfidence)
    }))
}

function toTuple({y, x}) {
  return [y, x];
}

export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

// export function drawKeypoints(ctx, keypoints) {
//   keypoints.forEach(({ position }) => {
//     const { x, y } = position
//     ctx.beginPath()
//     ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
//     ctx.fillStyle = "aqua"
//     ctx.fill()
//   })
// }

export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, 'aqua');
  }
}

export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints =
      posenet.getAdjacentKeyPoints(keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
        toTuple(keypoints[0].position), toTuple(keypoints[1].position), 'aqua',
        scale, ctx);
  });
}



  // keypoints.forEach(({ position }) => {
  //   const { x, y } = position
  //   ctx.beginPath()
  //   ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
  //   ctx.fillStyle = "aqua"
  //   ctx.fill()
  // })


