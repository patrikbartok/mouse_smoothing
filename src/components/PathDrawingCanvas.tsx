import React, { useRef, useEffect } from 'react';
import { PathsType } from "../sources/mouse_path";

type DrawerParams = {
    paths: PathsType
    canvasWidth: number
    canvasHeight: number
    recordingScreenWidth: number
    recordingScreenHeight: number
    drawingType: "point" | "line"
}
export const PathDrawingCanvas = ({paths, drawingType, canvasWidth, canvasHeight, recordingScreenWidth, recordingScreenHeight} : DrawerParams) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const scaleX = canvasWidth / recordingScreenWidth;
    const scaleY = canvasHeight / recordingScreenHeight;

    const convertCoordinates = (x: any, y: any) => {
        return [x * scaleX, y * scaleY];
    };

    const handleAnimationClick = () => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d');
        for (let i = 0; i < paths.length; i++) {
            const [/* skipping time */, x, y, /* skipping cursor */] = paths[i];
            const [canvasX, canvasY] = convertCoordinates(x, y);

            (function (index) {
                setTimeout(() => {
                    ctx!.fillStyle = "red"
                    ctx!.beginPath();
                    ctx!.arc(canvasX, canvasY, 1, 0, Math.PI * 2);
                    ctx!.fill();
                }, paths[index][0]);
            })(i);
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d');

        // Function to draw lines on the canvas
        const drawLines = () => {
            //Get the beginning point
            const [/* skipping time */, initialX, initialY, /* skipping cursor */] = paths[0]
            const [canvasInitialX, canvasInitialY] = convertCoordinates(initialX, initialY);

            //Move to beginning point
            ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx!.strokeStyle = 'white'; // Change the color if needed
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(canvasInitialX, canvasInitialY);

            //Draw line to all coords
            for (let i = 1; i < paths.length - 1; i++) {
                const [/* skipping time */, x, y, /* skipping cursor */] = paths[i]
                const [canvasX, canvasY] = convertCoordinates(x, y);

                ctx!.lineTo(canvasX, canvasY);
                ctx!.stroke()
            }
        };

        const drawPoints = () => {
            ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx!.fillStyle = 'white'; // Change the color if needed

            for (let i = 0; i < paths.length; i++) {
                const [/* skipping time */, x, y, /* skipping cursor */] = paths[i];
                const [canvasX, canvasY] = convertCoordinates(x, y);

                ctx!.beginPath();
                ctx!.arc(canvasX, canvasY, 1, 0, Math.PI * 2);
                ctx!.fill();
            }
        };

        switch (drawingType) {
            case "line":
                drawLines()
                break;
            case "point":
                drawPoints();
                break;
        }
    }, [paths, drawingType]);

    return <>
        <button onClick={handleAnimationClick}>Animate Points</button>
        <canvas ref={canvasRef} width={355} height={200} style={{ border: '2px solid black', margin: 3 }}/>
    </>

};

