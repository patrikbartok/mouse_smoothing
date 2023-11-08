import {PathsType} from "../sources/mouse_path";

export const segmentation = ( paths: PathsType, ms: number ):PathsType[] => {
    const result: PathsType[] = [];

    if (paths.length === 0) {
        return result;
    }

    let tempArray: PathsType = [paths[0]];

    for (let i = 1; i < paths.length; i++) {
        const diff = Math.abs(paths[i][0] - paths[i - 1][0]);

        if (diff > ms) {
            result.push(tempArray);
            tempArray = [paths[i]];
        } else {
            tempArray.push(paths[i]);
        }
    }

    if (tempArray.length > 0) {
        result.push(tempArray);
    }

    return result;
}