import React, { useState } from 'react';
import './App.css';
import { PathDrawingCanvas } from './components/PathDrawingCanvas';
import { paths, PathsType } from './sources/mouse_path';
import { segmentation } from './smoothing-functions/segmentation';
import { chaikinSmooth } from './smoothing-functions/chaikin';
import { tempo } from './smoothing-functions/tempo';

function App() {
    const [ease, setEase] = useState<number>(20);
    const [segmentMs, setSegmentMs] = useState<number>(100);
    const [msResolution, setMsResolution] = useState<number>(5);

    const handleEaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEase(Number(e.target.value));
    };

    const handleSegmentMsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSegmentMs(Number(e.target.value));
    };

    const handleMsResolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMsResolution(Number(e.target.value));
    };


    const segmentedPaths = segmentation(paths, segmentMs);

    const chaikinSegmentedPaths: PathsType[] = segmentedPaths.map((segment) => {
        return chaikinSmooth(segment, 4);
    });

    const tempoSegmentedPaths: PathsType[] = chaikinSegmentedPaths.map((segment) => {
        return tempo(segment, msResolution, ease);
    });

    const tempoPath = ([] as PathsType).concat(...tempoSegmentedPaths);

    return (
        <div className="App">
            <header className={"App-header"}>
            <div className="container">
                <div className="left">
                    <h4>Original (draw points):</h4>
                    <PathDrawingCanvas
                        paths={paths}
                        drawingType={'point'}
                        canvasHeight={225}
                        canvasWidth={400}
                        recordingScreenHeight={1440}
                        recordingScreenWidth={2560}
                    />
                </div>
                <div className="right">
                    <h4>Chaikin + tempo (draw points):</h4>
                    <PathDrawingCanvas
                        paths={tempoPath}
                        drawingType={'point'}
                        canvasHeight={225}
                        canvasWidth={400}
                        recordingScreenHeight={1440}
                        recordingScreenWidth={2560}
                    />
                    <div>
                        <label>
                            Ease:
                            <input type="number" value={ease} onChange={handleEaseChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Segment MS:
                            <input type="number" value={segmentMs} onChange={handleSegmentMsChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            MS Resolution:
                            <input type="number" value={msResolution} onChange={handleMsResolutionChange} />
                        </label>
                    </div>
                </div>
            </div>
            </header>
        </div>
    );
}

export default App;
