import {PathsType, PathType} from "../sources/mouse_path";

export const tempo = (paths: PathsType, msResolution: number, easingPercent: number) => {

    const distanceBetweenPoints = (path1:PathType, path2: PathType): number => {
        const [/* skip time */, x1, y1,/*skip cursor*/] = path1;
        const [/* skip time */, x2, y2,/*skip cursor*/] = path2;
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    const calculateDistances = (paths: PathsType) : [number[], number] =>  {
        let totalDistance = 0;
        const distances: number[] = [0];  //init with 0, first distance is always 0, no calculation

        for (let i = 0; i < paths.length - 1; i++) {
            const currentPoint = paths[i];
            const nextPoint = paths[i + 1];
            const distance = distanceBetweenPoints(currentPoint, nextPoint);
            totalDistance += distance;
            distances.push(totalDistance);
        }

        return [distances, totalDistance]
    }

    const convertRange = (value: number, r1: [number, number], r2: [number, number]): number => {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }


    const calculateSteps = (paths:PathsType, msResolution: number): number => {
        return Math.ceil((paths[paths.length-1][0] - paths[0][0]) / msResolution);
    }

    const calculatePointByElapsedPercent = (pointTime: number, paths:PathsType, distances: number[], elapsedPercent: number, totalDistance: number): PathType => {
        const distance = totalDistance * elapsedPercent;

        const index = distances.indexOf(distance);

        if (index !== -1) {  //Found the exact point, returning the point with the calculated time
            return [pointTime, paths[index][1], paths[index][2], paths[index][3]]
        } else {
            let closestIndex1 = 0;
            let closestIndex2 = 0;
            let minDiff = Infinity;

            for (let i = 0; i < distances.length - 1; i++) {
                const diff = Math.abs(distances[i] - distance);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex1 = i;
                    closestIndex2 = i + 1;
                }
            }

            const closestNumber1 = distances[closestIndex1];
            const closestNumber2 = distances[closestIndex2];

            const ratio1 = 1 - (Math.abs(closestNumber1 - distance) / Math.abs(closestNumber1 - closestNumber2));
            const ratio2 = 1 - ratio1;

            const [/* skip time*/, closestX1, closestY1, cursor1] = paths[closestIndex1];
            const [/* skip time*/, closestX2, closestY2, cursor2] = paths[closestIndex2];

            const newX = (closestX1 * ratio1 + closestX2 * ratio2) / (ratio1 + ratio2);
            const newY = (closestY1 * ratio1 + closestY2 * ratio2) / (ratio1 + ratio2);
            const newCursor = ratio1<ratio2 ? cursor1 : cursor2;

            return [pointTime, newX, newY, newCursor]
        }
    }


    const easeInQuad = ( t: number ) :number => {
        return t * t;
    }

    const easeOutQuad = ( t:number ):number => {
        return t * ( 2 - t );
    }

    const beginTime = paths[0][0]
    const totalTime = paths[paths.length-1][0] - paths[0][0]
    const [ distances, totalDistance ] = calculateDistances(paths);
    const steps = calculateSteps(paths, msResolution)

    //early return if not enough steps
    if(steps < 3 ){
        return paths;
    }

    const easePercent = easingPercent / 100;
    const easeInSteps = Math.ceil(steps * easePercent)
    const easeOutSteps = Math.ceil(steps * (1- easePercent))


    const newPaths:PathsType = []

    for(let i=0; i<easeInSteps; i++){
        const t = i / (steps - 1);
        const pointTime = Math.floor(beginTime + (totalTime * t));

        const scaledT = convertRange(t, [0,0.2], [0,1])
        const scaledEasedT = easeInQuad(scaledT)
        const tEaseIn = convertRange(scaledEasedT, [0,1], [0,0.2])
        const point: PathType = calculatePointByElapsedPercent(pointTime, paths, distances, tEaseIn, totalDistance);

        newPaths.push(point);
    }

    for(let i= easeInSteps; i<easeOutSteps; i++){
        const t = i / (steps - 1);
        const pointTime = Math.floor(beginTime + (totalTime * t));
        const point: PathType = calculatePointByElapsedPercent(pointTime, paths, distances, t, totalDistance);
        newPaths.push(point);
    }

    for(let i=easeOutSteps; i<steps; i++){
        const t = i / (steps - 1);
        const pointTime = Math.floor(beginTime + (totalTime * t));

        const scaledT = convertRange(t, [0.8,1], [0,1])
        const scaledEasedT = easeOutQuad(scaledT)
        const tEaseOut = convertRange(scaledEasedT, [0,1], [0.8,1])
        const point: PathType = calculatePointByElapsedPercent(pointTime, paths, distances, tEaseOut, totalDistance);

        newPaths.push(point);
    }


    return newPaths;
}